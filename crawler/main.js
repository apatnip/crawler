var args = process.argv;
var http = require("http");
var request = require('request');
var mongoose = require('mongoose');
var cheerio = require('cheerio');

//GET parameters
var pageSize=0;				// Get data from wwwranking in slots of?
var pageNo=0;					// No of slots
var colName = 'tpages';		// Collection name
var qfindurls = false;			// Whether add urls
var qalexa = false;			// Whether get alexa data
var addwCheck = true;		// Add to db with check if already exists
var qprint = false;			// whether print database
db = require('./model/db'),
Data = mongoose.model('tpages');

//Connect to db
var mongoose = require('mongoose');
db = require('./model/db'),
Data = mongoose.model('tpages');

var con = mongoose.connection;
con.on('error', console.error.bind(console, 'connection error:'));
con.once('open', function callback () {

/****************Most Important Calls***************/

	if(qprint) printData(Data);
	if(qfindurls) findUrl();
	if(qalexa) findRank();

/***************************************************/

	var noofpages = 5;
	Data.find(	function(err, arr) {
		arr.forEach(function(e,i,a) {
			if(i<noofpages)	findRes(e);
		});
	});
});

var phantom = require('phantom');
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function testjs (url, type) {
	if(url.endsWith('.js')) return true;
	else if(url.contains('.js?')) return true;
	else if(type!= null && type.contains('javasccript')) return true;
	return false;
}
function testcss (url, type) {
	if(url.endsWith('.css')) return true;
	else if(url.contains('.css?')) return true;
	else if(type!= null && type.contains('css')) return true;
	return false;
}
function testextjs (url, host) {
	if(url.contains(host)) return false;
	else return true;
}
url = require('url')

var gethost = function (href) {
	urlo = url.parse(href);
	return urlo.host;
}

function findRes(e) {
	var pageurl = e.url;
	console.log(pageurl);
	phantom.create(function (ph) {
	  ph.createPage(function (page) {
	    page.set('viewportSize', { width: 1366, height: 768});
	  	var jsarr = [];
		var cssarr = [];
		var extjsarr = [];
		var host = gethost(pageurl);
		page.set ('settings.userAgent', 'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0');
		page.set('onResourceReceived', function(response) {
			if(response.stage == 'end') {
				var url = response.url;
				type = response.contentType;

		//		console.log(url+'  '+host);
				if(testjs(url, type)) {// resource is js
					jsarr.push(url);
					if(testextjs ( url, host)) {
						extjsarr.push(url);
					}
				}
				else if(testcss(url, type))	 {// resource is css
					cssarr.push(url);
				}
				// other
			}
		})
	    page.open(pageurl, function (status) {
	    	if(status == 'success') {

	    	}
			page.evaluate(function () { return document.title; }, function (result) {
			//now actually done
			console.log('\nPage title is ' + result);
/*
				//CSS
			console.log ('\nCSS:\n');
			cssarr.forEach(function(value, index) {
			  console.log((index+1)+ ': '+value);
			});

			//JS
			console.log('\nJavascripts:\n');
			jsarr.forEach(function(value, index) {
			  console.log((index+1)+ ': '+value);
			});
*/
			//External JS
			console.log('\nExternal Javascripts:\n');
			extjsarr.forEach(function(value, index) {
			  console.log((index+1)+ ': '+value);
			});
			var path = 'img/' + host +'.png';
			page.render('./'+path);
			console.log('page rendered at ' + path);

			e.js = extjsarr;
			e.capture = path;
			e.save(function(err) {
	            if (err) return console.error(err);
	            console.log('saved to db');
            });

			ph.exit();
			});
		});
	  });
	});	
}

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
function findData () {
    urls.find(function(err, all) {
        all.forEach(function(element,index,array) {
            if(element.arank==null) {
                console.log('searching rank for ' + element.url);
                addData(element);
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
	if(addwCheck) {			//do without check in db
		var page = new urls({ url: url})
		page.save(function(err) {
			if (err) return console.error(err);
			//saved
			console.log(url +' saved');
		})
	}
	else {					//do with check if already present
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
	}

//	datas.push(new dataf(url));
	//console.log(link);
    
	//	console.log(rank);
    //datas[i].arank = rank;
}
nacount=0;
//refactor alexa ranks
function addData(e) {
	link = e.url;
	var aurl = 'http://data.alexa.com/data?cli=10&dat=snbamz&url='+ link;
    var rank;
    request(aurl, function (error, response, xml) {
    	if (!error && response.statusCode == 200) {
    		var $ = cheerio.load(xml, {
    			xmlMode:true
    		});
            rank = $('REACH').attr('RANK');
            e.time = $('SPEED').attr('TEXT');
    		e.ptime = $('SPEED').attr('PCT');

    		if(rank) {
                console.log(rank);
                e.arank = rank;
            }
    		else if(typeof rank === 'undefined') {
    			console.log ('Rank for '+aurl+ ' not available.');
    		}
            e.save(function(err) {
            if (err) return console.error(err);
                //console.log('saved');
            })    		
    	}
    	else console.log('Error fetching alexa data for '+ aurl);
    });
}