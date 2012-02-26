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

var http = require('http');

exports.xmlioRequest = function xmlioRequest(host,port,xml,callback) {

	var postData = xml;
	var postOptions = {
	  host: host,
	  port: port,
	  path: '/xmlio',
	  method: 'POST',
	  headers: {
		  'Content-Type': 'text/xml',
		  'Content-Length': postData.length
	  }
	};

	var responseXML = [];
	
	var req = http.request(postOptions, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (dataChunk) {
		  responseXML.push(dataChunk);
	  });
  
	  res.on('end',function () {
//	  	console.log('JMRI RESPONSE: '+ responseXML);
		if (typeof(callback) == 'function') {
			callback(responseXML.toString());
		}
	  });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	
//	console.log("JMRI REQUEST: "+postData);
	req.write(postData);
	req.end();
}


exports.getInitialState = function getInitialState(host,port,callback) {
	var xml = "<xmlio><list><type>turnout</type></list><list><type>sensor</type></list></xmlio>"
	exports.xmlioRequest(host,port,xml,callback);
}