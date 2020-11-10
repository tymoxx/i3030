const TelegramBot = require('node-telegram-bot-api');

const TOKEN = "";

const bot = new TelegramBot(TOKEN, {
    polling: true,
});

bot.on('message', (msg) => {
    bot.sendMessage(msg.chat.id, 'привет, ' + msg.chat.first_name);
});

