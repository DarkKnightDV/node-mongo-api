const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email : {
        type: String,
        minlength: 5,
        trim: true,
        required: true,
        unique: true,
        validate: {
           validator: validator.isEmail,
           message: '{VALUE} is not a valid email.'
        }
    },
    password : {
        required: true,
        type: String,
        trim: true,
        minlength: 6
    },
    tokens : [{
       access: {
           type: String,
           required: true
       },
       token: {
           type: String,
           required: true
       }
    }]
});

UserSchema.pre('save', function (next){
    var user = this;
    if(user.isModified('password')) {
        var password = user.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hashedPwd) => {
                // console.log("PWD:", hashedPwd);
                user.password = hashedPwd;
                next();
            });
        })
    } else {
        next();
    }
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.getAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(), access}, "123abc").toString();
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken= function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token , "123abc");
    } catch (err) {
       /*  return new Promise((resolve, reject) => {
            reject (); 
        }) */
        return Promise.reject("Invalid User");
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token' : token,
        'tokens.access': 'auth'
    });
};


const User = mongoose.model('User', UserSchema);

module.exports = {User};
