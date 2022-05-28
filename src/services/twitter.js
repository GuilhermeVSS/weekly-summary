require('dotenv').config();
const axios = require('axios');

const spotify = axios.create({
    baseURL: process.env.SPOTIFY_URL,
    params : {
        apikey: process.env.BLING_TOKEN,
    },
    headers : {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
});

module.exports = pipedrive;