var http = require('http'),
main = require('./main');

http.createServer(function (req, res) {
  main.out(req.url.replace('/',''), res);
}).listen(8888);