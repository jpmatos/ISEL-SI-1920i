'use strict'

module.exports = (router, tmaController, googleController, githubController) => {

    router.get('/', (req, res, next) => tmaController.home(req, res, next))

    router.get('/login/google', (req, res, next) => googleController.login(req, res, next))
    router.get('/googlecallback', (req, res, next) => googleController.callback(req, res, next))
    router.get('/tasklists', (req, res, next) => googleController.listTasklists(req, res, next))
    router.get('/createtask', (req, res, next) => googleController.createTask(req, res, next))

    router.get('/login/github', (req, res, next) => githubController.login(req, res, next))
    router.get('/githubcallback', (req, res, next) => githubController.callback(req, res, next))
    router.get('/issues', (req, res, next) => githubController.issues(req, res, next))

    return router
}