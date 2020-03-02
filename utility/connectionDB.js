var mongoose = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1:27017/connections');

try {
    mongoose.connect('mongodb://localhost:27017/funabounds', {useNewUrlParser: true});
} catch (error) {
    console.log(handleError(error));

}
var connectionInfo = require('../models/connection');

function addNewConnection(connectionData) {

    //console.log("Data in function" , connectionData);
    const id = connectionData.category.slice(0, 2) + connectionData.title.slice(0, 2) + connectionData.location.slice(0, 2) + connectionData.dateandtime.slice(0, 2);
    //console.log("id", id);
    const connectionModelNew = {
        id: id,
        category: connectionData.category,
        title: connectionData.title,
        details: connectionData.details,
        location: connectionData.location,
        dateandtime: connectionData.dateandtime
    };
    return connectionInfo
        .find({id: id})
        .exec()
        .then(async function (res) {
            //console.log('respond', res.length);
            if (res.length == 0) {
                var doc = new connectionInfo(connectionModelNew);
                console.log("Doc", doc);
                await doc.save();
                return 1;
            } else {
                console.log('else data present');
                return 1;
            }
        })
        .catch(function (err) {
            console.log("error", err);
            return 1;
        });
};

//This function returns all the events stored in the object array
function getConnections() {

    return connectionInfo
        .find({}, function (err, connections) {
            if (err) throw err;

            if (connections) {
                //console.log(connections);
                return connections;
            } else {
                console.log("Error: " + err);
                return null;
            }
        });
}

// //This function returns events matching the ID's passed to it as a parameter from the array objects
function getConnection(id) {
    return connectionInfo
        .find({id:id}, function (err, connection) {
            if (err) throw err;

            if (connection) {
                //console.log(connection);
                return connection;
            } else {
                console.log("Error: " + err);
                return null;
            }
        });
}

module.exports = {
    addNewConnection: addNewConnection,
    getConnections: getConnections,
    getConnection: getConnection
}