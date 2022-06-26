const mongoose = require('mongoose');
const { Schema } = mongoose;

//Model Colleciton setup
const userSchema = new Schema({
    email: {type: String, unique: true},
    name: {type: String},
    username:{type: String},
    password_hash:{type: String},
    spotify_access_token:{type: String},
    spotify_refresh_token:{type: String},
    consumer_key_twitter:{type: String},
    consumer_secret_twitter:{type: String},
    access_token_twitter:{type: String},
    access_secret_twitter:{type: String},
},{ timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = {
    User
};