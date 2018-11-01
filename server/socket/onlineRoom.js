const {OnlineUsers} = require('../helpers/OnlineUsers');

const ONLINE_ROOM = 'online room';

module.exports = function(io){
    const onlineRoom = new OnlineUsers();

    io.on('connection', (socket) => {
        // listen to new user joining online room
        socket.on('join online room', (user) => {
            socket.join(ONLINE_ROOM);

            onlineRoom.addUser(socket.id, user.username, user.image);
            
            const onlineUsers = onlineRoom.getUsers();
            io.to(ONLINE_ROOM).emit('online users', onlineUsers);
        });
        
        // listen to user disconnection and remove him from online room.
        socket.on('disconnect', () => {
            const deleted = onlineRoom.removeUser(socket.id);
            if(deleted) {
                var onlineUsers = onlineRoom.getUsers();
                io.to(ONLINE_ROOM).emit('online users', onlineUsers);
            }
        })
    });
}