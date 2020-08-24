if (!(process.env.NODE_ENV === 'production')) {
  require('dotenv').config({ silent: true });
}

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var bodyParser = require('body-parser');

var favicon = require('serve-favicon');

var app = express();
if (!(process.env.NODE_ENV === 'production')) {
  require('dotenv').load();
}

require('./app/config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(favicon(process.cwd() + '/client/public/favicon.ico'));
app.use('/', express.static(process.cwd() + '/client/public'));

app.use(
  session({
    secret: process.env.SECRET_SESSION || 'secretClementine',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log('Node.js listening on port ' + port + '...');
});
