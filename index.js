const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const mongoose = require('mongoose');
const Training = require('./model/training');
const startOfWeek = require('date-fns/startOfWeek');
const statsUrl = 'https://charts.mongodb.com/charts-i3030-kpcbo/public/dashboards/6056f474-8269-4108-89fe-49358c160042'

/** init DB */
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((db) => {
        console.log('Connected to DB')
    })
    .catch(err => console.error('-->', err));

/** init Telegram Bot */
const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, {
    webHook: {
        port: process.env.PORT || 443
    }
});
const serverURL = process.env.URL;
bot.setWebHook(`${serverURL}/bot${TOKEN}`);

const getRandomPraise = () => {
    const praises = [
        'remember Vanya! no pain no gain!',
        'Все, что ты можешь сделать, это стараться изо всех сил',
        'Доверяй своим инстинктам',
        'Никто не идеален, это нормально',
        'Ты можешь учиться на своих ошибках',
        'Твоя настойчивость поможет тебе добиться успеха',
        'Сделай перерыв и вернись к заданию',
        'Ошибки это доказательство того что ты пытаешься',
        'Ты делаешь невозможное',
        'Если люди не смеются над твоими целями, значит твои цели слишком мелкие',
        'Препятствия – это те страшные вещи, которые ты видишь, когда отводишь глаза от цели.',
        'Постановка целей является первым шагом на пути превращения мечты в реальность.',
        'Быть самым богатым человеком на кладбище для меня не важно… Ложиться спать и говорить себе, что сделал действительно нечто прекрасное, - вот что важно',
        'Когда ты знаешь, чего хочешь, и хочешь этого достаточно сильно,ты найдешь способ получить это',
        'Я трачу почти все свое время на Facebook. У меня практически нет времени на новые увлечения. Поэтому я ставлю перед собой четкие цели',
        'Пуля, просвистевшая на дюйм от цели, так же бесполезна, как та, что не вылетала из дула',
        'Никогда, никогда не позволяй другим убедить тебя, что что-то сложно или невозможно',
        'Когда ты думаешь, что уже слишком поздно, на самом деле, все еще рано',
        'Ну как обычно. Тяжело конечно',
        'Ну как обычно. Тяжело конечно',
        'Красавчик',
        'Ты на верном пути',
        'Здорово',
        'Удивительно',
        'Это как раз то, что нужно',
        'Гораздо лучше, чем я ожидал',
        'Великолепно',
        'Прекрасно',
        'Я тобой горжусь',
        'Грандиозно',
        'Незабываемо',
        'Ух',
        'Именно этого мы давно ждали',
        'Работать с тобой просто радость',
        'Это трогает меня до глубины души',
        'Ты нам необходим',
        'Экстра – класс',
        'С каждым днем у тебя получается всё лучше',
        'Ты сегодня великолепен',
        'Уже лучше',
        'Для меня нет никого красивее тебя',
        'Отлично',
        'Еще лучше, чем прежде',
        'Научи меня делать так же',
        'Потрясающе',
        'Тут без тебя не обойтись',
        'Я знал, что тебе это по силам',
        'Поразительно',
        'Ты мне нужен именно такой, какой есть',
        'Неподражаемо',
        'Несравненно',
        'Никто не может заменить тебя',
        'Я горжусь тем, что тебе это удалось',
        'Как в сказке',
        'Очень круто',
        'Я сам не смог бы сделать лучше',
        'Ярко, образно',
        'Фантастика',
        'Очень эффектно',
        'Ты просто чудо',
        'Ты умный, находчивый, сообразительный',
        'Сегодня у тебя получилось лучше, чем вчера',
        'Ты на правильном пути',
        'Ты превзошел сам себя',
        'Ты очень многое можешь',
        'Я радуюсь твоим успехам',
        'Ты нас порадовал!',
        'Ты близок к истине',
        'Наконец-то',
        'Ты взял ещё одну вершину',
        'Ты очень способный',
        'Восхитительно',
        'Терпенье и труд всё перетрут',
        'Умничка! Я никогда в тебе не сомневалась',
        'Твой успех сегодня - лучший подарок нам',
        'Гениально',
        'Какое интересное решение',
        'Ты сегодня сделал главное - вот он, ключик к успеху',
        'Мои аплодисменты',
        'Вот это класс',
        'Да ты просто ас в этом деле',
        'Я рада, что ты нашел в себе силы сделать это',
        'На тебя сегодня можно равняться',
        'С тебя можно брать пример',
        'Я никогда не видела ничего лучшего',
        'Асс',
    ];
    return praises[Math.floor(Math.random() * praises.length)];
}

