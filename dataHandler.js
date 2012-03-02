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

"use strict";

var util = require('util');
var jmri = require('./jmri');
var xml2js = require("xml2js");
var parser = new xml2js.Parser();


// Keeping with a minimalist approach for now. All tracked state is kept in an
// associative array— eventually, we'll probably want to create a more robust
// data storage system, but for now we're going to limp along with a simple array
// of named items.

var globalDataArray = [];


// dataItemIsValid
//
// Check any get/set parameter for validity— for now we just are very agreeable.

function dataItemIsValid(data) {
	return true;
}


// updateGlobalStateFromDataItem
//
// Sanity check parameter and selectively update the database with new state
// NOTE: We specifically do NOT update turnout state, as we rely on JMRI to
// report turnout changes back via the xmlio servlet.

function updateGlobalStateFromDataItem(item) {
	if (!dataItemIsValid(item)) {
		console.err("updateGlobalStateFromDataItem: bad data item!");
		console.dir(item);
		return false;
	}
	if (globalDataArray[item.name] === undefined) {
		globalDataArray[item.name] = item.value;
//		console.log("INITIALIZED: " + item.name + ":=" + item.value);
		return true;
	}
	if (item.value !== globalDataArray[item.name]) {
		globalDataArray[item.name] = item.value;
//		console.log("UPDATED: " + item.name + ":=" + item.value);
		return true;
	}
	return false;
}


// updateGlobalDataFromJMRI
//
// Handle the response from the JMRI xmlio servlet

function updateGlobalDataFromJMRI(response) {
	var responseData = [],
		data = response.item,
		item;

	if (data !== undefined) {
//		console.log("updateGlobalDataFromJMRI:");
//		console.log(util.inspect(response.item, false, null));
		for (item in data) {
			if (data.hasOwnProperty(item)) {
				switch (data[item].type) {
					case 'turnout':
						if (Number(data[item].value) === 4) {
							data[item].value = 'thrown';
						} else {
							data[item].value = 'closed';
						}
						if (updateGlobalStateFromDataItem(data[item])) {
							responseData.push({name: data[item].name, value: globalDataArray[data[item].name]});
						}
						break;

					case 'sensor':
						if (Number(data[item].value) === 4) {
							data[item].value = 'off';
						} else {
							data[item].value = 'on';
						}
						if (updateGlobalStateFromDataItem(data[item])) {
							responseData.push({name: data[item].name, value: globalDataArray[data[item].name]});
						}
						break;

					default:
						break;
				}
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

function trackLayoutState(callback) {

	function handleResponse(response, callback) {

		// Convert the xml response into JSON, update state, and invoke callback
		parser.parseString(response, function (err, result) {
			var changedState = updateGlobalDataFromJMRI(result);
			if (typeof (callback) === 'function') {
				callback(changedState);
			}

			// re-queue request with new response state
			jmri.xmlioRequest('127.0.0.1', 12080, response, function (newResponse) {
				handleResponse(newResponse, callback);
			});
		});
	}

	// request initial state from JMRI
	jmri.getInitialState('127.0.0.1', 12080, function (initialResponse) {
		handleResponse(initialResponse, callback);
	});
}


// processSetCommand
//
// Handle the 'set' commands initiated by the the socket.io/websocket interface

function processSetCommand(data) {
	var	changedData = [],
		item,
		xmlRequest = "",
		turnoutState;

	// Update Global State from the client data
	//
	// NOTE: In order to avoid race conditions, we pay special attention to only
	// deliver updates to JMRI items (e.g., turnouts) via the trackLayoutState
	// callback mechanism.

	for (item in data) {
		if (data.hasOwnProperty(item)) {
			if (data[item].type !== 'turnout') {
				if (updateGlobalStateFromDataItem(data[item])) {
					changedData.push(data[item]);
				}
			}
		}
	}

	// Push all turnout changes to JMRI via xmlioRequest
	//
	// NOTE: We don't care about parsing the response here, because the other
	// outstanding request issued in trackLayoutState will collect changes.

	if (data.length > 0) {
		for (item in data) {
			if (data.hasOwnProperty(item)) {
				switch (data[item].type) {
					case 'turnout':
						turnoutState = (data[item].value === "thrown") ? 4 : 2;
						xmlRequest += "<turnout name='" + data[item].name + "' set='"+ turnoutState +"' />";
						break;
					default:
						break;
				}
			}
		}
		if (xmlRequest !== "") {
			jmri.xmlioRequest('127.0.0.1', 12080, "<xmlio>" + xmlRequest + "</xmlio>", function (response) {
			});
		}
	}
	return changedData;
}


// processGetCommand
//
// Return the local state to clients. NOTE: For JMRI state, we most likely want to ask JMRI
// This is currently a synchronous operation, so this may be tough.

function processGetCommand(data) {
	var responseData = [],
		item;

	for (item in data) {
		if (data.hasOwnProperty(item)) {
//			console.log(item + ": " + data[item].name,globalDataArray[data[item].name]);
			responseData.push({name: data[item].name, value: globalDataArray[data[item].name]});
		}
	}

	return responseData;
}


var numDispatchPanels = 0;
var SERVER_NAME_MAINLINELOCKED = "Mainline Locked";

// registerPanel
//
// When a new client comes online, it can optionally register as a dispatcher panel

function registerPanel(socket, panelName) {
	console.log("registerPanel " + panelName);
	// TODO: should guard againt client calling register multiple times.
	if (panelName.search("Dispatch") !== -1) {
		numDispatchPanels = numDispatchPanels + 1;
	}
}


// unregisterPanel
//
// If a client was registered, go ahead a check to see if it was the last dispatcher
// panel active, and if so unlock the layout.

function unregisterPanel(socket, panelName) {
	console.log("unregisterPanel " + panelName);
	if (panelName.search("Dispatch") !== -1) {
		numDispatchPanels = numDispatchPanels - 1;
		// if the last dispatch panel was closed, be sure to unlock the mainline
		if (numDispatchPanels === 0) {
			console.log("last dispatch panel closed; unlocking mainline");
			globalDataArray[SERVER_NAME_MAINLINELOCKED] = false;
			socket.broadcast('update', {name: SERVER_NAME_MAINLINELOCKED, value: false});
		}
	}
}


exports.trackLayoutState = trackLayoutState;
exports.processSetCommand = processSetCommand;
exports.processGetCommand = processGetCommand;
exports.registerPanel = registerPanel;
exports.unregisterPanel = unregisterPanel;
