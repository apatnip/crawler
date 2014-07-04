var args = process.argv;
var http = require("http");
var request = require('request');
var cheerio = require('cheerio');
var colors = require('colors');
var phantom = require('phantom');
var events = require('events');
var mongoose = require('mongoose');
var fs = require('fs');
var parseString = require('xml2js').parseString;
var url = require('url')
var psi = require('./psi');
var analyzer = require('./analyzer');
var alexa = require('./alexa');
// Connect to db
var db = require('./model/db');
// Default values of variables

var pool = [];
var processing = [];

// GET parameters
var qfindurls = false; // Whether add urls from www ranking

// Modes for fetching data
var alexaMode = true; // Whether get alexa data
var jsMode = true; // get resources (js)
var psidMode = true; // get PageSpeed insights for desktop
var psimMode = true; // get PageSpeed Insights for mobile
var linkAnalysis = false;

// config
var resourceTimeOut = 120000; // Resource timeout
var pageSize = 1000; // Get data from wwwranking in slots of?
var pageNo = 10; // No of slots

var loadImage = true;
var desktopSS = true;
var mobileSS = true;
var desktopScreen = {
  "width": 1366,
  "height": 768
}
var mobileScreen = {
  "width": 320,
  "height": 480
}
var colName = 'thoupages'; // Collection name
var addwCheck = true; // Add to db with check if already exists
var qprint = false; // whether print database

// automated config
var query = {};
var noofpages = 4; // 0 for execution on all the results of the query
var slots = 2;
var executeInterval = 5000; // Time to wait for next slot to execute
var renderDelay = 2500;
// Queue config
var concurrentProcessing = 2; // Number of processes running at a time
var live = true;
var configs, Data;

var debug,printPool, printResultDocument;
var linkDensity,contrast;

exports.init = function(file, isLive) {
  // Get config file
  configs = require(file);
  live = isLive == true;
  // Call init for other files
  psi.init(configs, live);
  alexa.init(live, configs.alexa.withCheck);
  // Set parameter values
  key = configs.google.APIkey;
  // New URLs
  newUrls = configs.newUrls;
  qfindurls = newUrls.get;
  addwCheck = newUrls.checkIfAlreadyExists;
  pageSize = newUrls.slotSize;
  pageNo = newUrls.noOfSlots;
  // Modes
  alexaMode = configs.alexa.get;
  jsMode = configs.analyse.js;
  // Page speed Insights
  insights = configs.modes.pageSpeedInsights
  psidMode = insights.desktop;
  psimMode = insights.mobile;

  // Screenshot
  desktopSS = configs.analyse.screenshot.desktop;
  mobileSS = configs.analyse.screenshot.mobile;

  // Image Analysis
  linkDensity = configs.analyse.links.density;
  contrast = configs.analyse.links.contrast;

  // Resolution
  resolution = configs.analyse.resolution;
  desktopScreen = resolution.desktop;
  mobileScreen = resolution.mobile;

  resourceTimeOut = configs.analyse.resourceTimeOut;
  // Database
  colName = configs.db.collection;
  db.init(configs.db.server, configs.db.port, live,colName);
  
  qprint = configs.printDB;
  query = configs.queryToDB;
  noofpages = configs.noOfURLsToFetch;
  slots = configs.slotsOfFetching;
  executeInterval = configs.executeInterval;
  concurrentProcessing = configs.noOfConcurrentProcess;
  linkAnalysis = configs.imageAnalysis;
  renderDelay = configs.analyse.screenshot.delay;
  Data = mongoose.model(colName);

  debug = configs.debug.do;
  printPool = configs.debug.printPool;
  printResultDocument = configs.debug.printResultDocument;
}

pool.push = function(request) {
  e = request.obj;
  x = Array.prototype.push.apply(this, arguments);
  console.log('Added %s to pool'.blue, e.url);
  //printpool();
  if (processing.length < concurrentProcessing) {
    console.log('%d jobs processing', processing.length);
    processing.push((pool.splice(0, 1))[0]);
  }
  return x;
}

