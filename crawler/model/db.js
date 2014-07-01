// Bring Mongoose into the app
var mongoose = require('mongoose');

// GET parameter
// Build the connection string
// Mongoose Connect Parameter
//var dbURI = 'mongodb://localhost/test';
//var dbURI = 'mongodb://192.168.100.211/crawler';
var dbURI = 'mongodb://localhost/crawler';
//'mongodb://username:password@host:port/database?options...'

exports.init = function(server, port, isLive) {
  dbURI = 'mongodb://' + server + ':' + port + '/crawler';
  if (!isLive)
    mongoose.connect(dbURI);
}

// Create the database connection

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// BRING IN THE SCHEMAS & MODELS
require('./data');