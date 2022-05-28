require('dotenv').config();
const spotify = require('../../services/spotify');
const querystring = require("querystring");
const axios = require('axios');

class SpotifyController {

    constructor(token, refresh){
        this.accessToken = token;
        this.refreshToken = refresh;
        console.log(this.refreshToken);
        console.log(this.accessToken);
    }

    set setAccessToken(token){
        this.accessToken = token;
    }

    set setRefreshToken(refreshToken){
        this.refreshToken = refreshToken;
    }

    get getAccessToken(){
        return this.accessToken;
    }

    get getRefreshToken(){
        return this.refreshToken;
    }

    async getAuthorization(req, res) {
        try{
            const [, baseUrl] = req.rawHeaders;
            var scope = 'user-read-private user-read-email user-read-recently-played user-read-playback-state user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private';
    
            res.redirect('https://accounts.spotify.com/authorize?' +
                querystring.stringify({
                    response_type: 'code',
                    client_id: process.env.SPOTIFY_CLIENT_ID,
                    scope: scope,
                    redirect_uri: `${process.env.SECURITY}://${baseUrl}/authorized`,
                }));
        }catch(err){
            return res.json({error:err});
        }
    }

    async getToken(req, res) {
        try{
            const {code} = req.query;
            const [, baseUrl] = req.rawHeaders;
            const {data: result} = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
                "grant_type": "authorization_code",
                "code": code,
                "client_id": process.env.SPOTIFY_CLIENT_ID,
                "client_secret": process.env.SPOTIFY_CLIENT_SECRET,
                "redirect_uri": `${process.env.SECURITY}://${baseUrl}/authorized`
            }))
                
            this.setAccessToken(result.access_token);
            this.setRefreshToken(result.refresh_token);
            return res.send("Token has beenn saved succesfully");
        } catch(err) {

            console.log(err);
            return res.json({error:err});
        }
    }

    async refreshToken(req, res) {
        try{
            const [, baseUrl] = req.rawHeaders;
            const result = await axios.post("https://accounts.spotify.com/api/token", querystring.stringify({
                "grant_type": "refresh_token",
                "client_id": process.env.SPOTIFY_CLIENT_ID,
                "client_secret": process.env.SPOTIFY_CLIENT_SECRET,
                "refresh_token": this.refreshToken
            }))
            this._accessToken = result.access_token;
            this._refreshToken = result.refresh_token;

        }catch(err){
            return res.json({error: err});
        }
    }

    async confirmation(req,res){
        try {
            return res.json({
                "token": this.getAccessToken(),
                "refreshToken": this.getRefreshToken()
            });
        }catch(err){
        }
    }
}

module.exports = new SpotifyController('', '');