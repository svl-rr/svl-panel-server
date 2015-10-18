var svgDocument;

var xmlns="http://www.w3.org/2000/svg";
var xlinkns="http://www.w3.org/1999/xlink";
var hrefAttrib = "href";

// Vars for displaying animating the main locked SVG objects
var mainlineLocked = false;
var mainLockTimerID = null;
var mainLockCounter = 0;
var mainLockMod = 50;
var mainLockTimebase = Math.PI*2/mainLockMod;

// Constant id prefix for turnout objects
var PANEL_TURNOUT_OBJID_PREFIX = "TO";
var JMRI_TURNOUT_OBJID_PREFIX = "NT";

var PANEL_SENSOR_OBJID_PREFIX = "block";
var JMRI_SENSOR_OBJID_PREFIX = "LS";

var JMRI_SENSOR_ACTIVE = "on";
var JMRI_SENSOR_INACTIVE = "off";

// Disables 2 second setPanelStatus timer
var debugStringTimerOn = true;

// Enables attempts to accesss server
var enableServerAccesses = true;

// Object lists
var turnoutsOnPanel = new Array();
var stateChangeRequests = new Array();
var blocksOnPanel = new Array();
//var signalsOnPanel = new Array();

var MIN_PHYSICAL_TURNOUT_ADDR = 0;
var MAX_PHYSICAL_TURNOUT_ADDR = 767;

var turnoutOnclickScript = "turnoutSegmentClicked(evt.currentTarget.id)";

var SERVER_NAME_MAINLINELOCKED = "MAINLINE_LOCKED";

var connectedBackgroundColor = null;

var cookiesDefined = [
    new Cookie("disableMainlinePanelLinks", "true", "If set, this field will disable panel links on the mainline link layer of a panel. It is to be used for panels affixed to a particular location of a layout and adjacent panel browsing is not desired."),
    new Cookie("disableIndustrialPanelLinks", "true", "If set, this field will disable panel links on the industry link layer of a panel. It is to be used for panels affixed to a particular location of a layout and adjacent panel browsing is not desired."),
    new Cookie("disablePanelLinksOnlyIfMainlineLocked", "true", "If set, this field will disable panel links (as specified by disableMainlinePanelLinks and disableIndustrialPanelLinks cookies) only when the dispatcher has locked the mainline.")
    ];

function turnoutSegmentClicked(elemID)
{
    if(isDispatchPanel())
        dispatchTurnoutSegmentClicked(elemID);
    else
        changeTurnoutRoute(elemID, true);
}

function changeTurnoutRoute(elemID, allowToggle)
{
    var panelInstance = getPanelTurnoutFromElemID(elemID);
    
    if(panelInstance != null)
    {
        var turnoutID = getDCCAddrAndMotorSubAddr(elemID);
        var turnoutRoute = getDCCAddrRoute(elemID);
    
        var tempStateChangeRequests = stateChangeRequests;
    
        stateChangeRequests = [];
    
        if(allowToggle && (panelInstance.getSVGState() == turnoutRoute))
            addTurnoutStateChangeRequest(turnoutID, 'T');               // toggle turnout
        else
            addTurnoutStateChangeRequest(turnoutID, turnoutRoute);      // set to explicit route
        
        executePanelStateChangeRequests();
        
        stateChangeRequests = tempStateChangeRequests;
    }
}

function isDispatchPanel()
{
    return (typeof dispatchInit == 'function');
}

/* PanelTurnout([String] id, [boolean] flipBit)
 * PanelTurnout object to contain id and flipbit, which is used to invert the graphic status
 */
function PanelTurnout(normalRouteID, divergingRouteID)
{
    this.normalRouteID = normalRouteID;
    this.divergingRouteID = divergingRouteID;
	
	this.getInstanceID=getInstanceID;
    this.getDCCID=getDCCID;
    this.getAsServerObject= getAsServerTurnoutObject;
    this.getSVGState=getSVGState;
    this.setSVGState=setSVGState;
    this.doesTurnoutAllowMultipleAuthorizations=doesTurnoutAllowMultipleAuthorizations;
    this.allowMultipleNormalAuthorizations = false;
    this.allowMultipleReverseAuthorizations = false;
    
    this.successfullyCreated = false;
    
    var normalElem = svgDocument.getElementById(normalRouteID);
	
	if(normalElem == null)
	{
		alert("Attempted to create a PanelTurnout object with ID " + normalRouteID + " but no SVG object with that ID was found.");
		return;
	}
    
    var divergingElem = svgDocument.getElementById(divergingRouteID);
	
	if(divergingElem == null)
	{
		alert("Attempted to create a PanelTurnout object with ID " + divergingRouteID + " but no SVG object with that ID was found.");
		return;
	}
    
    if(normalElem.parentNode != divergingElem.parentNode)
	{
		alert("Attempted to create a PanelTurnout object with ID " + getDCCAddrAndMotorSubAddr(normalRouteID) + " but parent nodes did not match.");
		return;
	}
    
    if(normalElem.parentNode.childElementCount != 2)
    {
        alert("Attempted to create a PanelTurnout object with ID " + getDCCAddrAndMotorSubAddr(normalRouteID) + " but object did not appear to be grouped properly.");
		return;
    }
    
    this.successfullyCreated = true;
    
    checkTurnoutOnClick(normalElem);
    checkTurnoutOnClick(divergingElem);
    checkOpacity(normalElem.parentNode);
    
    // Make sure title element matches the object ID
    addElementTitle(normalRouteID, normalRouteID);
    addElementTitle(divergingRouteID, divergingRouteID);
        
    for(var i in turnoutsOnPanel)
    {
        var prevPanel = turnoutsOnPanel[i];
        
        if(prevPanel.getDCCID() == this.getDCCID())
        {
            var lec = svgDocument.getElementById(prevPanel.divergingRouteID).parentNode.lastElementChild;
            if(getDCCAddrRoute(divergingElem.parentNode.lastElementChild.id) != getDCCAddrRoute(lec.id))
                alert("Multiple turnout instances with DCC addr " + getDCCAddr(divergingRouteID) + " do not have consistent initial conditions. This has been updated during runtime but should be fixed in svg file. ")
        }
    }
    
    /*if(console != undefined)
    {
        console.log("Created turnout: " + id);
        console.warn("Krikey: a warning: " + id);
        console.error("jeepers an error");
    }*/
}

