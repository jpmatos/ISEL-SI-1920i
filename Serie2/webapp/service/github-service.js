'use strict'

const CLIENT_ID_GITHUB = '96bc24f89efc2c0b8ea1'
const CLIENT_SECRET_GITHUB = '3aa7fb85296b300d70d22fdd7862f5367e204081'

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
           '&redirect_uri=http://localhost.mydomain.com:3001/githubcallback')
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
                redirect_uri: 'http://localhost.mydomain.com:3001/githubcallback',
                grant_type: 'authorization_code'
            }
        }
        this.request.post(options, this.githubData.authenticate(cb))
    }

    getIssues(req, res, repo, token, cb){
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