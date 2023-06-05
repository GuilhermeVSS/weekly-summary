require('dotenv').config();
const axios = require('axios');

//axios config setup to Spotify Api
const spotify = axios.create({
    baseURL: process.env.SPOTIFY_BASE_URL,
});

module.exports = spotify;