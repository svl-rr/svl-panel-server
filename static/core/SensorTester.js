function panelInit(evt)
{
    for(var i = 1; i <= 8; i++)
    {
        var textElemID = JMRI_SENSOR_OBJID_PREFIX + i;
        var textElem = svgDocument.getElementById(textElemID);
        
        setSVGText(textElemID, JMRI_SENSOR_INACTIVE);
        setStyleSubAttribute(textElem, "cursor", "pointer");
    }
}

function toggleState(whichElem)
{
    var textElem = whichElem.parentNode;

    var newState;

    if(getSVGText(textElem.id) == JMRI_SENSOR_INACTIVE)
        newState = JMRI_SENSOR_ACTIVE;
    else
        newState = JMRI_SENSOR_INACTIVE;
    
    setSVGText(textElem.id, newState);
    
    var dataToSend = new Array();
    
    dataToSend.push(new ServerObject(textElem.id, SERVER_TYPE_SENSOR, newState));
    
    serverSet(dataToSend);
}