function doesTurnoutAllowMultipleAuthorizations(elemID)
{
    return (getDCCAddrRoute(elemID) == 'R' ? this.allowMultipleReverseAuthorizations : this.allowMultipleNormalAuthorizations);
}

function checkTurnoutOnClick(elem)
{    
    if(elem == null)
    {
        alert("Bad element passed to checkTurnoutOnClick");
        return;
    }
    
    var attrib = elem.getAttribute("onclick");
    if((attrib == null) || (attrib != turnoutOnclickScript))
    {
        alert("Element " + elem.id + " does not have a proper onclick setting. This has been updated during runtime but should be fixed in svg file.");
        elem.setAttribute("onclick", turnoutOnclickScript);
    }
    
    setStyleSubAttribute(elem, "cursor", "pointer");
}

function checkOpacity(parentElem)
{
    if((parentElem == null) || (parentElem.firstElementChild == null) || (parentElem.lastElementChild == null))
    {
        alert("checkOpacity was passed a null parent element or an element without the two expected children elements.");
        return;
    }
    
    var attrib = getStyleSubAttribute(parentElem.firstElementChild, "opacity");
    
    if((attrib == null) || (attrib == "1"))
{
        alert("Element " + parentElem.firstElementChild.id + " is first element in turnout but does not have a proper opacity setting of 0.25 (was " + attrib + "). The element order of the .R and .N segments may be reversed. This has been updated during runtime but should be fixed in svg file.");
}
	else if(attrib != "0.25")
    {
        alert("Element " + parentElem.firstElementChild.id + " is first element in turnout but does not have a proper opacity setting of 0.25 (was " + attrib + "). This has been updated during runtime but should be fixed in svg file.");
    }
    
    attrib = getStyleSubAttribute(parentElem.lastElementChild, "opacity");
    
    if((attrib != null) && (attrib != "1"))
    {
	if(attrib == "0.25")
	        alert("Element " + parentElem.lastElementChild.id + " is last element in turnout but does not have a proper opacity setting of 1/null (was " + attrib + "). The element order of the .R and .N segments may be reversed. This has been updated during runtime but should be fixed in svg file.");
	else
		alert("Element " + parentElem.lastElementChild.id + " is last element in turnout but does not have a proper opacity setting of 1/null (was " + attrib + "). This has been updated during runtime but should be fixed in svg file.");
    }
}

function getSVGState()
{
	var normalElem = svgDocument.getElementById(this.normalRouteID);
    
    if(normalElem != null)
    {
        var parent = normalElem.parentNode;
        
        if(parent.lastElementChild.id == this.normalRouteID)
            return 'N';
        else if(parent.lastElementChild.id == this.divergingRouteID)
            return 'R';
    }
    
    return null;
}

function setSVGState(newRoute)
{    
    var normalElem = svgDocument.getElementById(this.normalRouteID);
    var divergingElem = svgDocument.getElementById(this.divergingRouteID);
    
    if(normalElem != null)
    {
        var parent = normalElem.parentNode;
        
        if((newRoute == 'N') || (newRoute == 'n'))
        {
            // Set normal to full opacity
            setStyleSubAttribute(normalElem, "opacity", "1.0");
            parent.appendChild(normalElem);
            
            // Set diverging to reduced opacity
            setStyleSubAttribute(divergingElem, "opacity", "0.25");
        }
        else if((newRoute == 'R') || (newRoute == 'r'))
        {
            // Set diverging to full opacity
            setStyleSubAttribute(divergingElem, "opacity", "1.0");
            parent.appendChild(divergingElem);
            
            // Set normal to reduced opacity
            setStyleSubAttribute(normalElem, "opacity", "0.25");
        }
        else
            alert("Bad route passed to setSVGState on turnout instance " + this.getInstanceID());
    }
    
    return null;
}

function getPanelTurnoutFromElemID(elemID)
{
    for(var i in turnoutsOnPanel)
    {
        var turnoutInstance = turnoutsOnPanel[i];
        
        if((turnoutInstance.normalRouteID == elemID) || (turnoutInstance.divergingRouteID == elemID))
            return turnoutInstance;
    }
    
    return null;
}

function getPanelTurnoutFromDCCAddr(dccAddr)
{
    for(var i in turnoutsOnPanel)
    {
        var turnoutInstance = turnoutsOnPanel[i];
        
        if(turnoutInstance.getDCCID() == dccAddr)
            return turnoutInstance;
    }
    
    return null;
}

/* [String] getInstanceID()
 * Return id field of PanelTurnout
 */
function getInstanceID()
{
	return getDCCAddrAndMotorSubAddr(this.normalRouteID);
}

function getDCCID()
{
	return getDCCAddr(this.normalRouteID);
}

/* [ServerObject] getAsServerTurnoutObject()
 * Return PanelTurnout as a server object, preset as a get (null state)
 */
function getAsServerTurnoutObject()
{
    var turnoutAddr = this.getDCCID();
    
    return new ServerObject(JMRI_TURNOUT_OBJID_PREFIX + turnoutAddr, SERVER_TYPE_TURNOUT, getTurnoutState(turnoutAddr));
}

function isPhysicalTurnout(turnoutName)
{
    var deviceAddr = getDCCAddr(turnoutName);

    return ((turnoutName.search(JMRI_TURNOUT_OBJID_PREFIX) == 0) && (deviceAddr >= MIN_PHYSICAL_TURNOUT_ADDR) && (deviceAddr <= MAX_PHYSICAL_TURNOUT_ADDR));
}

/* BlockSensor([String] id)
 * BlockSensor object to contain id
 */
