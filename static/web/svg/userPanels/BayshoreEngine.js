var JMRI_TURNTABLE_OBJID_PREFIX = "ST";

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
    
    executePanelStateChangeRequests();
    
    stateChangeRequests = savedStateChangeRequests;
}

function setTurntableTrack(num)
{
    setTurntableState('ST' + (num + 225));
}

function ttLead1Path()
{
    setTurntableTrack(1);
    //executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}

function ttLead2Path()
{
    setTurntableTrack(2);
    //executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}
