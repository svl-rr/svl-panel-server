var JMRI_TURNTABLE_OBJID_PREFIX = "ST";
var BAYSHORE_TURNTABLE_CONTROLLER_ADDR = 57;

var bayshoreLastTrackNum = 0;

function panelInit(evt)
{
    //setLEDColorByID('dispatchMainlineLockedLED', mainlineLocked == true ? "#ff0000" : "off");
}

function addTurntableStateChangeRequest(id)
{
    var turnoutAddr = getDCCAddr(id);
    
	stateChangeRequests.push(new ServerObject(JMRI_TURNTABLE_OBJID_PREFIX + turnoutAddr, SERVER_TYPE_TURNOUT, 'N'));
}

function setTurntableState(id)
{
    var savedStateChangeRequests = stateChangeRequests;

    stateChangeRequests = [];
    
    addTurntableStateChangeRequest(id);
    
    executePanelStateChangeRequestsLowLevel(stateChangeRequests, false);
    
    stateChangeRequests = savedStateChangeRequests;
}

function setTurntableTrack(num)
{
    if((num >= 1) && (num <= 28))
        setTurntableState('ST' + ((BAYSHORE_TURNTABLE_CONTROLLER_ADDR - 1)*4 + num));
    else
        alert("Track number must be range of 1 to 28 for Walthers turntable. (" + num + " was passed.)");
}

function setBayshoreTurntableTrack(trackNum)
{
    if(trackNum != bayshoreLastTrackNum)
    {
        setTurntableTrack(trackNum);
    
        bayshoreLastTrackNum = trackNum;
    }
    else
    {
        alert("Turntable should already be set to track " + trackNum + ". If turntable is out of sync with panel, try selecting an adjacent track and then reselecting track " + trackNum + ".");
    }
}

function ttLead1Path()
{
    setBayshoreTurntableTrack(17);
    //executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}

function ttLead2Path()
{
    setBayshoreTurntableTrack(2);
    //executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}
