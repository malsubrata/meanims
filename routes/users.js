var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/* user model */
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	User.getAllUser(function(err,users){
		console.log(users);
		if(users.length > 0){
			res.redirect('/users/login');
		} else{
			res.redirect('/users/setup');
		}
	});
});

// Register
router.get('/setup', function(req, res){
	res.render('user/setup',{ title: 'Setup',errors:{} });
});

// Login
router.get('/login', function(req, res){
	res.render('user/login',{title:'Login'});
});

// Setup Evn
router.post('/setup', function(req, res){
	var username = req.body.username;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	console.log(errors);

	if(errors){
		res.render('user/setup',{
			title: 'Setup',
			errors:errors
		});
	} else {
		var newUser = new User({
			username: username,
			email:email,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			//console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

module.exports = router;
