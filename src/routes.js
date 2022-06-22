require('dotenv').config();
const { Router } = require("express");

const routes = new Router();

const spotifyController = require('./app/controllers/spotify.controller');

routes.get('/authorization', spotifyController.getAuthorization);

routes.get('/authorized', spotifyController.getToken);

routes.get('/', async(req,res)=>{
    return res.send("Welcome to my week summary builder - by : Guilherme Ventura Santos Silva [gvss]");
})

routes.get('/confirmation', spotifyController.confirmation);


module.exports = routes;