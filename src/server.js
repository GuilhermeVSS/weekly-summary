require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3333;

const {
    buildWeekSummary,
    getSpotifyInfo,
} = require('./services/cron.svr');

buildWeekSummary();
getSpotifyInfo();



app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`);
})