 var spawn = require('child_process').spawn;

 exports.afterWrite = function(path, host, contrast, linkDensity) {
   console.log('Calculating link density')
   var pyChild = spawn('python', ['analyzerUtil.py', host, path, contrast, linkDensity], {
     stdio: [null, null, null, 'ipc']
   });
   pyChild.stdout.on('data', function(data) {
     console.log('Py stdout: ' + data);
   });
   pyChild.on('message', function(message) {
     console.log('Received message...');
     console.log(message);
   });
 }