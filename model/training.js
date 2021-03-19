const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    numberOfPushUps: {
        type: Number,
        required: true,
    }
}, {timestamps: true});

const Training = mongoose.model('Training', trainingSchema);
module.exports = Training;
