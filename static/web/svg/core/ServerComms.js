var SOCKET_CONNECTED = "Connected";
var SOCKET_DISCONNECTED = "Disconnected";

var socketStatus = SOCKET_DISCONNECTED;

var jmriSocket = null;
var nodeSocket = null;

var NODE_SOCKET_PORT = 3000;
var JMRI_SOCKET_PORT = 12080;

var SERVER_SET = 'set';
var SERVER_GET = 'get';

var undefinedStateMap = {"jmri":"0"};
var normalStateMap = {"jmri":"2","svg":"N"};
var reverseStateMap = {"jmri":"4","svg":"R"};

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
        console.log("connected!");

        // Set up ping to maintain connection
        setInterval(function() { jmriSocket.send('{"type":"ping"}'); }, 10000);

        socketStatus = SOCKET_CONNECTED;
        
        handleSocketConnect();
    };

    jmriSocket.onmessage = handleJSONMessage;
    
    jmriSocket.onerror = function (e)
    {
        console.log("web socket error: " + e);
        setPanelStatus("web socket error: " + e);
    }

    jmriSocket.onclose = function (e)
    {
        console.log("disconnected "+ e.code);
        
        socketStatus = SOCKET_DISCONNECTED;
        
        handleSocketDisconnect();        
    };   
}

function initNodeSocketInstance()
{
	nodeSocket = io.connect();

    nodeSocket.on('connect', function ()
    {
        socketStatus = SOCKET_CONNECTED;
        //nodeSocket.emit('register', panelName);
        handleSocketConnect();
    });

    // on an response from the server, server will send array of updated elements
    // not all elements will necesarily be on this panel
    nodeSocket.on('update', function (data)
    {
        var cleanedVarNames = [];
    
        for(var i in data)
        {
            if((data[i].name.indexOf('IM') == 0) && (data[i].type == SERVER_TYPE_DISPATCH))
                cleanedVarNames.push(new ServerObject(data[i].name.substr(2), SERVER_TYPE_DISPATCH, data[i].value));
            else
                cleanedVarNames.push(data[i]);
        }
    
        handleSocketDataResponse(cleanedVarNames);
    });
    
    nodeSocket.on('disconnect', function ()
    {
        socketStatus = SOCKET_DISCONNECTED;        
        handleSocketDisconnect();
    });
    
    nodeSocket.on('time', function (time)
    {
        handleSocketTime(time);
    });
}


function handleJSONMessage(msg)
{
    var msgObj = JSON.parse(msg.data);
    var humanReadableMessage = null;

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
            setPanelStatus(humanReadableMessage);
        }
        else if(msgObj.type == "turnout")
        {
            humanReadableMessage = msgObj.data.name + " has state " + msgObj.data.state;

            var serverObj;
            
            if(msgObj.data.state == undefinedStateMap.jmri)
                serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_TURNOUT);
            else if(msgObj.data.state == normalStateMap.jmri)
                serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_TURNOUT, normalStateMap.svg);
            else if (msgObj.data.state == reverseStateMap.jmri)
                serverObj = new ServerObject(msgObj.data.name, SERVER_TYPE_TURNOUT, reverseStateMap.svg);

            console.log("server turnout message: " + humanReadableMessage);
            handleSocketDataResponse([serverObj]);
        }
        else if(msgObj.type == "sensor")
        {
            humanReadableMessage = msgObj.data.name + " has state " + msgObj.data.state;
        
            console.log("server sensor message: " + humanReadableMessage);
            handleSocketDataResponse([new ServerObject(msgObj.data.name, SERVER_TYPE_SENSOR, msgObj.data.state)]);
        }
        else if(msgObj.type == "memory")
        {
            humanReadableMessage = msgObj.data.name + " has value " + msgObj.data.value;
        
            console.log("server memory message: " + humanReadableMessage);
            
            if(msgObj.data.name.indexOf('IM') == 0)
                handleSocketDataResponse([new ServerObject(msgObj.data.name.substr(2), SERVER_TYPE_DISPATCH, msgObj.data.value)]);
            else
                handleSocketDataResponse([new ServerObject(msgObj.data.name, SERVER_TYPE_DISPATCH, msgObj.data.value)]);
        }
        else
            console.log("unknown server message: " + msg.data);
    }
    else
    {
        console.log("Improper JSON server message received: " + msg.data);
        setPanelStatus("Improper JSON server message received: " + msg.data);
    }
}


function ServerObject(objectName, objectType)
{
	this.name=objectName;
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
                
                if(jsonStr != null)
                {
                    if(jmriSocket != null)
                    	jmriSocket.send(jsonStr);
                    else if(nodeSocket != null)
                    	nodeSocket.emit(action, jsonStr);
                }
            }
        }
        else
        {
            console.log("Error: unsupported action (" + action + ") in serverSend");
        }
	}
}

function getAsSetJSONString(serverObj)
{
    if(serverObj.type == SERVER_TYPE_TURNOUT)
    {
        var jmriState;
        
        if(serverObj.value == normalStateMap.svg)
            jmriState = normalStateMap.jmri;
        else if(serverObj.value == reverseStateMap.svg)
            jmriState = reverseStateMap.jmri;
        else
            jmriState = undefinedStateMap.jmri;
    
        return '{"type":"turnout","data":{"name":"' + serverObj.name + '","state":"' + jmriState + '"}}';
    }
    else if(serverObj.type == SERVER_TYPE_SENSOR)
        return '{"type":"sensor","data":{"name":"' + serverObj.name + '","state":"' + serverObj.value + '"}}';
    else if(serverObj.type == SERVER_TYPE_DISPATCH)
        return '{"type":"memory","data":{"name":"IM' + serverObj.name + '","value":"' + serverObj.value + '"}}';
    
    return null;
}

function getAsGetJSONString(serverObj)
{
    if(serverObj.type == SERVER_TYPE_TURNOUT)
        return '{"type":"turnout","data":{"name":"' + serverObj.name + '"}}';
    else if(serverObj.type == SERVER_TYPE_SENSOR)
        return '{"type":"sensor","data":{"name":"' + serverObj.name + '"}}';
    else if(serverObj.type == SERVER_TYPE_DISPATCH)
        return '{"type":"memory","data":{"name":"IM' + serverObj.name + '"}}';
    
    return null;
}