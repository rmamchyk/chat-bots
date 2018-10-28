const express = require('express');
const router = express.Router();
const _ = require('lodash');

var {User} = require('../models/user');

router.post('/register', (req, res)=>{
    var user = new User(_.pick(req.body, ['username', 'email', 'password']));
    
    user.save().then(()=>{
      return user.generateAuthToken();
    }).then((token)=>{
      res.header('x-auth', token).send(user);
    }).catch((e)=>{
      res.status(400).send(e);
    });
});

router.post('/login', async (req, res)=>{
    var login = _.pick(req.body, ['username', 'password']);
  
    try {
      var user = await User.findByCredentials(login.username, login.password);
      var token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch (e) {
      res.status(400).send();
    }
  });

module.exports = router;