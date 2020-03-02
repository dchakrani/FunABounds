var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');

var alert = require('alert-node');
const {check, validationResult} = require("express-validator");

router.use(session({secret: 'itsasecret'}));

var connectionObject = require('../utility/userProfile');

router.get("/", function (req, res) {
    res.render('login', {login: false, message : "", user : ""});
});

router.post("/",
    [
        check("firstName")
            .not()
            .isEmpty()
            .withMessage("Enter First Name"),
        check("lastName")
            .not()
            .isEmpty()
            .withMessage("Enter Last name"),
        check("email")
            .not()
            .isEmpty()
            .withMessage("Enter email id"),
        check("password")
            .not()
            .isEmpty()
            .isLength({min:8})
            .withMessage("Enter Password (Should be 8 Characters minimum)")
    ], async function (req, res) {
        var userDetails = req.body;
        var errors = validationResult(req);
        console.log("error : ", errors);
        var messages = "";
        if (!errors.isEmpty()) {
            messages = "Error/s";
            for (i = 0; i < errors.array().length; i++) {
                if(errors.array()[i].msg == "Invaid value")
                    continue;
                messages = messages + "\n" + (i + 1) + " - " + errors.array()[i].msg;
            }
            alert(
                messages
            );
        }
        if (messages == "")
            var flagUserAdded = await connectionObject.userSignUp(userDetails);
        console.log("islogin flag : ", flagUserAdded);
        if (messages != "") {
            res.redirect('userSignup');
        }
        if (flagUserAdded == true) {
            var message = "New User Added";
            res.render("login", {login: false, message : message ,user : ""});
        } else {
            var message = "User Updated";
            res.render("login", {login: false, message : message, user : ""});
        }
        //res.render('404', {login: false});
    });

module.exports = router;