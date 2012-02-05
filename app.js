var connect = require('connect');

var oneDay = 86400000;

var server = connect.createServer()
//	.use(connect.favicon(__dirname + '/static/favicon.ico'))
//	.use(connect.logger())
//	.use(connect.static(__dirname + '/static'),{maxAge: oneDay})
	.use(connect.static(__dirname + '/static'))
	.listen(3000)

var io = require('socket.io').listen(server)
	.enable('browser client minification')
	.enable('browser client etag')
	.enable('browser client gzip')
	.set('log level', 1);

io.sockets.on('connection', function(client) {
	console.log('client connected');

	client.on('message',function(message) {
		console.log(message);
	});

	client.on('set',function(message) {
		console.log(message);
	});
});
