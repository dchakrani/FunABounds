//This is router/controller for connections page
var express = require('express');
var router = express.Router();

var dataObject = require('../utility/connectionDB');
var getConnections = require('../models/connection');

router.get('/', async function (req, res) {
    var connection_data = await dataObject.getConnections();
    var unique_category = [...new Set(connection_data.map(data => data.category))];
    console.log("connections login session : " , req.session.login);
    console.log("connections the user session : " , req.session.theUser);
    if(connection_data) {
        if(req.session.theUser) {
            res.render('connections', {
                connection_data: connection_data,
                unique_category: unique_category,
                login: req.session.login,
                user: req.session.theUser.firstName
            });
        }else{
            res.render('connections', {
                connection_data: connection_data,
                unique_category: unique_category,
                login: req.session.login,
                user: ""
            });
        }
    }else{
        res.render('404', {login: true})
    }
});

module.exports = router;