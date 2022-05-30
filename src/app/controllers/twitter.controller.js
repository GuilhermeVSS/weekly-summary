const twitter = require('../../services/twitter.svr');
const trackLogic = require('../logic/track.logic');

const moment = require('moment');

class TwitterController {

    postHeadHours = async(limit, hours) =>{
        const headTweet = await twitter.post(`/tweets`, {
            "text": `Summary of the last ${limit} songs - ${moment().format('dd.mm.yyyy')}\nTotal Time: ${hours}`
        });
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

    postSummary = async(limit, tracks)=>{
        try{
            const {hours, musics, artists} = await trackLogic.processTracks(tracks);
            let id;
            id = await this.postHeadHours(limit, hours);
            id = await this.postTopArtists(id, artists);
            id = await this.postSongs(id, musics);
        }catch(err){
            console.log("ERRO AO PUBLICAR", err);
        }
        return;
    }
}

module.exports = new TwitterController();