require('dotenv').config();

const {twitter, twitterUpload} = require('../../services/twitter.svr');
const trackLogic = require('../logic/track.logic');
const headerHelper = require('../helpers/headerHelper');

const moment = require('moment');

class TwitterController {

    constructor (){
        this.tweetUrl = process.env.TWITTER_URL
        this.uploadUrl = process.env.TWITTER_UPLOAD_URL
    }

    postHeadHours = async(limit, hours) =>{
        const config = {
            headers: headerHelper.getAuthorization(`${this.tweetUrl}/tweets`)
        }
        const headTweet = await twitter.post(`/tweets`, {
            "text": `Summary of the last ${limit} songs - ${moment().format('dd.mm.yyyy')}\nTotal Time: ${hours}`
        }, config);
        return headTweet.data.data.id
    }

    postHours = async(Id, hours)=>{
        let hoursTweet = await twitter.post(`/tweets`, {
            "text": `Total Time: ${hours}`,
            "reply":{
                "in_reply_to_tweet_id": Id
            }
        });
        return hoursTweet.data.data.id
    }

    postTopArtists = async(Id, topArtists)=>{
        let topArtistTweet = await twitter.post('/tweets', {
            "text": `Most listened to artists:\n${topArtists}`,
            "reply":{
                "in_reply_to_tweet_id": Id
            }
        });
        return topArtistTweet.data.data.id
    }


    postSongs = async(Id, musics) =>{
        let topArtistTweet = await twitter.post('/tweets', {
            "text": `Songs and artists:\n ${musics}`,
            "reply":{
                "in_reply_to_tweet_id": Id
            }
        });
        return topArtistTweet.data.data.id
    }

    postSummary = async(limit, tracks, artists)=>{
        try{
            console.log("Cheguei aqui");
            await trackLogic.initProcess(tracks, artists);
            let id;
            // id = await this.postHeadHours(limit, hours);
            // id = await this.postTopArtists(id, artists);
            // id = await this.postSongs(id, musics);
        }catch(err){
            console.log("ERRO AO PUBLICAR", err);
        }
        return;
    }
}

module.exports = new TwitterController();