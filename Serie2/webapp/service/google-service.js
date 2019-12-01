'use strict'

const CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE
const CLIENT_SECRET_GOOGLE = process.env.CLIENT_SECRET_GOOGLE
const API_KEY = process.env.API_KEY

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
            + 'scope=https://www.googleapis.com/auth/tasks&'
            // parameter state should bind the user's session to a request/response
            + `state=${validKey}&`
            // responde_type for "authorization code grant"
            + 'response_type=code&'
            // redirect uri used to register RP
            + 'redirect_uri=https://localhost.mydomain.com:3001/googlecallback')
    }

    requestToken(queryCode, cb){
        var options = {
            url: 'https://www.googleapis.com/oauth2/v3/token',
            // body parameters
            form: {
                code: queryCode,
                client_id: CLIENT_ID_GOOGLE,
                client_secret: CLIENT_SECRET_GOOGLE,
                redirect_uri: 'https://localhost.mydomain.com:3001/googlecallback',
                grant_type: 'authorization_code'
            }
        }
        this.request.post(options, this.googleData.authenticate(cb))
    }

    listTasklists(queryCode, cb){

        var options = {
            url: `https://www.googleapis.com/tasks/v1/users/@me/lists?key=${API_KEY}`,
            headers: {
                'Authorization': 'Bearer ' + queryCode,
                'Accept': 'application/json'
            }
        }
        this.request.get(options, this.googleData.listTasks(cb))
    }

    createTask(queryCode, taskId, issueInfo, cb){
        var options = {
            url: `https://www.googleapis.com/tasks/v1/lists/${taskId}/tasks?key=${API_KEY}`,
            headers: {
                'Authorization': 'Bearer ' + queryCode,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'body': {
                'title': issueInfo.title,
                'notes': issueInfo.body
            },
            'json': true
        }
        this.request.post(options, this.googleData.createTask(cb))
    }
}