const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, {
    polling: true,
});

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function getRandomPraise() {
    const praises = ['молоток', 'мужик', 'так тримати'];
    return praises[Math.floor(Math.random() * praises.length)];
}

bot.on('message', (msg) => {
    // console.log(JSON.stringify(msg, null, 2));
    const {id} = msg.chat;

    if (isNumeric(msg.text)) {
        bot.sendMessage(id, getRandomPraise() + ' ' + msg.chat.first_name + ' 💪');
    }
});
