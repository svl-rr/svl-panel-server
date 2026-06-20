function panelInitPreSocket(evt)
{
}

function oneAtATimeStartClick()
{
    promptAndSetField("oneAtATimeStart", "Enter a turnout number:", validateAddrRange);

    setSVGText("oneAtATimeCurrent", getDCCAddr(getSVGText("oneAtATimeStart")));
}

function oneAtATimeEndClick()
{
    promptAndSetField("oneAtATimeEnd", "Enter a turnout number:", validateAddrRange);
}

function oneAtATimeNextClick()
{
    var startValue = Number(getDCCAddr(getSVGText("oneAtATimeStart")));
    var currentValue = Number(getDCCAddr(getSVGText("oneAtATimeCurrent")));
    var endValue = Number(getDCCAddr(getSVGText("oneAtATimeEnd")));
    
    startValue = validateAddrRange(startValue);
    currentValue = validateAddrRange(currentValue);
    endValue = validateAddrRange(endValue);
    
    if(endValue > startValue)
    {
        if((currentValue >= startValue) && (currentValue < endValue))
            setSVGText("oneAtATimeCurrent", new String(currentValue + 1));
        else
            setSVGText("oneAtATimeCurrent", new String(startValue));
    }
    else
    {
        if((currentValue > endValue) && (currentValue <= startValue))
            setSVGText("oneAtATimeCurrent", new String(currentValue - 1));
        else
            setSVGText("oneAtATimeCurrent", new String(startValue));
    }
        
    svgDocument.getElementById("oneAtATimeSetN").setAttribute("visibility", "visible");
    svgDocument.getElementById("oneAtATimeSetR").setAttribute("visibility", "visible");
}

function oneAtATimeSetNClick()
{
    oneAtATime('N');
    svgDocument.getElementById("oneAtATimeSetN").setAttribute("visibility", "hidden");
    svgDocument.getElementById("oneAtATimeSetR").setAttribute("visibility", "visible");
}

function oneAtATimeSetRClick()
{
    oneAtATime('R');
    svgDocument.getElementById("oneAtATimeSetR").setAttribute("visibility", "hidden");
    svgDocument.getElementById("oneAtATimeSetN").setAttribute("visibility", "visible");
}

function oneAtATime(state)
{
    addTurnoutStateChangeRequest(getDCCAddr(getSVGText("oneAtATimeCurrent")), state);
	
    executePanelStateChangeRequestsLowLevel(stateChangeRequests, false);
	setPanelStatus("Done");
}




function setAllStartClick()
{
    promptAndSetField("setAllStart", "Enter a turnout number:", validateAddrRange);
}

function setAllEndClick()
{
    promptAndSetField("setAllEnd", "Enter a turnout number:", validateAddrRange);
}

function setAllNClick()
{
    setAll('N');
}

function setAllRClick()
{
    setAll('R');
}

function setAll(state)
{
    var start = Number(getDCCAddr(getSVGText("setAllStart")));
    var end = Number(getDCCAddr(getSVGText("setAllEnd")));
    
    start = validateAddrRange(start);
    end = validateAddrRange(end);
    
    if(end > start)
    {
        for(var i = start; i <= end; i++)
            addTurnoutStateChangeRequest("" + i, state);
	}
    else
    {
        for(var i = start; i >= end; i--)
            addTurnoutStateChangeRequest("" + i, state);
    }
    
    executePanelStateChangeRequestsLowLevel(stateChangeRequests, false);
	setPanelStatus("Done");
}
