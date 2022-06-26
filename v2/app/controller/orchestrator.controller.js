const userController = require('./user.controller');
const spotifyController = require('./spotify.controller');
const summaryController = require('./summary.controller');

class OrchestratorController {
    initColectInformation = async () => {
        try {
            const usersCredentials = await userController.getUsersSpotifyCredentials();
            await Promise.all(
                usersCredentials.map(credential => {
                    spotifyController.initProcess(credential);
                })
            )
            return {message: "Successful"}
        } catch (err) {
            throw new Error(err);
        }
    }

    initBuildSummary = async () => {
        try {
            const usersCredentials = await userController.getUsersTwitterCredentials();
            await Promise.all(
                usersCredentials.map(credential => {
                    summaryController.buildSummary(credential);
                })
            )
            return {message: "Successful"}
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new OrchestratorController();