const _ = require('lodash');

class GlobalRoom {
    constructor(){
        this.users = [];
    }
    
    addUser(id, username, image) {
        this.users.push({id, username, image});
    }
    
    removeUser(id){
       return _.remove(this.users, user => user.id === id);
    }
    
    getUser(id){
        return this.users.filter((user) => {
            return user.id === id;
        })[0];
    }
    
    getUsers(){
        var userNames = this.users.map((user) => {
            return {
                username: user.username,
                image: user.image
            }
        });
        return _.uniqBy(userNames, 'username');
    }
}

module.exports = {GlobalRoom};