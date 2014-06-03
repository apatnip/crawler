var args = process.argv;
var http = require("http");
var request = require('request');
var mongoose = require('mongoose');
var cheerio = require('cheerio');

//GET parameters
var pageSize=0;				// Get data from wwwranking in slots of?
var pageNo=0;				// No of slots
var colName = 'tpages';		// Collection name
var qfindurls = false;		// Whether add urls
var qalexa = false;			// Whether get alexa data
var addwCheck = true;		// Add to db with check if already exists
var qprint = false;			// whether print database
var qsc = true;				// whether take screenshot
var savetodb = false;
db = require('./model/db'),
Data = mongoose.model('tpages');

var live=false;
//var liveurl = 'http://www.connecto.io/';
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
	/*
	if(live) {
		e = new Data ({url: liveurl});
		findRes(e);
		addData(e);
	}
	*/
/***************************************************/
	
	/*
	var noofpages = 1;
	var slots = 1;
	Data.find({js:[]}, function(err, arr) {
		var add = 0;
		noofpages = arr.length;
		timera = setInterval(function() {
			for(i=add; i<slots+add; i++) {
				console.log('i = ' + i + 'total = ' + noofpages);
				if(i==noofpages) {
					console.log('timer stopped');
					clearInterval(timera);
					break;
				}
				console.log('At i = ' + i);
				findRes(arr[i]);
			}
			add+=slots;
		}, 20000);
	});
	*/
});
var done=false;
exports.out = function (req, res) {
	console.log('got request\n');
	liveurl = req;
	e = new Data ({url: liveurl});
	findRes(e);
	addData(e);
    res.write('Processing...\n');
    setInterval (function() {
    	if(done) {
    		done=false;
		    res.write(JSON.stringify(e));
		    res.end('Yayy!!');
    	}
    }, 200)
};
function change(e) {
	e.arank=10;
	return e;
}

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

donecount = 0;
function findRes(e) {
	var pageurl = e.url;
//	console.log(pageurl);
//	pageurl = 'http://metacafe.com';
	phantom.create(function (ph) {
	  ph.createPage(function (page) {
	    page.set('viewportSize', { width: 1366, height: 768});
	  	var jsarr = [];
		var cssarr = [];
		var extjsarr = [];
		var host = gethost(pageurl);
		page.set('onError',  function(msg, trace) {
			//console.log('Found error: '+msg);
		    var msgStack = ['ERROR: ' + msg];
		    if (trace && trace.length) {
		        msgStack.push('TRACE:');
		        trace.forEach(function(t) {
		            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
		        });
		    }
		    // uncomment to log into the console 
		     console.error(msgStack.join('\n'));
		});
		page.set ('settings.userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36');
		page.set ('settings.resourceTimeout', 15000);
		page.set('onResourceReceived', function(response) {
			if(response.stage == 'end') {
				var url = response.url;
		//		console.log(url);
				hosturl = gethost(url);
				type = response.contentType;
				if(testjs(url, type)) {// resource is js
					jsarr.push(url);
					if(testextjs ( hosturl, host)) {
						extjsarr.push(url);
					}
				}
				else if(testcss(url, type))	 {// resource is css
					cssarr.push(url);
				}
				// other
			}
		})
		page.set('onNavigationRequested', function(url, type, willNavigate, main) {
		  	if(main) console.log('Trying to navigate to: ' + url);
		//  console.log('Caused by: ' + type);
		// 	console.log('Will actually navigate: ' + willNavigate);
		});
	    page.open(pageurl, function (status) {
		    if (status !== 'success') {
		        console.log('Unable to load' + pageurl);
		    }
			page.evaluate(function () { return document.title; }, function (result) {
			//now actually done

			var path = 'img/' + host +'.png';
			page.render('./'+path);
			console.log('page rendered at ' + path);
			e.js = extjsarr;
			e.capture = path;
			if(!live) {
				console.info('\nurl:\t' + pageurl);
				console.log('Page title:\t' + result);
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
				console.log('\n\tExternal Javascripts:\n');
				extjsarr.forEach(function(value, index) {
				  console.log((index+1)+ ': '+value);
				});
				e.save(function(err) {
		            if (err) return console.error(err);
		            console.log('saved to db');
		            donecount++;
		            console.log('Done '+ donecount);
	            });	
			}
			else {
				e.title= result;
				console.log(e);
				done=true;
			}
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
    Data.find(function(err, all) {
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
		var page = new Data({ url: url})
		page.save(function(err) {
			if (err) return console.error(err);
			//saved
			console.log(url +' saved');
		})
	}
	else {					//do with check if already present
		Data.find({url: url}, function(err, arr) {
			console.log('searching ' + url);
			//console.log(arr);
			if(err) {
				
			} 
			if(arr.length==0) {
				var page = new Data({ url: url ,arank:''})
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
            e.ltime = $('SPEED').attr('TEXT');
    		e.ptime = $('SPEED').attr('PCT');

    		if(rank) {
                //console.log(rank);
                e.arank = rank;
            }
    		else if(typeof rank === 'undefined') {
    			console.log ('Rank for '+aurl+ ' not available.');
    		}
    		if(!live) {
	    		e.save(function(err) {
	            	if (err) return console.error(err);
	                //console.log('saved');
	            })	
    		}
    	}
    	else console.log('Error fetching alexa data for '+ aurl);
    });
}