require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

const path = require('path');
const moment = require('moment');

class TwitterController {

    constructor (credential) {
        this.client = new TwitterApi({
            appKey: credential.consumer_key_twitter,
            appSecret: credential.consumer_secret_twitter,
            accessToken: credential.access_token_twitter,
            accessSecret: credential.access_secret_twitter
        })
    }

    postSummary = async (imageId) => {
        const [artistId, hoursId, musicsId] = await Promise.all([
            await this.client.v1.uploadMedia(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-artists.png`)),
            await this.client.v1.uploadMedia(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-hours-and-genres.png`)),
            await this.client.v1.uploadMedia(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-musics.png`))
        ]);
        await this.client.v2.tweet(`Summary of last week's songs - WeekSummary\n\n____\nMade by: @gventura_ss`, { media: { media_ids: [hoursId, artistId, musicsId] } });
    }
}

module.exports = TwitterController;