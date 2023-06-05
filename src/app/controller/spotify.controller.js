require('dotenv').config();
const spotify = require('../../services/spotify.svr');
const querystring = require("querystring");
const axios = require('axios');
const { Day } = require('../models/day.model');
const { Cursor } = require('../models/cursor.model');

const trackLogic = require('../logic/track.logic');
const Log = require(`../log`);

class SpotifyController {

    refreshToken = async (credential) => {
        const { data: result } = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
            "grant_type": "refresh_token",
            "client_id": process.env.SPOTIFY_CLIENT_ID,
            "client_secret": process.env.SPOTIFY_CLIENT_SECRET,
            "refresh_token": credential.spotify_refresh_token
        }))
        return result.access_token;
    }

    getArtists = async (credential, tracks) => {
        const artists = [];
        const mapArtists = {};

        credential.accessToken = await this.refreshToken(credential);

        const config = {
            headers: {
                Authorization: `Bearer ${credential.accessToken}`
            }
        }

        for (const track of tracks) {
            if (mapArtists[track.artists[0].id]) {
                mapArtists[track.artists[0].id] += 1;
                continue;
            }
            const artist = await spotify.get(`/artists/${track.artists[0].id}`, config);

            mapArtists[track.artists[0].id] = 1;
            artists.push(artist.data);
        }

        return {
            mapArtists,
            artists
        };
    }

    getSongsData = async (credential, tracks) => {
        credential.accessToken = await this.refreshToken(credential);
        let ids = tracks.map((track, key) => {
            return key == tracks.length - 1 ? `${track.track.id}` : `${track.track.id},`
        }).join('');

        const config = {
            headers: {
                "Authorization": `Bearer ${credential.accessToken}`
            },
            params: {
                ids: ids
            }
        }

        const result = await spotify.get('/tracks', config);

        const musics = result.data.tracks;

        return musics;
    }

    getLastSongs = async (credential) => {
        const limit = 50;
        credential.accessToken = await this.refreshToken(credential);
        const [foundCursor] = await Cursor.find({ user_id: credential._id });
        const config = {
            headers: {
                Authorization: `Bearer ${credential.accessToken}`
            },
            params: {
                limit: limit,
                after: foundCursor ? foundCursor.after : null,
            }
        }

        const result = await spotify.get('/me/player/recently-played', config);

        const afterCursor = result.data.cursors ? result.data.cursors.after : null;

        const tracks = result.data.items;
        return [tracks, afterCursor, foundCursor];
    }

    initProcess = async (credential) => {
        await Log.start(`Get-Spotify-Info`, credential._id);
        try {
            const [tracksData, nextCursor, cursor] = await this.getLastSongs(credential);
            await Log.trace(`Get-Spotify-Info`, {
                key: credential._id,
                status: "Success",
                name: "Get last songs",
                data: {}
            });
            const songsData = await this.getSongsData(credential, tracksData);
            await Log.trace(`Get-Spotify-Info`, {
                key: credential._id,
                status: "Success",
                name: "Get songs information",
                data: {}
            });
            const artistsData = await this.getArtists(credential, songsData);
            await Log.trace(`Get-Spotify-Info`, {
                key: credential._id,
                status: "Success",
                name: "Get artists information",
                data: {}
            });
            const { artists, songs, timeListened } = await trackLogic.initProcess(songsData, artistsData);
            await Log.trace(`Get-Spotify-Info`, {
                key: credential._id,
                status: "Success",
                name: "Data transformation to mongo",
                data: {}
            });
            const newDaySummary = new Day({ artists, songs, timeListened, user_id: credential._id });
            await newDaySummary.save();
            await Log.trace(`Get-Spotify-Info`, {
                key: credential._id,
                status: "Success",
                name: "Saved on mongo",
                data: {}
            });
            if (!cursor) {
                const newCursor = new Cursor({ after: nextCursor, user_id: credential._id });
                await newCursor.save();
            }
            else if (nextCursor) {
                await cursor.update({ $set: { after: nextCursor } });
            }
            await Log.trace(`Get-Spotify-Info`, {
                key: credential._id,
                status: "Success",
                name: "Update/create cursor",
                data: {}
            });
            await Log.end('Get-Spotify-Info', credential._id);
            return { message: "Successful" }
        } catch (err) {
            await Log.trace('Get-Spotify-Info', {
                key: credential._id,
                status: 'Error',
                name: "Error on collect Information",
                data: {message: err.message}
            })
            await Log.end('Get-Spotify-Info', credential._id);
            return { message: "Something Went Wrong" }
        }
    }

}

module.exports = new SpotifyController();