const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

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
    }
};