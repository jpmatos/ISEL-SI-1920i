'use strict'

const CLIENT_ID_GOOGLE = '431445799594-2mdnasfa66iv0ga0blrki36iet1c1co4.apps.googleusercontent.com' //process.env.CLIENT_ID
const CLIENT_SECRET_GOOGLE = 'nSvBUOCfjwEh1fhm2rc_qpz4' //process.env.CLIENT_SECRET

module.exports = class googleController {
    
    constructor(request, jwt){
        this.request = request
        this.jwt = jwt
    }

    static init(request, jwt){
        return new googleController(request, jwt)
    }

    login(req, res, next){
        res.redirect(302,
            // authorization endpoint
            'https://accounts.google.com/o/oauth2/v2/auth?'
            
            // client id
            + 'client_id='+ CLIENT_ID_GOOGLE +'&'
            
            // scope "openid email"
            + 'scope=openid%20email&'
            
            // parameter state should bind the user's session to a request/response
            + 'state=some-id-based-on-user-session&'
            
            // responde_type for "authorization code grant"
            + 'response_type=code&'
            
            // redirect uri used to register RP
            + 'redirect_uri=http://localhost.mydomain.com:3001/googlecallback')
    }

    callback(req, res, next){
    //
    // TODO: check if 'state' is correct for this session
    //

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

                console.log(body)
                console.log(jwt_payload)

                res.send(
                    // send code and id_token to user-agent, *just* for this demo
                      '<div> callback with code = ' + req.query.code + '</div>'
                    + '<div> id_token = ' + json_response.id_token + '</div>'
                    // use 'email' claim from id_token
                    + '<div> Olá <b>' + jwt_payload.email + '</b> </div>'
                )
            }.bind(this)
        )
    }

}