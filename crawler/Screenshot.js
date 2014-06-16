var webshot = require('webshot');
var url = require('url');
var configs = require('./config.json');

var createScrShots = function() {
  var options = {
    windowSize: {
      width: configs.mobileScreen.width || 320,
      height: configs.mobileScreen.width || 480
    },
    shotSize: {
      width: configs.mobileScreen.width || 320,
      height: 'all'
    },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D5145e Safari/9537.53',
    defaultWhiteBackground: configs.BgWhite || 'true',
    renderDelay: configs.delayRender || 0
  }

  configs.urls.forEach(function(site) {
    var x = url.parse(site);
    webshot(site, 'screenshots/' + x.hostname + '-m.png', options, function(err) {
      if (err != null)
        console.log(" Error : " + err);
    });
  });
}
exports.createScrShots = createScrShots;