var argv - require('optimist').argv;

for(var i=0; i < argv.times; i++) {
	console.log(argv._[0] + ' on loop number ' + (i + 1));
}