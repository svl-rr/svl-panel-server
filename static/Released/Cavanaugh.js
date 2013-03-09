function panelInit(evt)
{
    // Mains
    createPanelTurnout("TO100A", true);
	createPanelTurnout("TO100B", true);
	createPanelTurnout("TO101", true);

    // Industries
	createPanelTurnout("TO102", true);
    createPanelTurnout("TO103", true);
	createPanelTurnout("TO104", true);
	createPanelTurnout("TO105", true);
	createPanelTurnout("TO106", true);
}

function buzzBeer2Path()
{
	addTurnoutStateChangeRequest("TO104", 'N');
	addTurnoutStateChangeRequest("TO105", 'R');

	executePanelStateChangeRequests();
}

function buzzBeer1Path()
{
	addTurnoutStateChangeRequest("TO104", 'R');
	addTurnoutStateChangeRequest("TO105", 'R');

	executePanelStateChangeRequests();
}

function buzzBeerLeadPath()
{
	addTurnoutStateChangeRequest("TO105", 'R');

	executePanelStateChangeRequests();
}

function slipperShipperPath()
{
	addTurnoutStateChangeRequest("TO103", 'R');

	executePanelStateChangeRequests();
}

function cavanaughJunkPath()
{
	addTurnoutStateChangeRequest("TO102", 'R');

	executePanelStateChangeRequests();
}

function departureMain1Path()
{
	addTurnoutStateChangeRequest("TO105", 'N');
	addTurnoutStateChangeRequest("TO100A", 'N');

	executePanelStateChangeRequests();
}

function departureMain2Path()
{
	addTurnoutStateChangeRequest("TO103", 'N');

	executePanelStateChangeRequests();
}

function departureMain3Path()
{
	addTurnoutStateChangeRequest("TO106", 'N');
	addTurnoutStateChangeRequest("TO101", 'N');

	executePanelStateChangeRequests();
}

function daytonIndustrialPath()
{
	addTurnoutStateChangeRequest("TO106", 'R');

	executePanelStateChangeRequests();
}

function arrivalMain1Path()
{
	addTurnoutStateChangeRequest("TO101", 'R');

	executePanelStateChangeRequests();
}

function arrivalMain2Path()
{
	addTurnoutStateChangeRequest("TO102", 'N');
    addTurnoutStateChangeRequest("TO100B", 'N');

	executePanelStateChangeRequests();
}
