'use strict'

module.exports = class githubController {

    constructor(githubService, tokenHandler){
        this.tokenHandler = tokenHandler
        this.githubService = githubService
    }

    static init(githubService, tokenHandler){
        return new githubController(githubService, tokenHandler)
    }

    login(req, res, next){
        this.githubService.redirect(req, res, (str) => {
            res.redirect(302, str)
        })
    }

    callback(req, res, next){
        var validKey = req.cookies.validKey
        var state = req.query.state
        if(validKey == state){
            res.clearCookie('validKey');
            console.log('making request to token endpoint')
            this.githubService.requestToken(req, res, (key, token) => {
                this.tokenHandler.addGithub(key, token)
                res.redirect('/')
            })
        }
        else{
            //TODO Handle session-key mismatch
        }
    }

    issues(req, res, next){
        var token = this.tokenHandler.get(req.cookies.key).github
        var repo = req.query.repo

        this.githubService.getIssues(req, res, repo, token, (issues) => {
            res.render('issues', {'issues': issues})
        })
    }
}