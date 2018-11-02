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
            Message.updateMany({
                '$and': [{'receiver': receiver}, {'sender':sender}]
            }, 
            {
                '$set': {'isRead': true, 'readAt': Date.now()}
            }, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } 
                resolve(result);
            });
        });
    },

    updateMessage(id) {
        return new Promise((resolve, reject) => {
            Message.updateOne({
                '_id': ObjectId(id)
            }, 
            {
                '$set': {'isRead': true, 'readAt': Date.now()}
            }, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } 
                console.log('ONE IS READ', result);
                resolve(result);
            });
        });
    }
};