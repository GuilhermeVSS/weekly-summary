
class AggregationHelper {
    getHoursListened(begin, end) {
        return [
            {
                $match: { "createdAt": { $gte: begin, $lte: end } }
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

    getMostGenresListened(begin, end) {
        return [
            {
                $match: { "createdAt": { $gte: begin, $lte: end } }
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
            { $limit : 5 }
        ]
    }

    getMostSongsListened(begin, end) {
        return [
            {
                $match: { "createdAt": { $gte: begin, $lte: end } }
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
                    album:{$addToSet: "$songs.album"},
                    frequency: {
                        $sum: 1
                    }
                }
            },
            { $sort: { "frequency": -1 } },
            { $limit : 5 }
        ]
    }

    getMostArtistsListened(begin, end) {
        return [
            {
                $match: { "createdAt": { $gte: begin, $lte: end } }
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
            { $limit : 5 }
        ]
    }

}

module.exports = new AggregationHelper();