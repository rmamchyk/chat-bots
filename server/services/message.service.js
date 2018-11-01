const Message = require('../models/message.model');

module.exports = {
    saveMessage(msg) {
        const message = new Message();
        message.text = msg.text;
        message.receiver = msg.receiver;
        message.sender = msg.sender;
        message.createdAt = msg.createdAt;
        
        return new Promise((resolve, reject) => {
            message.save((err) => {
                if(err){
                    reject(err);
                }
                resolve();
            });
        });
    },

    getMessages(sender, receiver) {
        return new Promise((resolve, reject) => {
            Message.find({
                '$or': [
                    {'$and': [{'sender':receiver}, {'receiver':sender}]},
                    {'$and': [{'sender':sender}, {'receiver':receiver}]}
                ]
            }).sort({'createdAt': 1}).exec((err, messages) => {
                if (err) {
                    reject(err);
                }
                resolve(messages);
            })
        });
    }
};