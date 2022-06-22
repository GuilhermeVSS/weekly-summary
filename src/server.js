require('dotenv').config();
const app = require('./app');

const {
    buildWeekSummary,
    getSpotifyInfo,
} = require('./services/cron.svr');

buildWeekSummary();
getSpotifyInfo();

const PORT = process.env.PORT || 3333;


app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`);
})