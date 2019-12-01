'use strict'

module.exports = class GithubData {

    constructor(){

    }

    static init(){
        return new GithubData()
    }

    authenticate(cb){
        return function (err, httpResponse, body) {
            //
            // TODO: check err and httpresponse
            //
            var json_response = JSON.parse(body)
            cb(json_response.access_token)
        }
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