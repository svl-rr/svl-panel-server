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

var PANEL_SENSOR_OBJID_PREFIX = "OD";
var JMRI_SENSOR_OBJID_PREFIX = "NS";

// Disables 2 second setPanelStatus timer
var debugStringTimerOn = true;

// Enables attempts to accesss server
var enableServerAccesses = true;

// Object lists
var turnoutsOnPanel = new Array();
var stateChangeRequests = new Array();
//var signalsOnPanel = new Array();

// Object types we can send to the server
var SERVER_TYPE_TURNOUT = "turnout";
var SERVER_TYPE_DISPATCH = "dispatch";
var SERVER_TYPE_SENSOR = "sensor";
//var SERVER_TYPE_SIGNAL = "signal";

var SERVER_NAME_MAINLINELOCKED = "Mainline Locked";

var connectedBackgroundColor = null;

/* PanelTurnout([String] id, [boolean] flipBit)
 * PanelTurnout object to contain id and flipbit, which is used to invert the graphic status
 */
function PanelTurnout(id, flipBit)
{
	this.id=id;
	this.flipBit=flipBit;
	
	this.getID=getID;
	this.getFlipBit=getFlipBit;
    this.getAsServerObject=getAsServerObject;
    
    var useElem = svgDocument.getElementById(id);
	
	if(useElem == null)
	{
		alert("Attempted to create a PanelTurnout object with ID " + id + " but no SVG object with that ID was found.");
		return;
	}
    
    // Make sure title element matches the object ID
    addElementTitle(id, id);
}


/* [String] getID()
 * Return id field of PanelTurnout
 */
function getID()
{
	return this.id;
}

/* [boolean] getFlipBit()
 * Return getFlipBit field of PanelTurnout
 */
function getFlipBit()
{
	return this.flipBit;
}

/* [ServerObject] getAsServerObject()
 * Return PanelTurnout as a server object, preset as a get (null state)
 */
function getAsServerObject()
{
    var turnoutAddr = getDCCAddr(this.id);
    
    return new ServerObject(JMRI_TURNOUT_OBJID_PREFIX + turnoutAddr, SERVER_TYPE_TURNOUT, getTurnoutState(turnoutAddr));
}

/* createPanelTurnout([String] id, [boolean] flipBit)
 * Creates a new PanelTurnout object and pushes it on to the array of turnouts used by this panel
 *
 * Panel specific code should use this method to create it's list of turnouts
 */
