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
}

/* setSensorState([String] sensorID, [String] sensorState)
 * Advances block authorization to next state in table. This is how JMRI sensor updates will enter in to 
 */
function setDispatchSensorState(sensorID, sensorState)
{
    var elemID = DISPATCHSEGMENT_OBJID_PREFIX + getDCCAddr(sensorID);
    var currentState = getDispatchSegmentState(elemID);
    
	if(sensorState == JMRI_SENSOR_ACTIVE)
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
	else if(sensorState == JMRI_SENSOR_INACTIVE)
	{
		if(currentState == UNAUTHORIZED_STATE)
    		{
		        // do nothing
		}
		else  // go back to unauthorized
    		{
	        	setDispatchBlockState(elemID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    		}
	}
	else
	{
		setPanelError("Bad sensor state passed to setDispatchSensorState(" + elemID + ")");
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
    
    var blockID = DISPATCHSEGMENT_OBJID_PREFIX + getDCCAddr(elemID);
    
    var currentState = getDispatchSegmentState(blockID);
    
    if(currentState == UNAUTHORIZED_STATE)
    {
		if((nextAuthorizationTrainID == "") || (nextAuthorizationTrainID == " "))
		{
			var returnedTrainID = prompt("Enter a train ID", "");
		
			if((returnedTrainID != null) && (returnedTrainID != "") && (returnedTrainID != " "))
				nextAuthorizationTrainID = returnedTrainID;
		}

        if((nextAuthorizationTrainID != null) && (nextAuthorizationTrainID != "") && (nextAuthorizationTrainID != " "))
			notifyServerOfNextState(blockID, nextAuthorizationState, nextAuthorizationTrainID);
    }
    else if(currentState == AUTHORIZED_NB_STATE)
    {
	// only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        notifyServerOfNextState(blockID, OCCUPIED_NB_STATE, null);
    }
    else if(currentState == AUTHORIZED_SB_STATE)
    {
	// only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        notifyServerOfNextState(blockID, OCCUPIED_SB_STATE, null);
    }
    else if(currentState == OCCUPIED_NB_STATE)
    {
	// only used until sensors are implemented in the field. Click should be ignored if sensors present
        notifyServerOfNextState(blockID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
    else if(currentState == OCCUPIED_SB_STATE)
    {
	// only used until sensors are implemented in the field. Click should be ignored if sensors present
        notifyServerOfNextState(blockID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
    else if(currentState == OOS_STATE)
    {
	// only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        notifyServerOfNextState(blockID, OCCUPIED_STATE, null);
    }
    else
    {
        notifyServerOfNextState(blockID, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
}

/* notifyServerOfNextState([String] elemID, [String] state, [String] trainID)
 */
function notifyServerOfNextState(blockID, state, trainID)
{	
    for(var i = 0; i < dispatchSegmentStates.length; i++)
    {
        if(dispatchSegmentStates[i].name == blockID)
        {			
			// Only update trainID if it is not null
			if(trainID != null)
                serverSet([new ServerObject(blockID, SERVER_TYPE_DISPATCH, state + ":" + trainID)]);
            else
                serverSet([new ServerObject(blockID, SERVER_TYPE_DISPATCH, state + ":" + dispatchSegmentStates[i].trainID)]);
            
            return;
        }
    }
    
	// Didn't find an entry so create a new one
    dispatchSegmentStates.push({name:blockID, state:UNAUTHORIZED_STATE, trainID:UNAUTHORIZED_STATE});
    
    serverSet([new ServerObject(blockID, SERVER_TYPE_DISPATCH, state + ":" + trainID)]);
}

/* setDispatchBlockState([String] elemID, [String] state, [String] trainID)
 */
function setDispatchBlockState(elemID, state, trainID)
{
	var blockNum = getDCCAddr(elemID);
	
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

    if(elemTextTrainID != null)
    {
        if((lowLevelTrainID != null) && (lowLevelTrainID != UNAUTHORIZED_STATE) && (((state != AUTHORIZED_NB_STATE) && (state != AUTHORIZED_SB_STATE)) || alwaysShowTrainID))
        {
            setSVGText(elemIDTextTrainID, lowLevelTrainID);
            elemTextTrainID.setAttribute("visibility", "visible");
        }
        else
        {
            elemTextTrainID.setAttribute("visibility", "hidden");
        }
    }

    return true;
}

function getDispatchSegmentState(blockID)
{
    for(var i = 0; i < dispatchSegmentStates.length; i++)
    {
        if(dispatchSegmentStates[i].name == blockID)
            return dispatchSegmentStates[i].state; 
    }
    
    return UNAUTHORIZED_STATE;
}

function setDispatchSegmentState(blockID, state, trainID)
{
    for(var i = 0; i < dispatchSegmentStates.length; i++)
    {
        if(dispatchSegmentStates[i].name == blockID)
        {
			// Update the new state
            dispatchSegmentStates[i].state = state;
			
			// Only update trainID if it is not null
			if(trainID != null)
				dispatchSegmentStates[i].trainID = trainID;
            
            //serverSet([new ServerObject(blockID, SERVER_TYPE_DISPATCH, state + ":" + dispatchSegmentStates[i].trainID)]);
            return;
        }
    }
    
	// Didn't find an entry so create a new one
    dispatchSegmentStates.push({name:blockID, state:state, trainID:trainID});
    
    //serverSet([new ServerObject(blockID, SERVER_TYPE_DISPATCH, state + ":" + trainID)]);
}

function getDispatchSegmentTrainID(blockID)
{
    for(var i = 0; i < dispatchSegmentStates.length; i++)
    {
        if(dispatchSegmentStates[i].name == blockID)
            return dispatchSegmentStates[i].trainID; 
    }
    
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

    for(var l in blockElements)
        commonObjs.push(new ServerObject(DISPATCHSEGMENT_OBJID_PREFIX + getDCCAddr(blockElements[l]), SERVER_TYPE_DISPATCH, null));

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
        
        if(postColonTrainID === "null")
            postColonTrainID = null;
        
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
