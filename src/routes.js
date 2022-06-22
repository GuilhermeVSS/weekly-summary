require('dotenv').config();
const { Router } = require("express");

const routes = new Router();

const spotifyController = require('./app/controllers/spotify.controller');
const summaryController = require('./app/controllers/summary.controller');

routes.get('/authorization', spotifyController.getAuthorization);

routes.get('/authorized', spotifyController.getToken);

routes.get('/', async(req,res)=>{
    return res.send("Welcome to my week summary builder - by : Guilherme Ventura Santos Silva [gvss]");
})

routes.get('/confirmation', spotifyController.confirmation);

routes.post('/build', summaryController.buildSummary);

routes.post('/get-info', spotifyController.initProcess);


module.exports = routes;