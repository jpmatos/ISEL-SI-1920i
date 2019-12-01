'use strict'

module.exports = class GoogleController {
    
    constructor(googleService, tokenHandler, uuid){
        this.googleService = googleService
        this.tokenHandler = tokenHandler
        this.uuid = uuid
    }

    static init(googleService, tokenHandler, uuid){
        return new GoogleController(googleService, tokenHandler, uuid)
    }

    login(req, res, next){
        var validKey = this.uuid();
        this.googleService.redirect(validKey, (str) => {
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
            // https://www.npmjs.com/package/request#examples
            // content-type: application/x-www-form-urlencoded (URL-Encoded Forms)
            this.googleService.requestToken(req.query.code, (token) => {
                var key = req.cookies.key
                if(key == undefined){
                    key = this.uuid()
                    res.cookie('key', key)
                }
                this.tokenHandler.addGoogle(key, token)
                res.redirect('/')
            })
        }
        else{
            //TODO Handle session-key mismatch
        }
    }

    listTasklists(req, res, next){
        var token = this.tokenHandler.get(req.cookies.key).google
        // var tasklist = req.query.tasklist
        var issueInfo = {
            'title': req.query.title,
            'state': req.query.state,
            'body': req.query.body 
        }

        this.googleService.listTasklists(token, (tasklists) => {
            res.render('tasklists', {'lists': tasklists.items, 'issueInfo': issueInfo})
        })
    }

    createTask(req, res, next){
        var token = this.tokenHandler.get(req.cookies.key).google
        var taskId = req.query.tasklist
        // var tasklist = req.query.tasklist
        var issueInfo = {
            'title': req.query.title,
            'state': req.query.state,
            'body': req.query.body 
        }

        this.googleService.createTask(token, taskId, issueInfo, () =>{
            res.render('task')
        })
    }
}