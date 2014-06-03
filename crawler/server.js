var program = require('commander');
var db-server,db-port;
var Urls = [];

function urls(val) {
	return val.split(',');
}

program
	.version('0.0.1')
	.option('-a, --automate ', 'Automate the whole process')
	.option('-r, --realtime','Realtime (Must provide url(s) to generate a report with -u)')
	.option('-u, --url <websites>','List of urls for which analysis has to be generated',urls)
	.option('-s, --database-server [value]','Server address of Mongodb server')
	.option('-p, --database-port [value]','Server port of Mongodb server')
	.option('-c, --config [value]','Path to config file')
	.option('-w, --webshot','Take Screen shot of websites')
	.parse(process.argv);

var config = require('./'+(program.config||'config.json'));

if(program.automate)
{
	if(program.realtime||program.url)
		program.help();
}
if(program.realtime)
{
	if(program.automate)
		program.help();
}

