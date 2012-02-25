// dataHandler.js -- Get/Set Data Routines for processing WebSocket requests
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

var util = require('util');
var jmri = require('./jmri');
xml2js = require("xml2js");
var parser = new xml2js.Parser();


// Keeping with a minimalist approach for now. All tracked state is kept in an
// associative array— eventually, we'll probably want to create a more robust
// data storage system, but for now we're going to limp along with a simple array
// of named items.

var globalDataArray = [];


// trackLayoutState
//
// Establish a connection with the JMRI xmlio servlet to determine
// the state of all sensors and turnouts. After collecting initial
// state, this routine issues a new request back to the servlet which
// will complete whenever there is a difference between the state passed
// in and the previously returned layout state.

exports.trackLayoutState = function trackLayoutState(callback)
{
	function handleResponse(response,callback) {
		// parse the xml response
		parser.parseString(response, function (err, result) {
			console.log(util.inspect(result, false, null));
			// update global layout state
			callback(result);
		});

		// re-queue request with new response state
		jmri.xmlioRequest('127.0.0.1',12080,response,function (newResponse) {
			handleResponse(newResponse,callback)
			});
	}

	// request initial state from JMRI
	jmri.getInitialState('127.0.0.1',12080,function (newResponse) {
		handleResponse(newResponse,callback)
	});
}


// ProcessSetCommand
//
// Handle the 'set' commands initiated by the the socket.io/websocket interface
// NOTE: The code currently here to manipulate the global state array should be
// moved elsewhere, as this is not the right place to be manipulating the state
// once once we begin accepting changes from the JMRI xmlio servlet.

exports.ProcessSetCommand = function ProcessSetCommand(data) {
	var changedData = [];

	for (var i in data) {

		if ((DataItemIsValid(data[i])) &&
			(globalDataArray[data[i].name] === undefined) ||
			(globalDataArray[data[i].name] !== data[i].value))	{
			
			globalDataArray[data[i].name] = data[i].value;
			changedData.push(data[i]);
		}
	}
	
	// Push turnout changes to JMRI
	if (changedData.length > 0) {
		var xmlRequest = "<xmlio>"
		for (var i in changedData) {
			switch (changedData[i].type) {
				case 'turnout':
					var turnoutState = (changedData[i].value === "thrown") ? 4 : 2;
					xmlRequest += "<turnout name='"+changedData[i].name+"' set='"+turnoutState+"' />"
					break;
					
				default:
					break;
			}
		}
		xmlRequest += "</xmlio>"
		
		if (xmlRequest !== "<xmlio></xmlio>") {
			jmri.xmlioRequest('127.0.0.1',12080,xmlRequest,function (response) {
			});
		}
	}
	return changedData;
}


// ProcessGetCommand
//
// Return the local state to clients. NOTE: For JMRI state, we most likely want to ask JMRI
// This is currently a synchronous operation, so this may be tough.

exports.ProcessGetCommand = function ProcessGetCommand(data) {
	var responseData = [];
	
	for (var i in data) {
//		console.log(i + ": " + data[i].name,globalDataArray[data[i].name]);
		responseData.push({name:data[i].name,value:globalDataArray[data[i].name]});
	}

	return responseData;
}


// DataItemIsValid
//
// Check any get/set parameter for validity— for now we just are very agreeable.

function DataItemIsValid(data) {
	return true;
}
