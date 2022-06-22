// const moment = require('moment');
// const fs = require('fs');
// const imageBuilder = require('./image-builder.lg');

// const leftPad = (value, totalWidth, paddingChar) => {
//     var length = totalWidth - value.toString().length + 1;
//     return Array(length).join(paddingChar || '0') + value;
// };


// const calculateHours = (miliseconds) => {
//     seconds = parseInt((miliseconds / 1000) % 60);
//     minutes = parseInt((miliseconds / 60000) % 60);
//     hours = parseInt((miliseconds / 3600000));
//     return `${leftPad(hours, 2)}h:${leftPad(minutes, 2)}m:${leftPad(seconds, 2)}s`
// }

// const getMusics = (mapMusicArtists) => {
//     return Object.entries(mapMusicArtists).map(([key, value]) => {
//         const phrase = `${key} - By: `
//         const listOfArtists = value.reduce((artists, data) => {
//             artists = artists + `${data}, `;
//             return artists;
//         }, '');
//         return phrase + listOfArtists + `\n`;
//     }).join('');
// }

// const calculateTopArtists = (mapArtists) => {
//     try {
//         return Object.entries(mapArtists).map(([key, value]) => {
//             return {
//                 key,
//                 value
//             }
//         }).sort((a, b) => {
//             return b.value - a.value;
//         }).map((data, key) => {
//             return `${key + 1}º - ${data.key}`
//         }).join('\n');
//     } catch (e) {
//         console.log(e);
//         return e;
//     }
// }

// const processArtists = (artistsObject) => {
//     try {
//         const { mapArtists, artists } = artistsObject;
//         const artistsVector = artists.map(data=>{
//             return {
//                 genres: data.genres,
//                 id: data.id,
//                 images: data.images,
//                 name: data.name
//             }
//         })
        // let artistsVector = Object.entries(mapArtists).map(([key, value]) => {
        //     return {
        //         id: key,
        //         timesListened: value
        //     }
        // }).sort((a, b) => {
        //     return b.timesListened - a.timesListened;
        // });

        // artistsVector = artistsVector.map((data, key) => {
        //     const foundArtist = artists.find(artist => {
        //         return artist.id == data.id;
        //     })
        //     return foundArtist;
        // });
        // console.log("VETOR DE ARTISTAS TAMANHO", artistsVector.length);
//         return artistsVector;

//     } catch (err) {
//         console.log(err);
//     }
// }

// const processMusics = (tracks) => {
//     const mapMusics = {}
//     let msListened = 0;

//     tracks.map(track=>{
//         msListened += track.duration_ms;
//         if(mapMusics[track.name]) mapMusics[track.name] += 1;
//         else mapMusics[track.name] = 1;
//     });

//     let songs = tracks.map(data=>{
//         return {
//             album: data.album,
//             artists: data.artists,
//             duration_ms: data.duration_ms,
//             name: data.name,
//             id: data.id
//         }
//     });

    // let musicsVector = Object.entries(mapMusics).map(([key, value]) => {
    //     return {
    //         id: key,
    //         timesListened: value
    //     }
    // }).sort((a, b) => {
    //     return b.timesListened - a.timesListened;
    // });

    // musicsVector = musicsVector.map((data, key) => {
    //     const foundMusic = tracks.find(track => {
    //         return track.name == data.id;
    //     })
    //     return foundMusic;
    // });

    // const hoursListened = calculateHours(msListened);
    // console.log("Tamanho vector Musica", tracks);
//     return {
//         musicsVector: songs,
//         hoursListened: msListened
//     };
// }

// const processGenre = (artistsObject) => {
//     try {
//         const { mapArtists, artists } = artistsObject;
//         const mapGenre = {};
//         let vectorOfGenres = [];
//         artists.map(data=>{
//             for(const genre of data.genres){
//                 if(mapGenre[genre]){
//                     mapGenre[genre] += 1;
//                     continue;
//                 }
//                 mapGenre[genre] = 1;
//             }
//             vectorOfGenres = vectorOfGenres.concat(data.genres);
//         });

//         let genreVector = Object.entries(mapGenre).map(([key, value]) => {
//             return {
//                 id: key,
//                 timesListened: value
//             }
//         }).sort((a, b) => {
//             return b.timesListened - a.timesListened;
//         });

//         genreVector = genreVector.map((data, key) => {
//             const foundGenre = vectorOfGenres.find(genre => {
//                 return genre == data.id;
//             })
//             return foundGenre;
//         });

//         return genreVector.slice(0,5);

//     } catch (err) {
//         console.log("Genre", err);
//     }
// }
// const initProcess = async (tracks, artists) => {
//     const [dataArtists, dataGenres, musicsObject] = await Promise.all([
//         processArtists(artists),
//         processGenre(artists),
//         processMusics(tracks),
//     ]);

//     return {
//         artists: dataArtists,
//         songs: musicsObject.musicsVector,
//         timeListened: musicsObject.hoursListened
//     }

//     await Promise.all([
//         imageBuilder.buildImageTopArtist(dataArtists),
//         imageBuilder.buildImageHoursAndGenres(dataGenres, musicsObject.hoursListened),
//         imageBuilder.buildImageMusics(musicsObject.musicsVector)
//     ]);

//     return;
// }

// const processTracks = (tracks) => {
//     let msListened = 0;
//     const mapArtist = {};
//     const mapMusicArtists = {}

//     for (const track of tracks) {
//         msListened += track.duration_ms;
//         for (const artist of track.artists) {
//             mapArtist[artist.name] = mapArtist[artist.name] ? mapArtist[artist.name] + 1 : 1;
//             if (mapMusicArtists[track.name]) {
//                 mapMusicArtists[track.name].push(artist.name);
//             } else {
//                 mapMusicArtists[track.name] = [artist.name];
//             };
//         }
//     }

//     return {
//         msListened,
//         mapMusicArtists,
//         mapArtist
//     };
// };

// const processTracksForImages = (tracks) => {
//     let msListened = 0;
//     const mapArtist = {};
//     const mapMusicArtists = {}

//     for (const track of tracks) {
//         msListened += track.duration_ms;
//         for (const artist of track.artists) {
//             mapArtist[artist.name] = mapArtist[artist.name] ? mapArtist[artist.name] + 1 : 1;
//             if (mapMusicArtists[track.name]) {
//                 mapMusicArtists[track.name].push(artist.name);
//             } else {
//                 mapMusicArtists[track.name] = [artist.name];
//             };
//         }
//     }

//     return {
//         msListened,
//         mapMusicArtists,
//         mapArtist
//     };
// };

// module.exports = {
//     initProcess
// }