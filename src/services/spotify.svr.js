require('dotenv').config();
const axios = require('axios');

//axios config setup to Bling Api
const spotify = axios.create({
    baseURL: process.env.SPOTIFY_BASE_URL,
});

module.exports = spotify;
