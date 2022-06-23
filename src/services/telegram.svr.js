require('dotenv').config();
const { Telegraf } = require('telegraf');
const { resolve } = require('path');

const botTelegram = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (message) => {
    try{
        await botTelegram.telegram.sendMessage(process.env.CHAT_ID, message);
        // await botTelegram.telegram.sendPhoto(process.env.CHAT_ID, { source: resolve(__dirname,'..', '..', 'tmp', 'image-teste.png') });
    }catch(e){
        console.log(e);
    }
} 