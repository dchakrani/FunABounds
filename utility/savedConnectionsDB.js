const fs = require("fs");
const path = require("path");
const datapath = path.join(__dirname, "/userConnections.json");
const rawjsondata = fs.readFileSync(datapath);

var savedConnectionsData = JSON.parse(rawjsondata);
var savedConnectionInfo = require('../models/userConnection');

//This will return all the Saved connections
var getSavedConnections = function() {
    return savedConnectionsData;
};

//This Function will return saved Connection of a specific userID passed.
var getSavedConnectionsByUId = function(userID) {

    //console.log(" search UserID : " , userID);
    return savedConnectionInfo
        .find({userID: userID}, function (err, connections) {
            if (err) throw err;

            if (connections) {
                //console.log(connections);
                return connections;
            } else {
                console.log("Error: " + err);
                return null;
            }
        });
};

module.exports = {
    getSavedConnections: getSavedConnections,
    getSavedConnectionsByUId: getSavedConnectionsByUId,
};