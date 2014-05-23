
//unable to connect to mongoose
/*
var mongoose = require('mongoose');
var urls;
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  	console.log('connected');
	var urlschema = new mongoose.Schema({
  		url: String,
  		arank: Number,
  		js: [String]
  	})
  	urls = mongoose.model('urls', urlschema);

});

function addJsAll () {
	urls.find(function(err, urls) {
		if (err) return console.error(err);
//  		console.log(urls)
		for(i=0; i<2; i++) {
			addJs (urls[i]);
		}
	})
}

function addJs (e) {
	e.js = 
	e.save(function(err) {
		if (err) return console.error(err);
	})
}
*/
var webPage = require('webpage');
var page = webPage.create();
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
page.onResourceRequested = function(requestData, networkRequest) {
	var url = requestData.url;
	//console.log(url);
	if(url.endsWith('js'))	 {
		hostname = gethost(url);
		console.log('id: \t'+requestData.id + '\t host: \t'+ hostname);
	}
	//networkRequest.abort();
//	console.log('id: \t'+requestData.id + '\t host: \t'+ hostname);
	//networkRequest.abort();
};
var gethost = function (href) {
	var l = document.createElement("a");
	l.href = href;
	return l.hostname;
}
url = 'http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string';
page.open(url);
