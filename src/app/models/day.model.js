const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

//Model Colleciton setup
const daySchema = new Schema({
    songs: {type: []},
    artists: {type: []},
    timeListened: {type: Number},
    user_id: {type: Schema.Types.ObjectId},
    createdAt: { type: String, default: moment(Date.now()).format('DD-MM-YYYY')}
});

const Day = mongoose.model('day', daySchema);

module.exports = {
    Day
};