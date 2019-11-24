'use strict'

const express = require('express')
const app = express()
const request = require('request');
const jwt = require('jsonwebtoken');

const webApi = require('./web-api/web-api')
const tmaController = require('./web-api/controller/tmaController').init()
const googleController = require('./web-api/controller/googleController').init(request, jwt)
const githubController = require('./web-api/controller/githubController').init()

const port = 3001

app.use('/', webApi(express.Router(), tmaController, googleController, githubController))

app.listen(port, (err) => {
    if (err) {
        return console.log('Failed to start server!', err)
    }
    console.log(`HTTP server listening on port ${port}.`)
})