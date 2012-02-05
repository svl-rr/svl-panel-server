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

globalDataArray["i1"]="off";
globalDataArray["t100"]="closed";
globalDataArray["t101"]="closed";
globalDataArray["t102"]="closed";

function ProcessSetCommand(data) {
//	console.log("ProcessSetCommand");

	for (i in data) {
//		console.log(i + ": " + data[i].name + ' ' + data[i].value);
//		NOTE: Probably want to validate parameters before setting state

		globalDataArray[data[i].name] = data[i].value;
	}
	
//	console.log("updated globalDataArray is:");
//	for (i in globalDataArray) {
//		console.log(i + ": " + globalDataArray[i]);
//	}
	return data;
}

function ProcessGetCommand(data) {
//	console.log("ProcessGetCommand");

	var responseData = [];
	
	for (i in data) {
//		console.log(i + ": " + data[i].name,globalDataArray[data[i].name]);
		responseData.push({name:data[i].name,value:globalDataArray[data[i].name]});
	}

	return responseData;
}

exports.ProcessSetCommand = ProcessSetCommand;
exports.ProcessGetCommand = ProcessGetCommand;
