'use strict'

module.exports = class GoogleData{

    constructor(jwt){
        this.jwt = jwt
    }

    static init(jwt){
        return new GoogleData(jwt)
    }

    authenticate(cb){
        return function(err, httpResponse, body){
            //
            // TODO: check err and httpresponse
            //
            var json_response = JSON.parse(body)
            // decode does not check signature
            var jwt_payload = this.jwt.decode(json_response.id_token)
            cb(jwt_payload)
        }.bind(this)
    }
}