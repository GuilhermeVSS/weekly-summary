const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

//Model Colleciton setup
const daySchema = new Schema({
    songs: {type: []},
    artists: {type: []},
    timeListened: {type: Number},
    user_id: {type: Schema.Types.ObjectId},
    createdAt: { type: Date, default: Date.now()}
});

const Day = mongoose.model('day', daySchema);

module.exports = {
    Day
};