var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    display_name:{
        type: String
    },
    type: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.updateUser = function(_id,user,callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(user.type == 'admin'){
                user.password = hash;
            }
            User.update(
                {
                    _id: _id
                },
                {
                    username: user.username
                    ,password : user.password
                    ,email: user.email
                    ,display_name: user.username
                    ,type: user.type
                },callback);
        });
    });
}

module.exports.deleteUser = function(id,callback){
    User.findByIdAndRemove({_id:id},callback);
}

module.exports.getAllUser = function(callback){
    User.find({},callback);
}

module.exports.getAdminUserByUsername = function(username, callback){
    var query = {username: username, type: 'admin'};
    User.findOne(query, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUsersByType = function(type,callback){
    var query = {type: type};
    User.find(query,callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}