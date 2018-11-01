const express = require('express');
const _ = require('lodash');
const router = express.Router();

const msgService = require('../services/message.service');
var {authenticate} = require('../middleware/authenticate');

router.post('/', authenticate, (req, res) => {
    console.log(req.body);
    let msg = _.pick(req.body, ['text', 'receiver']);
    msg.sender = req.user._id;
    console.log('SERVER: ', msg);
    msgService.saveMessage(msg)
        .then(res.status(201).send())
        .catch(err => res.status(400).send(err));
});

module.exports = router;