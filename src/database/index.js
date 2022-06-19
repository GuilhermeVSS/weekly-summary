const mongoose = require('mongoose');
require('dotenv').config();

//Connection config to mongoDB
class Database {
    async init() {
        mongoose.connect(process.env.STRING_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log("Connected to MongoDB");
        });
    }
}

module.exports = new Database();