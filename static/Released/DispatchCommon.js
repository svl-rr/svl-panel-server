// Constant id prefix for objects
var DISPATCHSEGMENT_OBJID_PREFIX = "block";


var UNAUTHORIZED_STATE = "Unauthorized";
var AUTHORIZED_NB_STATE = "Authorized NB";
var AUTHORIZED_SB_STATE = "Authorized SB";
var OCCUPIED_NB_STATE = "Occupied NB";
var OCCUPIED_SB_STATE = "Occupied SB";
var OOS_STATE = "Out of Service";
var OCCUPIED_STATE = "Occupied";

var dispatchSegmentStates = new Array();

var nextAuthorizationState = OOS_STATE;
var nextAuthorizationTrainID = "";

var selectionRect;
var selectedNSO;

var AUTHORIZED_COLOR = "#00ff00";
var OCCUPIED_COLOR = "#ff0000";
var OOS_COLOR = "#0000ff";
var UNAUTHORIZED_COLOR = "white";

var alwaysShowTrainID = true;

/* dispatchInit([Event] evt)
 * Called by PanelCommon.js to initialize dispatching separately
 */
function dispatchInit(evt)
{
	selectionRect = svgDocument.getElementById("selectedTrainIDRect");

	if(selectionRect == null)
		alert("Train ID selection rect could not be found in dispatchInit()!");
	else
		selectionRect.setAttribute("visibility", "hidden");
		
	var textElements = getAllObjectsOfTagNameAndID("text", "block\\S*TrainLabel");
	for(var i in textElements)
		setSVGText(textElements[i].id, "");
    
    textElements = getAllObjectsOfTagNameAndID("text", "[n|s|o][0-9]+Label");
	for(var j in textElements)
		setStyleSubAttribute(textElements[j], "cursor", "pointer");
    
	textElements = getAllObjectsOfTagNameAndID("text", "[n|s|o][0-9]+Train");
	for(var j in textElements)
    {
		setSVGText(textElements[j].id, "");
        setStyleSubAttribute(textElements[j], "cursor", "pointer");
    }
    
    var allBlockElements = getAllObjectsOfTagNameAndID("path", DISPATCHSEGMENT_OBJID_PREFIX + "\\d+[A-Z]?");
    
    for(var j in allBlockElements)
    {
        var rIndex = allBlockElements[j].id.indexOf("R");
        var nIndex = allBlockElements[j].id.indexOf("N");
            
        var currentBlockID = DISPATCHSEGMENT_OBJID_PREFIX + getDCCAddr(allBlockElements[j].id) + (rIndex != -1 ? "R" : (nIndex != -1 ? "N" : ""));
        
        dispatchSegmentStates[currentBlockID] = {name:currentBlockID, state:UNAUTHORIZED_STATE, trainID:UNAUTHORIZED_STATE};
    }
    
    var allTurnoutElements = getAllObjectsOfTagNameAndID("path", PANEL_TURNOUT_OBJID_PREFIX + "\\d+[A-Z]?[RrNn]");

    for(var k in allTurnoutElements)
    {    
        dispatchSegmentStates[allTurnoutElements[k].id] = {name:allTurnoutElements[k].id, state:UNAUTHORIZED_STATE, trainID:UNAUTHORIZED_STATE};
    }
}

/* setSensorState([String] sensorID, [String] sensorState)
 * Advances block authorization to next state in table. This is how JMRI sensor updates will enter in to 
 */
