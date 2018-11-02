const express = require('express');
const _ = require('lodash');
const router = express.Router();

const msgService = require('../services/message.service');
var {authenticate} = require('../middleware/authenticate');

router.post('/', authenticate, (req, res) => {
    let msg = _.pick(req.body, ['text', 'receiver', 'createdAt']);
    msg.sender = req.user.username;

    msgService.saveMessage(msg)
        .then(saved => res.status(201).send(saved))
        .catch(err => res.status(400).send(err));
});

router.get('/:receiver', authenticate, (req, res) => {
    let receiver = req.params.receiver;

    msgService.getMessages(req.user.username, receiver)
        .then(messages => res.send(messages))
        .catch(err => res.status(400).send(err));
});

router.put('/', authenticate, (req, res) => {
    let sender = req.body.sender;

    msgService.updateMessages(req.user.username, sender)
        .then(res.status(204).send())
        .catch(err => res.status(400).send(err));
});

router.put('/:id', authenticate, (req, res) => {
    console.log('UPDATE ONE', req.params);
    let id = req.params.id;

    msgService.updateMessage(id)
        .then(res.status(204).send())
        .catch(err => res.status(400).send(err));
});

module.exports = router;