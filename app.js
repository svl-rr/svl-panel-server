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
var clients = [];


// Create an HTTP Server Using the connect framework. This server is
// responsible for vending static content such as the HTML, JS, CSS,
// and SVG which runs the user interface on client devices.

var oneDay = 86400000;
var connect = require('connect');
var server = connect.createServer()
//	.use(connect.logger())
//	.use(connect.favicon(__dirname + '/static/favicon.ico'))
//	.use(connect.static(__dirname + '/static'),{maxAge: oneDay})
	.use(connect.static(__dirname + '/static'))
	.listen(3000)


// Create a socket.io (websocket) server associated with the HTTP server.
// Web-based clients will use this connection in order to determine layout
// state and/or request changes. We need to track the connected clients
// in order to deliver any out-of-band updates reported by JMRI.

var io = require('socket.io').listen(server)
	.enable('browser client minification')
	.enable('browser client etag')
	.enable('browser client gzip')
	.set('log level', 1)
	io.sockets.on('connection', function(socket) {
		clients[socket.id] = socket;
	
		socket.on('disconnect',function() {
			delete clients[socket.id];
		});
		
		// process the command and broadcast updates to all other clients
		socket.on('set',function(data) {
			var changedState = dataHandler.ProcessSetCommand(data);
			if (changedState.length > 0) {
				socket.broadcast.emit('update',changedState);
				socket.emit('update',changedState);
			}
		});
	
		// reply to sender with response to query of existing state
		socket.on('get',function(data) {
			socket.emit('update',dataHandler.ProcessGetCommand(data));
		});
	});


// Set up a callback for any unsolicited changes in layout state which don't
// originate from the websocket interface. These will normally be sensor changes
// caused by block occupancy detectors on the layout, but it can also be invoked
// by other JMRI-invoked turnout changes.

dataHandler.trackLayoutState(function (changedState) {
///	console.log("result of trackLayoutState:"+JSON.stringify(changedState));
	if (changedState.length > 0) {
		for (var i in clients) {
			clients[i].emit('update',changedState);
		}
	}
});
