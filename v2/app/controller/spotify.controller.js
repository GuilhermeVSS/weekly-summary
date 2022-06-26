require('dotenv').config();
const spotify = require('../../../src/services/spotify.svr');
const querystring = require("querystring");
const axios = require('axios');
const { Day } = require('../../../src/app/models/day.model');
const { Cursor } = require('../../../src/app/models/cursor.model');

const trackLogic = require('../logic/track.logic');

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
        try {
            const [tracksData, nextCursor, cursor] = await this.getLastSongs(credential);
            const songsData = await this.getSongsData(credential, tracksData);
            const artistsData = await this.getArtists(credential, songsData);
            const { artists, songs, timeListened } = await trackLogic.initProcess(songsData, artistsData);
            const newDaySummary = new Day({ artists, songs, timeListened, user_id: credential._id });
            await newDaySummary.save();
            if (!cursor) {
                const newCursor = new Cursor({ after: nextCursor, user_id: credential._id });
                await newCursor.save();
            }
            else if (nextCursor) {
                await cursor.update({ $set: { after: nextCursor } });
            }
            return { message: "Successful" }
        } catch (err) {
            console.log("Err:", err.message);
            return { message: "Something Went Wrong" }
        }
    }

}

module.exports = new SpotifyController();