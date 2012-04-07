function panelInit(evt)
{
	createPanelTurnout("TO35", true);
	createPanelTurnout("TO36", true);
	createPanelTurnout("TO37", true);
	createPanelTurnout("TO38", true);
	createPanelTurnout("TO24", false);
	createPanelTurnout("TO23A", true);
	createPanelTurnout("TO23B", true);
	createPanelTurnout("TO34", true);
	createPanelTurnout("TO22", true);
//	createPanelTurnout("TO908A", true);  // not hooked up
//	createPanelTurnout("TO908B", true);  // not hooked up
//	createPanelTurnout("TO909", true);  // not hooked up
	createPanelTurnout("TO26A", true);
	createPanelTurnout("TO26B", true);
	createPanelTurnout("TO27A", true);
	createPanelTurnout("TO27B", true);
	createPanelTurnout("TO28", true);
	createPanelTurnout("TO29", true);
	createPanelTurnout("TO30", true);
    createPanelTurnout("TO31", true);
	createPanelTurnout("TO32", true);
	createPanelTurnout("TO33", true);
	createPanelTurnout("TO42", true);
	createPanelTurnout("TO41", true);
	createPanelTurnout("TO39", true);
	createPanelTurnout("TO40", true);
//	createPanelTurnout("TO25", true);
}

function mainSouthLeadPath()
{
    addTurnoutStateChangeRequest("TO35", 'N');
    addTurnoutStateChangeRequest("TO24", 'N');

	executePanelStateChangeRequests();
}

function mainSouthPath()
{
    addTurnoutStateChangeRequest("TO23B", 'R');

	executePanelStateChangeRequests();
}

function cabooseTrkPath()
{
    addTurnoutStateChangeRequest("TO24", 'R');
    addTurnoutStateChangeRequest("TO23B", 'T');

	executePanelStateChangeRequests();
}

function arrivalLeadPath()
{
    addTurnoutStateChangeRequest("TO35", 'R');
    addTurnoutStateChangeRequest("TO36", 'N');
    addTurnoutStateChangeRequest("TO38", 'R');
    addTurnoutStateChangeRequest("TO23A", 'R');

	executePanelStateChangeRequests();
}

function arrivalNorthPath()
{
    //addTurnoutStateChangeRequest("TO23A", 'T');

	//executePanelStateChangeRequests();
}

function arrivalSouthPath()
{
    addTurnoutStateChangeRequest("TO34", 'R');

	executePanelStateChangeRequests();
}

function class1NorthPath()
{
    addTurnoutStateChangeRequest("TO35", 'R');
    addTurnoutStateChangeRequest("TO36", 'N');
    addTurnoutStateChangeRequest("TO38", 'N');

	executePanelStateChangeRequests();
}

function class1SouthPath()
{
    addTurnoutStateChangeRequest("TO34", 'N');
    addTurnoutStateChangeRequest("TO33", 'N');

	executePanelStateChangeRequests();
}

function class2NorthPath()
{
    addTurnoutStateChangeRequest("TO35", 'R');
    addTurnoutStateChangeRequest("TO36", 'R');
    addTurnoutStateChangeRequest("TO37", 'N');

	executePanelStateChangeRequests();
}

function class2SouthPath()
{
    addTurnoutStateChangeRequest("TO34", 'N');
    addTurnoutStateChangeRequest("TO33", 'R');
    addTurnoutStateChangeRequest("TO32", 'N');

	executePanelStateChangeRequests();
}

function class3NorthPath()
{
    addTurnoutStateChangeRequest("TO35", 'R');
    addTurnoutStateChangeRequest("TO36", 'R');
    addTurnoutStateChangeRequest("TO37", 'R');

	executePanelStateChangeRequests();
}

function class3SouthPath()
{
    addTurnoutStateChangeRequest("TO34", 'N');
    addTurnoutStateChangeRequest("TO33", 'R');
    addTurnoutStateChangeRequest("TO32", 'R');
    addTurnoutStateChangeRequest("TO31", 'N');

	executePanelStateChangeRequests();
}

function class4NorthPath()
{
    addTurnoutStateChangeRequest("TO39", 'R');
    addTurnoutStateChangeRequest("TO40", 'R');

	executePanelStateChangeRequests();
}

function class4SouthPath()
{
    addTurnoutStateChangeRequest("TO34", 'N');
    addTurnoutStateChangeRequest("TO33", 'R');
    addTurnoutStateChangeRequest("TO32", 'R');
    addTurnoutStateChangeRequest("TO31", 'R');
    addTurnoutStateChangeRequest("TO30", 'N');

	executePanelStateChangeRequests();
}

function class5NorthPath()
{
    addTurnoutStateChangeRequest("TO39", 'R');
    addTurnoutStateChangeRequest("TO40", 'N');
    addTurnoutStateChangeRequest("TO41", 'N');

	executePanelStateChangeRequests();
}

function class5SouthPath()
{
    addTurnoutStateChangeRequest("TO34", 'N');
    addTurnoutStateChangeRequest("TO33", 'R');
    addTurnoutStateChangeRequest("TO32", 'R');
    addTurnoutStateChangeRequest("TO31", 'R');
    addTurnoutStateChangeRequest("TO30", 'R');
    addTurnoutStateChangeRequest("TO29", 'N');
    addTurnoutStateChangeRequest("TO28", 'R');
   
	executePanelStateChangeRequests();
}

function class6NorthPath()
{
    addTurnoutStateChangeRequest("TO39", 'R');
    addTurnoutStateChangeRequest("TO40", 'N');
    addTurnoutStateChangeRequest("TO41", 'R');
    addTurnoutStateChangeRequest("TO42", 'N');

	executePanelStateChangeRequests();
}

function class6SouthPath()
{
    addTurnoutStateChangeRequest("TO27B", 'R');    

    addTurnoutStateChangeRequest("TO34", 'N');
    addTurnoutStateChangeRequest("TO33", 'R');
    addTurnoutStateChangeRequest("TO32", 'R');
    addTurnoutStateChangeRequest("TO31", 'R');
    addTurnoutStateChangeRequest("TO30", 'R');
    addTurnoutStateChangeRequest("TO29", 'R');
    addTurnoutStateChangeRequest("TO28", 'N');
   
	executePanelStateChangeRequests();
}

function departureNorthPath()
{
    addTurnoutStateChangeRequest("TO39", 'R');
    addTurnoutStateChangeRequest("TO40", 'N');
    addTurnoutStateChangeRequest("TO41", 'R');
    addTurnoutStateChangeRequest("TO42", 'R');

	executePanelStateChangeRequests();
}

function departureSouthPath()
{
    addTurnoutStateChangeRequest("TO26B", 'R');

	executePanelStateChangeRequests();
}

function mainNorthLeadPath()
{
    addTurnoutStateChangeRequest("TO39", 'N');

	executePanelStateChangeRequests();
}

function mainNorthPath()
{
}
