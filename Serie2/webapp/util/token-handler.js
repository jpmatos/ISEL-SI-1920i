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

    addGoogle(session, googleToken){
        if(this.tokens[session] == undefined)
            this.tokens[session] = new Object()
        this.tokens[session].google = googleToken
    }

    addGithub(session, githubToken){
        if(this.tokens[session] == undefined)
            this.tokens[session] = new Object()
        this.tokens[session].github = githubToken
    }
}