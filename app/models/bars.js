'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bar = new Schema({
	yelpId: {type: String, unique: true, required: true},
  going: [String]
});

module.exports = mongoose.model('Bar', Bar);
