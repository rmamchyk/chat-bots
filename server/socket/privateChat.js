module.exports = function(io){
    io.on('connection', (socket) => {
        // listen to joining private room and connect two users.
        socket.on('join private room', data => {
            socket.join(data.sender);
            socket.join(data.receiver);
        });

        // listen to private message and pass it to user-receiver.
        socket.on('message', msg => {
            io.to(msg.receiver).emit('message', msg);
        });

        socket.on('message seen', data => {
            io.to(data.sender).emit('message seen', {readAt: data.readAt});
        });
    });
}