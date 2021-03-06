const mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    text: {type: String},
    sender: {type: String},
    receiver: {type: String},
    isRead: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now},
    readAt: {type: Number, default: ''}
});

module.exports = mongoose.model('Message', messageSchema);