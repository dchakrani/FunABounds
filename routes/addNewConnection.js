var express = require('express');
var router = express.Router();
var alert = require('alert-node');
const { check, validationResult } = require("express-validator");

var bodyParser = require('body-parser')
router.use(bodyParser.json());       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var addNewConnection = require("./../utility/connectionDB");
var getUserConnections = require('../utility/savedConnectionsDB');

router.post('/',
    [
        check("category")
            .not()
            .isEmpty()
            .withMessage("Enter Category Name"),
        check("title")
            .not()
            .isEmpty()
            .withMessage("Enter title name"),
        check("details")
            .not()
            .isEmpty()
            .withMessage("Enter description"),
        check("location")
            .not()
            .isEmpty()
            .withMessage("Enter location"),
        check("dateandtime")
            .not()
            .isEmpty()
            .withMessage("Enter date")
    ],
    async function (req, res) {
        //console.log("Test", req.body);

        let result = await addNewConnection.addNewConnection(req.body);
        var errors = validationResult(req);
        console.log("result", result);
        var messages = "";
        if(!errors.isEmpty()){
            messages = "Error/s";
            for( i = 0 ; i< errors.array().length; i++){
                messages = messages + "\n" + (i+1) + " - " + errors.array()[i].msg;
            }
            alert(
                messages
            );
        }
        if(messages != ""){
            res.redirect('newConnections');
        }
        if (result == 1) {
            console.log("new Connection");
            res.redirect('connections');
        } else if (result == 0) {
            //res.render('404', {login: true});
            console.log("404 error");
            res.render('404', {login : ture});
        }else{
            console.log("unknown error")
        }

    });

module.exports = router;