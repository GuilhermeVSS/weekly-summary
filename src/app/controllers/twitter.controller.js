require('dotenv').config();

const {twitter} = require('../../services/twitter.svr');
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
            await trackLogic.initProcess(tracks, artists);
            const artistId = await twitter.v1.uploadMedia('src/assets/top_artists.png');
            const hoursId = await twitter.v1.uploadMedia('src/assets/hours_and_genres.png');
            const musicsId = await twitter.v1.uploadMedia('src/assets/top_musics.png');
            await twitter.v2.tweet(`Análise das minhas últimas ${limit} músicas - (Teste Api)`, {media:{media_ids:[hoursId,artistId, musicsId]}});
        }catch(err){
            console.log("ERRO AO PUBLICAR", err);
        }
        return;
    }

    postTweet = async(req, res)=>{
        try{
            const mediaId = await twitter.v1.uploadMedia('src/assets/background_image_blue.jpg');
            console.log(mediaId);
            console.log("na imagem");
            await twitter.v2.tweet('nuss', {media:{media_ids:[mediaId]}});
            return res.json({message: "sucesso"})
        }catch(err){
            console.log(err);
        }
        return res.json({message: "Fudeu"});
    }
}

module.exports = new TwitterController();