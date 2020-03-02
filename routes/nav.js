//This is router/controller for all pages on which computations for business logic is not required.
var express = require('express');
var router = express.Router();

// Login route
router.get("/userSignUp",function(req, res){
    if(req.session.theUser) {
        res.render('userSignUp', {login : false, message : '', user: req.session.theUser.firstName});
    }else{
        res.render('userSignUp', {login : false, message : '', user: ""});
    }
});

// index page route.
router.get('/index', function (req, res) {
    console.log("index : " + req.session.login);
    if(req.session.theUser) {
        res.render('index', {login: req.session.login, user: req.session.theUser.firstName});
    }else{
        res.render('index', {login: req.session.login, user: ""});
    }

});

// about page route.
router.get('/about', function (req, res) {
    //console.log(req.query);
    res.render('about', {login: req.session.login, user : req.session.theUser});
});

// contact page route.
router.get('/contact', function (req, res) {
    //console.log(req.query);
    res.render('contact', {login: req.session.login, user : req.session.theUser});
});

// newConnections page route.
router.get('/newConnections', function (req, res) {
    //console.log(req.query);
    if(req.session.theUser) {
        res.render('newConnections', {login: req.session.login, user: req.session.theUser.firstName});
    }else{
        res.render('newConnections', {login: req.session.login, user: ""});
    }
});

router.get('/', function (req, res) {
    res.render('index', {login: req.session.login, user : ""});
});

router.get('/*', function (req, res) {
    res.render('404', {login: req.session.login});
});

module.exports = router;