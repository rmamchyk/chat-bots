const Message = require('../models/message.model');
const {ObjectId} = require('mongodb');

module.exports = {
    saveMessage(msg) {
        const message = new Message();
        message.text = msg.text;
        message.receiver = msg.receiver;
        message.sender = msg.sender;
        message.createdAt = msg.createdAt;
        
        return new Promise((resolve, reject) => {
            message.save((err, saved) => {
                if(err){
                    reject(err);
                }
                resolve(saved);
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
    },

    updateMessages(receiver, sender) {
        return new Promise((resolve, reject) => {
            let readAt = Date.now();

            Message.updateMany({
                '$and': [{'receiver': receiver}, {'sender':sender}, {'isRead' : {$ne: true}}]
            }, 
            {
                '$set': {'isRead': true, 'readAt': readAt}
            }, (err, result) => {
                if (err) {
                    reject(err);
                } 
                resolve({readAt});
            });
        });
    }
};