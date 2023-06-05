const {ObjectID} = require('mongoose');
class AggregationHelper {
    getUsersSpotifyCredential() {
        return [
            {
                $match: {
                    "spotify_access_token": {
                        $ne: null
                    },
                    "spotify_refresh_token": {
                        $ne: null
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    spotify_access_token: 1,
                    spotify_refresh_token: 1
                }
            }
        ]
    }

    getUsersTwitterCredentials() {
        return [
            {
                $match: {
                    "access_secret_twitter": {
                        $ne: null
                    },
                    "access_token_twitter": {
                        $ne: null
                    },
                    "consumer_key_twitter": {
                        $ne: null
                    },
                    "consumer_secret_twitter": {
                        $ne: null
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    access_secret_twitter: 1,
                    access_token_twitter: 1,
                    consumer_key_twitter: 1,
                    consumer_secret_twitter: 1
                }
            }
        ]
    }

    getHoursListened(userId, begin, end) {
        return [
            {
                $match: { "createdAt": { $gte: begin, $lte: end }, "user_id": userId }
            },
            {
                $group: {
                    _id: null,
                    sum: {
                        $sum: "$timeListened"
                    }
                }
            }
        ]
    }

    getMostGenresListened(userId, begin, end) {
        return [
            {
                $match: { "createdAt": { $gte: begin, $lte: end }, "user_id": userId }
            },
            {
                $project: {
                    _id: 1,
                    artists: 1
                }
            },
            {
                $unwind: "$artists"
            },
            {
                $unwind: "$artists.genres"
            },
            {
                $group: {
                    _id: "$artists.genres",
                    frequency: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "frequency": -1
                }
            },
            { $limit: 5 }
        ]
    }

    getMostSongsListened(userId, begin, end) {
        return [
            {
                $match: { "createdAt": { $gte: begin, $lte: end }, "user_id": userId }
            },
            {
                $project: {
                    songs: 1,
                    _id: 1
                }
            },
            {
                $unwind: "$songs"
            },
            {
                $group: {
                    _id: "$songs.name",
                    album: { $addToSet: "$songs.album" },
                    frequency: {
                        $sum: 1
                    }
                }
            },
            { $sort: { "frequency": -1 } },
            { $limit: 5 }
        ]
    }

    getMostArtistsListened(userId, begin, end) {
        return [
            {
                $match: { "createdAt": { $gte: begin, $lte: end }, "user_id": userId }
            },
            {
                $project: {
                    artists: 1,
                    _id: 1,
                    images: 1,
                    name: 1
                }
            },
            {
                $unwind: "$artists"
            },
            {
                $unwind: "$artists.genres"
            },
            {
                $group: {
                    _id: "$artists.name",
                    images: {
                        $addToSet: "$artists.images"
                    },
                    frequency: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    frequency: -1
                }
            },
            { $limit: 5 }
        ]
    }
}

module.exports = new AggregationHelper();