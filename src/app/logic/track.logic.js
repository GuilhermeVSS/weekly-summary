
const processArtists = (artistsObject) => {
    const { artists } = artistsObject;
    const artistsVector = artists.map(data => {
        return {
            genres: data.genres,
            id: data.id,
            images: data.images,
            name: data.name
        }
    })
    return artistsVector;
}

const processMusics = (tracks) => {

    const msListened = tracks.reduce((acc, track) => {
        acc += track.duration_ms;
        return acc
    }, 0);

    const songs = tracks.map(data => {
        return {
            album: data.album,
            artists: data.artists,
            duration_ms: data.duration_ms,
            name: data.name,
            id: data.id
        }
    });

    return {
        musicsVector: songs,
        hoursListened: msListened
    };
}

const initProcess = async (tracks, artists) => {
    const [dataArtists, musicsObject] = await Promise.all([
        processArtists(artists),
        processMusics(tracks),
    ]);

    return {
        artists: dataArtists,
        songs: musicsObject.musicsVector,
        timeListened: musicsObject.hoursListened
    }
}

module.exports = {
    initProcess
}