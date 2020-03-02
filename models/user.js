//user data object defined with userId, firstName, lastName, email
var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

var usersSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type:String,
        required: 'First Name is mandatory.'
    },
    lastName: {
        type:String,
        required: 'Last Name is mandatory.'
    }
}, {collection: 'users'});

// autoIncrement.initialize(mongoose.connection);
// userSchema.plugin(autoIncrement.plugin, {model : 'user', field : 'userId', startAt : 1, incrementBy : 1});

// usersSchema.plugin(autoIncrement.plugin,{
//     model:'user',
//     field:'userId',
//     startAt:10000,
//     incrementBy: 2
// });

module.exports = mongoose.model('users', usersSchema);