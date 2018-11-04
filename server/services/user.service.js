const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const _ = require('lodash');
const async = require('async');

module.exports = {
    async registerUser(username, email, password) {
        let errors = [];

        let sameUser = await User.findOne({username});
        if(sameUser) {
            errors.push('Username already exists');
        }
        sameUser = await User.findOne({email});
        if (sameUser) {
            errors.push('Email already exists');
        }

        if (errors.length > 0) {
            return {user: null, errors};
        } 

        let user = new User({username, email, password});
        
        await user.generateToken();

        return {user, errors};
    },
    async loginUser(username, password) {
        let errors = [];
        let user = await User.findOne({username});
        if (!user) {
             errors.push('Username or Password is invalid');
             return {user: null, errors};
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, async (err, valid) => {
                if(valid) {
                    await user.generateToken();
                    resolve({user, errors});
                } else {
                    errors.push('Username or Password is invalid');
                    resolve({user: null, errors});
                }
            });
        });
    },
    async logoutUser(user) {
        return await user.removeToken();
    },
    getUsers(username) {
        return new Promise((resolve, reject) => {
            async.parallel([
                function(callback) {
                    User.find({'username' : {$ne: username}}, '_id username').lean()
                        .exec((err, users) => {
                            callback(err, users);
                    });
                },
                function(callback) {
                    Message.aggregate([
                        {$match: { "receiver": username, 'isRead': false } },
                        {
                            $group : {
                                _id: { sender: '$sender', receiver: '$receiver' },
                                count: { $sum: 1 } 
                            }
                        }
                    ], (err, results) => {
                        callback(err, results);
                    });
                },
                function(callback) {
                    Message.aggregate([
                        {$match:{$or:[{"sender":username}, {"receiver":username}]}},
                        {$sort:{"createdAt":-1}},
                        {
                            $group : {
                                _id : { 
                                    "last_message_between":{
                                        $cond: [{
                                            $gt:[
                                                {$substr:["$sender",0,-1]},
                                                {$substr:["$receiver",0,-1]}
                                            ]},
                                            {$concat:["$sender"," and ","$receiver"]},
                                            {$concat:["$receiver"," and ","$sender"]}
                                        ]
                                    }
                                },
                                lastMessage: { $first: "$$ROOT" }
                            }
                        }
                    ], (err, messages) => {
                        if (err) {
                            console.log(error)
                        }
                        callback(err, messages);
                    });
                }
            ], function(err, results) {
                if (err) {
                    reject(err);
                }
                let users = results[0];
                let unreadResults = results[1];
                let messages = results[2];

                users.forEach(user => {
                    let msgFound = _.find(messages, msg => {
                        return msg.lastMessage.sender == user.username || msg.lastMessage.receiver == user.username;
                    });
                    let unreadFound = _.find(unreadResults, unread => {
                        return unread._id.sender == user.username;
                    });
                    user.lastMessage = msgFound ? msgFound.lastMessage : '';
                    user.unreadCount = unreadFound ? unreadFound.count : 0;
                });
                resolve(users);
            });
        });
    }
};