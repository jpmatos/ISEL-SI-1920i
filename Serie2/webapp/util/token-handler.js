'use strict'

module.exports = class tokenHandler {

    constructor(){
        this.tokens = new Object()
    }

    static init(){
        return new tokenHandler()   
    }

    get(session){
        return this.tokens[session]
    }

    add(session, token){
        this.tokens[session] = token
    }
}