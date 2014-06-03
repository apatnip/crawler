var http = require('http'),
main = require('./main');

http.createServer(function (req, res) {

//req = 'http://www.connecto.io/';
  main.out(req.url.replace('/',''), res);
}).listen(8888);