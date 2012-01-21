var connect = require('connect');
var io = require('socket.io');

var oneDay = 86400000;

var server = connect.createServer()
//	.use(connect.favicon())
//  .use(favicon(__dirname + '/static/favicon.ico'))
//	.use(connect.logger())
	.use(connect.static(__dirname + '/static'),{maxAge: oneDay})
	.listen(3000)

var socket = io.listen(server)
	.enable('browser client minification')
	.enable('browser client etag')
	.enable('browser client gzip')
	.set('log level', 1);

socket.on('connection', function(client) {
	client.on('message',function(message) {
		console.log(message);
	});
});
