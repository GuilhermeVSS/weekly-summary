const jwt = require('jsonwebtoken')

const { promisify } = require('util')

const authConfig = require('../config/auth.js');

module.exports = async (req, res, next) => {

    let Token = req.headers.authorization;
    if (Token) {
        const authHeader = req.headers.authorization;
        const [, token] = authHeader.split(' ')
        Token = token;
    } else if (req.query.token) {
        Token = req.query.token
    } else {
        return res.status(401).json({ error: "Token not provided" })
    }

    try {
        const decoded = await promisify(jwt.verify)(Token, authConfig.secret)
        req.userEmail = decoded.email
        console.log(req.userEmail);
        return next()
    } catch (error) {
        return res.status(401).json({ error })
    }
}