const express = require('express');
const routes = require("./routes");
const database = require('./database');
class App {
    constructor(){
        this.connection();
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.server.use(express.json());
    }

    routes(){
        this.server.use(routes);
    }

    connection(){
        this.mongo = database.init();
    }
}

module.exports = new App().server;