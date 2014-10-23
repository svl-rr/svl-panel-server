// Constant id prefix for objects
var DISPATCHSEGMENT_OBJID_PREFIX = "BLOCK";

var UNAUTHORIZED_STATE = "Unauthorized";
var AUTHORIZED_NB_STATE = "Authorized NB";
var AUTHORIZED_SB_STATE = "Authorized SB";
var AUTHORIZED_OOS_STATE = "Authorized OOS";
var OCCUPIED_NB_STATE = "Occupied NB";
var OCCUPIED_SB_STATE = "Occupied SB";
var OCCUPIED_OOS_STATE = "Occupied OOS";

var BLOCK_AUTH = "BA";
var TURNOUT_AUTH = "TA";

var ROUTE_AUTHORIZED_NA = "N/A";

var CONFLICTING_MOVEMENT_MSG = "The route selected conflicts with previously authorized movements.";

var dispatchSegmentStates = new Array();

var nextAuthorizationState = AUTHORIZED_OOS_STATE;
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
		
	var textElements = getAllObjectsOfTagNameAndID("text", DISPATCHSEGMENT_OBJID_PREFIX + "\\S*TrainLabel");
	for(var i in textElements)
		setSVGText(textElements[i].id, "");
    
    textElements = getAllObjectsOfTagNameAndID("text", "[N|S|O][0-9]+Label");
	for(var j in textElements)
		setStyleSubAttribute(textElements[j], "cursor", "pointer");
    
	textElements = getAllObjectsOfTagNameAndID("text", "[N|S|O][0-9]+Train");
	for(var j in textElements)
    {
		setSVGText(textElements[j].id, "");
        setStyleSubAttribute(textElements[j], "cursor", "pointer");
    }
    
    var allBlockElements = getAllObjectsOfTagNameAndID("path", DISPATCHSEGMENT_OBJID_PREFIX + "\\d+[A-Z]?");
    
    for(var j in allBlockElements)
    {
        var currentBlockID = BLOCK_AUTH + getDCCAddr(allBlockElements[j].id);
        
        if(getDispatchLocalAuthorization(currentBlockID) == null)
            dispatchSegmentStates.push({name:currentBlockID, route:ROUTE_AUTHORIZED_NA, state:UNAUTHORIZED_STATE, trainID:UNAUTHORIZED_STATE});
    }

    for(var k in turnoutsOnPanel)
    {
        dispatchSegmentStates.push({name:TURNOUT_AUTH + turnoutsOnPanel[k].getInstanceID(), route:ROUTE_AUTHORIZED_NA, state:UNAUTHORIZED_STATE, trainID:UNAUTHORIZED_STATE});
    }
}

/* Entry point from server comms for sensors */

function setSensorState(sensorID, sensorState)
{
    if(sensorState == undefined)
		return;
	else if((sensorState != JMRI_SENSOR_ACTIVE) && (sensorState != JMRI_SENSOR_INACTIVE))
	{
		alert("Bad sensor state (" + sensorState + ") passed to setSensorState() by " + sensorID);
		return;
	}

	if(sensorID.search(JMRI_SENSOR_OBJID_PREFIX) == 0)
	{
		var blockAuthorization = getDispatchLocalAuthorization(BLOCK_AUTH + getDCCAddr(sensorID));         // will be null if a turnout
		var turnoutAuthorization = getDispatchLocalAuthorization(TURNOUT_AUTH + getDCCAddr(sensorID));      // will be null if not a turnout
		
		if(blockAuthorization != null)
			setDispatchSensorState(blockAuthorization.name, blockAuthorization.state, sensorID, sensorState);
		
		if(turnoutAuthorization != null)
			setDispatchSensorState(turnoutAuthorization.name, turnoutAuthorization.state, sensorID, sensorState);
			
		if((blockAuthorization == null) && (turnoutAuthorization == null))
			console.log("No corresponding authorization variable was found for sensor " + sensorID);
	}
}

