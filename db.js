var mongoose = require('mongoose');
var statsd = require('./statsd');

var schema = mongoose.Schema({value: String});
const Training = require('./model/training');


module.exports = {
    connectDB : function() {
        mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    },

    getVal : function(res) {
        Training.aggregate([
            {
                $match: {
                    date: {
                        $gte: lastMonday,
                        $lte: today
                    },
                    userId: msg.from.id
                }
            },
            {$group: {_id: "$username", total: {$sum: "$numberOfPushUps"}}},
            {$sort: {total: 1}}
        ])
    },
};
