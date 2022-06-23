require('dotenv').config();
const spotify = require('../../services/spotify.svr');
const querystring = require("querystring");
const axios = require('axios');
const { Day } = require('../models/day.model');
const { Cursor } = require('../models/cursor.model');

const trackLogic = require('../logic/track.logic');
const telegramSendMessage = require('../../services/telegram.svr');
class SpotifyController {

    constructor() {
        this._accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
        this._refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
        return this;
    }

    getAuthorization = async (req, res) => {
        try {
            const [, baseUrl] = req.rawHeaders;
            var scope = 'user-read-private user-read-email user-read-recently-played user-read-playback-state user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private';

            res.redirect('https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                    response_type: 'code',
                    client_id: process.env.SPOTIFY_CLIENT_ID,
                    scope: scope,
                    redirect_uri: `${process.env.SECURITY}://${baseUrl}/authorized`,
                }));
        } catch (err) {
            return res.json({ error: err });
        }
    }

    getToken = async (req, res) => {
        try {
            const { code } = req.query;
            const [, baseUrl] = req.rawHeaders;
            const { data: result } = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
                "grant_type": "authorization_code",
                "code": code,
                "client_id": process.env.SPOTIFY_CLIENT_ID,
                "client_secret": process.env.SPOTIFY_CLIENT_SECRET,
                "redirect_uri": `${process.env.SECURITY}://${baseUrl}/authorized`
            }))

            this._accessToken = result.access_token;
            this._refreshToken = result.refresh_token;

            return res.send("Token has beenn saved succesfully");
        } catch (err) {
            return res.json({ error: err });
        }
    }

    refreshToken = async () => {
        try {
            const { data: result } = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
                "grant_type": "refresh_token",
                "client_id": process.env.SPOTIFY_CLIENT_ID,
                "client_secret": process.env.SPOTIFY_CLIENT_SECRET,
                "refresh_token": this._refreshToken
            }))
            this._accessToken = result.access_token;
            return;
        } catch (err) {
            console.log("Erro linha 71", err);
            throw new Error(err)
        }
    }

    confirmation = async (req, res) => {
        try {
            const tokens = {
                accessToken: this._accessToken,
                refreshToken: this._refreshToken
            };
            return res.json(tokens);
        } catch (err) {
            return res.json({ error: err });
        }
    }

    verifyToken = async (error) => {
        try {
            console.log("Verify Token");
            if (error == "The access token expired") {
                await this.refreshToken();
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    getArtists = async (tracks) => {
        const artists = [];
        const mapArtists = {};

        const config = {
            headers: {
                Authorization: `Bearer ${this._accessToken}`
            }
        }

        await this.refreshToken();
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

    getSongsData = async (tracks) => {
        await this.refreshToken();
        let ids = tracks.map((track, key) => {
            return key == tracks.length - 1 ? `${track.track.id}` : `${track.track.id},`
        }).join('');

        const config = {
            headers: {
                "Authorization": `Bearer ${this._accessToken}`
            },
            params: {
                ids: ids
            }
        }

        const result = await spotify.get('/tracks', config);

        const musics = result.data.tracks;

        return musics;
    }

    getLastSongs = async () => {
        const limit = 50;
        await this.refreshToken();
        const [foundCursor] = await Cursor.find();
        const config = {
            headers: {
                Authorization: `Bearer ${this._accessToken}`
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

    initProcess = async (req, res) => {
        try {
            const [tracksData, nextCursor, cursor] = await this.getLastSongs();
            const songsData = await this.getSongsData(tracksData);
            const artistsData = await this.getArtists(songsData);
            const { artists, songs, timeListened } = await trackLogic.initProcess(songsData, artistsData);
            const newDaySummary = new Day({ artists, songs, timeListened});
            await newDaySummary.save();
            if (!cursor) {
                const newCursor = new Cursor({ after: nextCursor });
                await newCursor.save();
            }
            else if (nextCursor) {
                await cursor.update({ $set: { after: nextCursor } });
            }
            await telegramSendMessage("Songs collected successfully");
            return res ? res.json({ message: "Spotify Info retrieved successfuly" }) : { message: "Successful" }
        } catch (err) {
            const error = JSON.stringify(err.message);
            telegramSendMessage(`Error on retrieve songs ${error}`);
            return res ? res.status(500).json({ message: "Somethin Went Wrong" }) : { message: "Something Went Wrong" }
        }
    }
}

module.exports = new SpotifyController();