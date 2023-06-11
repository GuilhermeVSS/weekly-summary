const sessionController = require('./session.controller');
const orchestratorController = require('./orchestrator.controller');
const dayController = require('./day.controller');
const spotifyController = require('./spotify.controller');
const summaryController = require('./summary.controller');
const TwitterController = require('./twitter.controller');
const userController = require('./user.controller');

module.exports = {
    sessionController,
    orchestratorController,
    dayController,
    spotifyController,
    summaryController,
    userController,
    TwitterController
}