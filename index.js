const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const mongoose = require('mongoose');

const DB_URI = process.env.DB_URI
mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to DB')
    })
    .catch(err => console.error('-->', err));

const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, {
    webHook: {
        port: process.env.PORT || 443
    }
});

const serverURL = process.env.URL;
bot.setWebHook(`${serverURL}/bot${TOKEN}`);


const isNumeric = (str) => {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const isWhole = (num) => num % 1 === 0;

const getRandomPraise = () => {
    const praises = ['молоток', 'мужик', 'так тримати', 'Титан', '✅ засчитано', '👍 красавчик'];
    return praises[Math.floor(Math.random() * praises.length)];
}

function getRandomEmoji() {
    const praises = ['💪', '💪', '🎉', '🔥'];
    return praises[Math.floor(Math.random() * praises.length)];
}

const checkIfFever = (text) => {
    return false;
}

bot.on('message', (msg) => {
    // console.log(JSON.stringify(msg, null, 2));
    const createMessage = () => getRandomPraise() + ', ' + (msg.chat.first_name || msg.from.first_name) + ' ' + getRandomEmoji();
    const createFeverMessage = () => {
        const messages = ['🖕', 'дулі!', '💩', '🤒'];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const isInPushupRange = num => num > 4 && num <= 70;

    const isInFeverRange = num => num > 36.6 && num <= 38.5;

    const {id} = msg.chat;
    let number = null;

    if (isNumeric(msg.text)) {
        number = parseFloat(msg.text);
    } else return null;

    if (Number.isInteger(number) && isInPushupRange(number) && number !== 37) {
        setTimeout(() => {
            bot.sendMessage(id, createMessage(), {
                disable_notification: true,
            });
        }, 500)
    } else if ((!Number.isInteger(number) && isInFeverRange(number)) || number === 37) {
        setTimeout(() => {
            bot.sendMessage(id, createFeverMessage(), {
                disable_notification: true,
            });
        }, 500)
    }
});
