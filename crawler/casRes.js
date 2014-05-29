var casper = require('casper').create({
	pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: true,         // use these settings
    	userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36'
    },
    logLevel: "debug",
    verbose: false                  // log messages will be printed out to the console
});

//GET parameters
var url = casper.cli.get('url');

//calculated parameters to return
var jsarr = [];
var cssarr = [];
var tsize=0;
var jssize=0, csssize=0;

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function testjs (url, type) {
	if(url.endsWith('.js')) return true;
	else if(url.contains('.js?')) return true;
	else if(type.contains('javasccript')) return true;
	return false;
}
function testcss (url, type) {
	if(url.endsWith('.css')) return true;
	else if(url.contains('.css?')) return true;
	else if(type.contains('css')) return true;
	return false;
}
casper.on('resource.received', function(resource) {
	if(resource.stage == 'end') {
		var size =resource.bodySize;
	//	this.echo(JSON.stringify(resource));
		url = resource.url;
		type = resource.contentType;
		if(testjs(url, type)) {// resource is js
			jsarr.push(url);
//			if(typeof size != 'undefined') jssize+=size;
		}
		else if(testcss(url, type))	 {// resource is css
			cssarr.push(url);
//			if(typeof size != 'undefined') csssize+=size;
		}
		// other
//		if(typeof size != 'undefined') tsize += size;
	}
});

casper.start(url, function() {
	//CSS
	this.echo ('\nCSS:\n');
	cssarr.forEach(function(value, index) {
	  console.log((index+1)+ ': '+value);
	});
//	console.log('Total size = ' + csssize);

	//JS
	this.echo ('\nJavascripts:\n');
	jsarr.forEach(function(value, index) {
	  console.log((index+1)+ ': '+value);
	});
//	console.log('Total size = ' + jssize);

//	this.echo('\nTotal size = '+tsize);
});

casper.run();