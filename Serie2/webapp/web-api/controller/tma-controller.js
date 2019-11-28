'use strict'

module.exports = class tmaController {

    constructor(tokenHandler) {
        this.tokenHandler = tokenHandler
    }

    static init(tokenHandler){
        return new tmaController(tokenHandler)
    }

    home(req, res, next){
        var token = this.tokenHandler.get(req.session.id);
        res.render('home', {'token': token})
    }
}