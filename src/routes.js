require('dotenv').config();
const { Router } = require("express");
const {userController, sessionController} = require('./app/controller')
const authentication = require('./middleware/authentication');

const routes = new Router();


routes.post('/user', userController.store)
    .post('/login', sessionController.login)
    .post('/user/credentials', authentication, userController.insertCredentials)
    .get('/', async (req, res) => {
        return res.send("Welcome to my week summary builder - by : Guilherme Ventura Santos Silva [gvss]");
    })

module.exports = routes;