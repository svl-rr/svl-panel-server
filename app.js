// app.js -- a nodejs WebSocket Server Application
//
// (The MIT License)
//
// Copyright (c) 2012 Silicon Valley Lines Model Railroad Club
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var dataHandler = require('./dataHandler');

var oneDay = 86400000;

var connect = require('connect');
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
		socket.send('greetings');
	
		// log any informational message sent by clients
		socket.on('message',function(message) {
			console.log('CLIENT:' + message);
		});
	
		// process the command and broadcast update to all other
		socket.on('set',function(data) {
			socket.broadcast.emit('update',dataHandler.ProcessSetCommand(data));
		});
	
		// reply to sender with response to query of existing state
		socket.on('get',function(data) {
			socket.emit('update',dataHandler.ProcessGetCommand(data));
		});
	});
