require('dotenv').config();

module.exports = {
    secret : process.env.CONFIG_SECRET,
    expiresIn: process.env.CONFIG_EXPIRES_IN
}