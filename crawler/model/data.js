var colName = 'thoupages';

exports.init = function(colName) {
	var Data = module.exports = mongoose.model(colName, dataSchema);
}

var mongoose = require( 'mongoose' );

var dataSchema = new mongoose.Schema({
  url: String,
  arank: Number,
  ltime: Number,
  ptime: Number,
  js: [String],
  capture: {
    desktop: String,
    mobile: String
  },
  title: String,
  crash: Boolean,
  psi: {
    desktop: mongoose.Schema.Types.Mixed,
    mobile: mongoose.Schema.Types.Mixed,
  },
  timeStamp: Date,
  html: String,
  alexa: mongoose.Schema.Types.Mixed
});