function BlockSensor(id)
{
	this.id=id;
	
	this.getID=getID;
    this.getAsServerObject=getAsServerSensorObject;
        
    // Make sure title element matches the object ID
    //addElementTitle(id, id);
    
    /*if(console != undefined)
    {
        console.log("Created turnout: " + id);
        console.warn("Krikey: a warning: " + id);
        console.error("jeepers an error");
    }*/
}

function getAsServerSensorObject()
{
    var sensorAddr = getDCCAddr(this.id);
    
    return new ServerObject(JMRI_SENSOR_OBJID_PREFIX + sensorAddr, SERVER_TYPE_SENSOR, null);
}

/* createPanelTurnout([String] normalRouteElemID, [String] divergingRouteElemID)
 * Creates a new PanelTurnout object and pushes it on to the array of turnouts used by this panel
 */
function createPanelTurnout(normalRouteElemID, divergingRouteElemID)
{
    var panelTurnout = new PanelTurnout(normalRouteElemID, divergingRouteElemID);
    
    if(panelTurnout.successfullyCreated == true)
        turnoutsOnPanel.push(panelTurnout);
}

/* executePathArray([Array] pathArray)
 * Executes a (hardcoded) path where each array element is assumed to be a string that has same formatting as turnout segment IDs (TOxx[A-Z].R|N)
 */

function executePathArray(pathArray)
{
    if(pathArray != null)
    {
        for(var i in pathArray)
        {            
            var turnoutAddr = getDCCAddr(pathArray[i]);
            var turnoutRoute = getDCCAddrRoute(pathArray[i]);
            
            if((turnoutAddr != null) && (turnoutRoute != null))
                addTurnoutStateChangeRequest(turnoutAddr, turnoutRoute);
            else
                alert("A bad turnout id (" + turnoutAddr + ") or route (" + turnoutRoute + ") was passed to executePathArray.");
        }
        
        executePanelStateChangeRequests();
    }
}

/* addTurnoutStateChangeRequest([String] id, [string] state)
 * Creates a new ServerCommsObject object and pushes it on to the array of state change requests
 * Request will not be executed until executePanelStateChangeRequests is called.
 *
 * Panel specific code should use this method to build up a list of turnout changes based on what objects the user clicked
 */
function addTurnoutStateChangeRequest(id, state)
{
    var turnoutAddr = getDCCAddr(id);
    
    // resolve toggle request into a specific state
    if(state == 'T')
        state = (getTurnoutState(turnoutAddr) == 'N' ? 'R' : 'N');

	stateChangeRequests.push(new ServerObject(JMRI_TURNOUT_OBJID_PREFIX + turnoutAddr, SERVER_TYPE_TURNOUT, state));
}

/* init([Event] evt)
 * Called by each SVG file to initialize the panel.
 *
 * Each panel needs to provide a panelInitPreSocket(evt) function that it uses to initialize the specifics of that panel (namely,
 * create each of the PanelTurnout objects)
 */
function init(evt)
{
	svgDocument=evt.target.ownerDocument;

	var desiredWinWidth = window.outerWidth - window.innerWidth + svgDocument.rootElement.scrollWidth;
	var desiredWinHeight = window.outerHeight - window.innerHeight + svgDocument.rootElement.scrollHeight;
	
	if(desiredWinWidth > screen.width)
		desiredWinWidth = screen.width;
	
	if(desiredWinHeight > screen.height)
		desiredWinHeight = screen.height;
	
	window.resizeTo(desiredWinWidth, desiredWinHeight);
    
    // Check to see if metadata/window title and svg title text match
    var panelSVGTextTitle = getPanelSVGTextTitle();
    
    if(panelSVGTextTitle != null)
        setPanelDocumentTitle(panelSVGTextTitle);
    
    var groupItems = svgDocument.getElementsByTagName("g");
    
    for(var i = 0; i < groupItems.length; i++)
    {
        var elem = groupItems[i];
        
        if(elem.childElementCount == 2)
        {
            if((elem.firstElementChild.nodeName == "path") && (elem.lastElementChild.nodeName == "path"))
            {
                var id1 = elem.firstElementChild.id;
                var id2 = elem.lastElementChild.id;
                
                if(id1.length == id2.length)
                {
                    var base1 = id1.substring(0, id1.length - 1);
                    var base2 = id2.substring(0, id2.length - 1);
                    
		    // Make sure element title is set to object id here (this is for debug purposes)
		    addElementTitle(id1, id1);
		    addElementTitle(id2, id2);

                    if((base1 == base2) && (base1.search("TO[\\d]+[A-M]*[.]*") == 0))
                    {
                        var id1route = getDCCAddrRoute(id1);
                        var id2route = getDCCAddrRoute(id2);
                        
                        // Unswizzle the routes
                        if(((id1route == 'R') || (id1route == 'r')) && ((id2route == 'N') || (id2route == 'n')))
                        {                            
                            // Add the turnout to the list of known turnouts
                            createPanelTurnout(id2, id1);
                        }
                        else if(((id1route == 'N') || (id1route == 'n')) && ((id2route == 'R') || (id2route == 'r')))
                        {
                            // Add the turnout to the list of known turnouts
                            createPanelTurnout(id1, id2);
                        }
                        else
                        {
                            alert("Found an element that looked at lot like a turnout object but the routes did not match N or R");
                        }
                    }
                }
            }
        }
    }
    
    var pathItems = svgDocument.getElementsByTagName("path");
    
    for(var i = 0; i < pathItems.length; i++)
    {
        var elem = pathItems[i];
        
        var pathOnClick = elem.getAttribute('onclick');
        
        if((pathOnClick != null) && (pathOnClick != "") && (pathOnClick != turnoutOnclickScript))
        {
            setStyleSubAttribute(elem, "cursor", "pointer");
        }

        if(elem.id.indexOf(PANEL_SENSOR_OBJID_PREFIX) == 1)
        {
            //setStyleSubAttribute(elem, "cursor", "crosshair");
            //blocksOnPanel.push(new BlockSensor(elem.id));
        }
    }
    
	if(typeof panelInitPreSocket == 'function')
		panelInitPreSocket(evt);
	else
	{
		var errorStr = "Panel could not be initialized as panelInitPreSocket function could not be found";
		setPanelError(errorStr);
		alert(errorStr);
		return;
	}

    // Allow dispatch panels to initialize themselves
    if(isDispatchPanel())
		dispatchInit(evt);
    
    var panelBackground = svgDocument.getElementById("panelBackground");
    if(panelBackground != null)
    {
        connectedBackgroundColor = getStyleSubAttribute(panelBackground, "fill");
        
        if(connectedBackgroundColor == null)
           connectedBackgroundColor = 'yellow';
    }
    
    if(enableServerAccesses)
        initSocketToServer(getPanelSVGTextTitle());
    
    updateMainlineStatus();
	    
	setPanelStatus("Panel Ready");
    
    if(typeof panelInitPostSocket == 'function')
		panelInitPostSocket();
}

