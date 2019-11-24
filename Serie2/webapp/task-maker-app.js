'use strict'

const express = require('express')
const session = require('express-session');
const request = require('request')
const jwt = require('jsonwebtoken')
const uuid = require('uuid4')
const cookieParser = require('cookie-parser')
const exphbs  = require('express-handlebars');

const webApi = require('./web-api/web-api')
const tokenHandler = require('./util/token-handler').init()
const tmaController = require('./web-api/controller/tma-controller').init(tokenHandler)
const googleController = require('./web-api/controller/google-controller').init(request, jwt, uuid, tokenHandler)
const githubController = require('./web-api/controller/github-controller').init()
const port = 3001

const app = express()
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(cookieParser())
app.use(session({secret: uuid()}))
app.use('/', webApi(express.Router(), tmaController, googleController, githubController))

app.listen(port, (err) => {
    if (err) {
        return console.log('Failed to start server!', err)
    }
    console.log(`HTTP server listening on port ${port}.`)
})