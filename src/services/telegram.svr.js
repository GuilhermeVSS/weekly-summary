require('dotenv').config();
const { Telegraf } = require('telegraf');

const botTelegram = new Telegraf(process.env.BOT_TOKEN);

module.exports = async (message) => {
    try{
        await botTelegram.telegram.sendMessage(process.env.CHAT_ID, message);
    }catch(e){
    }
} 