//user data object defined with userId, password, username
var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

var usersSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
}, {collection: 'userlogin'});

module.exports = mongoose.model('userlogin', usersSchema);