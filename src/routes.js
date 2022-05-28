require('dotenv').config();
const { Router } = require("express");

const routes = new Router();
const querystring = require("querystring");

const spotifyController = require('./app/controllers/spotify-controller')
console.log("SPOTIFY CONTROLLER");
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

routes.get('/authorization', spotifyController.getAuthorization);

routes.get('/authorized', spotifyController.getToken);

routes.get('/', async(req,res)=>{
    //console.log(req);
    return res.send("ihh");
})

routes.get('/confirmation', spotifyController.confirmation);

module.exports = routes;