var Yelp = require('yelp');

var Bars = require('../models/bars.js');
var Users = require('../models/users.js');

if(!process.env.PRODUCTION) {
  require('dotenv').load();
}


var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});


function search (req, res, loc) {

  yelp.search({term: 'nightlife', location: loc})
    .then(function(data){
      if (req.user) {
        // Logged in. Add going count and am I going boolean to yelp data
        var bars = data.businesses;
        Bars.find({'yelpId': {$in: bars.map(function(b){return b.id})}})
        .exec(function(err, reservedBars){
          bars = bars.map(function(b){
            var r = reservedBars.find(function(el){return b.id === el.yelpId});
            if (r) {
              b.nGoing = r.going.length;
              b.amIGoing = r.going.indexOf(req.user._id) !== -1;
            }
            return b;
          })
          res.json(data);
        })
      } else {
        res.json(data);
      }
    })
    .catch(function(err){
      console.log('searchAuth: ',err);
      res.json(err);
      return;
    });
};

module.exports.search = function(req, res) {
  yelp.search({term: 'nightlife', location: req.params.loc})
    .then(function(data){
      res.json(data);
     })
    .catch(function(err){
      console.log('search ', err);
      res.json(err);
      return;
    })
};

module.exports.searchUpdateLoc = function(req, res) {
  if (req.user) {
    Users.findOne({'_id' : req.user._id}, function(err, user) {
      if (req.body.location !== 'last' && req.body.location !== user.location) {
        // update user location
        user.location = req.body.location;
        user.save(function(err){
          if(err) {
            console.log('error updating user');
            return;
          }
          // then search new location
          search(req, res, req.body.location)
        })
      } else {
        // search the last known user location
        search(req, res, user.location)
      }
    })
  } else {
    // Unauthenticated. Search w/out adding reservations data.
    search(req, res, req.body.location)
  }
}

module.exports.addReservation = function(req, res) {
  Bars.findOne({'yelpId': req.body.barId}, function (err, bar) {
    if (err) {
      console.log(err);
      res.status(500).end();
      return;
    }
    if(bar) {
      // bar is in the db
      if(bar.going.indexOf(req.user._id) === -1) {
        // user is not going yet
        bar.going.push(req.user._id);
        bar.save(function(err, b){
          if(err) {
            console.log('db saving error');
            return;
          }
          res.json({
            barId: b.yelpId,
            nGoing: b.going.length,
            amIGoing: true
          });
        })
      } else {
        // user is already going. Requested by mistake.
        res.json({
          barId: bar.yelpId,
          nGoing: bar.going.length,
          amIGoing: true
        });
      }
    } else {
      // Bar is not found. Noone is going yet.
      // create a new bar and add user.
      var newBar = new Bars();
      newBar.yelpId = req.body.barId;
      newBar.going = [req.user._id];
      newBar.save(function(err, b){
        res.json({
          barId: b.yelpId,
          nGoing: b.going.length,
          amIGoing: true
        });
      });
    }
  })
};

module.exports.removeReservation = function(req, res) {
  Bars.findOne({'yelpId': req.body.barId}, function (err, bar) {
    if (err) {
      console.log(err);
      res.status(500).end();
      return;
    }
    if(bar) {
      var bIndex = bar.going.indexOf(req.user._id);
      if( bIndex !== -1) {
        // user id found in going array
        bar.going.splice(bIndex, 1);
        if(bar.going.length > 0) {
          bar.save(function(err, b){
            if(err) {
              console.log('db saving error');
              return;
            }
            res.json({
              barId: b.yelpId,
              nGoing: b.going.length,
              amIGoing: false
            });
          })
        } else {
          // noone is going. Delete it from db.
          bar.remove(function(err){
            res.json({
              barId: bar.yelpId,
              nGoing: 0,
              amIGoing: false
            });
          });
        }
      } else {
        // user id not found. Requested by mistake (it should not happen)
        res.json({
          barId: bar.yelpId,
          nGoing: bar.going.length,
          amIGoing: false
        });
      }
    } else {
      // bar not found. Requested by mistake (it should not happen)
      res.json({error: 'not found'});
    }
  })
};
