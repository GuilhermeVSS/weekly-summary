require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

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