/* handleSocketConnect()
 * Called by ServerComms.js file to allow the panel to init itself once the socket has been established.
 *
 * Intention is to allow panel to update its state from the server
 */
function handleSocketConnect()
{
    setPanelStatus("Panel Ready");
    
    var panelBackground = svgDocument.getElementById("panelBackground");
    if(panelBackground != null)
    {
        setStyleSubAttribute(panelBackground, "fill", connectedBackgroundColor);
    }
    
    // Now that we are connected, try to update all objects from the server
    updateAllObjectsFromServer();
}

/* handleSocketDataResponse([ServerCommsObject] dataArray)
 * Called by ServerComms.js file upon receiving data from the server.
 *
 * If server returns valid data, do something with the state as appropriate to the object type.  If server returns objects with
 * null state, then server has no state and this panel should initialize the server with the current state of the panel
 */
function handleSocketDataResponse(dataArray)
{
    if(dataArray == null)
    {
        alert("null dataArray in handleSocketDataResponse");
        return;
    }
    
    var undefinedItemsToUpdate = [];
              
    for(var i in dataArray)
    {
        if(dataArray[i].value != undefined)
        {
            if((typeof setPanelSpecificState == 'function') && setPanelSpecificState(dataArray[i]))
            {
                // do nothing if panelSpecificSetState returned true (i.e. it handled the object)
            }
            else if((typeof setDispatchObject == 'function') && setDispatchObject(dataArray[i]))
            {
                // do nothing if setDispatchObject returned true (i.e. it handled the object)
                
                //console.log(dataArray[i].name + " is being set to '" + dataArray[i].value + "'");
            }
            else if((dataArray[i].type == SERVER_TYPE_DISPATCH) && (dataArray[i].name == SERVER_NAME_MAINLINELOCKED))
            {
                mainlineLocked = (dataArray[i].value == 'true');
            }
            else if((dataArray[i].type == SERVER_TYPE_TURNOUT) && isPhysicalTurnout(dataArray[i].name))
            {
                setTurnoutState(dataArray[i].name, dataArray[i].value);
            }
            else if((dataArray[i].type == SERVER_TYPE_SENSOR) && (typeof setSensorState == 'function'))
            {
                setSensorState(dataArray[i].name, dataArray[i].value);
            }
            else
            {
                // do nothing with object since we don't know what it is
            }
        }
        else
        {
            if((typeof getPanelSpecificState == 'function') && (getPanelSpecificState(dataArray[i]) != undefined))
            {
                undefinedItemsToUpdate.push(getPanelSpecificState(dataArray[i]));
            }
            else if((dataArray[i].type == SERVER_TYPE_TURNOUT) && isPhysicalTurnout(dataArray[i].name))
            {
                var localState = getTurnoutState(dataArray[i].name);
                
                if(localState != null)
                    undefinedItemsToUpdate.push(new ServerObject(dataArray[i].name, SERVER_TYPE_TURNOUT, localState));
            }
            else if(dataArray[i].type == SERVER_TYPE_DISPATCH)
            {
                if(dataArray[i].name == SERVER_NAME_MAINLINELOCKED)
                    undefinedItemsToUpdate.push(new ServerObject(SERVER_NAME_MAINLINELOCKED, SERVER_TYPE_DISPATCH, mainlineLocked ? 'true' : 'false'));
                else if(typeof getDispatchObject == 'function')
                {
                    var dispatchState = getDispatchObject(dataArray[i]);
                                        
                    //console.log(dataArray[i].name + " is undefined and will be set to default value of '" + dispatchState.value + "'");
                    
                    if(dispatchState != undefined)
                        undefinedItemsToUpdate.push(dispatchState);
                }
            }
            else if(dataArray[i].type == SERVER_TYPE_SENSOR)
            {
                // do nothing since a sensor is a read-only object (i.e. property of the layout)
            }
        }
    }
    
    if(undefinedItemsToUpdate.length > 0)
        executePanelStateChangeRequestsLowLevel(undefinedItemsToUpdate, false);
    
    updateMainlineStatus();
        
    setPanelStatus("Panel Updated");
}


/* handleSocketTime([String] time)
 * Called by ServerComms.js file to update the svg with JMRI fast clock data.  Currently stubbed out.
 */
function handleSocketTime(time)
{
}

/* handleSocketDisconnect()
 * Called by ServerComms.js file to allow the panel to clean up itself if the socket connection is lost
 */
function handleSocketDisconnect()
{
    updatePanelBackground();

    setPanelStatus("Panel Ready");
}

function updatePanelBackground()
{
    var panelBackground = svgDocument.getElementById("panelBackground");
    if(panelBackground != null)
    {
        if((socketStatus == SOCKET_DISCONNECTED) || (nodeJMRISocketReady == false))
            setStyleSubAttribute(panelBackground, "fill", "#700000");
        else
            setStyleSubAttribute(panelBackground, "fill", connectedBackgroundColor);
    }
}

