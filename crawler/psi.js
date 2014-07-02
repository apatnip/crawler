var https = require('https');
var key = 'AIzaSyDP18DJHojJMOyVdjjtcZDVfxVDCHfXpj4';
var live = false;

exports.init = function(configs, isLive) {
  key = configs.googleAPI;
  live = isLive == true;
}
var psimdone=0, psiddone=0;
exports.append = function (process, strategy) {
  e = process.obj;
  emitter = process.emitter;
  var url = e.url;
  getgpsi(url, strategy, function(data) {
    if (data) {
      var json = JSON.parse(data);
      if (strategy == 'desktop') {
        e.psi.desktop = json;
        process.done.psid = true;
      }
      else if (strategy == 'mobile') {
        e.psi.mobile = json;
        process.done.psim = true;
      }
      if (!live) {
        if (strategy == 'desktop') {
          e.psi.markModified('desktop');
        }
        else if (strategy == 'mobile') {
          e.psi.markModified('mobile');
        }
      }
      console.log(e);
      emitter.emit('done');
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