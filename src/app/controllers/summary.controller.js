const { Day } = require('../models/day.model');
const moment = require('moment');
const aggregateHelper = require('../helpers/aggregation.helper')

const imageBuilder = require('../logic/image-builder.lg');
const twitter = require('./twitter.controller');
const fs = require(`fs`);
const path = require('path');

class SummaryController {
    buildSummary = async()=>{
        try{
            const begin = moment().subtract(7,'d').format('DD-MM-YYYY');
            const end = moment().format('DD-MM-YYYY');
            const [[timeListened], mostArtistsListened, mostGenresListened, mostSongsListened] = await Promise.all([
                Day.aggregate(aggregateHelper.getHoursListened(begin, end)),
                Day.aggregate(aggregateHelper.getMostArtistsListened(begin, end)),
                Day.aggregate(aggregateHelper.getMostGenresListened(begin, end)),
                Day.aggregate(aggregateHelper.getMostSongsListened(begin, end))
            ])
            const imageId = Date.now();
            await Promise.all([
                await imageBuilder.buildImageTopArtist(imageId, mostArtistsListened),
                await imageBuilder.buildImageHoursAndGenres(imageId, mostGenresListened, timeListened),
                await imageBuilder.buildImageMusics(imageId, mostSongsListened)
            ]);
            await twitter.postSummary(imageId);
            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-hours-and-genres.png`));
            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-musics.png`));
            fs.unlinkSync(path.resolve(__dirname, '..', '..', '..', 'tmp', `${imageId}-top-artists.png`));
        }catch(err){
            console.log(err);
        }
        return;
    }
}

module.exports = new SummaryController();