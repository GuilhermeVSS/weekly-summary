const orchestratorController = require('../app/controller/orchestrator.controller');

const cron = require('node-cron');

const buildWeekSummaryV2 = () => {
    cron.schedule('0 1 * Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec Sun', async () => {
        try {
            await orchestratorController.initBuildSummary();
            return;
        } catch(e) {
            console.log(err);
        }
        return;
    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    })
}

const getSpotifyInfoV2 = () => {
    cron.schedule('0 59 23 * * *', async () => {
        try {
            await orchestratorController.initColectInformation();
            return;
        } catch(e) {
            console.log(e);
        }
        return;
    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    })
}

module.exports = {
    buildWeekSummaryV2,
    getSpotifyInfoV2,
}