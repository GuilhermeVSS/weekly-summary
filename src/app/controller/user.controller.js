const {User} = require('../models/user.model');
const aggregateHelper = require('../helpers/aggregation.helper');

class UserController {
    getUsersSpotifyCredentials = async () =>{
        const usersCredentials = await User.aggregate(aggregateHelper.getUsersSpotifyCredential());
        return usersCredentials;
    }

    getUsersTwitterCredentials = async () =>{
        const usersCredentials = await User.aggregate(aggregateHelper.getUsersTwitterCredentials());
        return usersCredentials;
    }
}

module.exports = new UserController();