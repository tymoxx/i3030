const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const mongoose = require('mongoose');
const Training = require('./model/training');

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

const getRandomPraise = () => {
    const praises = ['молоток', 'мужик', 'так тримати', 'Титан', '✅ засчитано', '👍 красавчик'];
    return praises[Math.floor(Math.random() * praises.length)];
}

function getRandomEmoji() {
    const praises = ['💪', '💪', '🎉', '🔥'];
    return praises[Math.floor(Math.random() * praises.length)];
}

const stringToNumber = (string) => {
    const isNumeric = (str) => {
        if (typeof str != "string") return false // we only process strings!
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    if (isNumeric(string)) {
        return parseFloat(string);
    }
    return null;
}

function saveTrainingTodDb(msg) {
    const date = new Date(msg.date * 1000);

    const training = new Training({
        userId: msg.from.id,
        username: msg.from.username,
        date: date,
        numberOfPushUps: stringToNumber(msg.text)
    })
    training.save()
        .then((result) => {
            console.log('Saved to DB -->', result);
        }).catch(err => console.error('-->', err)
    );
}

bot.on('message', (msg) => {
    // console.log('-->', JSON.stringify(msg, null, 2));

    const createMessage = () => getRandomPraise() + ', ' + (msg.chat.first_name || msg.from.first_name) + ' ' + getRandomEmoji();

    const createFeverMessage = () => {
        const messagesArr = ['🖕', 'дулі!', '💩', '🤒'];
        return messagesArr[Math.floor(Math.random() * messagesArr.length)];
    };

    const isInPushUpRange = num => num > 4 && num <= 70;
    const isInFeverRange = num => num > 36.6 && num <= 38.5;
    const pushUps = stringToNumber(msg.text);

    const replyDelayed = (replyMsg) => (
        setTimeout(() =>
            bot.sendMessage(msg.chat.id, replyMsg, {
                reply_to_message_id: msg.message_id,
                disable_notification: true,
                allow_sending_without_reply: true
            }), 400)
    );

    if (Number.isInteger(pushUps) && isInPushUpRange(pushUps) && pushUps !== 37) {
        // saveTrainingTodDb(msg);
        replyDelayed(createMessage());

    } else if ((!Number.isInteger(pushUps) && isInFeverRange(pushUps)) || pushUps === 37) {
        replyDelayed(createFeverMessage());
    }
});
