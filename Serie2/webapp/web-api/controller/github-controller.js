'use strict'

module.exports = class GithubController {

    constructor(githubService, tokenHandler, uuid){
        this.tokenHandler = tokenHandler
        this.githubService = githubService
        this.uuid = uuid
    }

    static init(githubService, tokenHandler, uuid){
        return new GithubController(githubService, tokenHandler, uuid)
    }

    login(req, res, next){
        var validKey = this.uuid();
        this.githubService.redirect(validKey, (str) => {
            res.cookie('validKey', validKey)
            res.redirect(302, str)
        })
    }

    callback(req, res, next){
        var validKey = req.cookies.validKey
        var state = req.query.state
        if(validKey == state){
            res.clearCookie('validKey');
            console.log('making request to token endpoint')
            this.githubService.requestToken(req.query.code, (token) => {
                var key = req.cookies.key
                if(key == undefined){
                    key = this.uuid()
                    res.cookie('key', key)
                }
                this.tokenHandler.addGithub(key, token)
                res.redirect('/')
            })
        }
        else{
            //TODO Handle session-key mismatch
        }
    }

    issues(req, res, next){
        var githubToken = this.tokenHandler.get(req.cookies.key).github
        var googleToken = this.tokenHandler.get(req.cookies.key).google
        var repo = req.query.repo

        this.githubService.getIssues(repo, githubToken, (issues) => {
            res.render('issues', {'issues': issues, 'googleToken': googleToken})
        })
    }
}