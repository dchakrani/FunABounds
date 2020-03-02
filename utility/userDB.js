//Variable used to store object array of hard coded Users
var mongoose = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1:27017/connections');

try {
    mongoose.connect('mongodb://localhost:27017/funabounds', {useNewUrlParser: true});
    console.log("Database Connected");
} catch (error) {
    console.log(handleError(error));

}
var userInfo = require('../models/user');

//This function returns all the Users stored in the object array
function getUsers() {

    return userInfo
        .find({}, function (err, userData) {
            if (err) throw err;

            if (userData) {
                //console.log(userData);
                return userData;
            } else {
                console.log("Error: " + err);
                return null;
            }
        });
}

//This function returns User data matching the userId's passed from the array objects
async function getUser(userId) {
    //var data = [];

    return userInfo
        .find({userId:userId}, function (err, userData) {
            if (err) throw err;

            if (userData) {
                //console.log(userData);
                return userData;
            } else {
                console.log("Error: " + err);
                return null;
            }
        });
}

//This function returns First User Object
async function getFirstUser() {
    var userObject = await getUsers();
    return userObject = await getUser(userObject[0].userId);
    // console.log("userObject2" , userObject);
}

var getLoginStatus = async function (userCredentials) {
    //console.log("User Creds : " , userCredentials);
    return getLoginData
        .find({userName: userCredentials.userName, password: userCredentials.password}, function (err, connections) {
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

var userSignUp = async function (userCredentials) {
    Console.log("Sign Up ", );
};

//Used for exporting modules
module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    getFirstUser: getFirstUser,
}