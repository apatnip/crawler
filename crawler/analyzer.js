 var spawn = require('child_process').spawn;

 exports.afterWrite = function(e, host) {
   var pyChild = spawn('python', ['analyzerUtil.py', host, e.capture], {
     stdio: [null, null, null, 'ipc']
   });
   pyChild.stdout.on('data', function(data) {
     console.log('Py stdout: ' + data);
   });
   pyChild.on('message', function(message) {
     console.log('Received message...');
     console.log(message);
   });
   //ph.exit();
 }