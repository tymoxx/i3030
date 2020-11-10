require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, {
    polling: true,
});

bot.on('message', (msg) => {
    const {id} = msg.chat;

    bot.sendMessage(id, 'привет, ' + msg.chat.first_name);
});
