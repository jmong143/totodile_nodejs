var express = require('express');
var router = express.Router();


var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}


module.exports = function(passport){

	router.get('/login', function(req, res) {
		res.render('index', { message: req.flash('message') });
	});
	/*	router.post('/', passport.authenticate('login', {
		// successRedirect: '/login',
		failureRedirect: '/',
		failureFlash : true
	}));
	*/

	router.post('/login', function(req, res, next) {
		passport.authenticate('login', { session: true },function(err, user, info) {
	    if (err) {
	      return next(err);
	    }
	    if (! user) {
				var jsonFailedLogin = {
					message : 'failed',
					authorize : 'false',
				}
	      return res.send(jsonFailedLogin);
	    }
	    req.login(user, loginErr => {
	      if (loginErr) {
	        return next(loginErr);
	      }
				var jsonSuccessLogin = {
					message : 'success',
					authorize : 'true',
				}
	      return res.send(jsonSuccessLogin);
	    });
	  })(req, res, next);
	});

	router.get('/me', isAuthenticated, function(req, res){
		//res.render('home', { user: req.user });
		var jsonMe = {
				message: "success",
				currentUser: {
					objectId : req.user._id,
					username : req.user.username,
					email: req.user.email,
					fullname: req.user.fullname
				}
			}
		res.send(jsonMe);
	});

	router.get('/profile', isAuthenticated, function(req, res){
		var jsonProfile = {
			message: "success",
			currentUser: {
				objectId : req.user._id,
				username : req.user.username,
				email: req.user.email,
				fullname: req.user.fullname
			}
		}
		res.send(jsonProfile);
	});



	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/register',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	router.get('/register', function(req, res){
		res.send(req.user);
	});


	router.get('/signout', isAuthenticated, function(req, res) {
		if (req.isAuthenticated()){
			req.session.destroy(function(err) {
				var jsonSuccessLogout = {
				result: "success",
				resultMessage: "Congratulations, You have successfully logged out."
					}
				res.send(jsonSuccessLogout);
			});
		}
		else{
			var jsonFailedLogout = {
					result: "failed",
					resultMessage: "Validation Message here"
				}
			res.send(jsonFailedLogout);

		}
	});

	return router;
}