function createPanelTurnout(id, flipBit)
{
	turnoutsOnPanel.push(new PanelTurnout(id, flipBit));
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
 * Each panel needs to provide a panelInit(evt) function that it uses to initialize the specifics of that panel (namely,
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
    
	if(typeof panelInit == 'function')
		panelInit(evt);
	else
	{
		var errorStr = "Panel could not be initialized as panelInit function could not be found";
		setPanelError(errorStr);
		alert(errorStr);
		return;
	}

    // Allow dispatch panels to initialize themselves
    if(typeof dispatchInit == 'function')
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
	
    // Check to see if metadata/window title and svg title text match
    var panelMetadataTitle = getPanelMetadataTitle();
    var panelSVGTextTitle = getPanelSVGTextTitle();
    if(panelMetadataTitle != panelSVGTextTitle)
    {
        alert("Panel title (" + panelSVGTextTitle + ") does not match metadata/window title (" + panelMetadataTitle + ")!");
    }
                                                    
	setPanelStatus("Panel Ready");
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
    var undefinedItemsToUpdate = [];
              
    for(var i in dataArray)
    {
        if(dataArray[i].value != undefined)
        {
            if((typeof setPanelSpecificState == 'function') && setPanelSpecificState(dataArray[i]))
            {
                // do nothing if panelSpecificSetState returned true (i.e. it handled the object)
            }
            else if((typeof setDispatchState == 'function') && setDispatchState(dataArray[i]))
            {
                // do nothing if setDispatchState returned true (i.e. it handled the object)
            }
            else if((dataArray[i].type == SERVER_TYPE_DISPATCH) && (dataArray[i].name == SERVER_NAME_MAINLINELOCKED))
            {
                mainlineLocked = dataArray[i].value;
            }
            else if(dataArray[i].type == SERVER_TYPE_TURNOUT)
                setTurnoutState(dataArray[i].name, dataArray[i].value);
            else
            {
                // do nothing with object since we don't know what it is
            }
        }
        else
        {
            if(dataArray[i].type == SERVER_TYPE_TURNOUT)
            {
                var localState = getTurnoutState(dataArray[i].name);
                
                if(localState != null)
                    undefinedItemsToUpdate.push(new ServerObject(dataArray[i].name, SERVER_TYPE_TURNOUT, localState));
            }
            else if(dataArray[i].type == SERVER_TYPE_DISPATCH)
            {
                if(dataArray[i].name == SERVER_NAME_MAINLINELOCKED)
                    undefinedItemsToUpdate.push(new ServerObject(SERVER_NAME_MAINLINELOCKED, SERVER_TYPE_DISPATCH, mainlineLocked));
                else if(typeof getDispatchState == 'function')
                {
                    var dispatchState = getDispatchState(dataArray[i]);
                    if(dispatchState != undefined)
                        undefinedItemsToUpdate.push(dispatchState);
                }
            }
            else if(typeof getPanelSpecificState == 'function')
            {
                var panelSpecificState = getPanelSpecificState(dataArray[i]);
                if(panelSpecificState != undefined)
                    undefinedItemsToUpdate.push(panelSpecificState);
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
    var panelBackground = svgDocument.getElementById("panelBackground");
    if(panelBackground != null)
    {
        setStyleSubAttribute(panelBackground, "fill", "#700000");
    }

    setPanelStatus("Panel Ready");
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
                    if(!isMainlineTurnout(findTurnoutSVGElement(scr.name)) || !mainlineLocked)
                        serverSetArray.push(scr);
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
    
    // Also get the dispatching mode
    serverGetArray.push(new ServerObject(SERVER_NAME_MAINLINELOCKED, SERVER_TYPE_DISPATCH, mainlineLocked));

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

/* getTurnout([String] id)
 * Searches turnouts on the panel and returns the PanelTurnout with the provided id. Returns null if the id was not found
 */
function getTurnout(id)
{
	for(var i in turnoutsOnPanel)
	{
		if(turnoutsOnPanel[i].getID() == id)
			return turnoutsOnPanel[i];
	}
	
	return null;
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
	var setNormal = true;
	
	if((routeText == "N") || (routeText == "n"))
		setNormal = true;
	else if((routeText == "R") || (routeText == "r"))
		setNormal = false;
	else
	{
		setPanelError("Bad route parameter passed to setTurnoutState(" + useElemID + ", " + routeText + ")");
		return;
	}
		
    var turnoutAddr = PANEL_TURNOUT_OBJID_PREFIX + getDCCAddr(useElemID);
    
	setTurnoutSVGLowLevel(turnoutAddr, setNormal);
	
    // Attempt to set all motors A-Z
	var nextMotor = 'A';
	setTurnoutSVGLowLevel(turnoutAddr + nextMotor, setNormal);
	while(nextMotor != 'Z')
	{		
		nextMotor = String.fromCharCode(nextMotor.charCodeAt(0) + 1);
		
		setTurnoutSVGLowLevel(turnoutAddr + nextMotor, setNormal);
	}
}

/* [String] getTurnoutState([String] useElemID)
 * Finds an SVG element (presumed to be an SVGUseElement) with the useElemID and returns the state of the points (normal
 * or reverse) based upon the xlink:href attribute being utilized by the SVGUseElement.  It does NOT query a server for
 * turnout state. Returns null if the useElemID could not be found.
 */
function getTurnoutState(useElemID)
{
	var useElem = findTurnoutSVGElement(useElemID);
	
    if(useElem != null)
    {
        var turnout = getTurnout(useElem.id);
	
        if(turnout != null)
        {
            var currentImg = getTurnoutHREFImage(useElem);
            
            // turnout states
            if(currentImg.search("normal") != -1)
                return turnout.getFlipBit() ? 'R' : 'N';
            else if(currentImg.search("reverse") != -1)
                return turnout.getFlipBit() ? 'N' : 'R';
        }
    }
	
	return null;
}

/* [SVGUseElement] findTurnoutSVGElement([String] useElemID)
 * Finds a SVG element (presumed to be an SVGUseElement associated with a turnout) with the base DCC address contained in
 * useElemID.  If that object is not found, it will attempt to find a turnout with a submotor designation (A-Z), by simply
 * appending the character to the turnout ID already tried.  Returns null if no objects found.
 */
function findTurnoutSVGElement(useElemID)
{
    var turnoutAddr = PANEL_TURNOUT_OBJID_PREFIX + getDCCAddr(useElemID);

	var useElem = svgDocument.getElementById(turnoutAddr);
	
    // If base address not found, attempt to find an element id with A-Z appended
    var nextMotor = 'A';
	while(useElem == null)
	{		
		useElem = svgDocument.getElementById(turnoutAddr + nextMotor);
        
        if(nextMotor == 'Z')
            break;
        else
            nextMotor = String.fromCharCode(nextMotor.charCodeAt(0) + 1);
	}
    
    return useElem;
}

/* [boolean] setTurnoutSVGLowLevel([String] useElemID, [boolean] setNormal)
 * Finds an SVG element (presumed to be an SVGUseElement) with the useElemID and sets the xlink:href attribute to match
 * the corresponding selected route (normal or reverse).  This is a low-level call in that it will set the
 * xlink:href attribute on only the SVGUseElement whose ID is an exact match with useElemID. Returns true if the useElemID
 * object was found or false if not.
 */
function setTurnoutSVGLowLevel(useElemID, setNormal)
{
	var useElem = svgDocument.getElementById(useElemID);
	var turnout = getTurnout(useElemID);
	
	if((useElem != null) && (turnout != null))
	{
		if(turnout.getFlipBit() == true)
			setNormal = !setNormal;
		
		var currentImg = getTurnoutHREFImage(useElem);
		
		if(currentImg.search("turnout_0deg") != -1)
		{
			if(setNormal)
				setTurnoutHREFImage(useElem, "#turnout_0deg_normal");
			else
				setTurnoutHREFImage(useElem, "#turnout_0deg_reverse");
		}
		else if(currentImg.search("turnout_45deg") != -1)
		{
			if(setNormal)
				setTurnoutHREFImage(useElem, "#turnout_45deg_normal");
			else
				setTurnoutHREFImage(useElem, "#turnout_45deg_reverse");
		}
		else if(currentImg.search("ds_") != -1)
		{
			if(setNormal)
				setTurnoutHREFImage(useElem, "#ds_normal");
			else
				setTurnoutHREFImage(useElem, "#ds_reverse");
		}
		else if(currentImg.search("dblxovr_0deg") != -1)
		{
			if(setNormal)
				setTurnoutHREFImage(useElem, "#dblxovr_0deg_normal");
			else
				setTurnoutHREFImage(useElem, "#dblxovr_0deg_reverse");
		}
		else if(currentImg.search("dblxovr_45deg") != -1)
		{
			if(setNormal)
				setTurnoutHREFImage(useElem, "#dblxovr_45deg_normal");
			else
				setTurnoutHREFImage(useElem, "#dblxovr_45deg_reverse");
		}
		
		return true;
	}
	
	return false;
}

/* [String] getTurnoutHREFImage([SVGUseElement] useElem)
 * Returns the xlink:href attribute of the SVGUseElement passed in.
 */
function getTurnoutHREFImage(useElem)
{
	return useElem.getAttributeNS(xlinkns, hrefAttrib);
}

/* setTurnoutHREFImage([SVGUseElement] useElem, [String] imageToUse)
 * Sets the xlink:href attribute of the SVGUseElement provided.
 */
function setTurnoutHREFImage(useElem, imageToUse)
{	
	useElem.setAttributeNS(xlinkns, hrefAttrib, imageToUse);
	
	setPanelStatus(useElem.id + " was set to " + imageToUse);
}

/* toggleTurnout([String] useElemID)
 * Creates a turnout state request object and adds it to the change request queue.  Queue (having only the single entry)
 * is then executed. SVG symbol definition uses this function as the default onclick function for when the user clicks
 * a single turnout element on the panel.
 */
function toggleTurnout(useElemID)
{
	var initialState = getTurnoutState(useElemID);
	
    if(initialState != null)
    {        
        addTurnoutStateChangeRequest(useElemID, 'T');
        executePanelStateChangeRequests();
	
        if((socketStatus == SOCKET_DISCONNECTED) || !enableServerAccesses)
            setPanelStatus(useElemID + " was toggled from " + initialState + " to " + getTurnoutState(useElemID));
        else
            setPanelStatus(useElemID + " sent toggle request from " + initialState + " to " + (initialState == 'N' ? 'R' : 'N'));
    }
    else
        setPanelStatus("Attempt to toggle turnout " + useElemID + " failed because it could not be found.");
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
		if(textItem == "[object SVGTextElement]")
			textItem.firstChild.firstChild.nodeValue=text;
		else if(textItem == "[object SVGTSpanElement]")
			textItem.firstChild.nodeValue=text;
	}
	else
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
	debugStringTimerWasOn = debugStringTimerOn;
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
        alert("You found a bug! Well, incomplete code really. Have SVG document author add a title element to avoid this issue. ObjID: " + elemID);
        
        // figure out how to create the title element on the fly here.
    }    
}

/* updateMainlineStatus()
 * Sets opacity, clickability, and visibility of three layers as determined by the mainlineLocked global variable.  Will also
 * start/stop opacity animation of lock group as appropriate
 */
function updateMainlineStatus()
{
	var mainlineLockGroup = svgDocument.getElementById("mainlineLockedGroup");
	var mainlineTrackLayer = svgDocument.getElementById("mainlineTrackLayer");
	var mainlinePanelLinks = svgDocument.getElementById("mainlinePanelLinkLayer");
	
	if(mainlineLocked)
	{
		mainlineTrackLayer.setAttribute("style", "opacity:0.5");
		mainlineTrackLayer.setAttribute("pointer-events", "none");
		mainlinePanelLinks.setAttribute("pointer-events", "none");
		mainlineLockGroup.setAttribute("visibility", "visible");
    }
	else
	{
		mainlineTrackLayer.setAttribute("style", "opacity:1.0");
		mainlineTrackLayer.setAttribute("pointer-events", "visiblePainted");
		mainlinePanelLinks.setAttribute("pointer-events", "visiblePainted");
		mainlineLockGroup.setAttribute("visibility", "hidden");
	}
    
    if(typeof setDispatchMainlineLockLEDColor == 'function')
        setDispatchMainlineLockLEDColor(svgDocument.getElementById('dispatchMainlineLockedLED'), mainlineLocked == true ? "#ff0000" : "off");

    updateMainlineLockGroup();
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
    // Actually toggle the variable
	mainlineLocked = !mainlineLocked;
    
    // Create new empty array
    var panelChangeRequests = new Array();
    
    // Add mainline lock to array
    panelChangeRequests.push(new ServerObject(SERVER_NAME_MAINLINELOCKED, SERVER_TYPE_DISPATCH, mainlineLocked));
    
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
	
	if(position != -1)
		return objID.substring(position);
	
	return null;
}

/* [String] getDCCAddrAndMotorSubAddr([String] objID)
 * Returns the DCC address only as encoded in the object ID.  ID is assumed to be of the form: ttt###aaa,
 * where
 *     t is the object type, ### are numeric characters, and aaa is an optional alphabetic submotor address
 * This function thus returns ### (e.g. TO450A will return 450)
 */
function getDCCAddr(objID)
{
	var dccMotorAddr = getDCCAddrAndMotorSubAddr(objID);
	
	var position = dccMotorAddr.search("\\D");
	
	if(position != -1)
		return dccMotorAddr.substring(0, position);
	
	return dccMotorAddr;
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