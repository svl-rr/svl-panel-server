var SOCKET_CONNECTED = "Connected";
var SOCKET_DISCONNECTED = "Disconnected";

var socketStatus = SOCKET_DISCONNECTED;

var jmriSocket = null;
var nodeSocket = null;

var NODE_SOCKET_PORT = 3000;
var JMRI_SOCKET_PORT = 12080;

// Object types we can send to the server
var SERVER_TYPE_TURNOUT = "turnout";
var SERVER_TYPE_DISPATCH = "memory";
var SERVER_TYPE_SENSOR = "sensor";
//var SERVER_TYPE_SIGNAL = "signal";

var supportedTypes = [SERVER_TYPE_TURNOUT, SERVER_TYPE_DISPATCH, SERVER_TYPE_SENSOR];

var SERVER_SET = 'set';
var SERVER_GET = 'get';

var undefinedStateMap = {"jmri":"0"};
var normalTurnoutStateMap = {"jmri":"2","svg":"N"};
var reverseTurnoutStateMap = {"jmri":"4","svg":"R"};
var onSensorStateMap = {"jmri":"2","svg":"on"};
var offSensorStateMap = {"jmri":"4","svg":"off"};

var nodeJMRISocketReady;

function initSocketToServer(panelName)
{
    document.title = "JMRI SVG Panel: " + panelName;
	
	initSocketInstance();
	
	setInterval(initSocketInstance, 10000);
}

function initSocketInstance()
{
	if(socketStatus == SOCKET_DISCONNECTED)
	{
		if(window.location.href.search(NODE_SOCKET_PORT) != -1)
			initNodeSocketInstance();
		else if(window.location.href.search(JMRI_SOCKET_PORT) != -1)
			initJMRISocketInstance();
		else
			setPanelError("Could not identify server type during socket initialization.");
	}
}

function initJMRISocketInstance()
{
    jmriSocket = new WebSocket("ws://" + window.location.hostname + ":" + JMRI_SOCKET_PORT + "/json/");
    
    jmriSocket.onopen = function ()
    {
        console.log("connected via JMRI Socket!");

        // Set up ping to maintain connection
        setInterval(function() { jmriSocket.send('{"type":"ping"}'); }, 10000);

        socketStatus = SOCKET_CONNECTED;
        
        handleSocketConnect();
    };

    jmriSocket.onmessage = function(msg)
    {
        var msgObj = JSON.parse(msg.data);
        handleSocketDataResponse(handleJSONMessage(msgObj));
    };
    
    jmriSocket.onerror = function (e)
    {
        console.log("web socket error: " + e);
        setPanelStatus("web socket error: " + e);
    };

    jmriSocket.onclose = function (e)
    {
        console.log("disconnected from JMRI socket "+ e.code);
        
        socketStatus = SOCKET_DISCONNECTED;
        
        handleSocketDisconnect();        
    };   
}

function initNodeSocketInstance()
{
	nodeSocket = io.connect();

    nodeSocket.on('connect', function ()
    {
        console.log("connected via Node socket");

        socketStatus = SOCKET_CONNECTED;
        handleSocketConnect();
    });

    // on an response from the server, server will send array of updated elements
    // not all elements will necessarily be on this panel
    nodeSocket.on('update', function(data)
    {
        var msgObj = JSON.parse(data);
                
        if((msgObj != null) && (msgObj != undefined))
            handleSocketDataResponse(handleJSONMessage(msgObj));
        else
            alert("bad node update: " + data);
    });
    
    nodeSocket.on('nodeJMRISocketStatus', function(data)
    {
        if((nodeJMRISocketReady == false) && (data == true))
            handleSocketConnect();
        
        nodeJMRISocketReady = data;
        
        updatePanelBackground();
    });
    
    nodeSocket.on('disconnect', function ()
    {
        console.log("disconnected from Node socket");

        socketStatus = SOCKET_DISCONNECTED;        
        handleSocketDisconnect();
    });
}

function handleJSONMessage(msgObj)
{
    var serverObjs = [];

    if(msgObj != null)
    {
        var serverItem;
        
    	if(msgObj.length == undefined)
        {
    		serverItem = handleJSONObject(msgObj);
            
            if(serverItem != null)
                serverObjs.push(serverItem);
        }
    	else if(msgObj.length > 0)
    	{
    		for(var i in msgObj)
            {
    			serverItem = handleJSONObject(msgObj[i]);
                
                if(serverItem != null)
                    serverObjs.push(serverItem);
            }
    	}
    }
    
    return serverObjs;
}

