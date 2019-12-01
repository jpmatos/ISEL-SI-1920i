'use strict'

const CLIENT_ID_GOOGLE = '431445799594-2mdnasfa66iv0ga0blrki36iet1c1co4.apps.googleusercontent.com' //process.env.CLIENT_ID
const CLIENT_SECRET_GOOGLE = 'nSvBUOCfjwEh1fhm2rc_qpz4' //process.env.CLIENT_SECRET

module.exports = class GoogleService{

    constructor(googleData, request){
        this.googleData = googleData
        this.request = request
    }

    static init(googleData, request){
        return new GoogleService(googleData, request)
    }

    redirect(validKey, cb){
        cb( // authorization endpoint
            'https://accounts.google.com/o/oauth2/v2/auth?'
            // client id
            + 'client_id='+ CLIENT_ID_GOOGLE +'&'
            // scope "openid email"
            + 'scope=openid%20email&'
            // parameter state should bind the user's session to a request/response
            + `state=${validKey}&`
            // responde_type for "authorization code grant"
            + 'response_type=code&'
            // redirect uri used to register RP
            + 'redirect_uri=http://localhost.mydomain.com:3001/googlecallback')
    }

    requestToken(queryCode, cb){
        var options = {
            url: 'https://www.googleapis.com/oauth2/v3/token',
            // body parameters
            form: {
                code: queryCode,
                client_id: CLIENT_ID_GOOGLE,
                client_secret: CLIENT_SECRET_GOOGLE,
                redirect_uri: 'http://localhost.mydomain.com:3001/googlecallback',
                grant_type: 'authorization_code'
            }
        }
        this.request.post(options, this.googleData.authenticate(cb))
    }
}