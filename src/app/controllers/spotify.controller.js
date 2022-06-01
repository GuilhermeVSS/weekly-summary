require('dotenv').config();
const spotify = require('../../services/spotify.svr');
const querystring = require("querystring");
const axios = require('axios');
const fs = require('fs');
const twitterController = require('./twitter.controller');
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

    refreshToken = async (req, res) => {
        try {
            const [, baseUrl] = req.rawHeaders;
            const { data: result } = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
                "grant_type": "refresh_token",
                "client_id": process.env.SPOTIFY_CLIENT_ID,
                "client_secret": process.env.SPOTIFY_CLIENT_SECRET,
                "refresh_token": this._refreshToken
            }))
            this._accessToken = result.access_token;
            this._refreshToken = result.refresh_token;
            return;
        } catch (err) {
            return res.json({ error: err });
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

    verifyToken = async (req, res, error) => {
        try {
            if (error == "The access token expired") {
                await this.refreshToken(req, res);
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    getArtists = async (req, res, tracks) => {
        const artists = [];
        const mapArtists = {};

        const config = {
            headers: {
                Authorization: `Bearer ${this._accessToken}`
            }
        }

        try {
            for (const track of tracks) {
                let artist;
                if(mapArtists[track.artists[0].id]) {
                    mapArtists[track.artists[0].id] += 1;
                    continue;
                }
                try {
                    artist = await spotify.get(`/artists/${track.artists[0].id}`, config);
                } catch (err) {
                    const { response: { data: { error: error } } } = err;
                    await this.verifyToken(req, res, error.message);
                    artist = await spotify.get(`/artists/${track.artists[0].id}`, config);
                }
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

            const tracks = await this.createSummary(req, res, result.data.items);

            return res.json({ data: tracks });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new SpotifyController();