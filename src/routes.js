require('dotenv').config();
const { Router } = require("express");

const routes = new Router();

routes.get('/', async(req,res)=>{
    return res.send("Welcome to my week summary builder - by : Guilherme Ventura Santos Silva [gvss]");
})

module.exports = routes;