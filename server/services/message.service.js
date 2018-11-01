const Message = require('../models/message.model');

module.exports = {
    saveMessage(msg) {
        const message = new Message();
        message.text = msg.text;
        message.receiver = msg.receiver;
        message.sender = msg.sender;
        message.createdAt = new Date();
        
        return new Promise((resolve, reject) => {
            message.save((err) => {
                if(err){
                    reject(err);
                }
                resolve();
            });
        });
    }
};