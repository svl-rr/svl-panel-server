var socket;

var SOCKET_CONNECTED = "Connected";
var SOCKET_DISCONNECTED = "Disconnected";

var socketStatus = SOCKET_DISCONNECTED;

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

function initSocketToServer(panelName)
{
    socket = io.connect(location.host);

    socket.on('connect', function ()
    {
        socketStatus = SOCKET_CONNECTED;
        socket.emit('register', panelName);
        handleSocketConnect();
    });

    // on an response from the server, server will send array of updated elements
    // not all elements will necesarily be on this panel
    socket.on('update', function (data)
    {
        handleSocketDataResponse(data);
    });
    
    
    socket.on('disconnect', function ()
    {
        socketStatus = SOCKET_DISCONNECTED;        
        handleSocketDisconnect();
    });
}

function serverSet(setArray)
{
	serverSend('set', setArray);
}

function serverGet(getArray)
{
    serverSend('get', getArray);
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
        // Send objects to server
        socket.emit(action, dataArray);
	}
}

