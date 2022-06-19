require('dotenv').config();
const { Router } = require("express");

const routes = new Router();
const querystring = require("querystring");

const spotifyController = require('./app/controllers/spotify.controller');
const twitterController = require('./app/controllers/twitter.controller');


routes.get('/authorization', spotifyController.getAuthorization);

routes.get('/authorized', spotifyController.getToken);

routes.post('/post-twitter', twitterController.postTweet);

routes.get('/', async(req,res)=>{
    return res.send("Home Page");
})

routes.get('/confirmation', spotifyController.confirmation);

routes.get('/recently-played', spotifyController.recentlyPlayed);



module.exports = routes;