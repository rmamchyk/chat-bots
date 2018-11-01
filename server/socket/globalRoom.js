const {GlobalRoom} = require('../helpers/GlobalRoom');

const ONLINE_ROOM = 'online room';

module.exports = function(io){
    const global = new GlobalRoom();

    io.on('connection', (socket) => {
        // listen to new user joining online room
        socket.on('join global room', (user) => {
            socket.join(ONLINE_ROOM);

            global.addUser(socket.id, user.username, user.image);
            
            const onlineUsers = global.getUsers();
            io.to(ONLINE_ROOM).emit('global room update', onlineUsers);
        });
        
        // listen to user disconnection and remove him from online room.
        socket.on('disconnect', () => {
            const deleted = global.removeUser(socket.id);
            if(deleted) {
                var onlineUsers = global.getUsers();
                io.to(ONLINE_ROOM).emit('global room update', onlineUsers);
            }
        })
    });
}