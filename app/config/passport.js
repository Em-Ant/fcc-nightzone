'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.consumerKey,
		consumerSecret: configAuth.twitterAuth.consumerSecret,
		callbackURL: configAuth.twitterAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'twitter.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					if (user.twitter.username == profile.username &&
						user.twitter.displayName == profile.displayName) {
							return done(null, user);
					} else {
            user.twitter.username = profile.username;
            user.twitter.displayName = profile.displayName;
            user.save(function(err, updatedUser){
              if (err) throw err;
              return done(null, updatedUser);
            })
          }
					
				} else {
					var newUser = new User();

					newUser.twitter.id = profile.id;
					newUser.twitter.username = profile.username;
					newUser.twitter.displayName = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
};
