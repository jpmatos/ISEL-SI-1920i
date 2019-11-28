'use strict'

const CLIENT_ID_GITHUB = '96bc24f89efc2c0b8ea1'
const CLIENT_SECRET_GITHUB = '3aa7fb85296b300d70d22fdd7862f5367e204081'

module.exports = class githubController {

    constructor(request, jwt, uuid, tokenHandler){
        this.request = request
        this.jwt = jwt
        this.uuid = uuid
        this.tokenHandler = tokenHandler
        this.sessionKey = new Object()
    }

    static init(request, jwt, uuid, tokenHandler){
        return new githubController(request, jwt, uuid, tokenHandler)
    }

    login(req, res, next){
        var key = req.cookies.key
        if(key == 'undefined'){
            key = this.uuid()
            res.cookie('key', key)
        }
        this.sessionKey[req.session.id] = key
        res.redirect(302,
            'https://github.com/login/oauth/authorize?' + 
            '&client_id=' + CLIENT_ID_GITHUB +
            '&scope=repo' +
            '&state=' + key +
            '&redirect_uri=http://localhost.mydomain.com:3001/githubcallback')
    }

    callback(req, res, next){
        var key = req.cookies.key
        if(key == this.sessionKey[req.session.id]){
            console.log('making request to token endpoint')
            this.request
                .post(
                    {
                        url: 'https://github.com/login/oauth/access_token',
                        headers: {
                            accept: 'application/json'
                        },
                        form: {
                            code: req.query.code,
                            client_id: CLIENT_ID_GITHUB,
                            client_secret: CLIENT_SECRET_GITHUB,
                            redirect_uri: 'http://localhost.mydomain.com:3001/githubcallback',
                            grant_type: 'authorization_code'
                        }
                    },
                    function(err, httpResponse, body){
                        //
                        // TODO: check err and httpresponse
                        //

                        var json_response = JSON.parse(body)
                        // decode does not check signature
                        var jwt_payload = this.jwt.decode(json_response.access_token)

                        this.tokenHandler.addGithub(req.session.id, jwt_payload)

                        res.redirect('/')
                    }.bind(this)
                )
        }
        else{
            //TODO Handle session-key mismatch
        }
    }
}