processing.push = function(process) {
  var done = process.done = {
    alexa: false,
    js: false,
    psim: false,
    psid: false
  };
  e = process.obj;
  console.log('%s is now processing'.yellow, e.url);
  x = Array.prototype.push.apply(this, arguments);
  if (printPool && debug) printpool();
  if (jsMode) findRes(process);
  if (psidMode) psi.append(process, 'desktop');
  if (psimMode) psi.append(process, 'mobile');
  if (alexaMode) alexa.append(process);
  return x;
}

function printpool() {
  console.log('Pool contains: ');
  for (i = 0; i < pool.length; i++) {
    console.log('( %d ) %s', i + 1, pool[i].obj.url);
  }
  console.log('Now processing: ');
  for (i = 0; i < processing.length; i++) {
    console.log('( %d ) %s', i + 1, processing[i].obj.url);
  }
}

// Live Version
exports.liveServer = function(url, res) {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  console.log('got request for -> ' + url);
  var request = {};
  request.obj = new Data({
    url: url
  });;
  request.emitter = new events.EventEmitter();
  pool.push(request);
  var crash = phantom.crash(url);
  crash.on('error', function() {
    request.obj.crash = true;
    console.log('Crashed: '.red + crash.url);
    res.end(url + ' sucks :-P ' + 'It crashed!!\n');
  });
  request.emitter.on('done', function() {
    if(checkdone(request.done)) {
      if(printResultDocument && debug) console.log(request.obj); 
      processing.splice(processing.indexOf(request), 1);
      if (pool.length > 0) processing.push((pool.splice(0, 1))[0]);
      else if(printPool && debug) printpool();
      res.end(JSON.stringify(request.obj, null, 2) + '\n');
      /*
      path = './'+e.capture;
      console.log(path);
      fs.readFile(path, function(error, file) {
        if(error) console.log('Error reading file');
        var imagedata = new Buffer(file).toString('base64');
        res.write("hi there!<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
      });
      */
    }
  });
};

function checkdone(done) {
  //console.log(done);
  if (done.alexa == alexaMode && done.js == jsMode && done.psid == psidMode && done.psim == psimMode) {
    return true;
  }
  else return false;
}
// Automated Version
var con;
exports.automate = function() {
  con = mongoose.connection;
  con.on('error', console.error.bind(console, 'connection error:'));
  con.once('open', function callback() {

    /**********Most Important Calls**********/

    if (qprint) printData(Data);
    else if (qfindurls) findUrl();
    else if (!live) executeThrottled();

    /****************************************/

  });
}

function executeThrottled() {
  console.log('Max number of concurrent process = ' + concurrentProcessing);
  donecount = 0;
  Data.find(query, function(err, arr) {
    arr.forEach(function(element, index, array) {
      if (index < noofpages || noofpages == 0) {
        var request = {};
        request.obj = element;
        var emitter = new events.EventEmitter();
        request.emitter = emitter;
        pool.push(request);
        request.emitter.on('done', function() {
        //  console.log('received done: '+done);
          //console.log(request);
          if(checkdone(request.done)) {
            element.save(function(err) {
              if (err) return console.error(err);
              //console.log(element);
              donecount++;
              console.info('Done '.green + donecount);
              if(donecount == noofpages){
                con.close();
              } 
            })
            if(printResultDocument && debug) console.log(request.obj); 
            processing.splice(processing.indexOf(request), 1);
            if (pool.length > 0) processing.push((pool.splice(0, 1))[0]);
            else if(printPool && debug) printpool();
          }
        });
      }
    })
  });
}
String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
String.prototype.contains = function(it) {
  return this.indexOf(it) != -1;
};

function testjs(url, type) {
  if (url.endsWith('.js')) return true;
  else if (url.contains('.js?')) return true;
  else if (type != null && type.contains('javascript')) return true;
  return false;
}

function testcss(url, type) {
  if (url.endsWith('.css')) return true;
  else if (url.contains('.css?')) return true;
  else if (type != null && type.contains('css')) return true;
  return false;
}

function testextjs(url, host) {
  if (url.contains(host)) return false;
  else return true;
}
var gethost = function(href) {
  urlo = url.parse(href);
  return urlo.host;
}
function testimg(url, type) {
  if (url.endsWith('.jpg')) return true;
  if (url.endsWith('.png')) return true;
  if (url.endsWith('.gif')) return true;
  return false;
}