function handleJSONObject(msgObj)
{
    var humanReadableMessage = null;
    var serverObj = null;
    
    if(msgObj != null)
    {
        if (msgObj.type == "pong")
        {
            // Modifing DOM seems to help keep connection alive (for browsers where power saving might have been enabled)
            setPanelStatus("Panel Ready");
        }
        else if (msgObj.type == "hello")
        {
            humanReadableMessage = msgObj.data.railroad + " is running JMRI version " + msgObj.data.JMRI;
            console.log("server hello message: " + humanReadableMessage);
            
            setPanelStatus(humanReadableMessage);
        }
        else if (msgObj.type == "error")
        {
            humanReadableMessage = msgObj.data.message + " (code " + msgObj.data.code + ")";
            console.log("server error message: " + humanReadableMessage);
            
            if(msgObj.data.code == "404")
            {
                var searchTxt = "Unable to access ";
            
                if(msgObj.data.message.search(searchTxt) == 0)
                {
                    var reducedMsg = msgObj.data.message.replace(searchTxt, "");
                    
                    var spaceLoc = reducedMsg.search(" ");
                    
                    if(spaceLoc != -1)
                    {
                        var type = reducedMsg.substr(0, spaceLoc);
                        var name = reducedMsg.substr(spaceLoc + 1);
                        
                        if(name.charAt(name.length - 1) == ".")
                            name = name.substr(0, name.length - 1);
                        
                        var jsonObj = {"type":type, "data":{"name":name}};
                    }
                }
            }
            
            setPanelStatus(humanReadableMessage);
        }
        else if(msgObj.type == "turnout")
        {
            humanReadableMessage = msgObj.data.name + " has state " + msgObj.data.state;
            console.log("server turnout message: " + humanReadableMessage);

            if(msgObj.data.state == undefinedStateMap.jmri)
                serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_TURNOUT);
            else if(msgObj.data.state == normalTurnoutStateMap.jmri)
                serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_TURNOUT, normalTurnoutStateMap.svg);
            else if (msgObj.data.state == reverseTurnoutStateMap.jmri)
                serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_TURNOUT, reverseTurnoutStateMap.svg);
        }
        else if(msgObj.type == "sensor")
        {
            var name = msgObj.data.userName != "" ? msgObj.data.userName : msgObj.data.name;
            humanReadableMessage = name + " has state " + msgObj.data.state;
        	console.log("server sensor message: " + humanReadableMessage);
			
			if(msgObj.data.state == undefinedStateMap.jmri)
				serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_SENSOR);
			else if(msgObj.data.state == onSensorStateMap.jmri)
				serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_SENSOR, onSensorStateMap.svg);
			else if (msgObj.data.state == offSensorStateMap.jmri)
				serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_SENSOR, offSensorStateMap.svg);

            serverObj.userName = msgObj.data.userName;
        }
        else if(msgObj.type == "memory")
        {
            humanReadableMessage = msgObj.data.name + " has value " + msgObj.data.value;
            console.log("server memory message: " + humanReadableMessage);
            
            if(msgObj.data.name.indexOf('IM') == 0)
                serverObj = new ServerObject(msgObj.data.name.substr(2), SERVER_TYPE_DISPATCH, msgObj.data.value);
            else
                serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_DISPATCH, msgObj.data.value);
        }
        else
            console.log("unknown server message of type: " + msgObj.type);
    }
    else
    {
        console.log("Null JSON server message received.");
        setPanelError("Null JSON server message received.");
    }
    
    return serverObj;
}

function UserNameServerObject(objectUserName, objectType) {
    var so = new ServerObject(objectUserName, objectType);
    so.useUserName = true;
    return so
}

function ServerObject(objectName, objectType)
{
	this.name=objectName;
    this.useUserName = false;
    this.type=objectType;
	
    this.getName=getName;
	this.getType=getType;
	this.getValue=getValue;
	
	this.setName=setName;
	this.setType=setType;
	this.setValue=setValue;
}

function ServerObject(objectName, objectType, objectValue)
{
	this.name=objectName;
    this.useUserName = false;
    this.type=objectType;
	this.value=objectValue;
	
    this.getName=getName;
	this.getType=getType;
	this.getValue=getValue;
	
	this.setName=setName;
	this.setType=setType;
	this.setValue=setValue;
}

