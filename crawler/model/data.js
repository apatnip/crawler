//GET parameter
var colName = 'thoupages';

var mongoose = require( 'mongoose' );

var dataSchema = new mongoose.Schema({
	url: String,
	arank: Number,
	ltime: Number,
	ptime: Number,
    js: [String],
	capture: String,
	mcapture: String,
	title: String,
	crash: Boolean,
	psid: mongoose.Schema.Types.Mixed,
	psim: mongoose.Schema.Types.Mixed,
	timeStamp: Date,
	html: String,
	alexa: mongoose.Schema.Types.Mixed
});
var Data = module.exports = mongoose.model(colName, dataSchema);