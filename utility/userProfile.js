//User Profile Controller to perform Add, Remove and Update functions on saved connections.
var mongoose = require('mongoose');

try {
    mongoose.connect('mongodb://localhost:27017/funabounds', {useNewUrlParser: true});
} catch (error) {
    console.log(handleError(error));
}

var userConnectionsInfo = require('../models/userConnection');
var getConnections = require('../utility/connectionDB');
var getLoginData = require('../models/userLogin');
var saveUser = require('../models/user');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

var addUpdateConnection = async function (connectionID, rsvp, userObject) {

    console.log("inside addupdate");

    var connections = await getConnections.getConnection(connectionID);

    if (connections.length == 0) {
        return false;
    }
    //console.log(" id : ", connectionID);
    //console.log(" userobject : ", userObject);

    var savedConnections = await userConnectionsInfo
        .find({id: connectionID, userID: userObject.userId}, function (err, matchedConnection) {
            if (err) throw err;

            if (matchedConnection) {
                //console.log(matchedConnection);
                return matchedConnection;
            } else {
                console.log("Error: " + err);
                return null;
            }
        });

    //console.log("Saved connections  ", savedConnections);
    //console.log("Saved connections length  ", savedConnections.length);

    if (savedConnections.length == 1) {
        console.log("Update Connection")
        await userConnectionsInfo.findOneAndUpdate(
            {
                id: connectionID,
                userID: userObject.userId
            },
            {$set: {rsvp: rsvp}},
            {upsert: false, new: true, runValidators: true}, // options
            function (err, updatedConnection) {  // callback
                if (err) {
                    throw err;
                } else {
                    console.log("UpdatedConnection ", updatedConnection);
                }
            });
        return true;
    } else if (savedConnections.length == 0) {
        var connectionData = await getConnections.getConnection(connectionID);
        //console.log("data to be saved", connectionData);
        var connectionData = {
            category: connectionData[0].category,
            event: connectionData[0].title,
            rsvp: rsvp,
            eventId: userObject.userId + connectionData[0].id,
            id: connectionData[0].id,
            userID: userObject.userId
        };

        //console.log("Final data to be saved ", connectionData);
        var doc = new userConnectionsInfo(connectionData);
        //console.log("Doc", doc);
        await doc.save();
        return true;
        //doc.save
    } else {
        console.log("Final Else");
        return null;
    }
};

//This function is used to remove added saved connection.
var removeConnection = async function (connectionID, userObject) {
    await userConnectionsInfo.deleteOne(
        {id: connectionID, userID: userObject.userId},
        function (err, res) {
            if (err) {
                console.log("Delete error", err);
                return 0;
            } else if (res) {
                return res.deletedCount;
            }
        }
    );
};

var getLoginStatus = async function (userCredentials) {
    //console.log("User Creds : " , userCredentials);
    //console.log(encryptedPasswrod);
    var userLoginData = await getLoginData
        .find({userId: userCredentials.userId}, function (err, connections) {
            if (err) throw err;

            if (connections) {
                console.log("connections : ", connections);
                //return connections;
            } else {
                console.log("Error: " + err);
                return null;
            }
        });
    console.log("password : ", userCredentials.password);
    console.log("database output : ", userLoginData );
    console.log("database output length : ", userLoginData.length );
    if (userLoginData.length == 1) {
        if (cryptr.decrypt(userLoginData[0].password) == userCredentials.password) {
            return userLoginData;
        }
    } else {
        return null;
    }

};

var userSignUp = async function (userDetails) {
    console.log("Sign Up ", userDetails);
    //saveUser
    // getLoginData

    var updatedUserData = await saveUser.findOneAndUpdate(
        {
            userId: userDetails.email
        },
        {$set: {firstName: userDetails.firstName, lastName: userDetails.lastName}},
        {upsert: false, new: true, runValidators: true}, // options
        function (err, updatedUser) {  // callback
            if (err) {
                throw err;
            } else {
                console.log("updatedUser ", updatedUser);
            }
        });
    console.log(" is update : ", updatedUserData);
    if (updatedUserData == null) {
        var newUserData = {
            userId: userDetails.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName
        };
        var doc = new saveUser(newUserData);
        await doc.save();

        var encryptedPasswrod = cryptr.encrypt(userDetails.password);

        var newUserCredsData = {
            userId: userDetails.email,
            password: encryptedPasswrod
        };
        doc = new getLoginData(newUserCredsData);
        await doc.save();

        return true;
    }
    return false;
};

//This will return empty array and the calling js file will update session variable and will set saved connections object ot null.
var emptyProfile = function (userConnections) {
    return [];
};

module.exports = {
    addUpdateConnection: addUpdateConnection,
    removeConnection: removeConnection,
    emptyProfile: emptyProfile,
    getLoginStatus: getLoginStatus,
    userSignUp: userSignUp,
};