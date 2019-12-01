'use strict'

const express = require('express')
const request = require('request')
const jwt = require('jsonwebtoken')
const uuid = require('uuid4')
const cookieParser = require('cookie-parser')
const exphbs  = require('express-handlebars');

const webApi = require('./web-api/web-api')
const tokenHandler = require('./util/token-handler').init()
const githubData = require('./data/github-data').init(uuid)
const githubService = require('./service/github-service').init(githubData, request)
const githubController = require('./web-api/controller/github-controller').init(githubService, tokenHandler)
const tmaController = require('./web-api/controller/tma-controller').init(request, tokenHandler)
const googleController = require('./web-api/controller/google-controller').init(request, jwt, uuid, tokenHandler)
const port = 3001

const app = express()
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(cookieParser())
app.use('/', webApi(express.Router(), tmaController, googleController, githubController))

app.listen(port, (err) => {
    if (err) {
        return console.log('Failed to start server!', err)
    }
    console.log(`HTTP server listening on port ${port}.`)
})