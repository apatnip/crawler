var colName = 'tpages';

var mongoose = require( 'mongoose' );

var dataSchema = new mongoose.Schema({
	url: String,
	arank: Number,
	ltime: Number,
	ptime: Number,
    js: [String],
	capture: String,
	mcapture: String,
	title: String
});
var Data = module.exports = mongoose.model(colName, dataSchema);