function getRandomEmoji() {
    const praises = ['💪', '💪', '🎉', '🔥', '👍'];
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

const createMessage = (msg, weekTotal) => {
    const name = msg.chat.first_name || msg.from.first_name

    return ` ${getRandomPraise()}, ${name} ${getRandomEmoji()}
    \n📈 this week: ${weekTotal}
    `;
};

const replyWithDelay = (msg, replyMsg) => (
    setTimeout(() =>
        bot.sendMessage(msg.chat.id, replyMsg, {
            disable_notification: true,
            allow_sending_without_reply: true
        }), 400)
);

const getSumOfValuesInArrayOfObjects = function (array, prop) {
    return array.reduce((a, b) => a + b[prop], 0);
};

async function handleTraining(msg) {
    const date = new Date(msg.date * 1000);

    const training = new Training({
        userId: msg.from.id,
        messageId: msg.message_id,
        username: msg.from.username,
        date: date,
        numberOfPushUps: stringToNumber(msg.text)
    })

    function getCurrentWeekTotal(currentTraining) {
        const lastMonday = startOfWeek(new Date(), {weekStartsOn: 1});

        return Training.find({
            "date": {$gt: lastMonday},
            "userId": currentTraining.userId,
        }).then((res) => {
            const total = getSumOfValuesInArrayOfObjects(res, 'numberOfPushUps')
            console.log('total:', total);
            return total;
        }).catch(err => console.error('-->', err))
    }


    /** Save to DB and Reply */

    try {
        const result = await training.save();
        const weeksTotal = await getCurrentWeekTotal(result);
        console.log(`✅ Training saved to DB. 🙎${result.username}: ${result.numberOfPushUps}`);
        replyWithDelay(msg, createMessage(msg, weeksTotal));
    } catch (err) {
        console.error('-->', err)
    }
}

const isInFeverRange = num => num === 37 || (!Number.isInteger(num) && (num > 36.6 && num <= 38.5));
const isInPushUpRange = num => Number.isInteger(num) && (num > 4 && num <= 70);

bot.on('message', (msg) => {
    // console.log('-->', JSON.stringify(msg, null, 2));

    const createFeverMessage = () => {
        const messagesArr = ['🌡 Get better!', '👊 дулі!', '💩', '🤒'];
        return messagesArr[Math.floor(Math.random() * messagesArr.length)];
    };

    const pushUps = stringToNumber(msg.text);

    if (isInFeverRange(pushUps)) {
        return replyWithDelay(msg, createFeverMessage());
    }

    if (isInPushUpRange(pushUps)) {
        handleTraining(msg);
    }
});

bot.on('edited_message', (msg) => {
    console.log('🖊 edited message:', msg.message_id);
});

bot.onText(/\/start/, (msg) => {
    const name = msg.chat.first_name || msg.from.first_name
    bot.sendMessage(msg.chat.id, `Hello, ${name} ! \nTo see statistics type /stats`);
});

bot.onText(/\/stats/, (msg) => {
    bot.sendMessage(msg.chat.id, `See statistics <a href='${statsUrl}'> >> HERE >>  📊</a>`, {
        'parse_mode': 'HTML',
    });
});
