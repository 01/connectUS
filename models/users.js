var mongoose = require('mongoose');
var WriteAP = require('../tools/WriteAP');
var hash = require('pwd').hash;
var gravatar = require('gravatar');
var fs = require('fs');

UserSchema = mongoose.Schema({
	firstName:  String,
	lastName:   String,
	school:     {type: String},
	email:      {type: String, index: true},
	salt:       {type: String, select: false},
	hash:       {type: String, select: false},
	img:        {type: String, trim: true},
	facebook:   {id: String},
	twitter:    {id: String},
	google:     {id: String}
});
UserSchema.virtual("fullName").get(function(){
    return this.firstName+" "+this.lastName
}).set(function(name){
    var n = name.split(" ")
    this.firstName=n[0];this.lastName= n[n.length-1];
})
UserSchema.set("toJSON",{virtuals: true})
UserSchema.set("toObject",{virtuals: true})

UserSchema.statics.signup = function(name, email, password, done){
	var User = this;
	hash(password, function(err, salt, hash){
		if(err) throw err;
        // if (err) return done(err);
		User.create({
			fullName: name,
			email: email,
			salt: salt,
			hash: hash,
			isAdmin: false
		}, function(err, user){
			if(err) throw err;
			done(null, user);
		});
	});
}

UserSchema.statics.isValidUserPassword = function(email, password, done) {
	User.findOne({email: email}).select("+salt +hash").exec(function(err, user){
		if(err) {throw err;}
		if(!user) {return done(null, false, {message : 'Incorrect email'});}
		hash(password, user.salt, function(err, hash){
			if(err) throw err;
			if(hash == user.hash) return done(null, user);
			done(null, false, {
				message : 'Incorrect password'
			});
		});
	});
};

// Create a new user given a profile
UserSchema.statics.findOrCreateOAuthUser = function(profile, done){
	var User = this;
	var query = {};
	WriteAP("!came here")
	console.log(profile)
	//Compain about Emails if none
    var origin = ""+profile.authOrigin, id = profile.id, name = profile.displayName, img = profile.photos[0].value, email = profile.emails[0].value;
	query[origin+'.id'] = id;
	User.findOne(query, function(err, user){
		if(err) {throw err}
		if(user){return done(null, user)}
        User.findOne({'email': email}, function(err, user){
            if(err) throw err;
            if(user){
                // Preexistent e-mail, update
                user.img = user.img || img;
                user[origin] = {};
                user[origin].id = id;
                user.save(function(err, user){
                    if(err) throw err;
                    done(null, user);
                });
            } else {
                user = {
                    email: email,
                    fullName: name,
                    img: img
                };
                user[origin] = {};
                user[origin].id = id;
                User.create(user, function(err, user){
                    if(err) {throw err}
                    user.setProfilePic()
                    done(null, user);
                });
            }
        });
	});
}

UserSchema.methods.setProfilePic = function(pic, done){
    var me = this;
}

var User = mongoose.model("User", UserSchema);
module.exports = User;