var express  = require("express");
var path  = require("path");
var request  = require("request");
var config  = require("../config/keys.json");
var querystring = require("querystring");
var mongoose = require("mongoose");
var User = require('../models/users');
var fs = require("fs");
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oath').OAuthStrategy;

var router   = express.Router();

passport.use(new GoogleStrategy({
    consumerKey: GOOGLE_CONSUMER_KEY,
    consumerSecret: GOOGLE_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({
      'google': profile.id
    }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        let name_parts = profile.displayName.split("")
        user = new User({
          firstName: name_parts[0],
          lastName: name_parts.length > 1? name_parts[1] : null,
          email: profile.emails[0].name,
          google: profile.id
        })
        done(null, user);
      }
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: "http://3a1c0b10.ngrok.io/auth/facebook/cb"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'facebook': profile.id
    }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        let name_parts = profile.displayName.split("")
        user = new User({
          firstName: name_parts[0],
          lastName: name_parts.length > 1? name_parts[1] : null,
          email: profile.emails[0].name,
          facebook: profile.id
        })
        done(null, user);
      }
    });
  }
));

router.post('/', passport.authenticate('local'),
  {
    successRedirect: '/users/' + req.user.username,
    failureRedirect: '/login'
})

router.get(
  '/facebook/cb',
  passport.authenticate('facebook', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/users/' + req.user.username)
  }
)
