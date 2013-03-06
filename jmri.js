// jmri.js -- Javscript to JMRI XmlIO Servlet Glue
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

var	http = require('http'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

function JMRI(host,port) {
	var self = this;
	EventEmitter.call(self);
	self.host = host;
	self.port = port;
	self.req = null;
}
util.inherits(JMRI, EventEmitter);


JMRI.prototype.xmlioRequest = function(xml) {
	var self = this,
		options = {
			host: self.host, port: self.port,
			path: '/xmlio/', method: 'POST',
			headers: {'Content-Type': 'text/xml','Content-Length': xml.length}
		};
		
	self.responseXML = [];

	if (self.req !== null) {
		self.req.abort();		// aborting existing/previous request
	}

	self.req = http.request(options, function (res) {
		res.setEncoding('utf8');

		res.on('data', function (dataChunk) {
			self.responseXML.push(dataChunk);
		});

		res.on('end', function () {
			self.emit('xmlioResponse',self.responseXML.join(''));
		});
	});

	self.req.on('error', function(e) {
		self.emit('error',e);
	});

	self.emit('xmlioRequest',xml);	// debug hook
	self.req.write(xml);
	self.req.end();
}


JMRI.prototype.getInitialState = function() {
	this.xmlioRequest("<xmlio><list><type>turnout</type></list><list><type>sensor</type></list></xmlio>");
}


JMRI.prototype.getCurrentTime = function() {
	this.xmlioRequest("<xmlio><item><type>memory</type><name>IMCURRENTTIME</name></item></xmlio>");
}


module.exports = {
	JMRI : JMRI
};
