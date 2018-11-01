const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Load config 
require('./server/config/config');
// Connect to Mongo
require('./server/common/dbConnection');

// Using middleware
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./server/socket/onlineRoom')(io);

// Getting routes
const users = require('./server/controllers/user.controller');

// Setting routes
app.use('/users', users);

// Catch all other routes request and return it to the index
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || 4600;
server.listen(port, ()=>{
    console.log(`Server is listening on port ${port}...`);
});