function getName()
{
	return this.name;
}

function setName(objectName)
{
	this.name=objectName;
}

function getType()
{
	return this.type;
}

function setType(objectType)
{
	this.type=objectType;
}

function getValue()
{
	return this.value;
}

function setValue(objectValue)
{
	this.value=objectValue;
}

function getJMRIObjects()
{
    for(var i in supportedTypes)
        getJMRIObjectsOfType(supportedTypes[i]);
}

function getJMRIObjectsOfType(type)
{
    if(type == SERVER_TYPE_DISPATCH)
        serverSendRawJSON('{"type":"list","list":"memories", "method":"get"}', SERVER_GET);
    else if(type == SERVER_TYPE_SENSOR)
        serverSendRawJSON('{"type":"list","list":"sensors", "method":"get"}', SERVER_GET);
    else if(type == SERVER_TYPE_TURNOUT)
        serverSendRawJSON('{"type":"list","list":"turnouts", "method":"get"}', SERVER_GET);
    else
        alert("Unnsupported type (" + type + ") passed to getAllJMRIObjects()");
}

function serverSet(setArray)
{
	serverSend(SERVER_SET, setArray);
}

function serverGet(getArray)
{
    serverSend(SERVER_GET, getArray);
}

function serverSend(action, dataArray)
{
	if((socketStatus == SOCKET_DISCONNECTED) || !enableServerAccesses)
	{        
        // Pretend the server returned the inbound item
        handleSocketDataResponse(dataArray);
	}
	else if(socketStatus == SOCKET_CONNECTED)
	{
        if((action == SERVER_GET) || (action == SERVER_SET))
        {
            for(var i in dataArray)
            {
                var jsonStr = null;
                
                if(action == SERVER_GET)
                	jsonStr = getAsGetJSONString(dataArray[i]);
                else if(action == SERVER_SET)
                	jsonStr = getAsSetJSONString(dataArray[i]);
                
                serverSendRawJSON(jsonStr, action);
            }
        }
        else
        {
            console.log("Error: unsupported action (" + action + ") in serverSend");
        }
	}
}

function serverSendRawJSON(jsonStr, action)
{
	if(socketStatus == SOCKET_CONNECTED)
	{
		if(jsonStr != null)
		{
			if(jmriSocket != null)
			{
				jmriSocket.send(jsonStr);
				return;
			}
			else if((nodeSocket != null) && (action != null))
			{
				nodeSocket.emit(action, jsonStr);
				return;
			}
		}
	}
	
	console.log("Error: serverSendRawJSON could not complete as expected (" + jsonStr + " " + action + " " + socketStatus + ")");
}

function getAsSetJSONString(serverObj)
{
    if(serverObj.type == SERVER_TYPE_TURNOUT)
    {
        var jmriState;
        
        if(serverObj.value == normalTurnoutStateMap.svg)
            jmriState = normalTurnoutStateMap.jmri;
        else if(serverObj.value == reverseTurnoutStateMap.svg)
            jmriState = reverseTurnoutStateMap.jmri;
        else
            jmriState = undefinedStateMap.jmri;
    
        return '{"type":"turnout","data":{"name":"' + serverObj.name + '","state":"' + jmriState + '"}, "method":"post"}';
    }
    else if (serverObj.type == SERVER_TYPE_SENSOR) {
        var nameField = serverObj.useUserName ? "userName" : "name";
        return '{"type":"sensor","data":{"' + nameField + '":"' + serverObj.name + '","state":"' + serverObj.value + '"}, "method":"post"}';
    }
    else if(serverObj.type == SERVER_TYPE_DISPATCH)
        return '{"type":"memory","data":{"name":"IM' + serverObj.name + '","value":"' + serverObj.value + '"}, "method":"post"}';
    
    return null;
}

function getAsGetJSONString(serverObj)
{
    if(serverObj.type == SERVER_TYPE_TURNOUT)
        return '{"type":"turnout","data":{"name":"' + serverObj.name + '"}, "method":"get"}';
    else if(serverObj.type == SERVER_TYPE_SENSOR)
        return '{"type":"sensor","data":{"name":"' + serverObj.name + '"}, "method":"get"}';
    else if(serverObj.type == SERVER_TYPE_DISPATCH)
        return '{"type":"memory","data":{"name":"IM' + serverObj.name + '"}, "method":"get"}';
    
    return null;
}
