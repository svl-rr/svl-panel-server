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


// DataItemIsValid
//
// Check any get/set parameter for validity— for now we just are very agreeable.

function DataItemIsValid(data) {
	return true;
}


// UpdateGlobalStateFromDataItem
//
// Sanity check parameter and selectively update the database with new state
// NOTE: We specifically do NOT update turnout state, as we rely on JMRI to
// report turnout changes back via the xmlio servlet.

function UpdateGlobalStateFromDataItem(item) {

	if (!DataItemIsValid(item)) {
		console.err("UpdateGlobalStateFromDataItem: bad data item!");
		console.dir(item);
		return false;
	}

	if (globalDataArray[item.name] === undefined)	{
		globalDataArray[item.name] = item.value;
//		console.log("INITIALIZED: " + item.name + ":=" + item.value);
		return true;
	};
	 
	if (item.value != globalDataArray[item.name]) {
		globalDataArray[item.name] = item.value;
//		console.log("UPDATED: " + item.name + ":=" + item.value);
		return true;
	}
	
	return false;
}


// UpdateGlobalDataFromJMRI
//
// Handle the response from the JMRI xmlio servlet

function UpdateGlobalDataFromJMRI(response) {
	var responseData = [];
	
	if (response.item !== undefined) {
//		console.log("UpdateGlobalDataFromJMRI:");
//		console.log(util.inspect(response.item, false, null));
		
		var data = response.item;
		for (var item in data) {
		
			switch (data[item].type) {
				case 'turnout':
					if (data[item].value == 4) {
						data[item].value = 'thrown';
					}
					else {
						data[item].value = 'closed';
					}

					// fall through!

				case 'sensor':
					if (UpdateGlobalStateFromDataItem(data[item])) {
						responseData.push({name:data[item].name,value:globalDataArray[data[item].name]});
					}
					break;

				default:
					break;
			}
		}
	}
	return responseData;
}


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
	
		// Convert the xml response into JSON so we can deal
		parser.parseString(response, function (err, result) {
		
			// Update our global state
			var changedState = UpdateGlobalDataFromJMRI(result);

			if (typeof(callback) == 'function') {
				callback(changedState);
			}
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

exports.ProcessSetCommand = function ProcessSetCommand(data) {
	var changedData = [];

	// Update Global State from the client data
	//
	// NOTE: In order to avoid race conditions, we pay special attention to only
	// deliver updates to JMRI items (e.g., turnouts) via the trackLayoutState
	// callback mechanism.

	for (var item in data) {
		if (data[item].type !== 'turnout') {
			if (UpdateGlobalStateFromDataItem(data[item])) {
				changedData.push(data[item]);
			}
		}
	}
	
	// Push all turnout changes to JMRI via xmlioRequest
	//
	// NOTE: We don't care about parsing the response here, because the other
	// outstanding request issued in trackLayoutState will collect changes.
	
	if (data.length > 0) {
		var xmlRequest = '';
		
		for (var i in data) {
			switch (data[i].type) {
				case 'turnout':
					var turnoutState = (data[i].value === "thrown") ? 4 : 2;
					xmlRequest += "<turnout name='"+data[i].name+"' set='"+turnoutState+"' />"
					break;
					
				default:
					break;
			}
		}
		
		if (xmlRequest !== "") {
			jmri.xmlioRequest('127.0.0.1',12080,"<xmlio>" + xmlRequest + "</xmlio>",function (response) {
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
