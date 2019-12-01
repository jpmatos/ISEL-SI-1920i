'use strict'

module.exports = class tokenHandler {

    constructor(){
        this.tokens = new Object()
    }

    static init(){
        return new tokenHandler()
    }

    get(cookie){
        return this.tokens[cookie]
    }

    addGoogle(cookie, googleToken){
        if(this.tokens[cookie] == undefined)
            this.tokens[cookie] = new Object()
        this.tokens[cookie].google = googleToken
    }

    addGithub(cookie, githubToken){
        if(this.tokens[cookie] == undefined)
            this.tokens[cookie] = new Object()
        this.tokens[cookie].github = githubToken
    }
}