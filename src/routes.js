require('dotenv').config();
const { Router } = require("express");

const routes = new Router();

const spotifyController = require('./app/controllers/spotify.controller');
// const orchestratorController = require('../v2/app/controller/orchestrator.controller');
//const summaryController = require('./app/controllers/summary.controller');
//const userController = require('./app/controllers/user.controller');

routes.get('/authorization', spotifyController.getAuthorization);

routes.get('/authorized', spotifyController.getToken);

routes.get('/', async(req,res)=>{
    return res.send("Welcome to my week summary builder - by : Guilherme Ventura Santos Silva [gvss]");
})

// routes.post('/build-summary', orchestratorController.initBuildSummary);
// routes.post('/collect-info', orchestratorController.initColectInformation);

//routes.get('/confirmation', spotifyController.confirmation);

//routes.post('/build', summaryController.buildSummary);

//routes.post('/get-info', spotifyController.initProcess);

//routes.post('/user/create', userController.store);
//routes.post('/user/credentials', userController.insertCredentials);


module.exports = routes;