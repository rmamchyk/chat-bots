module.exports = function(io){
    io.on('connection', (socket) => {
        // listen to joining private room and connect two users.
        socket.on('join private room', (data) => {
            socket.join(data.sender);
            socket.join(data.receiver);
        });

        // listen to private message and pass it to user-receiver.
        socket.on('message', (message) => {
            // send the private message to user-receiver.
            io.to(message.receiver).emit('message', {
                text: message.text,
                sender: message.sender,
                createdAt: message.createdAt
            });
        });
    });
}