function setDispatchSensorState(sensorID, sensorState)
{
    var elemID = DISPATCHSEGMENT_OBJID_PREFIX + getDCCAddr(sensorID);
    var currentState = getDispatchSegmentState(elemID);             // will be null if a turnout
    var currentNState = getDispatchSegmentState(elemID + "N");      // will be null if not a turnout
    var currentRState = getDispatchSegmentState(elemID + "R");      // will be null if not a turnout
    
	if(sensorState == JMRI_SENSOR_ACTIVE)
	{
        // Standard block activated
        if((currentState != null) && (currentNState == null) && (currentRState == null))
        {
            if(currentState == AUTHORIZED_NB_STATE)
            {
                setDispatchBlockState(elemID, OCCUPIED_NB_STATE, null);
            }
            else if(currentState == AUTHORIZED_SB_STATE)
            {
                setDispatchBlockState(elemID, OCCUPIED_SB_STATE, null);
            }
            else if(currentState == OCCUPIED_NB_STATE)
            {
                // do nothing
            }
            else if(currentState == OCCUPIED_SB_STATE)
            {
                // do nothing
            }
            else
            {
                setDispatchBlockState(elemID, OCCUPIED_STATE, "UNAUTHORIZED TRAIN!");
            }
        }
        // Turnout block activated
        else if((currentState == null) && (currentNState != null) && (currentRState != null))
        {
            if(currentNState == AUTHORIZED_NB_STATE)
            {
                setDispatchBlockState(elemID + "N", OCCUPIED_NB_STATE, null);
            }
            else if(currentNState == AUTHORIZED_SB_STATE)
            {
                setDispatchBlockState(elemID + "N", OCCUPIED_SB_STATE, null);
            }
            else if(currentRState == AUTHORIZED_NB_STATE)
            {
                setDispatchBlockState(elemID + "R", OCCUPIED_NB_STATE, null);
            }
            else if(currentRState == AUTHORIZED_SB_STATE)
            {
                setDispatchBlockState(elemID + "R", OCCUPIED_SB_STATE, null);
            }
            else if(currentNState == OCCUPIED_NB_STATE)
            {
                // do nothing
            }
            else if(currentNState == OCCUPIED_SB_STATE)
            {
                // do nothing
            }
            else if(currentRState == OCCUPIED_NB_STATE)
            {
                // do nothing
            }
            else if(currentRState == OCCUPIED_SB_STATE)
            {
                // do nothing
            }
            else
            {
                setDispatchBlockState(elemID + "N", OCCUPIED_STATE, "UNAUTHORIZED TRAIN!");
                setDispatchBlockState(elemID + "R", OCCUPIED_STATE, "UNAUTHORIZED TRAIN!");
            }
        }
        else
        {
            alert("Unexpected turnout authorization states in setDispatchSensorState()");
        }
	}
	else if(sensorState == JMRI_SENSOR_INACTIVE)
	{
        // Standard block inactivated
        if((currentState != null) && (currentNState == null) && (currentRState == null))
        {
            if(currentState != UNAUTHORIZED_STATE)
            {
                setDispatchBlockState(elemID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
            }
        }
        // Turnout block inactivated
        else if((currentState == null) && (currentNState != null) && (currentRState != null))
        {
            if((currentRState != UNAUTHORIZED_STATE) || (currentNState != UNAUTHORIZED_STATE))
            {
                setDispatchBlockState(elemID + "N", UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
                setDispatchBlockState(elemID + "R", UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
            }
        }
        else
        {
            alert("Unexpected turnout authorization states in setDispatchSensorState()");
        }
        
	}
	else
	{
		setPanelError("Bad sensor state passed to setDispatchSensorState(" + elemID + ")");
	}
}

function dispatchTurnoutSegmentClicked(id)
{
    if(turnoutOccupied(id))
    {
        advanceTurnoutStateToUnoccupied(id);
        return;
    }
    else if(turnoutAuthorized(id))
    {
        advanceTurnoutStateToOccupied(id);
        return;
    }
}

function userClickChangeToNextState(elemID)
{    
	var elem = svgDocument.getElementById(elemID);
	
	if(elem == null)
	{
		setPanelError("Bad object ID passed to dispatchChangeToNextState(" + elemID + ")");
		return;
	}

    var rIndex = elemID.indexOf("R");
    var nIndex = elemID.indexOf("N");
    
    var currentStateID = DISPATCHSEGMENT_OBJID_PREFIX + getDCCAddr(elemID) + (rIndex != -1 ? "R" : (nIndex != -1 ? "N" : ""));
    
    var currentState = getDispatchSegmentState(currentStateID);
    
    if(currentState == null)
    {
        alert("Unexpected null dispatch segment state in userClickChangeToNextState");
        setDispatchBlockState(currentStateID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
    else if(currentState == UNAUTHORIZED_STATE)
    {
		if((nextAuthorizationTrainID == "") || (nextAuthorizationTrainID == " "))
		{
			var returnedTrainID = prompt("Enter a train ID", "");
		
			if((returnedTrainID != null) && (returnedTrainID != "") && (returnedTrainID != " "))
				nextAuthorizationTrainID = returnedTrainID;
		}

        if((nextAuthorizationTrainID != null) && (nextAuthorizationTrainID != "") && (nextAuthorizationTrainID != " "))
			setDispatchBlockState(currentStateID, nextAuthorizationState, nextAuthorizationTrainID);
    }
    else if(currentState == AUTHORIZED_NB_STATE)
    {
        // only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        setDispatchBlockState(currentStateID, OCCUPIED_NB_STATE, null);
    }
    else if(currentState == AUTHORIZED_SB_STATE)
    {
        // only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        setDispatchBlockState(currentStateID, OCCUPIED_SB_STATE, null);
    }
    else if(currentState == OCCUPIED_NB_STATE)
    {
        // only used until sensors are implemented in the field. Click should be ignored if sensors present
        setDispatchBlockState(currentStateID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
    else if(currentState == OCCUPIED_SB_STATE)
    {
        // only used until sensors are implemented in the field. Click should be ignored if sensors present
        setDispatchBlockState(currentStateID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
    else if(currentState == OOS_STATE)
    {
        // only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        setDispatchBlockState(currentStateID, OCCUPIED_STATE, null);
    }
    else
    {
        setDispatchBlockState(currentStateID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
}

/* setDispatchBlockState([String] elemID, [String] state)
 * Finds an SVG element (presumed to be an SVGUseElement) with the useElemID and sets the xlink:href attribute to match
 * the corresponding selected route (normal or reverse).  This is a high-level call in that it will set the
 * xlink:href attribute for all PanelTurnout objects whose base address matches the base address of useElemID.
 *
 * e.g. TO450, TO450A, TO450B will all be thrown to the same state regardless of which ID is passed.  This allows
 * the panel to replicate an interlocked crossover function (i.e. multiple motors on a single switch-it).
 */

function setDispatchBlockState(elemID, state, trainID)
{
    var blockNum = getDCCAddr(elemID);

    var rIndex = elemID.indexOf("R");
    var nIndex = elemID.indexOf("N");
    
    if((rIndex != -1) || (nIndex != -1))
    {
        // This is a turnout block segment	
        var thisRoute = (rIndex != -1 ? "R" : "N");
        var oppositeRoute = (rIndex != -1 ? "N" : "R");
        
        var oppositeState = getDispatchSegmentState(DISPATCHSEGMENT_OBJID_PREFIX + blockNum + oppositeRoute);
        
        if(oppositeState == UNAUTHORIZED_STATE)
        {
            // Move clicked item to top of layer
            var elem = svgDocument.getElementById(elemID);
            
            elem.parentNode.appendChild(elem);
        
            setDispatchSegmentState(DISPATCHSEGMENT_OBJID_PREFIX + blockNum + thisRoute, state, trainID);
            setDispatchSVGLowLevel(DISPATCHSEGMENT_OBJID_PREFIX + blockNum + thisRoute, state, trainID);
        }
        else
        {
            alert("Turnout authorization request could not be completed because it is already authorized or occupied.");
        }
    }
    else
    {
        // This is a standard block segment	
        setDispatchSegmentState(DISPATCHSEGMENT_OBJID_PREFIX + blockNum, state, trainID);
    
        setDispatchSVGLowLevel(DISPATCHSEGMENT_OBJID_PREFIX + blockNum, state, trainID);
    
        var nextSubBlock = 'A';
        var success = setDispatchSVGLowLevel(DISPATCHSEGMENT_OBJID_PREFIX + blockNum + nextSubBlock, state, trainID);
        while(success)
        {
            nextSubBlock = String.fromCharCode(nextSubBlock.charCodeAt(0) + 1);
		
            success = setDispatchSVGLowLevel(DISPATCHSEGMENT_OBJID_PREFIX + blockNum + nextSubBlock, state, trainID);
        }
    }
}

function setDispatchSVGLowLevel(elemID, state, trainID)
{
    var elem = svgDocument.getElementById(elemID);
	
	if(elem == null)
        return false;

	if(trainID != null)
        addElementTitle(elemID, trainID);

	var lowLevelTrainID = getDispatchSegmentTrainID(DISPATCHSEGMENT_OBJID_PREFIX + getDCCAddr(elemID));

    if((trainID != null) && (trainID != lowLevelTrainID))
        lowLevelTrainID = trainID;

	var elemIDTextTrainID = elemID + "TrainLabel";
	var elemTextTrainID = svgDocument.getElementById(elemIDTextTrainID);

    if(state == OOS_STATE)
    {
        setStyleSubAttribute(elem, "stroke", OOS_COLOR);
        removeStyleSubAttribute(elem, "marker-start");
        removeStyleSubAttribute(elem, "marker-end");
    }
    else if(state == AUTHORIZED_NB_STATE)
    {
        setStyleSubAttribute(elem, "stroke", AUTHORIZED_COLOR);
        setStyleSubAttribute(elem, "marker-end", "url(#TriangleAuthNBMarker)");
        removeStyleSubAttribute(elem, "marker-start");
    }
    else if(state == AUTHORIZED_SB_STATE)
    {
        setStyleSubAttribute(elem, "stroke", AUTHORIZED_COLOR);
        removeStyleSubAttribute(elem, "marker-end");
        setStyleSubAttribute(elem, "marker-start", "url(#TriangleAuthSBMarker)");
    }
	else if(state == OCCUPIED_NB_STATE)
    {
        setStyleSubAttribute(elem, "stroke", OCCUPIED_COLOR);
        setStyleSubAttribute(elem, "marker-end", "url(#TriangleOccupiedNBMarker)");
        removeStyleSubAttribute(elem, "marker-start");
    }
	else if(state == OCCUPIED_SB_STATE)
    {
        setStyleSubAttribute(elem, "stroke", OCCUPIED_COLOR);
        removeStyleSubAttribute(elem, "marker-end");
        setStyleSubAttribute(elem, "marker-start", "url(#TriangleOccupiedSBMarker)");
    }
    else if(state == OCCUPIED_STATE)
    {
        setStyleSubAttribute(elem, "stroke", OCCUPIED_COLOR);
        removeStyleSubAttribute(elem, "marker-start");
        removeStyleSubAttribute(elem, "marker-end");
    }
    else
    {
        setStyleSubAttribute(elem, "stroke", UNAUTHORIZED_COLOR);
        removeStyleSubAttribute(elem, "marker-start");
        removeStyleSubAttribute(elem, "marker-end");
    }

    if((elemTextTrainID != null) && (lowLevelTrainID != null) && (lowLevelTrainID != UNAUTHORIZED_STATE) && (((state != AUTHORIZED_NB_STATE) && (state != AUTHORIZED_SB_STATE)) || alwaysShowTrainID))
    {
        setSVGText(elemIDTextTrainID, lowLevelTrainID);
        elemTextTrainID.setAttribute("visibility", "visible");
    }
    else
    {
        elemTextTrainID.setAttribute("visibility", "hidden");
    }

    return true;
}

function getDispatchSegmentState(blockID)
{
    if(dispatchSegmentStates[blockID] != undefined)
        return dispatchSegmentStates[blockID].state; 
    
    return null;
}

function setDispatchSegmentState(blockID, state, trainID)
{
    var existingInfo = dispatchSegmentStates[blockID];
    dispatchSegmentStates[blockID] = {name:blockID, state:state, trainID:(trainID == null && existingInfo != undefined ? existingInfo.trainID : trainID)};
    
    serverSet([new ServerObject(blockID, SERVER_TYPE_DISPATCH, dispatchSegmentStates[blockID].state + ":" + dispatchSegmentStates[blockID].trainID)]);
}

function getDispatchSegmentTrainID(blockID)
{
    if(dispatchSegmentStates[blockID] != undefined)
        return dispatchSegmentStates[blockID].trainID; 
    
    return null;
}

function clickTrainListLabel(elemID)
{
	var trainIDElemID = elemID.replace("Label", "Train");
	
	var trainIDElem = svgDocument.getElementById(trainIDElemID);
	
	if(trainIDElem == null)
	{
		alert("Unsupported train ID element ID " + trainIDElem + " in clickTrainListLabel()!");
		return;
	}
	else
	{
		var currentTrainID = getTrainIDText(trainIDElemID);
	
		if(currentTrainID == " ")
			currentTrainID = "";
	
		var returnedTrainID = prompt("Enter a train ID or enter a single space to clear this field.", currentTrainID);
		
        if(returnedTrainID != null)
		{
			// MacOS/Safari seems to always return "" when canceled. So emulate the cancel by not doing anything if "" is returned
			if(returnedTrainID != "")
			{
				if(returnedTrainID == " ")
					returnedTrainID = "";
			
				setTrainIDText(trainIDElemID, returnedTrainID);
				setNextAuthorizationTrain(trainIDElemID);
			}
		}
	}
}

function setNextAuthorizationTrain(elemID)
{
	if(elemID.search("Train") != 2)
	{
		alert("Unsupported element ID " + elemID + " in setNextAuthorizationTrain()!");
		return;
	}

	if(elemID.charAt(0) == "n")
		nextAuthorizationState = AUTHORIZED_NB_STATE;
	else if(elemID.charAt(0) == "s")
		nextAuthorizationState = AUTHORIZED_SB_STATE;
	else if(elemID.charAt(0) == "o")
		nextAuthorizationState = OOS_STATE;
	else
	{
		alert("Unsupported element ID " + elemID + " in setNextAuthorizationTrain()!");
		return;
	}
	
	showSelectedAuthorizationElement(elemID.substring(0, 2));
	
	nextAuthorizationTrainID = getTrainIDText(elemID);
	
	if((nextAuthorizationTrainID == "") || (nextAuthorizationTrainID == " "))
		nextAuthorizationState = OOS_STATE;
	
}

function getTrainIDText(trainIDElemID)
{
	return getSVGText(trainIDElemID);
}

function setTrainIDText(trainIDElemID, trainID)
{
    var changed = (getSVGText(trainIDElemID) != setSVGText(trainIDElemID, trainID));

    if(changed)
    {
        var tempStateChangeRequests = stateChangeRequests;
        
        stateChangeRequests = new Array();
        
        stateChangeRequests.push(new ServerObject(trainIDElemID.substring(0,2), SERVER_TYPE_DISPATCH, trainID));
        
        if(stateChangeRequests.length > 0)
            executePanelStateChangeRequests();
        
        stateChangeRequests = tempStateChangeRequests;
    }

	showSelectedAuthorizationElement(trainIDElemID.substring(0, 2));
}

function showSelectedAuthorizationElement(whichElem)
{
	var leftElemID = whichElem + "Label";
	var rightElemID = whichElem + "Train";
	
	var leftElem = svgDocument.getElementById(leftElemID);
	var rightElem = svgDocument.getElementById(rightElemID);
	
	if((leftElem == null) || (rightElem == null))
	{
		alert("Unsupported element prefix " + whichElem + " in showSelectedAuthorizationElement()!");
		return;
	}
	
	if(selectionRect != null)
	{
		if(getTrainIDText(rightElemID) == "")
        {
			selectionRect.setAttribute("visibility", "hidden");
            selectedNSO = null;
		}
        else
		{
			selectionRect.setAttribute("visibility", "visible");
		
			var selectionRectOffset = 2;
		
			var lBBox = leftElem.getBBox();
			var rBBox = rightElem.getBBox();
			
			selectionRect.setAttribute("x", lBBox.x - selectionRectOffset);
			selectionRect.setAttribute("y", lBBox.y - selectionRectOffset);
			
			var width = (rBBox.x + rBBox.width + selectionRectOffset + 1) - (lBBox.x - selectionRectOffset);

			selectionRect.setAttribute("width", width < 0 ? width*-1 : width);
			selectionRect.setAttribute("height", lBBox.height + 2*selectionRectOffset);

            selectedNSO = whichElem;
		}
	}
	
	switch(whichElem.charAt(0))
	{
		case "o": setStyleSubAttribute(selectionRect, "stroke", OOS_COLOR); break;
		
		case "n":
		case "s": setStyleSubAttribute(selectionRect, "stroke", AUTHORIZED_COLOR); break;

		default: setStyleSubAttribute(selectionRect, "stroke", UNAUTHORIZED_COLOR); break;
	}
}

function getCommonDispatchStates()
{
    var commonObjs = [];
    
    for(var i = 1; i <= 8; i++)
    {
        commonObjs.push(new ServerObject("n" + i, SERVER_TYPE_DISPATCH, getTrainIDText("n" + i + "Train")));
        commonObjs.push(new ServerObject("s" + i, SERVER_TYPE_DISPATCH, getTrainIDText("s" + i + "Train")));
        commonObjs.push(new ServerObject("o" + i, SERVER_TYPE_DISPATCH, getTrainIDText("o" + i + "Train")));
    }

    var blockElements = [];    
    var allBlockElements = getAllObjectsOfTagNameAndID("path", DISPATCHSEGMENT_OBJID_PREFIX + "\\d+[A-Z]?");
	for(var j in allBlockElements)
    {
        var blockID = DISPATCHSEGMENT_OBJID_PREFIX + getDCCAddr(allBlockElements[j].id);
        if(blockElements[blockID] == undefined)
            blockElements[blockID] = blockID;
    }

    for(var k in blockElements)
        commonObjs.push(new ServerObject(JMRI_SENSOR_OBJID_PREFIX + getDCCAddr(blockElements[k]), SERVER_TYPE_SENSOR, null));

    return commonObjs;
}

function setDispatchState(stateObj)
{
    if(stateObj.name.search("[n|s|o][1-8]") == 0)
    {
        setSVGText(stateObj.name + "Train", stateObj.value);
        
        if(selectedNSO == stateObj.name.substring(0,2))
        {
            if((stateObj.value == "") || (stateObj.value == null))
            {
                selectionRect.setAttribute("visibility", "hidden");
                selectedNSO = null;
                
                nextAuthorizationTrainID = "";
                nextAuthorizationState = OOS_STATE;
            }
        }
        
        return true;
    }

    else if(stateObj.name.search(DISPATCHSEGMENT_OBJID_PREFIX) == 0)
    {
        var colonLoc = stateObj.value.search(':');
        var preColonState = stateObj.value.substring(0, colonLoc);
        var postColonTrainID = stateObj.value.substring(colonLoc+1);
        
        setDispatchBlockState(stateObj.name, preColonState, postColonTrainID);
    
        return true;
    }

    else if(stateObj.name.search(JMRI_SENSOR_OBJID_PREFIX) == 0)
    {
        setDispatchSensorState(stateObj.name, stateObj.value);
    
        return true;
    }

    return false;
}

function getDispatchState(stateObj)
{
    if(stateObj.name.search("[n|s|o][1-8]") == 0)
    {
        stateObj.value = getTrainIDText(stateObj.name + "Train");
        return stateObj;
    }
    else if(stateObj.name.search(DISPATCHSEGMENT_OBJID_PREFIX) == 0)
    {
        stateObj.value = getDispatchSegmentState(stateObj.name) + ":" + getDispatchSegmentTrainID(stateObj.name);
        return stateObj;
    }
    
    return undefined;
}

function setDispatchMainlineLockLEDColor(LED, color)
{
    if((LED != undefined) && (LED != null))
    {
        setStyleSubAttribute(LED, "fill", color == "off" ? "#808080" : color);
        setStyleSubAttribute(LED, "stroke", color == "off" ? "#808080" : color);
    }
}
