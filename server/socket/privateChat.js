module.exports = function(io){
    io.on('connection', (socket) => {
        // listen to joining private room and connect two users.
        socket.on('join private room', (data) => {
            socket.join(data.sender);
            socket.join(data.receiver);
        });

        // listen to private message and pass it to user-receiver.
        socket.on('message', (msg) => {
            // send the private message to user-receiver.
            io.to(msg.receiver).emit('message', {
                _id: msg._id,
                text: msg.text,
                sender: msg.sender,
                receiver: msg.receiver,
                createdAt: msg.createdAt,
                isRead: msg.isRead,
                readAt: msg.readAt
            });
        });
    });
}