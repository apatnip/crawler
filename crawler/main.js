var args = process.argv;

var http = require("http");
var request = require('request');
var mongoose = require('mongoose');
var cheerio = require('cheerio');

var pageNo;
var pageSize;
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
  		psize: Number,
  		js: [String]
  	})
  	urls = mongoose.model('tpages', urlschema);
  	//saving new page
  	/*
  	var page = new urls({ url: 'abc' ,arank:''})
	console.log(page.url)
	
	page.save(function(err) {
		if (err) return console.error(err);
  		console.log('saved');
	})
	*/	
	//mongoose.connection.close();

/****************Most Important Calls***************/

//comment out what you don't wanna do
//	printData(urls);
	pageNo = args[2]/args[3];
	pageSize = args[3];
	findUrl();
//	findRank();

/***************************************************/
});

//var datas = [];


//find all the urls from wwwranking
//also calls addurl

function findUrl() {
	var url1 = "http://wwwranking.webdatacommons.org/Q/?pageIndex=";
	var url2 = "&pageSize=";

	j=0
	var timer = setInterval (function() {
		url3 = url1+j+url2+pageSize;		//complete url
		console.log('url3 = '+url3);
		download(url3, function(data) {
	  		if (data) {
		    	//console.log(data);
		   		var json = JSON.parse(data);
		    	//console.log(json_string);
		    	for(i=0; i<pageSize; i++){
		    		html = (json['data'][i]['harmonic']);
		    		$ = cheerio.load(html);
		    		link = $('a').attr('href');
		    		addUrls(link);
		    	}
		  	}
		  	else console.log("error");
			j++;
		});

		// This part not working
		if(j == pageNo) clearInterval(timer);

	}, 10000)
}

//find ranks of all the urls present in the db
//also calls addRank
function findRank () {
	urls.find(function(err, all) {
		all.forEach(function(element,index,array) {
			if(element.arank==null) {
				console.log('searching rank for ' + element.url);
				addaRank(element);
			}
		})
	})
}

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

//print existing data
function printData (urls) {
	urls.find(function(err, urls) {
		if (err) return console.error(err);
  		console.log(urls)
	})
}

//refactor urls
function addUrls(url) {
	//do without check in db
	var page = new urls({ url: url})
	page.save(function(err) {
		if (err) return console.error(err);
		//saved
		console.log(url +' saved');
	})

	/*	
	//do with check if already present
	urls.find({url: url}, function(err, arr) {
		console.log('searching ' + url);
		//console.log(arr);
		if(err) {
			
		} 
		if(arr.length==0) {
			var page = new urls({ url: url ,arank:''})
			page.save(function(err) {
				if (err) return console.error(err);
  				//console.log('saved');
			})
			console.log('not found');
		}
		else {
			console.log('already present');
			//console.log(arr[0].url);
		}
	})
	*/
//	datas.push(new dataf(url));
	//console.log(link);
    
	//	console.log(rank);
    //datas[i].arank = rank;
}
nacount=0;
//refactor alexa ranks
function addaRank(e) {
	link = e.url;
	var aurl = 'http://data.alexa.com/data?cli=10&dat=snbamz&url='+ link;
    var rank;
    request(aurl, function (error, response, xml) {
  		if (!error && response.statusCode == 200) {
    		var $ = cheerio.load(xml, {
    			xmlMode:true
    		});
    		rank = $('REACH').attr('RANK');
    		if(rank) console.log(rank);
    		else if(typeof rank === 'undefined') {
    			console.log ('Rank for '+aurl+ ' not available.');
    			nacount++;
    			console.log(nacount);
    		}
    		e.arank = rank;
    		e.save(function(err) {
				if (err) return console.error(err);
  				//console.log('saved');
			})
  		}
  		else console.log('Error fetching alexa data for '+ aurl);
	});
}