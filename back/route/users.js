var db = require('../config/database');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

exports.login = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	
	if (username == '' || password == '') { 
		return res.send(401); 
	}

	db.userModel.findOne({ username: username }, function (err, user) {
	    if (err) {
	        console.log('Database error, cannot find the user');
			console.log(err);
			return res.send(401);
	    } else if (typeof user == 'undefined' || user === null) {
	        console.log('No such a user');
			return res.send(401);
	    }
		
		user.comparePassword(password, function(isMatch) {
			if (!isMatch) {
				console.log("Attempt failed to login with " + user.username + 'not a match');
				return res.send(401);
            }
			var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
			return res.json({token:token});
		});
	});
};

exports.logout = function(req, res) {
	if (req.user) {
		delete req.user;	
		res.send(200);
	}
	else {
		res.send(401);
	}
}


//Uncomment this the first time you ran it. Then delete it and restart.
//var user = new db.userModel();
//user.username = "enver";
//user.password = "secret";

//user.save(function(err) {
//	if (err) {
//	  console.log(err);
//	}
//	console.log("User Created ! Stop nodejs and remove these lines");
//});
