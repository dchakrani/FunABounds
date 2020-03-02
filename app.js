var express = require('express');
var app = express();
var path = require('path');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var session = require('express-session');
app.use(session({secret:'itsasecret'}));


var getConnections = require("./routes/getConnections");
var getConnection = require("./routes/getConnection");
var addNewConnection = require("./routes/addNewConnection");
var getSavedConnections = require("./routes/getSavedConnections");
var navigation = require("./routes/nav");
var signUpAuthentication = require("./routes/authentication");

app.set('view engine', 'ejs');

// used for accessing static contents i.e CSS, JavaScript and Images
app.use('/Assets', express.static('Assets'));

app.set("views", path.join(__dirname, "views"));

//Middleware for checking login
app.use(function(req,res,next){
    if(req.session && req.session.login && req.session.login==true){
        module.exports.login=req.session.login;
    }
    else{
        //do nothing
    }
    next();
});

// add new connections page route.
app.use('/newConnectionInfo', addNewConnection);

// connections page route.
app.use('/connections', getConnections);

// connection page route.
app.use("/connection", getConnection);

// saved connection page route.
app.use("/savedConnection", getSavedConnections);

//
app.use("/login" , signUpAuthentication);

//This will destroy session variables.
app.get("/logout",function(req, res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("logout: ");
            res.render('index', {login: false, user : ""})
        }
    });
});

// Navigations
app.use("/", navigation)

app.listen(3000);