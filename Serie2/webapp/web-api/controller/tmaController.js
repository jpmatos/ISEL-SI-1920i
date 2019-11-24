'use strict'

module.exports = class tmaController {

    constructor() {

    }

    static init(){
        return new tmaController()
    }

    home(req, res, next){
        res.send('<a href=/login>Use Google Account</a>')
    }
}