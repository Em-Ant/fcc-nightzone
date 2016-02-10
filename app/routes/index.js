'use strict';

var path = process.cwd();

var search = require('../controllers/appHandler.js').search;
var searchAuth = require('../controllers/appHandler.js').searchUpdateLoc;
var add = require('../controllers/appHandler.js').addReservation;
var remove = require('../controllers/appHandler.js').removeReservation;


module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
  	} else {
      res.json({status: 'forbidden'});
    }
  }


  app.route('/api/test')
    .post(function (req, res) {
      console.log(req.body);
      res.json(req.body);
    });

  app.route('/api/search')
    .post(isLoggedIn, searchAuth);

  app.route('/api/search/:loc')
    .get(search);

  app.route('/api/addme')
    .post(isLoggedIn, add);

  app.route('/api/removeme')
    .post(isLoggedIn, remove);

	app.route('/api/user')
		.get(function (req, res) {
      if(req.user) {
        res.json(req.user);
      } else {
        res.json({status: 'guest'});
      }
		});

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));


	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

  app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

  app.route('/*')
		.get(function (req, res) {
			res.sendFile(path + '/client/public/index.html');
	});
};
