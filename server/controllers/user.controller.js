const express = require('express');
const router = express.Router();

const userService = require('../services/user.service');
var {authenticate} = require('../middleware/authenticate');

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

router.delete('/logout', authenticate, (req, res)=>{
      userService.logoutUser(req.user)
        .then(res.status(200).send())
        .catch(err => res.status(400).send(err));
});

router.get('/', authenticate, (req, res) => {
      userService.getUsers(req.user.username)
         .then(users => res.send(users))
         .catch(err => res.status(400).send(err));
})

module.exports = router;