require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');
const fs = require('fs');
const {TwitterApi} = require('twitter-api-v2');

const consumerKey = process.env.CONSUMER_KEY_TWITTER;
const consumerSecret = process.env.CONSUMER_SECRET_TWITTER;
const accessToken = process.env.ACCESS_TOKEN_TWITTER;
const accessSecret = process.env.ACCESS_SECRET_TWITTER;

const client = new TwitterApi({
    appKey: consumerKey,
    appSecret: consumerSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
});

module.exports = {
    twitter: client
}

// const oauth = oauth1a({
//     consumer: { key: consumerKey, secret: consumerSecret },
//     signature_method: 'HMAC-SHA1',
//     hash_function(base_string, key) {
//         return crypto
//             .createHmac('sha1', key)
//             .update(base_string)
//             .digest('base64')
//     },
// })

// const authorization = oauth.authorize(
//     {
//         url: "https://api.twitter.com/2/tweets",
//         method: 'POST',
//     },{
//     key: accessToken,
//     secret: accessSecret,
// });

// const authHeader = oauth.toHeader(authorization);

// const twitter = axios.create({
//     baseURL: process.env.TWITTER_URL,
// });

// const twitterUpload = axios.create({
//     baseURL: process.env.TWITTER_UPLOAD_URL
// })

// module.exports = {
//     twitter,
//     twitterUpload   
// };