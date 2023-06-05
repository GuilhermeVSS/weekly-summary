require('dotenv').config();
const app = require('./app.js');
const PORT = process.env.PORT || 3333;

const { getSpotifyInfoV2, buildWeekSummaryV2, cleanDatabase } = require('./services/cron.svr');

getSpotifyInfoV2();
buildWeekSummaryV2();
cleanDatabase();

app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`);
})