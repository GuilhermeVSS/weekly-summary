const spotifyController = require('../app/controllers/spotify.controller');
const summaryController = require('../app/controllers/summary.controller');
const cron = require('node-cron');

const buildWeekSummary= () => {
    cron.schedule('2 0 * Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec Sun', async () => {
        try {
            await summaryController.buildSummary();
        } catch(e) {
            console.log(err);
        }
    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    })
}

const getSpotifyInfo = () => {
    cron.schedule('0 59 23 * * *', async () => {
        try {
            await spotifyController.initProcess();
        } catch(e) {

        }
    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    })
}

module.exports = {
    buildWeekSummary,
    getSpotifyInfo,
}