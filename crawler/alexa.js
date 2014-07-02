var request = require('request');
var parseString = require('xml2js').parseString;
var live;

exports.init = function(configs, isLive) {
  live = isLive == true;
}
var adone = 0;
exports.append = function(e) {
  link = e.url;
  if (e.alexa == null) {
    console.log('Fetching alexa data for -> ' + e.url);
    var aurl = 'http://data.alexa.com/data?cli=10&dat=snbamz&url=' + link;
    var rank;
    request(aurl, function(error, response, xml) {
      if (!error && response.statusCode == 200) {
        parseString(xml, function(err, result) {
          e.alexa = result.ALEXA;
          e.markModified('alexa');
          if (!live) {
            e.save(function(err) {
              if (err) return console.error(err);
              adone++;
              console.log('Alexa Done '.green + adone);
            })
          }
        });
      } else console.log('Error fetching alexa data for ' + link);
    });
  } else console.log('Alexa Data already present for ' + link);
}