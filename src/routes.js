require('dotenv').config();
const { Router } = require("express");

const routes = new Router();
const querystring = require("querystring");

const spotifyController = require('./app/controllers/spotify-controller')


routes.get('/authorization', spotifyController.getAuthorization);

routes.get('/authorized', spotifyController.getToken);

routes.get('/', async(req,res)=>{
    return res.send("Home Page");
})

routes.get('/confirmation', spotifyController.confirmation);

routes.get('/recently-played', spotifyController.recentlyPlayed);



module.exports = routes;

// routes.get('/confirmation', (async(req, res)=>{
    //     await spotifyController.confirmation(req, res)}));
    
    // routes.get('/authorization', async (req, res) => {
    //     //var state = generateRandomString(16);
    //     var scope = 'user-read-private user-read-email user-read-recently-played user-read-playback-state user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private';
    
    //     res.redirect('https://accounts.spotify.com/authorize?' +
    //         querystring.stringify({
    //             response_type: 'code',
    //             client_id: process.env.SPOTIFY_CLIENT_ID,
    //             scope: scope,
    //             redirect_uri: 'http://localhost:3333/authorized',
    //             //state: state
    //         }));
    // });