function setDispatchSensorState(authName, currentAuthState, sensorID, sensorState)
{
	if(sensorState == JMRI_SENSOR_ACTIVE)
	{        
		if(currentAuthState == AUTHORIZED_NB_STATE)
		{
			updateServerAuthorizationState(authName, null, OCCUPIED_NB_STATE, null);
		}
		else if(currentAuthState == AUTHORIZED_SB_STATE)
		{
			updateServerAuthorizationState(authName, null, OCCUPIED_SB_STATE, null);
		}
		else if(currentAuthState == AUTHORIZED_OOS_STATE)
		{
			updateServerAuthorizationState(authName, null, OCCUPIED_OOS_STATE, null);
		}
		else if(currentAuthState == OCCUPIED_NB_STATE)
		{
			// do nothing
		}
		else if(currentAuthState == OCCUPIED_SB_STATE)
		{
			// do nothing
		}
		else if(currentAuthState == OCCUPIED_OOS_STATE)
		{
			// do nothing
		}
		else
		{
			if(authName.indexOf(TURNOUT_AUTH) == 0)
			{
				var panelInstance = getPanelTurnoutFromDCCAddr(getDCCAddr(authName));
		
				if(panelInstance != null)
					updateServerAuthorizationState(authName, panelInstance.getSVGState(), OCCUPIED_OOS_STATE, "UNAUTHORIZED TRAIN!");
				else
					updateServerAuthorizationState(authName, "N", OCCUPIED_OOS_STATE, "UNAUTHORIZED TRAIN!");
			}
			else
				updateServerAuthorizationState(authName, null, OCCUPIED_OOS_STATE, "UNAUTHORIZED TRAIN!");
		}
	}
	else if(sensorState == JMRI_SENSOR_INACTIVE)
	{
		if(currentAuthState == OCCUPIED_NB_STATE)
		{
			updateServerAuthorizationState(authName, ROUTE_AUTHORIZED_NA, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
		}
		else if(currentAuthState == OCCUPIED_SB_STATE)
		{
			updateServerAuthorizationState(authName, ROUTE_AUTHORIZED_NA, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
		}
		else if(currentAuthState == OCCUPIED_OOS_STATE)
		{
			updateServerAuthorizationState(authName, ROUTE_AUTHORIZED_NA, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
		}
		else
		{
			console.log("Unexpected sensor transition detected (" + sensorID + " changed to " + sensorState + "). Server and sensor states must not have been in sync.");
		}        
	}
}

function dispatchTurnoutSegmentClicked(elemID)
{
	var panelTurnout = getPanelTurnoutFromElemID(elemID);

	if(panelTurnout == null)
	{
		alert("PanelTurnout " + elemID + " could not be found in dispatchTurnoutSegmentClicked");
		return;
	}

	var authorizationName = TURNOUT_AUTH + getDCCAddrAndMotorSubAddr(elemID);

    var currentAuth = getDispatchLocalAuthorization(authorizationName);

	if(currentAuth == null)
	{
		alert("dispatchTurnoutSegmentClicked could not find local authorization for elemID " + elemID);
		return;
	}

	// Current authorized route matches item clicked
	if(currentAuth.route == getDCCAddrRoute(elemID))
	{
		if(currentAuth.state == OCCUPIED_NB_STATE)
		{
			updateServerAuthorizationState(authorizationName, ROUTE_AUTHORIZED_NA, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
		}
		else if(currentAuth.state == OCCUPIED_SB_STATE)
		{
			updateServerAuthorizationState(authorizationName, ROUTE_AUTHORIZED_NA, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
		}
		else if(currentAuth.state == OCCUPIED_OOS_STATE)
		{
			updateServerAuthorizationState(authorizationName, ROUTE_AUTHORIZED_NA, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
		}
		else if(currentAuth.state == AUTHORIZED_NB_STATE)
		{
			updateServerAuthorizationState(authorizationName, null, OCCUPIED_NB_STATE, null);
		}
		else if(currentAuth.state == AUTHORIZED_SB_STATE)
		{
			updateServerAuthorizationState(authorizationName, null, OCCUPIED_SB_STATE, null);
		}
		else if(currentAuth.state == AUTHORIZED_OOS_STATE)
		{
			updateServerAuthorizationState(authorizationName, null, OCCUPIED_OOS_STATE, null);
		}
		else
		{
			alert("Unexpected dispatch segment state machine error for " + authorizationName + " in dispatchTurnoutSegmentClicked: " + currentAuth.state);
			updateServerAuthorizationState(authorizationName, ROUTE_AUTHORIZED_NA, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
		}
    }
    else if(currentAuth.state == UNAUTHORIZED_STATE)
	{
		// Opposing direction being occupied or authorized will deny authorization
		var allowAuthorization = !anyTurnoutInstanceAuthorizedOrOccupied(true, elemID);
		
		// Same direction being occupied or authorized is determined by panel turnout (default is false)
		if(allowAuthorization && anyTurnoutInstanceAuthorizedOrOccupied(false, elemID))
			allowAuthorization = panelTurnout.doesTurnoutAllowMultipleAuthorizations(elemID);
		
		if(allowAuthorization)
		{
			if((nextAuthorizationTrainID == "") || (nextAuthorizationTrainID == " "))
			{
				var returnedTrainID = prompt("Enter a train ID", "");
			
				if((returnedTrainID != null) && (returnedTrainID != "") && (returnedTrainID != " "))
					nextAuthorizationTrainID = returnedTrainID;
			}
			
			if((nextAuthorizationTrainID != null) && (nextAuthorizationTrainID != "") && (nextAuthorizationTrainID != " "))
			{
				updateServerAuthorizationState(authorizationName, getDCCAddrRoute(elemID), nextAuthorizationState, nextAuthorizationTrainID);
				changeTurnoutRoute(elemID, false);
			}
		}
		else
		{
			alert(CONFLICTING_MOVEMENT_MSG);
		}
	}
	else	// user clicked on a different route in turnout but it wasn't unauthorized so there is nothing to do
	{
		alert(CONFLICTING_MOVEMENT_MSG);
	}
}

function anyTurnoutInstanceAuthorizedOrOccupied(checkOpposing, elemID)
{
    var turnoutDirectionToCheck = getDCCAddrRoute(elemID);
    
    if(checkOpposing)
        turnoutDirectionToCheck = (turnoutDirectionToCheck == 'R' ? 'N' : 'R');

    for(var i = 0; i < dispatchSegmentStates.length; i++)
    {
        if(dispatchSegmentStates[i].name.search(TURNOUT_AUTH) == 0)
        {
			if(getDCCAddr(elemID) == getDCCAddr(dispatchSegmentStates[i].name))
            {
                if(dispatchSegmentStates[i].route == turnoutDirectionToCheck)
                {                    
                    if(dispatchSegmentStates[i].state != UNAUTHORIZED_STATE)
                        return true;
                }
            }
        }
    }
    
    return false;
}

function userClickChangeToNextState(elemID)
{
	var elem = svgDocument.getElementById(elemID);
	
	if(elem == null)
	{
		setPanelError("Bad object ID passed to userClickChangeToNextState(" + elemID + ")");
		return;
	}
    
    var blockAuthName = BLOCK_AUTH + getDCCAddr(elemID);
    
    var localAuth = getDispatchLocalAuthorization(blockAuthName);
    
    if(localAuth.state == AUTHORIZED_NB_STATE)
    {
        // only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        updateServerAuthorizationState(blockAuthName, null, OCCUPIED_NB_STATE, null);
    }
    else if(localAuth.state == AUTHORIZED_SB_STATE)
    {
        // only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        updateServerAuthorizationState(blockAuthName, null, OCCUPIED_SB_STATE, null);
    }
    else if(localAuth.state == OCCUPIED_NB_STATE)
    {
        // only used until sensors are implemented in the field. Click should be ignored if sensors present
        updateServerAuthorizationState(blockAuthName, null, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
    else if(localAuth.state == OCCUPIED_SB_STATE)
    {
        // only used until sensors are implemented in the field. Click should be ignored if sensors present
        updateServerAuthorizationState(blockAuthName, null, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
    else if(localAuth.state == AUTHORIZED_OOS_STATE)
    {
        // only used until sensors are implemented in the field. Dispatcher must emulate train movement via radio feedback
        updateServerAuthorizationState(blockAuthName, null, OCCUPIED_OOS_STATE, null);
    }
    else if(localAuth.state == OCCUPIED_OOS_STATE)
    {
        // only used until sensors are implemented in the field. Click should be ignored if sensors present
        updateServerAuthorizationState(blockAuthName, null, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
    else if(localAuth.state == UNAUTHORIZED_STATE)
    {
		if((nextAuthorizationTrainID == "") || (nextAuthorizationTrainID == " "))
		{
			var returnedTrainID = prompt("Enter a train ID", "");
		
			if((returnedTrainID != null) && (returnedTrainID != "") && (returnedTrainID != " "))
				nextAuthorizationTrainID = returnedTrainID;
		}
        
        if((nextAuthorizationTrainID != null) && (nextAuthorizationTrainID != "") && (nextAuthorizationTrainID != " "))
            updateServerAuthorizationState(blockAuthName, null, nextAuthorizationState, nextAuthorizationTrainID);
    }
    else
    {
        alert("Unexpected dispatch segment state machine error for " + blockAuthName + " in userClickChangeToNextState: " + currentState);
        updateServerAuthorizationState(blockAuthName, null, UNAUTHORIZED_STATE, UNAUTHORIZED_STATE);
    }
}

/* updateServerAuthorizationState([String] name, [String] route, [String] state, [String] trainID)
 */
function updateServerAuthorizationState(name, route, state, trainID)
{
    var newAuthString = (route == null ? ROUTE_AUTHORIZED_NA : route) + ':' + state + ':' + (trainID == null ? UNAUTHORIZED_STATE : trainID);

    for(var i = 0; i < dispatchSegmentStates.length; i++)
    {
        if(dispatchSegmentStates[i].name == name)
        {
        	newAuthString = (route == null ? dispatchSegmentStates[i].route : route) + ':' + state + ':' + (trainID == null ? dispatchSegmentStates[i].trainID : trainID);
        	
			serverSet([new ServerObject(name, SERVER_TYPE_DISPATCH, newAuthString)]);
            
            return;
        }
    }
        
    serverSet([new ServerObject(name, SERVER_TYPE_DISPATCH, newAuthString)]);
}

/* setDispatchAuthorization([String] elemID, [String] route, [String] state, [String] trainID)
*  This routine sets the local state variables (only) and then updates the SVG to display that state
 */
function setDispatchAuthorization(name, route, state, trainID)
{
    if(name.search(TURNOUT_AUTH) == 0)
    {
        // This is a turnout block segment
        setDispatchLocalAuthorization(name, route, state, trainID);
        
        if(state == UNAUTHORIZED_STATE)
        {
	        setDispatchSVGLowLevel(name.replace(TURNOUT_AUTH,PANEL_TURNOUT_OBJID_PREFIX) + ".R");
	        setDispatchSVGLowLevel(name.replace(TURNOUT_AUTH,PANEL_TURNOUT_OBJID_PREFIX) + ".N");
	    }
	    else
	    	setDispatchSVGLowLevel(name.replace(TURNOUT_AUTH,PANEL_TURNOUT_OBJID_PREFIX) + "." + route);
    }
    else if(name.search(BLOCK_AUTH) == 0)
    {
        // This is a standard block segment
        var blockNum = getDCCAddr(name);
        
        setDispatchLocalAuthorization(BLOCK_AUTH + blockNum, route, state, trainID);
    
        setDispatchSVGLowLevel(DISPATCHSEGMENT_OBJID_PREFIX + blockNum);
    
        var nextSubBlock = 'A';
        var success = setDispatchSVGLowLevel(DISPATCHSEGMENT_OBJID_PREFIX + blockNum + nextSubBlock);
        while(success)
        {
            nextSubBlock = String.fromCharCode(nextSubBlock.charCodeAt(0) + 1);
		
            success = setDispatchSVGLowLevel(DISPATCHSEGMENT_OBJID_PREFIX + blockNum + nextSubBlock);
        }
    }
}

function setDispatchSVGLowLevel(elemID)
{
    var elem = svgDocument.getElementById(elemID);
	
	if(elem == null)
        return false;

	var localAuth = null;
	
	if(elemID.search(DISPATCHSEGMENT_OBJID_PREFIX) == 0)
		localAuth = getDispatchLocalAuthorization(BLOCK_AUTH + getDCCAddr(elemID));
	else if(elemID.search(PANEL_TURNOUT_OBJID_PREFIX) == 0)
		localAuth = getDispatchLocalAuthorization(TURNOUT_AUTH + getDCCAddrAndMotorSubAddr(elemID));

	var elemIDTextTrainID = elemID + "TrainLabel";
	var elemTextTrainID = svgDocument.getElementById(elemIDTextTrainID);

    if(localAuth.state == AUTHORIZED_OOS_STATE)
    {
        setStyleSubAttribute(elem, "stroke", OOS_COLOR);
        removeStyleSubAttribute(elem, "marker-start");
        removeStyleSubAttribute(elem, "marker-end");
    }
    else if(localAuth.state == AUTHORIZED_NB_STATE)
    {
        setStyleSubAttribute(elem, "stroke", AUTHORIZED_COLOR);
        setStyleSubAttribute(elem, "marker-end", "url(#TriangleAuthNBMarker)");
        removeStyleSubAttribute(elem, "marker-start");
    }
    else if(localAuth.state == AUTHORIZED_SB_STATE)
    {
        setStyleSubAttribute(elem, "stroke", AUTHORIZED_COLOR);
        removeStyleSubAttribute(elem, "marker-end");
        setStyleSubAttribute(elem, "marker-start", "url(#TriangleAuthSBMarker)");
    }
	else if(localAuth.state == OCCUPIED_NB_STATE)
    {
        setStyleSubAttribute(elem, "stroke", OCCUPIED_COLOR);
        setStyleSubAttribute(elem, "marker-end", "url(#TriangleOccupiedNBMarker)");
        removeStyleSubAttribute(elem, "marker-start");
    }
	else if(localAuth.state == OCCUPIED_SB_STATE)
    {
        setStyleSubAttribute(elem, "stroke", OCCUPIED_COLOR);
        removeStyleSubAttribute(elem, "marker-end");
        setStyleSubAttribute(elem, "marker-start", "url(#TriangleOccupiedSBMarker)");
    }
    else if(localAuth.state == OCCUPIED_OOS_STATE)
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
    	addElementTitle(elemID, localAuth.trainID);
    
        if((localAuth.trainID != null) && (localAuth.trainID != UNAUTHORIZED_STATE) && (((localAuth.state != AUTHORIZED_NB_STATE) && (localAuth.state != AUTHORIZED_SB_STATE)) || alwaysShowTrainID))
        {
            setSVGText(elemIDTextTrainID, localAuth.trainID);
            elemTextTrainID.setAttribute("visibility", "visible");
        }
        else
        {
            elemTextTrainID.setAttribute("visibility", "hidden");
        }
    }

    return true;
}

function setDispatchLocalAuthorization(name, route, state, trainID)
{
    for(var i = 0; i < dispatchSegmentStates.length; i++)
    {
        if(dispatchSegmentStates[i].name == name)
        {
			// Update the new state
            dispatchSegmentStates[i].state = state;
			
			// Update the new route
			if(route != null)
	            dispatchSegmentStates[i].route = route;
			
			// Only update trainID if it is not null
			if(trainID != null)
				dispatchSegmentStates[i].trainID = trainID;
            
            return;
        }
    }
    
	// Didn't find an entry so create a new one
    dispatchSegmentStates.push({name:name, route:route, state:state, trainID:trainID});
}

function getDispatchLocalAuthorization(name)
{
    for(var i = 0; i < dispatchSegmentStates.length; i++)
    {
        if(dispatchSegmentStates[i].name == name)
            return dispatchSegmentStates[i];
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
	
		var returnedTrainID = prompt("Enter a train ID:", currentTrainID);
		
        if((returnedTrainID != null) && (returnedTrainID != ""))
		{
            setTrainIDText(trainIDElemID, returnedTrainID);
            setNextAuthorizationTrain(trainIDElemID);
		}
	}
}

function clickClearTrainID(target)
{
    var trainIDElemID = target.parentNode.id.replace("ClearTrainID", "Train");
	
	var trainIDElem = svgDocument.getElementById(trainIDElemID);
	
	if(trainIDElem == null)
	{
		alert("Unsupported train ID element ID " + trainIDElem + " in clearTrainID()!");
		return;
	}
	else
	{
		setTrainIDText(trainIDElemID, "");
        setNextAuthorizationTrain(trainIDElemID);
	}
}

function setNextAuthorizationTrain(elemID)
{
	if(elemID.search("Train") != 2)
	{
		alert("Unsupported element ID " + elemID + " in setNextAuthorizationTrain()!");
		return;
	}

	if(elemID.charAt(0) == "N")
		nextAuthorizationState = AUTHORIZED_NB_STATE;
	else if(elemID.charAt(0) == "S")
		nextAuthorizationState = AUTHORIZED_SB_STATE;
	else if(elemID.charAt(0) == "O")
		nextAuthorizationState = AUTHORIZED_OOS_STATE;
	else
	{
		alert("Unsupported element ID " + elemID + " in setNextAuthorizationTrain()!");
		return;
	}
	
	showSelectedAuthorizationElement(elemID.substring(0, 2));
	
	nextAuthorizationTrainID = getTrainIDText(elemID);
	
	if((nextAuthorizationTrainID == "") || (nextAuthorizationTrainID == " "))
		nextAuthorizationState = AUTHORIZED_OOS_STATE;
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
		case "O": setStyleSubAttribute(selectionRect, "stroke", OOS_COLOR); break;
		
		case "N":
		case "S": setStyleSubAttribute(selectionRect, "stroke", AUTHORIZED_COLOR); break;

		default: setStyleSubAttribute(selectionRect, "stroke", UNAUTHORIZED_COLOR); break;
	}
}

/* getCommonDispatchStates()
*  This is the method that PanelCommon.js uses to request initialization data from the server.  It is not used by DispatchCommon
*/

function getCommonDispatchStates()
{
    var commonObjs = [];
    var sensorObjs = [];
    
    for(var i = 1; i <= 8; i++)
    {
        commonObjs.push(new ServerObject("N" + i, SERVER_TYPE_DISPATCH, getTrainIDText("N" + i + "Train")));
        commonObjs.push(new ServerObject("S" + i, SERVER_TYPE_DISPATCH, getTrainIDText("S" + i + "Train")));
        commonObjs.push(new ServerObject("O" + i, SERVER_TYPE_DISPATCH, getTrainIDText("O" + i + "Train")));
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
    {
        commonObjs.push(new ServerObject(BLOCK_AUTH + getDCCAddr(blockElements[k]), SERVER_TYPE_DISPATCH, null));
        sensorObjs.push(new ServerObject(JMRI_SENSOR_OBJID_PREFIX + getDCCAddr(blockElements[k]), SERVER_TYPE_SENSOR, null));
	}

    for(var m in turnoutsOnPanel)
    {
        commonObjs.push(new ServerObject(TURNOUT_AUTH + turnoutsOnPanel[m].getInstanceID(), SERVER_TYPE_DISPATCH, null));
        
        var alreadyPresent = false;
        
        for(var mm in sensorObjs)
        {
        	alreadyPresent = (sensorObjs[mm].name == JMRI_SENSOR_OBJID_PREFIX + turnoutsOnPanel[m].getDCCID());
        	
        	if(alreadyPresent)
        		break;
        }
        
        if(!alreadyPresent)
        	sensorObjs.push(new ServerObject(JMRI_SENSOR_OBJID_PREFIX + turnoutsOnPanel[m].getDCCID(), SERVER_TYPE_SENSOR, null));
	}
		
    return commonObjs.concat(sensorObjs);
}

/* setDispatchObject(stateObj)
*  This is the main entry point for information coming back from server.  All dispatch-related server sets go through this routine
*/

function setDispatchObject(object)
{
    if(object.type == SERVER_TYPE_DISPATCH)
    {
        // Handle train subpanels at bottom of dispatch panel
        if(object.name.search("[N|S|O][1-8]") == 0)
        {
            setSVGText(object.name + "Train", object.value);
            
            var clearElemID = object.name.substring(0,2) + "ClearTrainID";
            var clearElem = svgDocument.getElementById(clearElemID);

            if(clearElem != null)
            {
                if(object.value == "")
                    clearElem.setAttribute("visibility", "hidden");
                else
                    clearElem.setAttribute("visibility", "visible");
            }
            
            if(selectedNSO == object.name.substring(0,2))
            {
                if((object.value == "") || (object.value == null))
                {
                    selectionRect.setAttribute("visibility", "hidden");
                    selectedNSO = null;
                    
                    nextAuthorizationTrainID = "";
                    nextAuthorizationState = AUTHORIZED_OOS_STATE;
                }
            }
            
            return true;
        }
        // Handle block/turnout authorization/state
        else if((object.name.search(BLOCK_AUTH) == 0) || (object.name.search(TURNOUT_AUTH) == 0))
        {
        	var fields = object.value.split(':');
            var route = fields[0];
            var state = fields[1];
            var trainID = fields[2];
            
            if(trainID === "null")
                trainID = null;
            
            setDispatchAuthorization(object.name, route, state, trainID);
        
            return true;
        }
    }

    return false;
}

/* getDispatchObject(object)
*  This is the method that PanelCommon.js uses to initialize server state (if variables are not undefined).  It is not used by DispatchCommon
*/

function getDispatchObject(object)
{
    if(object.name.search("[N|S|O][1-8]") == 0)
    {
        object.value = getTrainIDText(object.name + "Train");
        return object;
    }
    else if((object.name.search(BLOCK_AUTH) == 0) || (object.name.search(TURNOUT_AUTH) == 0))
    {
    	var localAuth = getDispatchLocalAuthorization(object.name);
    
    	if(localAuth != null)
    	{
        	object.value = localAuth.route + ":" + localAuth.state + ":" + localAuth.trainID;
        	
	        return object;
	    }
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
