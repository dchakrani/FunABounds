//userConnection data object defined with category, event, rsvp, eventId, id, userID
var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

var userConnectionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    category: {
        type:String,
        required: 'Categpry is mandatory.'
    },
    event: {
        type:String,
        required: 'Event is mandatory.'
    },
    rsvp: {
        type:String,
        required: 'rsvp is mandatory.'
    },
    eventId: {
        type: String,
        required: 'Event Id is mandatory.'
    },
    userID: {
        type: String,
        required: 'User Id is mandatory.'
    }
}, {collection: 'userconnections'});

// autoIncrement.initialize(mongoose.connection);
// userConnectionSchema.plugin(autoIncrement.plugin, {model : 'userConnection', field : 'id', startAt : 1, incrementBy : 1});

module.exports = mongoose.model('userconnections', userConnectionSchema);