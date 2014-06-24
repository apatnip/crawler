var https = require('https');
var key = 'AIzaSyDP18DJHojJMOyVdjjtcZDVfxVDCHfXpj4';
var live;

exports.init = function(configs, isLive) {
  key = configs.googleAPI;
  live = isLive == true;
}

exports.append = function (e, strategy) {
  var url = e.url;
  getgpsi(url, strategy, function(data) {
    if (data) {
      var json = JSON.parse(data);
      if (strategy == 'desktop') e.psid = json;
      else if (strategy == 'mobile') e.psim = json;
      if (!live) {
        if (strategy == 'desktop') e.markModified('psid');
        else if (strategy == 'mobile') e.markModified('psim');
        e.save();
      }
    } else console.log("error");
  });
}

function getgpsi(url, strategy, callback) {
  https.get({
    host: 'www.googleapis.com',
    path: '/pagespeedonline/v1/runPagespeed?url=' + encodeURIComponent(url) +
      '&key=' + key + '&strategy=' + strategy
  }, function(res) {
    var data = "";
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function(err) {
    console.log(err);
    callback(null);
  });
}