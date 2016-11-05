var User = require('../models/users');
var API_C = require('./APICodes').Codes

exports.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){next()} else {res.status(API_C.Denied).json({message: "Access Denied"})}
}
exports.emailNotExist = function(req, res, next) {
    User.count({email: req.body.email}, function (err, count) {
        if (count === 0) {next()} else {res.status(API_C.Conflict).json({message: "User is already Active"})}
    });
}
exports.findEmail = function(email,callback) {
    User.count({email: email}, function (err, count) {
        if (err) throw err
        callback(count>0)
    });
}