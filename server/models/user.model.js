const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
    },
    password: {
      type: String,
      required: true,
      minlength: 5
    },
    token: {
      type: String
    }
});

// UserSchema.methods.toJSON = function(){
//   var user = this;
//   var userObj = user.toObject();
//   return _.pick(userObj, ['_id', 'username', 'email', 'token']);
// };

UserSchema.methods.generateToken = function() {
   let user = this;
   user.token = jwt.sign({_id: user._id.toHexString()}, process.env.JWT_SECRET).toString();
   return user.save(() => {
      return user;
   });
};

UserSchema.methods.removeToken = function() {
  let user = this;
  user.token = null;
  return user.save(() => {
     return user;
  });
};

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    token: token
  });
};

UserSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt)=> {
      bcrypt.hash(user.password, salt, (err, hash)=>{
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
