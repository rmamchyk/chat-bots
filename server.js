const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Getting our routes
const users = require('./server/routes/users');

// Using middleware
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Setting our routes
app.use('/users', users);

// Catch all other routes request and return it to the index
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}...`);
})