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
		globalDataArray[item.name] = item;
		//console.log("INITIALIZED: " + item.name + ":=" + item.value);
		return true;
	}
	if (item.value !== globalDataArray[item.name].value) {
		globalDataArray[item.name] = item;
		//console.log("UPDATED: " + item.name + ":=" + item.value);
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
		item,
        serverObj;

	if (data !== undefined) {
		//console.log("updateGlobalDataFromJMRI:");
		//console.log(util.inspect(response.item, false, null));
		for (item in data) {
			if (data.hasOwnProperty(item)) {
            
				switch (data[item].type) {

                    case 'turnout':
                    case 'memory':
                    case 'sensor':
                        serverObj = {"type":data[item].type, "name":data[item].name,"value":undefined};
                        
                        if(typeof data[item].value != "object")
                            serverObj.value = data[item].value;
                        
                        if((serverObj.value == undefined) && (serverObj.type == 'memory'))
                            serverObj.value = '';
                        
                        switch (serverObj.type)
                        {
                            case 'turnout':
                                serverObj.value = (data[item].value == 4) ? 'R' : 'N';
                                break;
                        }
                        
                        if (updateGlobalStateFromDataItem(serverObj)) {
							responseData.push(serverObj);
						}
                        break;

					default:
                        console.log("don't know of data type " +  data[item].type + " in updateGlobalDataFromJMRI:");
						break;
				}
			}
		}
	}
	return responseData;
}


// processSetCommand
//
// Handle the 'set' commands initiated by the the socket.io/websocket interface

function processSetCommand(data) {
	var	changedData = [],
		item,
		xmlRequest = "",
		turnoutState,
		turnoutUpdateRequest;

	// Update Global State from the client data

	if (data.length > 0) {
    
        var jsonObj = JSON.parse(data);
    
        if(jsonObj != null)
        {
            var serverObj = {"type":jsonObj.type,"name":jsonObj.data.name,"value":undefined};
            
            switch (serverObj.type)
            {
                case 'turnout':
                    serverObj.value = (jsonObj.data.state == 4) ? 'R' : 'N';
                    break;
                    
                default:
                    serverObj.value = jsonObj.data.value;
                    break;
            }
                  
            //console.log("SET: " + data);
            //console.log("SET: " + serverObj.type + " -> " + serverObj.name + " is '" + serverObj.value + "'");
        
            // In offline mode, manually update the data
            if (process.env.OFFLINE !== undefined) {
                if (updateGlobalStateFromDataItem(serverObj)) {
                    changedData.push(serverObj);
                }
            }
            else
            {
                switch (serverObj.type) {
                    
                    case 'sensor':
                        console.error('SET: ERR: Sensors are read-only in online mode: ' + util.inspect(serverObj));
                        break;
                    
                    case 'turnout':
                        xmlRequest += "<" + serverObj.type + " name='" + serverObj.name + "' set='" + (serverObj.value == 'R' ? 4 : 2) +"' />";
                        if (updateGlobalStateFromDataItem(serverObj)) {
                            changedData.push(serverObj);
                        }
                        break;
                    
                    case 'memory':
                        xmlRequest += "<" + serverObj.type + " name='" + serverObj.name + "' set='" + serverObj.value +"' />";
                        if (updateGlobalStateFromDataItem(serverObj)) {
                            changedData.push(serverObj);
                        }
                        break;
                    
                    default:
                        console.error('SET: ERR: Unknown type not allowed. ' + util.inspect(serverObj));
                        break;
                }
            }
        }
	}

	// Push any turnout changes to JMRI via xmlioRequest
	// NOTE: We don't care about parsing the response here, because the other
	// outstanding request issued in trackLayoutState will collect changes.

	if ((xmlRequest !== "") && (process.env.OFFLINE === undefined)) {
		turnoutUpdateRequest = new jmri.JMRI('127.0.0.1', 12080);
        
        //console.log(xmlRequest);
        
		turnoutUpdateRequest.xmlioRequest("<xmlio>" + xmlRequest + "</xmlio>");
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

    var jsonObj = JSON.parse(data);
    
    if(jsonObj != null)
    {
        var foundObj = globalDataArray[jsonObj.data.name];
        
        if((foundObj != null) && (foundObj != undefined))
            responseData.push(foundObj);
        else
            responseData.push({"type":jsonObj.type,"name":jsonObj.data.name,"value":undefined});
        
        //console.log("GET: " + jsonObj.type + " -> " + jsonObj.data.name + " will return value of " + responseData[0].value);
        //console.log(responseData[0]);
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
		numDispatchPanels = (numDispatchPanels > 0 ? numDispatchPanels - 1 : 0);
		// if the last dispatch panel was closed, be sure to unlock the mainline
		if (numDispatchPanels === 0) {
			console.log("last dispatch panel closed; unlocking mainline");
			if (globalDataArray[SERVER_NAME_MAINLINELOCKED] !== undefined) {
                globalDataArray[SERVER_NAME_MAINLINELOCKED].value = false;
                socket.broadcast.emit('update', [globalDataArray[SERVER_NAME_MAINLINELOCKED]]);
            }
		}
	}
}


exports.updateGlobalDataFromJMRI = updateGlobalDataFromJMRI;
exports.processSetCommand = processSetCommand;
exports.processGetCommand = processGetCommand;
exports.registerPanel = registerPanel;
exports.unregisterPanel = unregisterPanel;

