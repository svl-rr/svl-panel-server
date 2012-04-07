function panelInit(evt)
{
}

function oneAtATimeStartClick()
{
    promptAndSetField("oneAtATimeStart");
    
    setSVGText("oneAtATimeCurrent", getDCCAddr(getSVGText("oneAtATimeStart")));
}

function oneAtATimeEndClick()
{
    promptAndSetField("oneAtATimeEnd");
}

function oneAtATimeNextClick()
{
    var startValue = Number(getDCCAddr(getSVGText("oneAtATimeStart")));
    var currentValue = Number(getDCCAddr(getSVGText("oneAtATimeCurrent")));
    var endValue = Number(getDCCAddr(getSVGText("oneAtATimeEnd")));
    
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
	
	executePanelStateChangeRequests();
	setPanelStatus("Done");
}




function setAllStartClick()
{
    promptAndSetField("setAllStart");
}

function setAllEndClick()
{
    promptAndSetField("setAllEnd");
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
    
    if(start < 0)
        start = 0;
    else if(start > 999)
        start = 999;
    
    if(end < 0)
        end = 0;
    else if(end > 999)
        end = 999;
    
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
    
	executePanelStateChangeRequests();
	setPanelStatus("Done");
}


function promptAndSetField(whichObj)
{
    var currentText = getSVGText(whichObj);
    
    var newText = prompt("Enter a turnout number:", currentText);
        
    var value = Number(getDCCAddr(newText));
    
    if(value < 0)
        value = 0;
    else if(value > 999)
        value = 999;
    
    setSVGText(whichObj, "" + value);
}