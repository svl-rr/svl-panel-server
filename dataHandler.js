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


// Keeping with a minimalist approach for now. All tracked state is kept in an
// associative array— eventually, we'll probably want to create a more robust
// data storage system, but for now we're going to limp along with a simple array
// of named items.

var globalDataArray = [];

var jmri = require('./jmri');

// Some work-in-progress routine to track JMRI state changes
exports.trackLayoutState = function trackLayoutState(callback)
{
	function handleResponse(response,callback) {
		// update and/or initialize global layout state
		callback(response);
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

exports.ProcessSetCommand = function ProcessSetCommand(data) {
	var changedData = [];

	for (var i in data) {

		if ((SetDataItemIsValid(data[i])) &&
			(globalDataArray[data[i].name] === undefined) ||
			(globalDataArray[data[i].name] !== data[i].value))	{

			globalDataArray[data[i].name] = data[i].value;
			changedData.push(data[i]);
		}
	}

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
		
		jmri.xmlioRequest('127.0.0.1',12080,xmlRequest,function (response) {
		});
	}

	return changedData;
}


exports.ProcessGetCommand = function ProcessGetCommand(data) {
	var responseData = [];
	
	for (var i in data) {
//		console.log(i + ": " + data[i].name,globalDataArray[data[i].name]);
		responseData.push({name:data[i].name,value:globalDataArray[data[i].name]});
	}

	return responseData;
}


function SetDataItemIsValid(data) {
	return true;
}
