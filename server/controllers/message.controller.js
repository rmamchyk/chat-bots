const express = require('express');
const _ = require('lodash');
const router = express.Router();

const msgService = require('../services/message.service');
var {authenticate} = require('../middleware/authenticate');

router.post('/', authenticate, (req, res) => {
    let msg = _.pick(req.body, ['text', 'receiver', 'createdAt']);
    msg.sender = req.user._id;

    msgService.saveMessage(msg)
        .then(res.status(201).send())
        .catch(err => res.status(400).send(err));
});

router.get('/:receiver', authenticate, (req, res) => {
    let receiver = req.params.receiver;

    msgService.getMessages(req.user._id, receiver)
        .then(messages => res.send(messages))
        .catch(err => res.status(400).send(err));
})

module.exports = router;