/* executePanelStateChangeRequests()
 * Panel specific code should use this method to execute all panel updates once the state change requests have been added to the stateChangeRequests array
 * 
 * This function simply executes a lower level call, passing in a the global data array and true to ensure that the mainline lockout variable is honored
 */
function executePanelStateChangeRequests()
{
    executePanelStateChangeRequestsLowLevel(stateChangeRequests, true);
}

/* executePanelStateChangeRequestsLowLevel([Array] setArray, [boolean] honorMainlineLock)
 * Iterates through all state change requests and sends them to the server.
 *
 * Panel specific code should NOT use this method (use executePanelStateChangeRequests() instead).  The server response callback
 * routine will use this routine to update mainline turnout state (by passing in false) even if the mainline is locked for
 * input on this panel.
 */
function executePanelStateChangeRequestsLowLevel(setArray, honorMainlineLock)
{
	if((setArray != null) && (setArray != undefined))
	{
		var serverSetArray = new Array();
	
        // Create the array of server items to change
		while(setArray.length > 0)
		{
			var scr = setArray.shift();
			
            // if a turnout is being requested
            if(scr.type == SERVER_TYPE_TURNOUT)
            {
                // Make sure panel is not locked.  If it is, don't allow set to go out to server
                if(honorMainlineLock)
                {
                    var turnoutInstance = getPanelTurnoutFromDCCAddr(getDCCAddr(scr.name));
                    
                    if(turnoutInstance != null)
                    {
                        var routeElem = svgDocument.getElementById(turnoutInstance.normalRouteID);
                        if(!isMainlineTurnout(routeElem) || !mainlineLocked)
                            serverSetArray.push(scr);
                    }
                }
                else
                    serverSetArray.push(scr);
            }
            else    // let all other requests go out to server
                serverSetArray.push(scr);
		}
	    
        // send comms request
        if(serverSetArray.length > 0)
            serverSet(serverSetArray);
	}
	else
	{
		alert("setArray was unexpectedly null in executePanelStateChangeRequestsLowLevel");
	}
}

function getPanelObjectsToUpdate()
{
    var serverGetArray = new Array();

    var parallelGetHash = [];
    
    // Create the array of server items we want an update on...use a parallel hash to find duplicate motor ids and remove them
    for(var i in turnoutsOnPanel)
    {
        var nextObject = turnoutsOnPanel[i].getAsServerObject();
        
        if(parallelGetHash[nextObject.name] == undefined)
        {
            parallelGetHash[nextObject.name] = nextObject;
            serverGetArray.push(nextObject);
        }
    }
    
    for(var i in blocksOnPanel)
    {
        var nextObject = blocksOnPanel[i].getAsServerObject();
        
        if(parallelGetHash[nextObject.name] == undefined)
        {
            parallelGetHash[nextObject.name] = nextObject;
            serverGetArray.push(nextObject);
        }
    }

    // Also get the dispatching mode
    serverGetArray.push(new ServerObject(SERVER_NAME_MAINLINELOCKED, SERVER_TYPE_DISPATCH));

    // Get dispatching items if this is a dispatching panel
    if(typeof getCommonDispatchStates == 'function')
    {
        var commonDispatchStates = getCommonDispatchStates();
        
        for(var cds in commonDispatchStates)
            serverGetArray.push(commonDispatchStates[cds]);            
    }

    // Get panel specific items
    if(typeof getPanelSpecificStates == 'function')
    {
        var panelSpecificStates = getPanelSpecificStates();
        
        for(var pss in panelSpecificStates)
            serverGetArray.push(panelSpecificStates[pss]);            
    }
    
    return serverGetArray;
}

/* updateAllObjectsFromServer()
 * Will force a full panel update
 */
function updateAllObjectsFromServer()
{
    // send comms request
    serverGet(getPanelObjectsToUpdate());
}

/* setTurnoutState([String] useElemID, [String] routeText)
 * Finds an SVG element (presumed to be an SVGUseElement) with the useElemID and sets the xlink:href attribute to match
 * the corresponding selected route (normal or reverse).  This is a high-level call in that it will set the
 * xlink:href attribute for all PanelTurnout objects whose base address matches the base address of useElemID.
 *
 * e.g. TO450, TO450A, TO450B will all be thrown to the same state regardless of which ID is passed.  This allows
 * the panel to replicate an interlocked crossover function (i.e. multiple motors on a single switch-it).
 */
function setTurnoutState(useElemID, routeText)
{
    var dccAddr = getDCCAddr(useElemID);
    
    for(var i in turnoutsOnPanel)
    {
        var turnoutInstance = turnoutsOnPanel[i];
        
        if(turnoutInstance.getDCCID() == dccAddr)
            turnoutInstance.setSVGState(routeText);
    }
}

/* [String] getTurnoutState([String] useElemID)
 * Finds an SVG element (presumed to be an SVGUseElement) with the useElemID and returns the state of the points (normal
 * or reverse) based upon the xlink:href attribute being utilized by the SVGUseElement.  It does NOT query a server for
 * turnout state. Returns null if the useElemID could not be found.
 */
function getTurnoutState(dccAddr)
{	
    var panelTurnout = getPanelTurnoutFromDCCAddr(getDCCAddr(dccAddr));
    
    if(panelTurnout != null)
    {
        return panelTurnout.getSVGState();
    }
	
	return null;
}

/* [Array] getAllObjectsOfTagNameAndID([String] matchTagName, [String] matchID)
 * Returns an array of objects whose SVG file tags match matchTagName.  That result is then filtered to find an object
 * (or subset of objects) whose ID matches the regex pattern matchID.
 */
function getAllObjectsOfTagNameAndID(matchTagName, matchID)
{
    var elems = document.getElementsByTagName(matchTagName);
	var matchList=new Array();
    for(var i in elems)
	{
        if(elems[i].id != undefined)
        {
            if(elems[i].id.search(matchID) > -1)
                matchList.push(elems[i]);
        }
    }
	
	return matchList;
}

