var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/* user model */
var User = require('../models/user');

// Register
router.get('/setup', function(req, res){
    User.getAllUser(function(err,users){
        if(users.length > 0){
            res.redirect('/users/login');
        } else{
            res.render('user/setup',{ title: 'Setup',errors:{} });
        }
    });
});

/* GET All Users */
router.get('/getAllUsers/',function(req,res,next){
    User.getAllUser(function(err,items){
        if(err) throw err;
        res.json(items);
    });
});

/* Get user by id */
router.get('/getUserById/:_id',function(req,res,next){
    User.getUserById(req.params._id, function(err,user){
        res.json(user);
    })
});

// Login
router.get('/login', function(req, res){
    if(!req.isAuthenticated()){
        res.render('user/login',{title:'Login'});
    } else{
        res.redirect('/');
    }
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
            password: password,
            display_name: username,
            type: 'admin'
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            //console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});
/* Create new user */
router.post('/createuser',function(req,res,next){
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        display_name: req.body.username,
        type: req.body.type
    });
    User.createUser(newUser, function(err, user){
        if(err) throw err;
        //console.log(user);
        res.json(user);
    });
});
/* Update user */
router.post('/updateUser/',ensureAuthenticated,function(req,res,next){
    var updateUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        display_name: req.body.username,
        type: req.body.type
    });
    User.updateUser(req.body._id,updateUser,function(err,user){
        if(err) throw err;
        res.json(user);
    });
});

/* Delete User */
router.delete('/deleteUser/:_id',ensureAuthenticated,function(req,res,next){
    User.deleteUser(req.params._id,function(err,response){
       if(err) throw err; 
        res.json(response);
    });
});

/* config passport locat strategy */
passport.use(new LocalStrategy(function(username, password, done) {
    User.getAdminUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}), function(req, res) {
    res.redirect('/');
});

router.get('/vendorlist',function(req, res){
    User.getUsersByType('vendor',function(err,users){
        if(err) throw err;
        res.json(users);
    })
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

/* GET users listing. */
router.get('/*', function(req, res, next) {
    User.getAllUser(function(err,users){
        if(users.length > 0){
            if(req.isAuthenticated()){
                res.render('user/users',{ title: 'User', selectedMenu: '', errors:{} });
            } else{
                res.redirect('/users/login');
            }
        } else{
            res.redirect('/users/setup');
        }
    });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users');
    }
}

module.exports = router;
