'use strict'

const CLIENT_ID_GOOGLE = '431445799594-2mdnasfa66iv0ga0blrki36iet1c1co4.apps.googleusercontent.com' //process.env.CLIENT_ID
const CLIENT_SECRET_GOOGLE = 'nSvBUOCfjwEh1fhm2rc_qpz4' //process.env.CLIENT_SECRET

module.exports = class googleController {
    
    constructor(request, jwt, uuid, tokenHandler){
        this.request = request
        this.jwt = jwt
        this.uuid = uuid
        this.tokenHandler = tokenHandler
        this.sessionKey = new Object()
    }

    static init(request, jwt, uuid, tokenHandler){
        return new googleController(request, jwt, uuid, tokenHandler)
    }

    login(req, res, next){
        var validKey = this.uuid();
        res.cookie('validKey', validKey)
        res.redirect(302,
            // authorization endpoint
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

    callback(req, res, next){
        var validKey = req.cookies.validKey
        var state = req.query.state
        if(validKey == state){
            res.clearCookie('validKey');
            console.log('making request to token endpoint')
            // https://www.npmjs.com/package/request#examples
            // content-type: application/x-www-form-urlencoded (URL-Encoded Forms)
            this.request
                .post(
                    { 
                        url: 'https://www.googleapis.com/oauth2/v3/token',
                        // body parameters
                        form: {
                            code: req.query.code,
                            client_id: CLIENT_ID_GOOGLE,
                            client_secret: CLIENT_SECRET_GOOGLE,
                            redirect_uri: 'http://localhost.mydomain.com:3001/googlecallback',
                            grant_type: 'authorization_code'
                        }
                    }, 
                    function(err, httpResponse, body){
                        //
                        // TODO: check err and httpresponse
                        //

                        var json_response = JSON.parse(body)
                        // decode does not check signature
                        var jwt_payload = this.jwt.decode(json_response.id_token)

                        var key = req.cookies.key
                        if(key == undefined){
                            key = this.uuid()
                            res.cookie('key', key)
                        }
                        this.tokenHandler.addGoogle(key, jwt_payload)

                        res.redirect('/')
                    }.bind(this)
                )
        }
        else{
            //TODO Handle session-key mismatch
        }
    }
}