/* getSVGText([String] elemID)
 * Gets the text of an SVGTextElement or SVGTSpanElement element
 */
function getSVGText(elemID)
{
	var textItem = svgDocument.getElementById(elemID);
		
	if(textItem != null)
	{
		if(textItem == "[object SVGTextElement]")
			return textItem.firstChild.firstChild.nodeValue;
		else if(textItem == "[object SVGTSpanElement]")
			return textItem.firstChild.nodeValue;
	}
	else
	{
		alert("getSVGText(...) failed on element ID " + elemID);
		return null;
	}
}

/* setSVGText([String] elemID, [String] text)
 * Sets the text of an SVGTextElement or SVGTSpanElement element
 */
function setSVGText(elemID, text)
{
	var textItem = svgDocument.getElementById(elemID);
		
	if(textItem != null)
	{
        var textNode = null;
        
		if(textItem == "[object SVGTextElement]")
            textNode = textItem.firstChild.firstChild;
        else if(textItem == "[object SVGTSpanElement]")
            textNode = textItem.firstChild;
        
        if(textNode != null)
        {
            // Following two lines workaround a problem in Safari 6
            textNode.nodeValue=".";
            textNode.nodeValue=". ";
        
            textNode.nodeValue=text;
            return;
        }
	}
    
    alert("setSVGText(...) failed to update string to " + text + " on element ID " + elemID);
}

/* setStyleSubAttribute([SVGElement] elem, [String] subAttribName, [String] subAttribValue)
 * Adds or replaces subattribute value in the delimited list of styles in the style attribute of an SVG element
 */
function setStyleSubAttribute(elem, subAttribName, subAttribValue)
{
    var currentStyle = elem.getAttribute("style");
        
    var nvPairs = currentStyle.split(";");
    
    var styleFound = false;
    for(var i = 0; i < nvPairs.length; i++)
    {
        var nv = nvPairs[i].split(":");
        
        if(nv[0] == subAttribName)
        {
            nvPairs[i] = subAttribName + ":" + subAttribValue;
            styleFound = true;
            continue;
        }
    }
    
    if(styleFound == false)
        nvPairs.push(subAttribName + ":" + subAttribValue);
    
    var newStyle = "";
    for(i = 0; i < nvPairs.length; i++)
        newStyle = newStyle + nvPairs[i] + ";"
    
    elem.setAttribute("style", newStyle);
}

/* getStyleSubAttribute([SVGElement] elem, [String] subAttribName)
 * Returns subattribute value from the delimited list of styles in the style attribute of an SVG element
 */
function getStyleSubAttribute(elem, subAttribName)
{
    var currentStyle = elem.getAttribute("style");
    
    var nvPairs = currentStyle.split(";");
    
    for(var i = 0; i < nvPairs.length; i++)
    {
        var nv = nvPairs[i].split(":");
        
        if(nv[0] == subAttribName)
            return nv[1];
    }
    
    return null;
}

/* removeStyleSubAttribute([SVGElement] elem, [String] subAttribName)
 * Removes "subAttribName=*;" from the delimited list of styles in the style attribute of an SVG element
 */
function removeStyleSubAttribute(elem, subAttribName)
{
    var currentStyle = elem.getAttribute("style");
    
    var nvPairsO = currentStyle.split(";");
    var nvPairsN = "";
    
    for(var i = 0; i < nvPairsO.length; i++)
    {
        var nv = nvPairsO[i].split(":");
        
        if(nv[0] != subAttribName)
            nvPairsN = nvPairsN + nvPairsO[i] + ";";
    }
    
   elem.setAttribute("style", nvPairsN);
}

/* setPanelStatus([String] text)
 * Sets the text of the panelStatus textItem to the string passed in. This panel status is only shown for 2 seconds
 * before reverting back to "Panel Ready" via the window.setTimeout function
 */
function setPanelStatus(text)
{
	var textItem = svgDocument.getElementById("panelStatus");
	if(textItem != null)
	{
		if(debugStringTimerOn && (text != "Panel Ready"))
			window.setTimeout("setPanelStatus(\"Panel Ready\")",2000)
	
        setSVGText("panelStatus", text + " (" + socketStatus + ")");
	}
	else
		alert("setPanelStatus(...) failed to update string to " + text);
}

/* setPanelError([String] text)
 * Sets the text of the panelStatus textItem to the string passed in. Unlike setPanelStatus, the string is shown
 * indefinitely (or until next setPanelStatus/Error call is made)
 */
function setPanelError(text)
{
	var debugStringTimerWasOn = debugStringTimerOn;
	debugStringTimerOn = false;
	setPanelStatus(text);
	debugStringTimerOn = debugStringTimerWasOn;
}

/* [String] getPanelSVGTextTitle()
 * Returns the panel title as displayed by SVG text
 */
function getPanelSVGTextTitle()
{
    var panelTitle = svgDocument.getElementById("panelTitle");
    
    if(panelTitle != null)
        return panelTitle.firstChild.firstChild.nodeValue;
        
    return "Untitled";
}

/* [String] getPanelMetadataTitle()
 * Returns the panel title as defined by the SVG file's metadata:RDF:Work:title tag
 */
function getPanelMetadataTitle()
{    
    var elems = document.getElementsByTagName("Work");

    if(elems != null)
    {
        for(var j = 0; j < elems.length; j++)
        {
            for(var i = 0; i < elems[j].childNodes.length; i++)
            {
                if(elems[j].childNodes[i] == '[object Element]')
                {
                    if((elems[j].childNodes[i].nodeName == "dc:title") && (elems[j].childNodes[i].firstChild != null))
                        return elems[j].childNodes[i].firstChild.nodeValue;
                }
            }
        }
    }
    
    return null;
}

/* [String] getPanelDocumentTitle()
 * Returns the document title
 */
function getPanelDocumentTitle()
{    
    return getElementTitle("title1");
}

