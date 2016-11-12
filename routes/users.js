var express  = require("express");
var path  = require("path");
var request  = require("request");
var config  = require("../config/keys.json");
var querystring = require("querystring");
var mongoose = require("mongoose");
var fs = require("fs");
var User = mongoose.model("User")

var router   = express.Router();

router.get('/:username', function(req, res) {
  res.render('user', {username: req.username})
})