function findRes(process) {
  var e = process.obj;
  var pageurl = e.url;
  // Crash Object
  var crash = phantom.crash(pageurl);
  crash.once('error', function() {
    e.crash = true; 
    console.error('Crashed: '.yellow + crash.url);
    console.error(pageurl + ' sucks :-P It crashed!!\n');
    if (!live) {
      e.save(function(err) {});
    }
  });
  if (mobileSS) {
    phantom.create(function(ph) {
      ph.createPage(function(page) {
        page.set('viewportSize', {
          width: mobileScreen.width,
          height: mobileScreen.height
        });
        var host = gethost(pageurl);
        page.set('settings.userAgent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D5145e Safari/9537.53');
        page.set('settings.resourceTimeout', resourceTimeOut);
        page.open(pageurl, function(status) {
          if (status !== 'success') {
            console.log('Unable to load in mobile' + pageurl);
          }
          page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function() {
            page.evaluate(function() {
              var object = {
                aTags: [],
                buttons: [],
              };
              $("button").each(function() {
                var button = $(this);
                var rect = button[0].getBoundingClientRect();
                var max = rect.height * rect.width;
                button.children().each(function() {
                  var newRect = $(this)[0].getBoundingClientRect();
                  var newMax = newRect.width * newRect.height;
                  if (max < newMax) {
                    max = newMax;
                    rect = newRect;
                  }
                });
                if (rect.height != 0 && rect.width != 0)
                  object.buttons.push(JSON.stringify(rect));
              });
              $("a").each(function() {
                var aTag = $(this);
                var rect = aTag[0].getBoundingClientRect();
                var max = rect.height * rect.width;
                aTag.children().each(function() {
                  var newRect = $(this)[0].getBoundingClientRect();
                  var newMax = newRect.width * newRect.height;
                  if (max < newMax) {
                    max = newMax;
                    rect = newRect;
                  }
                });
                if (rect.height != 0 && rect.width != 0)
                  object.aTags.push(JSON.stringify(rect));
              });
              return object;
            }, function(object) {
              afterEvalM(object);
            });
          });

          function afterEvalM(object) {
            var path = 'screenshots/' + host + '-m';
            setTimeout(function() {
              page.render('./' + path, {
                format: 'jpeg',
                quality: '60'
              }, function() {
                if (linkAnalysis) {
                    fs.writeFile('./' + host + '-m', JSON.stringify(object), analyzer.afterWrite(path, host + '-m', contrast, linkDensity));
                }
              });
            }, renderDelay);
            e.capture.mobile = path;
            setTimeout(function() {
              page.close();
              ph.exit();
            }, renderDelay + 1);
          }
        });
      });
    });
  }
  phantom.create(function(ph) {
    ph.onError = function(msg, trace) {
      var msgStack = ['PHANTOM ERROR: ' + msg];
      if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
          msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
      }
      console.error(msgStack.join('\n'));
    };
    ph.createPage(function(page) {
      page.set('viewportSize', {
          width: desktopScreen.width,
          height: desktopScreen.height
      });
      var jsarr = [];
      var cssarr = [];
      var extjsarr = [];
      var host = gethost(pageurl);
      page.set('onError', function(msg, trace) {
        //console.log('Found error: '+msg);
        var msgStack = ['ERROR: '.red + msg];
        if (trace && trace.length) {
          msgStack.push('TRACE:');
          trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
          });
        }
        // uncomment to log into the console 
        console.error(msgStack.join('\n'));
      });
      page.set('settings.userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36');
      page.set('settings.resourceTimeout', resourceTimeOut);
      page.set('onResourceReceived', function(response) {
        if (response.stage == 'end') {
          var url = response.url;
          //		console.log(url);
          hosturl = gethost(url);
          type = response.contentType;
          if (testjs(url, type)) { // resource is js
            jsarr.push(url);
            if (testextjs(hosturl, host)) {
              extjsarr.push(url);
            }
          } else if (testcss(url, type)) { // resource is css
            cssarr.push(url);
          }
          // other
        }
      })
      page.set('onResourceError', function(resourceError) {
        console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
        console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
      });
      page.set('onNavigationRequested', function(url, type, willNavigate, main) {
        //  if(main) console.log('Trying to navigate to: ' + url);
        //  console.log('Caused by: ' + type);
        // 	console.log('Will actually navigate: ' + willNavigate);
      });
      page.open(pageurl, function(status) {
        if (status !== 'success') {
          console.log('Unable to load' + pageurl);
        }
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function() {
          if (linkAnalysis) {
            page.evaluate(function() {
              var object = {
                aTags: [],
                buttons: [],
                doc: []
              };
              $("button").each(function() {
                var button = $(this);
                var rect = button[0].getBoundingClientRect();
                var max = rect.height * rect.width;
                button.children().each(function() {
                  var newRect = $(this)[0].getBoundingClientRect();
                  var newMax = newRect.width * newRect.height;
                  if (max < newMax) {
                    max = newMax;
                    rect = newRect;
                  }
                });
                if (rect.height != 0 && rect.width != 0)
                  object.buttons.push(JSON.stringify(rect));
              });
              $("a").each(function() {
                var aTag = $(this);
                var rect = aTag[0].getBoundingClientRect();
                var max = rect.height * rect.width;
                aTag.children().each(function() {
                  var newRect = $(this)[0].getBoundingClientRect();
                  var newMax = newRect.width * newRect.height;
                  if (max < newMax) {
                    max = newMax;
                    rect = newRect;
                  }
                });
                if (rect.height != 0 && rect.width != 0)
                  object.aTags.push(JSON.stringify(rect));
              });
              object.doc.push(document);
              return object;
            }, function(object) {
              afterEval(object);
            });
          } else { // Link analysis not required
            page.evaluate(function() {
              return document;
            }, function(object) {
              afterEval(object);
            });
          }
          var afterEval = function(object) {
            if (linkAnalysis) {
              var doc = object.doc.pop(); // Document object
              e.title = doc.title;
            } else {
              e.title = object.title;
            }
            if (loadImage && desktopSS) {
              var path = 'screenshots/' + host;
              setTimeout(function() {
                page.render('./' + path, {
                  format: 'jpeg',
                  quality: '60'
                }, function() {
                  if (linkAnalysis)
                      fs.writeFile('./' + host, JSON.stringify(object), analyzer.afterWrite(path, host, contrast, linkDensity));
                });
              }, renderDelay);
              e.capture.desktop = path;
            }
            e.js = extjsarr;
            process.done.js = true;
            process.emitter.emit('done');
            setTimeout(function() {
              page.close();
              ph.exit();
            }, renderDelay + 1);
          }
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
  j = 0;
  var timer = setInterval(function() {
    url3 = url1 + j + url2 + pageSize; //complete url
    console.log('url3 = ' + url3);
    download(url3, function(data) {
      if (data) {
        var json = JSON.parse(data);
        for (i = 0; i < pageSize; i++) {
          html = (json['data'][i]['harmonic']);
          $ = cheerio.load(html);
          link = $('a').attr('href');
          addUrls(link);
        }
      } else console.log("error");
      j++;
    });
    if (j == (pageNo - 1)) { //
      clearInterval(timer);
      console.log('Fetching URLs is over.');
    }
  }, 10000)
}

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

// Print existing data
function printData(urls) {
  urls.find(function(err, urls) {
    if (err) return console.error(err);
    console.log(urls)
  })
}

// Refactor urls
function addUrls(url) {
  if (!addwCheck) { //do without check in db
    var page = new Data({
      url: url
    })
    page.save(function(err) {
      if (err) return console.error(err);
      //saved
      console.log(url + ' saved');
    })
  } else { //do with check if already present
    Data.find({
      url: url
    }, function(err, arr) {
      console.log('searching ' + url);
      if (err) {
        console.log(err);
      }
      if (arr.length == 0) {
        var page = new Data({
          url: url
        })
        page.save(function(err) {
          if (err) return console.error(err);
        })
        console.log(url + ' added to ' + colName);
      } else {
        console.log(url + ' is already present.');
      }
    })
  }
}