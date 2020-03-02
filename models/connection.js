//Connection data object defined with at least 6 properties i.e id, title, category, details, date and time and location
var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

var connectionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type:String,
        required: 'Title is mandatory.'
    },
    category: {
        type:String,
        required: 'Category is mandatory.'
    },
    details: {
        type:String,
        required: 'Details is mandatory.'
    },
    dateandtime: {
        type:String,
        required: 'Date and Time is mandatory.'
    },
    location: {
        type:String,
        required: 'Location is mandatory.'
    }
}, {collection: 'connections'});

// autoIncrement.initialize(mongoose.connection);
// connectionSchema.plugin(autoIncrement.plugin, {model : 'connections', field : 'id', startAt : 1, incrementBy : 1});

module.exports = mongoose.model('connections', connectionSchema);