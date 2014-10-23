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

function dataItemIsValid(jsonObj)
{
	if((jsonObj.type != undefined) && (jsonObj.data.name != undefined))
	{
		switch (jsonObj.type)
		{
			case 'turnout':
			case 'sensor':
				return (jsonObj.data.state != undefined);
				break;
				
			case 'memory':
				return (jsonObj.data.value != undefined);
				break;
		}
	}
	
	return false;
}


// updateGlobalStateFromDataItem
//
// Sanity check parameter and selectively update the database with new state
// NOTE: We specifically do NOT update turnout state, as we rely on JMRI to
// report turnout changes back via the xmlio servlet.

function updateGlobalStateFromDataItem(jsonObj) {
	if (!dataItemIsValid(jsonObj)) {
		//console.err("updateGlobalStateFromDataItem: bad data item!");
		//console.dir(jsonObj);
		return false;
	}
	if (globalDataArray[jsonObj.data.name] === undefined) {
		globalDataArray[jsonObj.name] = jsonObj;

		switch(jsonObj.type)
		{
			case 'sensor':
			case 'turnout':
				//console.log("INITIALIZED: " + jsonObj.data.name + ":=" + jsonObj.data.state);
				break;
				
			case 'memory':
				//console.log("INITIALIZED: " + jsonObj.data.name + ":=" + jsonObj.data.value);
				break;
		}

		return true;
	}
	
	switch(jsonObj.type)
	{
		case 'sensor':
		case 'turnout':
			if (jsonObj.data.state !== globalDataArray[jsonObj.data.name].data.state) {
				globalDataArray[jsonObj.data.name] = jsonObj;
				//console.log("UPDATED: " + jsonObj.data.name + ":=" + jsonObj.data.state);
				return true;
			}
			break;
			
		case 'memory':
			if (jsonObj.data.value !== globalDataArray[jsonObj.data.name].data.value) {
				globalDataArray[jsonObj.data.name] = jsonObj;
				//console.log("UPDATED: " + jsonObj.data.name + ":=" + jsonObj.data.value);
				return true;
			}
			break;
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
        jsonObj;

	if (data !== undefined) {
		//console.log("updateGlobalDataFromJMRI:");
		//console.log(util.inspect(response.item, false, null));
		for (item in data) {
			if (data.hasOwnProperty(item)) {
            
				switch (data[item].type) {

                    case 'turnout':
                    case 'memory':
                    case 'sensor':
                        jsonObj = {"type":data[item].type, "data":{"name":data[item].name}};
                        
                        switch (jsonObj.type)
                        {
                            case 'turnout':
                            case 'sensor':
                            	if(typeof data[item].value != "object")
                            		jsonObj.data.state = data[item].value;
                                
                                if(jsonObj.data.state == "1")
                                    jsonObj.data.state = "0";
                                    
                                break;
                                
                            case 'memory':
                                if(typeof data[item].value != "object")
                            		jsonObj.data.value = data[item].value;
                            	else
                            		jsonObj.data.value = '';
                                break;
                        }
                        
                        if (updateGlobalStateFromDataItem(jsonObj)) {
							responseData.push(emulateJMRIResponse(jsonObj));
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
	var	changedData = null,
		item,
		xmlRequest = "",
		turnoutState,
		turnoutUpdateRequest;

	// Update Global State from the client data

	if (data.length > 0) {
    
        var jsonObj = JSON.parse(data);
    
        if(jsonObj != null)
        {
        	// check for improperly formed set command
			if((jsonObj.data.value == undefined) && (jsonObj.data.state == undefined))
			{
				console.error('SET: ERR: Improperly formed set command. ' + util.inspect(jsonObj));
				return null;
        	}
        	
            // In offline mode, manually update the data
            if (process.env.OFFLINE !== undefined) {
                if (updateGlobalStateFromDataItem(jsonObj)) {
                    changedData = emulateJMRIResponse(jsonObj);
                }
            }
            else
            {
                switch (jsonObj.type) {
                    
                    case 'sensor':
                        console.error('SET: ERR: Sensors are read-only in online mode: ' + util.inspect(jsonObj));
                        break;
                    
                    case 'turnout':
                        xmlRequest += "<" + jsonObj.type + " name='" + jsonObj.data.name + "' set='" + jsonObj.data.state +"' />";
                        if (updateGlobalStateFromDataItem(jsonObj)) {
                            changedData = emulateJMRIResponse(jsonObj);
                        }
                        break;
                    
                    case 'memory':
                        xmlRequest += "<" + jsonObj.type + " name='" + jsonObj.data.name + "' set='" + jsonObj.data.value +"' />";
                        if (updateGlobalStateFromDataItem(jsonObj)) {
                            changedData = emulateJMRIResponse(jsonObj);
                        }
                        break;
                    
                    default:
                        console.error('SET: ERR: Unknown type not allowed. ' + util.inspect(jsonObj));
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
	var responseData = null,
		item;

    var jsonObj = JSON.parse(data);
    
    if(jsonObj != null)
    {
        var foundObj = globalDataArray[jsonObj.data.name];
        
        if((foundObj != null) && (foundObj != undefined))
            responseData = emulateJMRIResponse(foundObj);
        else
            responseData = emulateJMRINotFoundError(jsonObj);
        
        //console.log("GET: " + jsonObj.type + " -> " + jsonObj.data.name + " will return value of " + responseData[0].value);
        //console.log(responseData[0]);
	}

	return responseData;
}

function emulateJMRIResponse(jsonObj)
{
	return '{"type":"message", "data":' + getJSONObjAsStr(jsonObj) + '}';
}

function emulateJMRINotFoundError(jsonObj)
{
	return '{"type":"message", "data":{"type":"error", "data":{"code":"404", "message":"Unable to access ' + jsonObj.type + ' ' + jsonObj.data.name + '."}}}';
}

function getJSONObjAsStr(jsonObj)
{
	var jsonStr = '{"type":"' + jsonObj.type + '","data":{"name":"' + jsonObj.data.name + '"';

	if(jsonObj.data.state != undefined)
		jsonStr += ', "state":"' + jsonObj.data.state + '"';
	else if(jsonObj.data.value != undefined)
		jsonStr += ', "value":"' + jsonObj.data.value + '"';
	
	jsonStr += '}}';
    
    //console.log(jsonStr);
    
	return jsonStr;
}

exports.updateGlobalDataFromJMRI = updateGlobalDataFromJMRI;
exports.processSetCommand = processSetCommand;
exports.processGetCommand = processGetCommand; 