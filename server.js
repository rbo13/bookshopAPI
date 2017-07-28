'use strict';

let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 1340;
let book = require('./routes/book');
let config = require('config'); // To load the DB location from JSON file.

// DB Options
let options = {
    server:  { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

// DB Connection
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

// Dont show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
  app.use(morgan('combined'));
}

// Parse application/json and look for raw test
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }))

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Bookstore API",
    version: "v1",
    status: 200
  });
});

// Main routes
app.route('/book')
  .get(book.getBooks)
  .post(book.postBook);

app.route('/book/:id')
  .get(book.getBook)
  .delete(book.deleteBook)
  .put(book.updateBook);

app.listen(port);
console.log("Listening on port: " + port);
module.exports = app;
