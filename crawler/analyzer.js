var phantom = require('phantom');
var fs = require('fs');
var filename = 'sample.txt';
var image = './screenshots/mangalmay.org';
var spawn = require('child_process').spawn;
phantom.create(function(ph) {
  ph.createPage(function(page) {
    page.set('viewportSize', {
      width: 1366,
      height: 768
    });
    page.set('settings.userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36');
    page.open("http://mangalmay.org", function(status) {
      console.log("opened website ", status);
      page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js", function() {
        page.evaluate(function() {
          var object = [];
          $("a").each(function() {
            var aTag = $(this);
            var rect = aTag[0].getBoundingClientRect();
            if (rect.height != 0 && rect.width != 0)
              object.push(JSON.stringify(rect));
          });
          return (object);
        }, function(result) {
          fs.writeFile(filename, JSON.stringify(result), afterWrite);
        });

        function afterWrite() {
          console.log('Forking Python')
          var pyChild = spawn('python', ['analyzerUtil.py', filename, image], {
            stdio: [null, null, null, 'ipc']
          });
          pyChild.stdout.on('data', function(data) {
            console.log('Py stdout: ' + data);
          });
          pyChild.on('message', function(message) {
            console.log('Received message...');
            console.log(message);
          });
          ph.exit();
        }
      });
    });
  });
});