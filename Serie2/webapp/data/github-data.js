'use strict'

module.exports = class GithubData {

    constructor(uuid){
        this.uuid = uuid
    }

    static init(uuid){
        return new GithubData(uuid)
    }

    authenticate(res, key, cb){
        return function (err, httpResponse, body) {
            //
            // TODO: check err and httpresponse
            //
            if(key == undefined){
                key = this.uuid()
                res.cookie('key', key)
            }
            var json_response = JSON.parse(body)
            cb(key, json_response.access_token)
        }
    }

    redirect(res, id, cb){
        var validKey = this.uuid();
        res.cookie('validKey', validKey)
        cb('https://github.com/login/oauth/authorize?' + 
           '&client_id=' + id +
           '&scope=repo' +
           '&state=' + validKey +
           '&redirect_uri=http://localhost.mydomain.com:3001/githubcallback')
    }

    requestIssues(cb){
        return function(err, httResponse, body){
            var issues = JSON.parse(body)
            cb(issues)
        }
    }

    requestUser(cb){
        return function(err, httResponse, body){
            var user = JSON.parse(body).login
            cb(user)
        }
    }
}