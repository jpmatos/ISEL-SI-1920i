'use strict'

const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB
const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB

module.exports = class GithubService{

    constructor(githubData, request){
        this.githubData = githubData
        this.request = request
    }

    static init(githubData, request){
        return new GithubService(githubData, request)
    }

    redirect(validKey, cb){
        cb('https://github.com/login/oauth/authorize?' + 
           '&client_id=' + CLIENT_ID_GITHUB +
           '&scope=repo' +
           '&state=' + validKey +
           '&redirect_uri=https://localhost.mydomain.com:3001/githubcallback')
    }

    requestToken(queryCode, cb){
        var options = {
            url: 'https://github.com/login/oauth/access_token',
            headers: {
                accept: 'application/json'
            },
            form: {
                code: queryCode,
                client_id: CLIENT_ID_GITHUB,
                client_secret: CLIENT_SECRET_GITHUB,
                redirect_uri: 'https://localhost.mydomain.com:3001/githubcallback',
                grant_type: 'authorization_code'
            }
        }
        this.request.post(options, this.githubData.authenticate(cb))
    }

    getIssues(repo, token, cb){
        var optionsUser = {
            url: `https://api.github.com/user`,
            headers: {
                'Authorization': 'token ' + token,
                'User-Agent': 'SI'
            }
        }
        this.request.get(optionsUser, this.githubData.requestUser((user) => {
            var options = {
                url: `https://api.github.com/repos/${user}/${repo}/issues`,
                headers: {
                    'Authorization': 'token ' + token,
                    'User-Agent': 'SI'
                }
            }
            this.request.get(options, this.githubData.requestIssues(cb)) 
        }))
    }
}