/* [String] setPanelDocumentTitle([String] newTitle)
 * Sets the document title
 */
function setPanelDocumentTitle(newTitle)
{
    setElementTitle(svgDocument.getElementById("title1"), newTitle);
}

/* [SVGTitleElement] getElementTitle([String] elemID)
 * Returns the element title object
 */
function getElementTitleObj(elemID)
{
    var elem = svgDocument.getElementById(elemID);
    
    if(elem == null)
        return null;
        
    for(var i = 0; i < elem.childNodes.length; i++)
    {
        if(elem.childNodes[i] == '[object SVGTitleElement]')
            return elem.childNodes[i];
    }
    
    return null;
}

/* [String] getElementTitle([String] elemID)
 * Returns the element title object
 */
function getElementTitle(elemID)
{
    var elem = getElementTitleObj(elemID);
        
    if(elem != null)
        return elem.firstChild.nodeValue;
    
    return null;
}

/* setElementTitle([SVGTitleElement] elem, [String] title)
 * Sets the element title object
 */
function setElementTitle(elem, title)
{
    if(elem != null)
        elem.firstChild.nodeValue = title;
}

/* addElementTitle([String] elemID, [String] title)
 * Adds the element title object
 */
function addElementTitle(elemID, title)
{
    var titleObj = getElementTitleObj(elemID);
    
    if(titleObj != null)
        setElementTitle(titleObj, title);
    else
    {        
        // Create the title element on the fly here.
        var elem = svgDocument.getElementById(elemID);
    
        if(elem != null)
        {
            var titleElem = svgDocument.createElementNS(xmlns, "title");
            var textNode = svgDocument.createTextNode(title);

            titleElem.appendChild(textNode);
        
            elem.insertBefore(titleElem, elem.firstChild);
        }
    }    
}

/* setLEDColor([SVGElement] LED, [String] color)
 * Sets fill and stroke of an object to provided color, unless color is "off", in which case a mid-gray is substituted
 */
function setLEDColor(LED, color)
{
    if((LED != undefined) && (LED != null))
    {
        setStyleSubAttribute(LED, "fill", color == "off" ? "#808080" : color);
        setStyleSubAttribute(LED, "stroke", color == "off" ? "#808080" : color);
    }
}

/* setLEDColorByID([String] LED, [String] color)
 * Sets LED color by providing object ID
 */
function setLEDColorByID(LED, color)
{
    setLEDColor(svgDocument.getElementById(LED), color);
}

/* updateMainlineStatus()
 * Sets opacity, clickability, and visibility of three layers as determined by the mainlineLocked global variable as well as cookies.  Will also
 * start/stop opacity animation of lock group as appropriate
 */
function updateMainlineStatus()
{
	var mainlineLockGroup = svgDocument.getElementById("mainlineLockedGroup");
	var mainlineTrackLayer = svgDocument.getElementById("mainlineTrackLayer");
	
	if(mainlineLocked)
	{
		mainlineTrackLayer.setAttribute("style", "opacity:0.5");
		mainlineTrackLayer.setAttribute("pointer-events", "none");
		mainlineLockGroup.setAttribute("visibility", "visible");
    }
	else
	{
		mainlineTrackLayer.setAttribute("style", "opacity:1.0");
		mainlineTrackLayer.setAttribute("pointer-events", "visiblePainted");
		mainlineLockGroup.setAttribute("visibility", "hidden");
	}
    
    setLEDColorByID('dispatchMainlineLockedLED', mainlineLocked == true ? "#ff0000" : "off");

    var disableLayer = true;

    if(cookiesDefined[2].isSet())
        disableLayer = mainlineLocked;

    disablePanelLayer("mainlinePanelLinkLayer", cookiesDefined[0].isSet() && disableLayer);
    disablePanelLayer("industrialPanelLinkLayer", cookiesDefined[1].isSet() && disableLayer);

    updateMainlineLockGroup();
}

function disablePanelLayer(layerName, disable)
{
    var panelLinkLayer = svgDocument.getElementById(layerName);
    
    if(panelLinkLayer != null)
    {
        if(disable)
        {
            panelLinkLayer.setAttribute("pointer-events", "none");
            panelLinkLayer.setAttribute("style", "opacity:0.5");
        }
        else
        {
            panelLinkLayer.setAttribute("pointer-events", "visiblePainted");
            panelLinkLayer.setAttribute("style", "opacity:1.0");
        }
    }
}

/* updateMainlineLockGroup()
 * Animates opacity of the mainlineLockGroup objects to a sine wave function, between 50 and 100% opacity
 */
function updateMainlineLockGroup()
{
	var mainlineLockGroup = svgDocument.getElementById("mainlineLockedGroup");

	if(mainlineLockGroup.getAttribute("visibility") == "visible")
	{
        // if visible, animate opacity of the lock group
		mainLockCounter = (mainLockCounter + 1) % mainLockMod;
		mainlineLockGroup.setAttribute("style", "opacity:" + (0.75 + 0.25*Math.sin(mainLockTimebase*mainLockCounter)));
		
        // If timer isn't currently set, set it now to start animation
        if(mainLockTimerID == null)
            mainLockTimerID = window.setInterval("updateMainlineLockGroup()", 75);
	}
    else
    {
        // if hidden, no reason to continue to evaluate animation code.  Turn off interval timer
        if(mainLockTimerID != null)
        {
            clearInterval(mainLockTimerID);
            mainLockTimerID = null;
        }
    }
}

/* toggleMainlineLock()
 * Inverts the mainlineLocked global variable and updates all SVG objects according to that new status
 */
function toggleMainlineLock()
{
    // Create new empty array
    var panelChangeRequests = new Array();
    
    // Add inverted mainline lock to array
    panelChangeRequests.push(new ServerObject(SERVER_NAME_MAINLINELOCKED, SERVER_TYPE_DISPATCH, mainlineLocked ? 'false' : 'true'));
    
    // Perform update
    executePanelStateChangeRequestsLowLevel(panelChangeRequests, false);
}

