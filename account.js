var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    solved: [Number],
    score: Number
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);