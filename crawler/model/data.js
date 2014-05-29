var colName = 'tpages';

var mongoose = require( 'mongoose' );

var dataSchema = new mongoose.Schema({
	url: String,
	arank: Number,
	psize: Number,
	ptime: Number,
    js: [String],
	capture: String,
	ssMobile: String
});
var Data = module.exports = mongoose.model(colName, dataSchema);