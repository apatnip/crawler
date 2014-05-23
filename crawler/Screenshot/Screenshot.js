// --- node Screenshot.js http://www.facebook.com facebook.png 1366 768 m ---

var webshot = require('webshot');

var site = process.argv[2];
var output = process.argv[3]
var mobile = process.argv[6];
var options = {
    screenSize: {
        width: process.argv[4] || 1024
    , height: process.argv[5] || 768
    }
, userAgent: mobile ? 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
    + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g' : 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0'
}

webshot(site, output, options, function (err) {
    if (err != null)
        console.log(" Error : " + err);
});
