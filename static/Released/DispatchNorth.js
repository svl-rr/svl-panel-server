function panelInitNorth(evt)
{
    // Paso - Victoria
	createPanelTurnout("TO725", false);
    createPanelTurnout("TO703", false);
    createPanelTurnout("TO702", false);
    createPanelTurnout("TO701", false);
    createPanelTurnout("TO700", false);
    createPanelTurnout("TO651", false);
    createPanelTurnout("TO650", false);
    createPanelTurnout("TO601", false);
    createPanelTurnout("TO600", false);
    createPanelTurnout("TO575", false);

	// Nowheres South
	createPanelTurnout("TO492", false);
	createPanelTurnout("TO493", true);
	createPanelTurnout("TO494A", false);
	
	// Nowheres North
	createPanelTurnout("TO507", true);
	createPanelTurnout("TO508", false);
	createPanelTurnout("TO509", true);
    
    // Loop North
	createPanelTurnout("TO329", false);
}

function nowheresMain1SouthPath()
{
	addTurnoutStateChangeRequest("TO494A", 'N');
	addTurnoutStateChangeRequest("TO493", 'R');
	addTurnoutStateChangeRequest("TO492", 'N');

	executePanelStateChangeRequests();									
}

function nowheresMain1NorthPath()
{
	addTurnoutStateChangeRequest("TO508", 'N');
	addTurnoutStateChangeRequest("TO509", 'R');

	executePanelStateChangeRequests();
}

function nowheresMain2SouthPath()
{
	addTurnoutStateChangeRequest("TO494A", 'N');
	addTurnoutStateChangeRequest("TO493", 'N');

	executePanelStateChangeRequests();
}

function nowheresMain2NorthPath()
{
	addTurnoutStateChangeRequest("TO507", 'N');
	addTurnoutStateChangeRequest("TO508", 'R');
	addTurnoutStateChangeRequest("TO509", 'R');

	executePanelStateChangeRequests();
}

function nowheresYardSouthPath()
{
	addTurnoutStateChangeRequest("TO494A", 'R');

	executePanelStateChangeRequests();									
}

function nowheresYardNorthPath()
{
	addTurnoutStateChangeRequest("TO507", 'R');
	addTurnoutStateChangeRequest("TO508", 'R');
	addTurnoutStateChangeRequest("TO509", 'R');

	executePanelStateChangeRequests();
}

function nowheresPassSouthPath()
{
	addTurnoutStateChangeRequest("TO492", 'R');
	addTurnoutStateChangeRequest("TO494A", 'N');
	addTurnoutStateChangeRequest("TO493", 'R');

	executePanelStateChangeRequests();
}

function nowheresPassNorthPath()
{
	addTurnoutStateChangeRequest("TO509", 'N');

	executePanelStateChangeRequests();
}

function nowheresPassThru()
{
	nowheresPassNorthPath();
	nowheresPassSouthPath();
}

function nowheresMain1Thru()
{
	nowheresMain1NorthPath();
	nowheresMain1SouthPath();
}

function nowheresMain2Thru()
{
	nowheresMain2NorthPath();
	nowheresMain2SouthPath();
}

function nowheresYardThru()
{
	nowheresYardNorthPath();
	nowheresYardSouthPath();
}
