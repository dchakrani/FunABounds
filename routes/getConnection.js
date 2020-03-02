//This is router/controller for connection page
var express = require('express');
var router = express.Router();

var dataObject = require('../utility/connectionDB');

router.get('/', async function (req, res) {
    var qs = req.query;
    var connection_data = await dataObject.getConnection(qs.id);
    //console.log("Connection Data connection page ", connection_data);
    //To handle invalid id in query string
    if (connection_data.length == 0) {
        //console.log("Null");
        res.render('404', {login: req.session.login});
    } else {
        //console.log("connection : " + req.session.login);
        if (req.session.theUser)
            res.render('connection', {
                connection_data: connection_data,
                login: req.session.login,
                user: req.session.theUser.firstName
            });
        else
            res.render('connection', {connection_data: connection_data, login: req.session.login, user: ""});
    }
});

module.exports = router;