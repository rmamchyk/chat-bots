module.exports = function(io){
    io.on('connection', (socket) => {
        // listen to private message and pass it to user-receiver.
        socket.on('message', msg => {
            io.to(msg.receiver).emit('message', msg);
            io.to(msg.sender).emit('message', msg);
        });

        socket.on('message seen', data => {
            io.to(data.sender).emit('message seen', {readAt: data.readAt});
        });

        socket.on('typing', data => {
            io.to(data.receiver).emit('typing', {sender: data.sender});
        })
    });
}