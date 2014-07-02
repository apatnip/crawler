// Get parameters
var host = 'deshaw.local';
var db = 'crawler';
var port = '27017';
var live;

// Build the connection string
var dbURI = 'mongodb://'+host+':'+port+'/'+db;
//'mongodb://username:password@host:port/database?options...'

exports.init = function(configs, isLive) {
	live = isLive == true;

	// Create the database connection
	if (!live) mongoose.connect(dbURI);
}

// Bring Mongoose into the app
var mongoose = require('mongoose');

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// BRING IN THE SCHEMAS & MODELS
require('./data');