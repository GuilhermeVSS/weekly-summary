const spotifyController = require('../app/controllers/spotify.controller');
const cron = require('node-cron');


module.exports = () => {
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