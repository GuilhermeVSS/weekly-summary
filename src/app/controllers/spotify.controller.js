require('dotenv').config();
const spotify = require('../../services/spotify.svr');
const querystring = require("querystring");
const axios = require('axios');
const fs = require('fs');
const twitterController = require('./twitter.controller');
const { Day } = require('../models/day.model');
const { Cursor } = require('../models/cursor.model');

const trackLogic = require('../logic/track.logic');
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

            console.log(err);
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
            // console.log(result);
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
                console.log("Chamando refresh Token");
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

        try {
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
        } catch (err) {
            console.log(err);
        }

        return {
            mapArtists,
            artists
        };
    }

    createSummary = async (req, res, tracks) => {
        const { limit } = req.query;
        try {
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

            let result;

            try {
                result = await spotify.get('/tracks', config);
            } catch (err) {
                const { response: { data: { error: error } } } = err;
                await this.verifyToken(req, res, error.message);
                result = await spotify.get('/tracks', config);
            }

            const musics = result.data.tracks;
            const artists = await this.getArtists(req, res, musics);

            await twitterController.postSummary(limit, musics, artists);

            return { data: result.data };
        } catch (err) {
            throw err;
        }
    }

    recentlyPlayed = async (req, res) => {
        const { limit } = req.query;
        try {
            let result;
            const config = {
                headers: {
                    Authorization: `Bearer ${this._accessToken}`
                },
                params: {
                    limit: limit
                }
            }

            try {
                result = await spotify.get('/me/player/recently-played', config);
            } catch (err) {
                const { response: { data: { error: error } } } = err;
                await this.verifyToken(req, res, error.message);
                result = await spotify.get('/me/player/recently-played', config);
            }

            //this.createSummary(req, res, result.data.items);

            return res.json({ message: "your songs are being processed" });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    getMusicData = async (tracks) => {
        try {

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

        } catch (err) {
            throw new Error(err);
        }
    }

    getLastSongs = async () => {
        const limit = 50;
        try {

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

            const afterCursor = result.data.cursors? result.data.cursors.after: null;

            if (!foundCursor) {
                const newCursor = new Cursor({ after: afterCursor });
                await newCursor.save();
            }
            else if (afterCursor) {
                await foundCursor.update({ $set: { after: afterCursor } });
            }

            const tracks = result.data.items;
            return tracks;
        } catch (err) {
            console.log("Error linha 272", err);
            throw new Error(err);
        }
    }

    initProcess = async () => {
        try {
            const tracksData = await this.getLastSongs();
            console.log("Tracks");
            const musicsData = await this.getMusicData(tracksData);
            console.log("Songs");
            const artistsData = await this.getArtists(musicsData);
            console.log("Artists");
            const { artists, songs, timeListened } = await trackLogic.initProcess(musicsData, artistsData);
            const newDaySummary = new Day({ artists, songs, timeListened });
            await newDaySummary.save();
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new SpotifyController();