
require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const oauth1a = require('oauth-1.0a');
const fs = require('fs');

const consumerKey = process.env.CONSUMER_KEY_TWITTER;
const consumerSecret = process.env.CONSUMER_SECRET_TWITTER;
const accessToken = process.env.ACCESS_TOKEN_TWITTER;
const accessSecret = process.env.ACCESS_SECRET_TWITTER;

const getAuthorization = (url) => {

    const oauth = oauth1a({
        consumer: { key: consumerKey, secret: consumerSecret },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64')
        },
    })
    
    const authorization = oauth.authorize(
        {
            url: url,
            method: 'POST',
        },{
        key: accessToken,
        secret: accessSecret,
    });
    const header = oauth.toHeader(authorization);
    return header;
}

module.exports = {
    getAuthorization
}