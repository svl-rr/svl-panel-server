var turnoutState, isRunning;

function panelInitPreSocket(evt)
{
    turnoutState = 'N';
    
    toggleStopClick();
}

function addrToToggleClick()
{
    promptAndSetField("addrToToggle", "Enter a turnout number:");
}

function toggleDelayClick()
{
    promptAndSetField("toggleDelay", "Enter a delay in seconds (1-10):");
}

function toggleStartClick()
{
    svgDocument.getElementById("toggleStart").setAttribute("visibility", "hidden");
    svgDocument.getElementById("toggleStop").setAttribute("visibility", "visible");

    isRunning = true;

    setTimeout(timerFire, 0);
}

function toggleStopClick()
{
    isRunning = false;

    svgDocument.getElementById("toggleStart").setAttribute("visibility", "visible");
    svgDocument.getElementById("toggleStop").setAttribute("visibility", "hidden");

    setSVGText("togglerStatusString", "Toggling stopped");
}

function timerFire()
{
    if(isRunning)
    {
	var currentDelayText = getSVGText("toggleDelay");
    
        var delayValue = Number(currentDelayText);

        var currentDelay = validateDelayRange(delayValue);

	toggleCurrentAddress();

	setTimeout(timerFire, currentDelay*1000);
    }
}


function toggleCurrentAddress()
{
    if(turnoutState == 'N')
	turnoutState = 'R';
    else
        turnoutState = 'N';

    setCurrentAddress(turnoutState);
}

function setCurrentAddress(state)
{
    var addr = getDCCAddr(getSVGText("addrToToggle"));

    var updateMessage = "";

    if((addr > 0) && (addr < 2044))
    {
    	addTurnoutStateChangeRequest(addr, state);
    	executePanelStateChangeRequestsLowLevel(stateChangeRequests, false);

	updateMessage = "Address " + addr + " set to " + state;
    }
    else
	updateMessage = "Address field invalid";

    setSVGText("togglerStatusString", updateMessage);
}



function promptAndSetField(whichObj, message)
{
    var currentText = getSVGText(whichObj);
    
    var newText = prompt(message, currentText);
        
    var value = Number(getDCCAddr(newText));
    
    if(whichObj == "addrToToggle")
        value = validateAddrRange(value);
    else if(whichObj == "toggleDelay")
	value = validateDelayRange(value);
    
    setSVGText(whichObj, "" + value);
}

function validateAddrRange(inAddr)
{
    if(inAddr < 1)
        return 1;
    else if(inAddr > 2044)
        return 2044;
    else
        return inAddr;
}

function validateDelayRange(inDelay)
{
    if(inDelay < 1)
	return 1;
    else if(inDelay > 10)
	return 10;
    else
	return inDelay;
}
