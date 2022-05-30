const moment = require('moment');
const fs = require('fs');

const leftPad = (value, totalWidth, paddingChar) => {
    var length = totalWidth - value.toString().length + 1;
    return Array(length).join(paddingChar || '0') + value;
};


const calculateHours = (miliseconds) => {
    seconds = parseInt((miliseconds / 1000) % 60);
    minutes = parseInt((miliseconds / 60000) % 60);
    hours = parseInt((miliseconds / 3600000));
    return `${leftPad(hours,2)}h:${leftPad(minutes,2)}m:${leftPad(seconds,2)}s`
}


const processTracks = async (tracks) => {
    let hoursListened = 0;
    const mapArtist = {};
    const mapMusicArtists = {}

    for(const track of tracks){
        hoursListened += track.duration_ms;
        for(const artist of track.artists){
            mapArtist[artist.name] = mapArtist[artist.name]? mapArtist[artist.name] + 1: 1;
            if(mapMusicArtists[track.name]){
                mapMusicArtists[track.name].push(artist.name);
            } else {
                mapMusicArtists[track.name] = [artist.name];
            };
        }
    }
    
    hoursListened = calculateHours(hoursListened);

    const topArtists = Object.entries(mapArtist).map(([key, value])=>{
        return {
            key,
            value
        }
    }).sort((a,b)=>{
        return b.value - a.value;
    }).map(data=>{
        return `${data.key} - ${data.value}\n`
    }).join('');


    const musicsByArtist = Object.entries(mapMusicArtists).map(([key, value])=>{
        const phrase = `${key} - By: `
        const listOfArtists = value.reduce((artists, data)=>{
            artists = artists + `${data}, `;
            return artists;
        },'');
        return phrase + listOfArtists + `\n`;
    }).join('');

    return {
        hours :hoursListened,
        musics : musicsByArtist,
        artists : topArtists
    };
};

module.exports = {
    processTracks
}