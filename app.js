var express = require('express');
var app = express();
var server = require('http').Server(app);
var cookieParser = require('cookie-parser');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: false
}));

app.use(require('express-session')({
    secret: 's00per s3cr3t',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('static'));

app.use('/', require('./routes/index'));
app.use('/c', require('./routes/chals'));

var Account = require('./account');
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect('mongodb://localhost/TestCTF');

const PORT = 3333;
server.listen(PORT, function() {
	console.log(`Running on port ${PORT}...`);
});
