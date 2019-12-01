'use strict'

module.exports = class tmaController {

    constructor(request, tokenHandler) {
        this.request = request
        this.tokenHandler = tokenHandler
    }

    static init(request, tokenHandler){
        return new tmaController(request, tokenHandler)
    }

    home(req, res, next){
        var token = this.tokenHandler.get(req.cookies.key);
        res.render('home', {'token': token})
    }
}