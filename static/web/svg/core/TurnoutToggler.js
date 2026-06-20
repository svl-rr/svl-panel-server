var turnoutState, isRunning;

function panelInitPreSocket(evt)
{
    turnoutState = 'N';
    
    toggleStopClick();
}

function addrToToggleClick()
{
    promptAndSetField("addrToToggle", "Enter a turnout number:", validateAddrRange);
}

function toggleDelayClick()
{
    promptAndSetField("toggleDelay", "Enter a delay in seconds (1-10):", validateDelayRange);
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

