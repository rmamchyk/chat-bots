const express = require('express');
const router = express.Router();

const userService = require('../services/user.service');

router.post('/register', (req, res)=>{
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    userService.registerUser(username, email, password)
      .then(result => res.send(result))
      .catch(err => res.status(400).send(err));
});

router.post('/login', (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;

    userService.loginUser(username, password)
      .then(result => res.send(result))
      .catch(err => res.status(400).send(err));
  });

module.exports = router;