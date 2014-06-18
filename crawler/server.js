var program = require('commander'),
  http = require('http'),
  main = require('./main');
var db_server, db_port;
var Urls = [];

function urls(val) {
  return val.split(',');
}
program
  .version('0.0.1')
  .option('-a, --automate ', 'Automate the whole process')
  .option('-r, --realtime', 'Will make a live server on localhost with Port specified in config')
  .option('-s, --database-server [value]', 'Server address of Mongodb server')
  .option('-p, --database-port [value]', 'Server port of Mongodb server')
  .option('-c, --config [value]', 'Path to config file')
  .option('-w, --webshot', 'Take Screen shot of websites')
  .parse(process.argv);
var configFile = './' + (program.config || 'config.json');
var config = require(configFile);
main.init(configFile, program.realtime);
if (program.automate) {
  if (program.realtime)
    program.help();
  main.automate();
} else if (program.realtime) {
  if (program.automate)
    program.help();
  console.log("Started live server on " + config.RESTServerport);
  http.createServer(function(req, res) {
    if (req.url != '/favicon.ico' && req.url != null) {
      main.liveServer(req.url.replace('/', ''), res);
    }
  }).listen(config.RESTServerport);
} else {
  program.help();
}
