const moment = require('moment');
const fs = require('fs');
const imageBuilder = require('./image-builder.lg');

const leftPad = (value, totalWidth, paddingChar) => {
    var length = totalWidth - value.toString().length + 1;
    return Array(length).join(paddingChar || '0') + value;
};


const calculateHours = (miliseconds) => {
    seconds = parseInt((miliseconds / 1000) % 60);
    minutes = parseInt((miliseconds / 60000) % 60);
    hours = parseInt((miliseconds / 3600000));
    return `${leftPad(hours, 2)}h:${leftPad(minutes, 2)}m:${leftPad(seconds, 2)}s`
}

const getMusics = (mapMusicArtists) => {
    return Object.entries(mapMusicArtists).map(([key, value]) => {
        const phrase = `${key} - By: `
        const listOfArtists = value.reduce((artists, data) => {
            artists = artists + `${data}, `;
            return artists;
        }, '');
        return phrase + listOfArtists + `\n`;
    }).join('');
}

const calculateTopArtists = (mapArtists) => {
    try{
        return Object.entries(mapArtists).map(([key, value]) => {
            return {
                key,
                value
            }
        }).sort((a, b) => {
            return b.value - a.value;
        }).map((data, key) => {
            return `${key + 1}º - ${data.key}`
        }).join('\n');
    } catch(e){
        console.log(e);
        return e;
    }
}

const processArtists = (artistsObject)=>{
    try {
        // console.log(artistsObject);

        const {mapArtists, artists} = artistsObject;
        let artistsVector = Object.entries(mapArtists).map(([key, value])=>{
                return {
                    id: key, 
                    timesListened: value
                }
            }).sort((a, b)=>{
                return b.timesListened - a.timesListened;
            });
            console.log("artistsVector", artistsVector[0])
            console.log("ARTISTA EXEMPLO", artists[0])
        artistsVector = artistsVector.map((data, key)=>{
            // console.log(data);
            const foundArtist = artists.find(artist=>{
                return artist.id == data.id;
            })
            return foundArtist; 
        });
        console.log("ORDENADO", artistsVector)
        return artistsVector.slice(0,10); 
    } catch(err) {
        console.log(err);
    }
}
const initProcess = async (tracks, artists) => {
    console.log("Iniciando processo")
    const dataArtists = processArtists(artists);
    console.log("Artistas Coletados")
    await imageBuilder.buildImageTopArtist(dataArtists);
    // const {msListened, mapArtist, mapMusicArtists} = processTracks(tracks);
    // const hoursListened = calculateHours(msListened);
    // const musics = getMusics(mapMusicArtists);
    // const topArtists = calculateTopArtists(mapArtist);
    return {
        // hours: hoursListened,
        // musics: musics,
        // artists: topArtists,
    }
}

const processTracks = (tracks) => {
    let msListened = 0;
    const mapArtist = {};
    const mapMusicArtists = {}

    for (const track of tracks) {
        msListened += track.duration_ms;
        for (const artist of track.artists) {
            mapArtist[artist.name] = mapArtist[artist.name] ? mapArtist[artist.name] + 1 : 1;
            if (mapMusicArtists[track.name]) {
                mapMusicArtists[track.name].push(artist.name);
            } else {
                mapMusicArtists[track.name] = [artist.name];
            };
        }
    }

    return {
        msListened,
        mapMusicArtists,
        mapArtist
    };
};

const processTracksForImages = (tracks) => {
    let msListened = 0;
    const mapArtist = {};
    const mapMusicArtists = {}

    for (const track of tracks) {
        msListened += track.duration_ms;
        for (const artist of track.artists) {
            mapArtist[artist.name] = mapArtist[artist.name] ? mapArtist[artist.name] + 1 : 1;
            if (mapMusicArtists[track.name]) {
                mapMusicArtists[track.name].push(artist.name);
            } else {
                mapMusicArtists[track.name] = [artist.name];
            };
        }
    }

    return {
        msListened,
        mapMusicArtists,
        mapArtist
    };
};

module.exports = {
    initProcess
}