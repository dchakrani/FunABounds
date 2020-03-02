//This is router/controller for managing login and saving user data and saved static saved connection data in session variable.
var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
router.use(session({secret: 'itsasecret'}));
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

var getUserConnections = require('../utility/savedConnectionsDB');
var connectionObject = require('../utility/userProfile');
var isLoginFlag = false;
var message = "";
//This function to save userObject and savedConnection Object in session variables.
var getLoginSession = async function (req, res, next) {

    //var isLoginFlag = false;
    var userCreds = req.body;

    console.log("userCreds : ", req.body);
    console.log("login session : ", req.session.login);
    console.log("user session : ", req.session.theUser);

    if (!userCreds.userId || !userCreds.password) {
        message = "Either Username or Password Missing";
    }

    if (userCreds.userId && userCreds.password) {
        var isLogin = await connectionObject.getLoginStatus(userCreds);

        console.log("isLogin : ", isLogin);
        var getUserObject = require('../utility/userDB');

        if (isLogin != null) {
            console.log("True : ", isLogin[0].userId);
            isLoginFlag = true;
            var userObject = await getUserObject.getUser(isLogin[0].userId);
            console.log("userObject : ", userObject);
            req.session.theUser = userObject[0];
            req.session.login = true;
            req.session.incorrectCreds = false;
            console.log("Login success");
            message = "";
        } else {
            console.log("Login unSuccess");
            req.session.theUser = null;
            req.session.login = false;
            req.session.incorrectCreds = true;
            message = "Invalid Credentials";
        }
    } else if (req.session.login == true) {
        // var userObject = await getUserObject.getUser(isLogin[0].userId);
        // //console.log("userObject : ", userObject);
        // req.session.theUser = userObject[0];
    } else {
        req.session.login = false;
    }

    // if (req.session.login != true) {
    //     var getUserConnections = require('../utility/savedConnectionsDB');
    //     var UserConnections = await getUserConnections.getSavedConnectionsByUId("uid001");
    //     //var userConnectionsModel = getUserConnectionsModel.userConnection(UserConnections.category, UserConnections.event , UserConnections.rsvp , UserConnections.eventId , UserConnections.id, UserConnections.userID);
    //     req.session.userConnections = UserConnections;
    // }

    // req.session.theUser = userObject[0];
    // req.session.login = true;
    next();
}

router.use(getLoginSession);

//This handles Add, Delete and Update connections.
router.get("/", async function (req, res) {
    var qs = req.query;
    if (qs.action == "login") {
        console.log("success ");
        //console.log("action login session : ", req.session.login);
        console.log("action login user session : ", req.session.theUser);
        var userConnections = await getUserConnections.getSavedConnectionsByUId(req.session.theUser.userId);
        res.render('savedConnection', {
            savedConnection_data: userConnections,
            login: req.session.login,
            user: req.session.theUser.firstName
        });
    }

    if (qs.action == "delete") {
        console.log("Delete");
        var connection_data = await connectionObject.removeConnection(qs.id, req.session.theUser);
        console.log("Connection data : ", connection_data);
        if (connection_data == 0) {
            console.log("destroy 1");
            req.session.destroy();
            res.render("404", {login: false});
        } else {
            if (req.session.theUser)
                var userConnections = await getUserConnections.getSavedConnectionsByUId(req.session.theUser.userId);
            else
                var userConnections = "";
            res.render('savedConnection', {
                savedConnection_data: userConnections,
                login: req.session.login,
                user: req.session.theUser.firstName
            });
        }
    } else if (qs.action == "add") {
        console.log(" ADD/Update user session : ", req.session.theUser);
        //This will handle query injection in rsvp and call addConnection function from userProfile controller which internally handles Add and Update savedConnection.
        if (['Yes', 'No', 'Maybe'].indexOf(qs.rsvp) >= 0) {
            //console.log('yes clicked ');
            if (req.session.login == false) {

                res.render('login', {login: false, user: "", message: "Please Login First"});
            }
            var flag = await connectionObject.addUpdateConnection(qs.id, qs.rsvp, req.session.theUser);
            console.log("flag ", flag);
            if (flag == true) {
                var userConnections = await getUserConnections.getSavedConnectionsByUId(req.session.theUser.userId);
                if (userConnections.length == 0) {
                    res.render('404', {login: req.session.login});
                }
                res.render('savedConnection', {
                    savedConnection_data: userConnections,
                    login: req.session.login,
                    user: req.session.theUser.firstName
                });
            }
        }
    }
});

router.post("/", async function (req, res) {
    //console.log("login success session var check : ", req.session.login)
    if (message != "") {
        res.render('login', {login: false, message: message, user: ""});
    }
    if (req.session.login) {
        var userConnections = await getUserConnections.getSavedConnectionsByUId(req.session.theUser.userId);
        res.render('savedConnection', {
            savedConnection_data: userConnections,
            login: req.session.login,
            user: req.session.theUser.firstName
        });
    }
    res.render('404', {login: false});
});

module.exports = router;