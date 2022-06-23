const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

//Model Colleciton setup
const daySchema = new Schema({
    songs: {type: []},
    artists: {type: []},
    timeListened: {type: Number},
    createdAt: { type: String, default: moment(Date.now()).format('DD-MM-YYYY'), unique: true }
});

const Day = mongoose.model('day', daySchema);

module.exports = {
    Day
};