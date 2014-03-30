var SENSORTESTER_SID = "SID";
var SENSORTESTER_STATE = "SState";

function panelInit(evt)
{
    for(var i = 1; i <= 8; i++)
    {
        var stateElemID = SENSORTESTER_STATE + i;
        var stateElem = svgDocument.getElementById(stateElemID);
        
        setSVGText(stateElemID, "--");
        setStyleSubAttribute(stateElem, "cursor", "pointer");
        
        var addrElemID = SENSORTESTER_SID + i;
        var addrElem = svgDocument.getElementById(addrElemID);
        
        setStyleSubAttribute(addrElem, "cursor", "pointer");
    }
}

function getPanelSpecificStates()
{
    var panelSpecificStates = new Array();
    
    for(var i = 1; i <= 8; i++)
    {
        var addrElemID = SENSORTESTER_SID + i;
        
        panelSpecificStates.push(new ServerObject(JMRI_SENSOR_OBJID_PREFIX + getSVGText(addrElemID), SERVER_TYPE_SENSOR, null));
    }
    
    return panelSpecificStates;
}

function setSensorAddr(whichElem)
{
    var newAddr = prompt("Enter a new sensor address", getSVGText(whichElem.id));

    var regExResult = newAddr.match(/[1-9][0-9]*/);

    if(newAddr == regExResult)
    {
        setSVGText(whichElem.parentNode.id, newAddr);
        
        var i = whichElem.parentNode.id.substring(whichElem.parentNode.id.length-1);
        
        setSVGText(SENSORTESTER_STATE + i, "--");
        
        updateAllObjectsFromServer();
    }
    else if((newAddr == null) || (newAddr == ""))
    {
        // canceled by user
    }
    else
        alert("Only enter a numeric address in this field");
}

function toggleState(whichElem)
{
    var textElem = whichElem.parentNode;
    
    var i = textElem.id.substring(textElem.id.length-1);

    var addrElemID = SENSORTESTER_SID + i;
    var stateElemID = SENSORTESTER_STATE + i;
    
    var newState = JMRI_SENSOR_INACTIVE;

    if(getSVGText(stateElemID) == JMRI_SENSOR_INACTIVE)
        newState = JMRI_SENSOR_ACTIVE;
    
    var dataToSend = new Array();
    
    dataToSend.push(new ServerObject(JMRI_SENSOR_OBJID_PREFIX + getSVGText(addrElemID), SERVER_TYPE_SENSOR, newState));
    
    serverSet(dataToSend);
}

function setSensorState(name, value)
{
    for(var i = 1; i <= 8; i++)
    {
        var addrElemID = SENSORTESTER_SID + i;
        var addrElem = svgDocument.getElementById(addrElemID);
        
        if(name.substring(2) == getSVGText(addrElemID))
        {
            var stateElemID = SENSORTESTER_STATE + i;
        
            setSVGText(stateElemID, value);
        }
    }
}
