require('dotenv').config();

const { twitter } = require('../../services/twitter.svr');
const path = require('path');
const moment = require('moment');

class TwitterController {

    constructor() {
        this.tweetUrl = process.env.TWITTER_URL
        this.uploadUrl = process.env.TWITTER_UPLOAD_URL
    }

    postSummary = async (imageId) => {
        const [artistId, hoursId, musicsId] = await Promise.all([
            await twitter.v1.uploadMedia(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-artists.png`)),
            await twitter.v1.uploadMedia(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-hours-and-genres.png`)),
            await twitter.v1.uploadMedia(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-musics.png`))
        ]);
        await twitter.v2.tweet(`Summary of last week's songs - ${moment().format('DD/MM/YYYY')} - (Test Api)`, { media: { media_ids: [hoursId, artistId, musicsId] } });
    }
}

module.exports = new TwitterController();