'use strict'

module.exports = (router, tmaController, googleController, githubController) => {

    router.get('/', (req, res, next) => tmaController.home(req, res, next))

    router.get('/login', (req, res, next) => googleController.login(req, res, next))

    router.get('/googlecallback', (req, res, next) => googleController.callback(req, res, next))

    return router
}