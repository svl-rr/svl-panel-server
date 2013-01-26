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

"use strict";

var path = require('path'),
	connect = require('connect'),
	dataHandler = require('./dataHandler'),
	jmri = require('./jmri'),
	xml2js = require('xml2js'),
	parser = new xml2js.Parser(),
	clients = [],
	currentTime = "12:00";

// Create an HTTP Server Using the connect framework. This server is
// responsible for vending static content such as the HTML, JS, CSS,
// and SVG which runs the user interface on client devices.

var oneDay = 86400000;
var server = connect()
//	.use(connect.logger('dev'))
//	.use(connect.static(__dirname + '/static'),{maxAge: oneDay})
	.use(connect.static(__dirname + '/static'))
	.use(connect.directory(__dirname + '/static',{filter: customFileFilter}))
	.listen(3000);


// Create a socket.io (websocket) server associated with the HTTP server.
// Web-based clients will use this connection in order to determine layout
// state and/or request changes. We need to track the connected clients
// in order to deliver any out-of-band updates reported by JMRI.

var io = require('socket.io').listen(server)
	.enable('browser client minification')
	.enable('browser client etag')
	.enable('browser client gzip')
	.set('transports', ['websocket'])
	.set('log level', 1)
	.sockets.on('connection', function (socket) {
		clients[socket.id] = socket;	// track the socket in clients array

		socket.on('register', function (panelName) {
			if (panelName !== null) {
				socket.set('panelName', panelName, function () {});
				dataHandler.registerPanel(socket, panelName);
			}
		});

		socket.on('disconnect', function () {
			delete clients[socket.id];	// stop tracking the client

			// if the panel was registered, unregister it on disconnect
			socket.get('panelName', function (err, panelName) {
				if (panelName !== null) {
					dataHandler.unregisterPanel(socket, panelName);
				}
			});
		});

		// process the command and broadcast updates to all other clients
		socket.on('set', function (data) {
			var changedState = dataHandler.processSetCommand(data);
			if (changedState.length > 0) {
				socket.broadcast.emit('update', changedState);
				socket.emit('update', changedState);
			}
		});

		// reply to sender with response to query of existing state
		socket.on('get', function (data) {
			socket.emit('update', dataHandler.processGetCommand(data));
		});
	});



// trackLayoutState
//
// Establish a connection with the JMRI xmlio servlet to determine
// the state of all sensors and turnouts. After collecting initial
// state, this routine issues a new request back to the servlet which
// will complete whenever there is a difference between the state passed
// in and the previously returned layout state.
//
// NOTE: If we are running in OFFLINE mode, we log and bail out.

function trackLayoutState() {
	var turnoutAndSensorTracker;
	var changedState;

	if (process.env.OFFLINE !== undefined) {
		console.log("Running in OFFLINE mode, no JMRI transactions will occur!");
	} else {

		turnoutAndSensorTracker = new jmri.JMRI('127.0.0.1', 12080);

		turnoutAndSensorTracker.on('xmlioResponse', function (response) {

			// Convert the xml response into JSON, update state, and invoke callback
			parser.parseString(response, function (err, result) {

				var i;

				if (err) { throw err; }
				changedState = dataHandler.updateGlobalDataFromJMRI(result);
				if (changedState.length > 0) {
					for (i in clients) {
						if (clients.hasOwnProperty(i)) {
							clients[i].emit('update', changedState);
						}
					}
				}

				// re-queue request with response state
				turnoutAndSensorTracker.xmlioRequest(response);
			});
		});

		turnoutAndSensorTracker.on('error', function (e) {
			console.log("unable to contact JMRI: "+e.message);
		});

		// request initial state from JMRI
		turnoutAndSensorTracker.getInitialState();
	}
}


trackLayoutState();


// Filter function for the connect.directory middleware. This function allows
// us to get by without an index.html and will allow folks to navigate to panel
// files directly. By default, we only allow the user to see SVG and HTML files.
// This has the side effect of hiding subdirectories from the casual browser.

function customFileFilter(file) {
        switch (path.extname(file)) {
        case '.html':
        case '.svg':
                return true;
                
        default:
                break;
        }
        return false;
}
