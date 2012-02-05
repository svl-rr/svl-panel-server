var connect = require('connect');

var oneDay = 86400000;

var server = connect.createServer()
	.use(connect.logger())
//	.use(connect.favicon(__dirname + '/static/favicon.ico'))
//	.use(connect.static(__dirname + '/static'),{maxAge: oneDay})
	.use(connect.static(__dirname + '/static'))
	.listen(3000)

var io = require('socket.io').listen(server)
	.enable('browser client minification')
	.enable('browser client etag')
	.enable('browser client gzip')
//	.set('log level', 1)
	io.sockets.on('connection', function(socket) {
		console.log('client connected');
	
		socket.on('message',function(message) {
			console.log('CLIENT:' + message);
			socket.send('good to see you');
		});
	
		socket.on('set',function(data) {
			console.log('SET:' + data);
			socket.broadcast.emit('update',data);
		});
	
		socket.on('get',function(message) {
			console.log('GET:' + message);
		});
	});
