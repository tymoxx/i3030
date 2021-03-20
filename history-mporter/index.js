const fs = require('fs');
const mongoose = require('mongoose');
const Training = require('../model/training');
DB_URI = 'MONGO_DB_URL'

const save = () => {
    let rawdata = fs.readFileSync('./result.json');
    let input = JSON.parse(rawdata);
    const msgs = input.messages;

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
        const training = new Training({
            userId: msg['from_id'],
            username: msg.from,
            date: msg.date,
            numberOfPushUps: stringToNumber(msg.text)
        })

        training.save()
            .then((result) => {
                console.log(`✅ SAVED: User: ${training.username}, PushUps: ${training.numberOfPushUps}`);
            }).catch(err => console.error('-->', err)
        );
    }


    const isInFeverRange = num => num === 37 || (!Number.isInteger(num) && (num > 36.6 && num <= 38.5));
    const isInPushUpRange = num => Number.isInteger(num) && (num > 4 && num <= 70);

    const outputArr = [];

    msgs.forEach((msg) => {
        if (msg.from_id === 5738623495) {
            return null
        }

        const pushUps = stringToNumber(msg.text);

        if (isInFeverRange(pushUps)) {
            return null
        }

        if (isInPushUpRange(pushUps)) {
            saveTrainingTodDb(msg)

            /** Create array of results **/
            /* const training = {
               userId: msg['from_id'],
               username: msg.from,
               date: msg.date,
               numberOfPushUps: stringToNumber(msg.text)
               }
               outputArr.push(training);
            */
        }
    })

    /*
    const outputObj = { messages: outputArr }

    const data = JSON.stringify(outputObj);
    fs.writeFile('./output.json', data, err => {
        if (err) {
            console.error(err)
            return
        }
        console.log('file written successfully');
    })
    */
}

mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('History Importer: Connected to DB')
        save();
    }).catch(err => console.error('-->', err));
