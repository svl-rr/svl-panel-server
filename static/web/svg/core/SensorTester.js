var SENSORTESTER_SID = "SID";
var SENSORTESTER_STATE = "SState";

var UNKNOWN_SENSOR_STATE = "--";

function panelInitPreSocket(evt)
{
    for(var i = 1; i <= 8; i++)
    {
        var stateElemID = SENSORTESTER_STATE + i;
        var stateElem = svgDocument.getElementById(stateElemID);
        
        setSVGText(stateElemID, UNKNOWN_SENSOR_STATE);
        setStyleSubAttribute(stateElem, "cursor", "pointer");
        
        var addrElemID = SENSORTESTER_SID + i;
        var addrElem = svgDocument.getElementById(addrElemID);
        
        setStyleSubAttribute(addrElem, "cursor", "pointer");
    }
    
    var autoFillElem = svgDocument.getElementById("autoFillAddrRange");
    
    if(autoFillElem != null)
        setStyleSubAttribute(autoFillElem, "cursor", "pointer");
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

function autoFillAddressRange()
{
    var newAddr = promptForAddress("Enter start of address range:", "1", 4089);

    if(newAddr != null)
    {
        for(var i = 1; i <= 8; i++)
        {
            var stateElemID = SENSORTESTER_STATE + i;
            
            setSVGText(stateElemID, UNKNOWN_SENSOR_STATE);
            
            var addrElemID = SENSORTESTER_SID + i;
            
            setSVGText(addrElemID, Number(newAddr.valueOf()) + (i-1));
        }
        
        updateAllObjectsFromServer();
    }
}

function promptForAddress(displayText, initialValue, maxAddress)
{
    var newAddr = prompt(displayText, initialValue);

    var regExResult = newAddr.match(/[1-9][0-9]*/);

    if(newAddr == regExResult)
    {
        if(Number(newAddr.valueOf()) <= maxAddress)
            return newAddr;
    }
    else if((newAddr == null) || (newAddr == ""))
    {
        return null;
    }
    
    alert("Only enter a numeric address between 1 and " + maxAddress + " in this field");
    return null;
}

function setSensorAddr(whichElem)
{
    var newAddr = promptForAddress("Enter a new sensor address:", getSVGText(whichElem.id), 4096);

    if(newAddr != null)
    {
        setSVGText(whichElem.parentNode.id, newAddr);
        
        var i = whichElem.parentNode.id.substring(whichElem.parentNode.id.length-1);
        
        setSVGText(SENSORTESTER_STATE + i, UNKNOWN_SENSOR_STATE);
        
        updateAllObjectsFromServer();
    }
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