/* [boolean] isMainlineTurnout([SVGElement] obj)
 * Determines if object is on mainline (created simply for code readability)
 */
function isMainlineTurnout(obj)
{
	return isOnMainlineLayer(obj);
}

/* [boolean] isOnMainlineLayer([SVGElement] obj)
 * Recursive function to determine if SVGElement is on the mainline layer. Searches parents until either the mainline track
 * layer object is found or the svg document itself is found.
 */
function isOnMainlineLayer(obj)
{
	var mainlineTrackLayer = svgDocument.getElementById("mainlineTrackLayer");
	
	if((mainlineTrackLayer != null) && (obj == mainlineTrackLayer))
		return true;
	
	if((obj == svgDocument) || (obj == null))
		return false;
		
	return isOnMainlineLayer(obj.parentNode);
}

/* [String] getPanelObjType([String] objID)
 * Returns the object type as encoded in the object ID.  ID is assumed to be of the form: ttt###aaa, where
 *     t is the object type, ### are numeric characters, and aaa is an optional alphabetic submotor address
 * This function thus returns ttt (e.g. TO450A will return TO) or null if the ### characters could not be found
 */
function getPanelObjType(objID)
{
	var position = objID.search("[0-9]");
	
	if(position != -1)
		return objID.substring(0, position);
	
	return null;
}

/* [String] getDCCAddrAndMotorSubAddr([String] objID)
 * Returns the DCC address and motor subaddress as encoded in the object ID.  ID is assumed to be of the form: ttt###aaa,
 * where
 *     t is the object type, ### are numeric characters, and aaa is an optional alphabetic submotor address
 * This function thus returns ###aaa (e.g. TO450A will return 450A) or null if the ### characters could not be found
 */
function getDCCAddrAndMotorSubAddr(objID)
{
	var position = objID.search("[0-9]");
	var positionOfDot = objID.search("[.]");
    
	if((position != -1) && (positionOfDot == -1))
    {
        var lastChar = objID.substring(objID.length-1);
        if((lastChar == 'R') || (lastChar == 'r') || (lastChar == 'N') || (lastChar == 'n'))
            return objID.substring(position, objID.length-1);
        
		return objID.substring(position);
    }
    
	if((position != -1) && (positionOfDot != -1))
        return objID.substring(position, positionOfDot);
	
	return null;
}

function getDCCAddrRoute(objID)
{
	var positionOfDot = objID.search("[.]");
    
    if(positionOfDot != -1)
    {
        var route = objID.substring(positionOfDot+1);
        
        if((route == 'R') || (route == 'r'))
            return 'R';
        
        if((route == 'N') || (route == 'n'))
            return 'N';
        
        if((route == 'T') || (route == 't'))
            return 'T';
    }
    else
    {
        var dccMotorAddr = getDCCAddrAndMotorSubAddr(objID);
        
        if(dccMotorAddr != null)
        {
            var position = objID.search(dccMotorAddr);
        
            if(position != -1)
            {
                var route = objID.substring(position + dccMotorAddr.length);
                
                if((route == 'R') || (route == 'r'))
                    return 'R';
                
                if((route == 'N') || (route == 'n'))
                    return 'N';
                
                if((route == 'T') || (route == 't'))
                    return 't';
            }
        }
    }
	
	return null;
}

/* [String] getDCCAddr([String] objID)
 * Returns the DCC address only as encoded in the object ID.  ID is assumed to be of the form: ttt###aaa,
 * where
 *     t is the object type, ### are numeric characters, and aaa is an optional alphabetic submotor address
 * This function thus returns ### (e.g. TO450A will return 450)
 */
function getDCCAddr(objID)
{
	var dccMotorAddr = getDCCAddrAndMotorSubAddr(objID);
	
    if(dccMotorAddr != null)
    {
        var position = dccMotorAddr.search("\\D");
	
        if(position != -1)
            return dccMotorAddr.substring(0, position);
	
        return dccMotorAddr;
    }
    else
    {
        console.log(objID + " was not a valid dcc address and moter sub address.");
    }
    
    return null;
}

/* [String] getMotorSubAddr([String] objID)
 * Returns the motor subaddress only as encoded in the object ID.  ID is assumed to be of the form: ttt###aaa,
 * where
 *     t is the object type, ### are numeric characters, and aaa is an optional alphabetic submotor address
 * This function thus returns aaa (e.g. TO450A will return A). Returns null if submotor address was not present
 */
function getMotorSubAddr(objID)
{
	var dccMotorAddr = getDCCAddrAndMotorSubAddr(objID);
	
	if(dccMotorAddr != null)
	{
		var position = dccMotorAddr.search("\\D");
		
		if(position != -1)
			return dccMotorAddr.substring(position);
	}
	
	return null;
}

/* [boolean] turnoutHasMultipleMotors([String] objID)
 * Indicates whether the object ID has the submotor field preset. ID is assumed to be of the form: ttt###aaa,
 * where
 *     t is the object type, ### are numeric characters, and aaa is an optional submotor address
 * This function thus returns true if aaa is not empty (e.g. TO450A will return true).
 */
function turnoutHasMultipleMotors(objID)
{
	return (getMotorSubAddr(objID) != null);
}

/* Cookies */
function Cookie(cname, defaultValue, explanation)
{
    var cpath = "/";

    this.name = cname;
    this.defaultValue = defaultValue;
    this.explanation = explanation;
    this.path = "path=" + cpath;
    
    this.getCookie = getCookie;
    this.setCookie = setCookie;
    this.deleteCookie = deleteCookie;
    
    this.isSet = isSet;
}

function isSet()
{
    return this.getCookie() == this.defaultValue;
}

function getCookie()
{
    var cname = this.name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(cname)==0) return c.substring(cname.length,c.length);
    }
    return "";
}

function setCookie(exdays)
{
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = this.name + "=" + this.defaultValue + "; " + expires + "; " + this.path;
}

function deleteCookie()
{
    this.setCookie(-1);
}
