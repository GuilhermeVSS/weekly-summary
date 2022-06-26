const { Day } = require('../../../src/app/models/day.model');
const moment = require('moment');
const aggregateHelper = require('../helpers/aggregation.helper');

const imageBuilder = require('../logic/image-builder.logic');
const Twitter = require('./twitter.controller');
const fs = require(`fs`);
const path = require('path');

class SummaryController {
    buildSummary = async(credential)=>{
        try{
            const begin = moment().subtract(7,'d').format('DD-MM-YYYY');
            const end = moment().format('DD-MM-YYYY');
            const [[timeListened], mostArtistsListened, mostGenresListened, mostSongsListened] = await Promise.all([
                Day.aggregate(aggregateHelper.getHoursListened(credential._id,begin, end)),
                Day.aggregate(aggregateHelper.getMostArtistsListened(credential._id,begin, end)),
                Day.aggregate(aggregateHelper.getMostGenresListened(credential._id,begin, end)),
                Day.aggregate(aggregateHelper.getMostSongsListened(credential._id,begin, end))
            ])
            const imageId = Date.now();
            await Promise.all([
                await imageBuilder.buildImageTopArtist(imageId, mostArtistsListened),
                await imageBuilder.buildImageHoursAndGenres(imageId, mostGenresListened, timeListened),
                await imageBuilder.buildImageMusics(imageId, mostSongsListened)
            ]);

            const twitter = new Twitter(credential);
            await twitter.postSummary(imageId);

            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-hours-and-genres.png`));
            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-musics.png`));
            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-artists.png`));
            return {message: "Successful"};
        }catch(err){
            throw new Error(err);
        }
    }
}

module.exports = new SummaryController();