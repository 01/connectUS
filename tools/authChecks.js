var User = require('../models/users');

exports.onlyPublicUser = function (req, res, next){
    if(!req.isAuthenticated()){next()} else {res.redirect("/")}
}
exports.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){next()} else {res.redirect("/login")}
}
exports.emailNotExist = function(req, res, next) {
    User.count({email: req.body.email}, function (err, count) {
        if (count === 0) {next()} else {req.flash('error', 'User already exists!');res.redirect("/sign-up")}
    });
}