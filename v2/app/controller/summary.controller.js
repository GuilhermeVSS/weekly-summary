const { Day } = require('../../../src/app/models/day.model');
const moment = require('moment');
const aggregateHelper = require('../helpers/aggregation.helper');

const imageBuilder = require('../logic/image-builder.logic');
const Twitter = require('./twitter.controller');
const fs = require(`fs`);
const path = require('path');
const Log = require('../log/index');

class SummaryController {
    buildSummary = async (credential) => {
        await Log.start(`Build-Summary`, credential._id);
        try {
            const begin = moment().subtract(7, 'd').format('DD-MM-YYYY');
            const end = moment().format('DD-MM-YYYY');
            const [[timeListened], mostArtistsListened, mostGenresListened, mostSongsListened] = await Promise.all([
                Day.aggregate(aggregateHelper.getHoursListened(credential._id, begin, end)),
                Day.aggregate(aggregateHelper.getMostArtistsListened(credential._id, begin, end)),
                Day.aggregate(aggregateHelper.getMostGenresListened(credential._id, begin, end)),
                Day.aggregate(aggregateHelper.getMostSongsListened(credential._id, begin, end))
            ])
            await Log.trace(`Build-Summary`, {
                key: credential._id,
                status: "Success",
                name: "Collect user data on mongo",
                data: {}
            });

            const imageId = Date.now();
            await Promise.all([
                await imageBuilder.buildImageTopArtist(imageId, mostArtistsListened),
                await imageBuilder.buildImageHoursAndGenres(imageId, mostGenresListened, timeListened),
                await imageBuilder.buildImageMusics(imageId, mostSongsListened)
            ]);

            await Log.trace(`Build-Summary`, {
                key: credential._id,
                status: "Success",
                name: "Build Image",
                data: {}
            });

            const twitter = new Twitter(credential);
            await twitter.postSummary(imageId);

            await Log.trace(`Build-Summary`, {
                key: credential._id,
                status: "Success",
                name: "Posted on twitter",
                data: {}
            });

            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-hours-and-genres.png`));
            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-musics.png`));
            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-artists.png`));
            await Log.trace(`Build-Summary`, {
                key: credential._id,
                status: "Success",
                name: "Delete Images",
                data: {}
            });

            await Log.end(`Build-Summary`, credential._id);

            return { message: "Successful" };
        } catch (err) {
            await Log.trace(`Build-Summary`, {
                key: credential._id,
                status: "Error",
                name: "Erro on Build Summary",
                data: { message: err.message }
            });
            await Log.end(`Build-Summary`, credential._id);
            throw new Error(err);
        }
    }
}

module.exports = new SummaryController();