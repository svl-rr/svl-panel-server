function panelInit(evt)
{
	// Hump Yard
    createPanelTurnout("TO400", true);
	createPanelTurnout("TO401", true);
	createPanelTurnout("TO402", true);
	createPanelTurnout("TO403", false);
	createPanelTurnout("TO404", true);
	createPanelTurnout("TO405", true);

    // Bowl
	createPanelTurnout("TO410", true);    
    createPanelTurnout("TO411", true);
	createPanelTurnout("TO412", true);
	createPanelTurnout("TO413", true);
	createPanelTurnout("TO414", true);
	createPanelTurnout("TO415", true);
	createPanelTurnout("TO416", true);
	createPanelTurnout("TO417", true);
	createPanelTurnout("TO419", true);
    
    // Mt. Marvel
}

function class1SouthPath()
{
	addTurnoutStateChangeRequest("TO400", 'R');
	addTurnoutStateChangeRequest("TO401", 'R');

	executePanelStateChangeRequests();									
}

function class1NorthPath()
{
	addTurnoutStateChangeRequest("TO410", 'N');
	addTurnoutStateChangeRequest("TO411", 'N');
	addTurnoutStateChangeRequest("TO412", 'N');
	addTurnoutStateChangeRequest("TO414", 'R');

	executePanelStateChangeRequests();
}

function class2SouthPath()
{
	addTurnoutStateChangeRequest("TO400", 'R');
	addTurnoutStateChangeRequest("TO401", 'N');
	addTurnoutStateChangeRequest("TO402", 'N');

	executePanelStateChangeRequests();
}

function class2NorthPath()
{
	addTurnoutStateChangeRequest("TO410", 'N');
	addTurnoutStateChangeRequest("TO411", 'N');
	addTurnoutStateChangeRequest("TO412", 'N');
	addTurnoutStateChangeRequest("TO414", 'N');

	executePanelStateChangeRequests();
}

function class3SouthPath()
{
	addTurnoutStateChangeRequest("TO400", 'R');
	addTurnoutStateChangeRequest("TO401", 'N');
	addTurnoutStateChangeRequest("TO402", 'R');

	executePanelStateChangeRequests();									
}

function class3NorthPath()
{
	addTurnoutStateChangeRequest("TO410", 'N');
	addTurnoutStateChangeRequest("TO411", 'N');
	addTurnoutStateChangeRequest("TO412", 'R');

	executePanelStateChangeRequests();
}

function class4SouthPath()
{
	addTurnoutStateChangeRequest("TO400", 'N');
	addTurnoutStateChangeRequest("TO403", 'N');
	addTurnoutStateChangeRequest("TO404", 'N');

	executePanelStateChangeRequests();
}

function class4NorthPath()
{
	addTurnoutStateChangeRequest("TO410", 'N');
	addTurnoutStateChangeRequest("TO411", 'R');
	addTurnoutStateChangeRequest("TO413", 'N');
	addTurnoutStateChangeRequest("TO415", 'R');

	executePanelStateChangeRequests();
}

function class5SouthPath()
{
	addTurnoutStateChangeRequest("TO400", 'N');
	addTurnoutStateChangeRequest("TO403", 'N');
	addTurnoutStateChangeRequest("TO404", 'R');

	executePanelStateChangeRequests();									
}

function class5NorthPath()
{
	addTurnoutStateChangeRequest("TO410", 'N');
	addTurnoutStateChangeRequest("TO411", 'R');
	addTurnoutStateChangeRequest("TO413", 'N');
	addTurnoutStateChangeRequest("TO415", 'N');
	addTurnoutStateChangeRequest("TO417", 'R');

	executePanelStateChangeRequests();
}

function class6SouthPath()
{
	addTurnoutStateChangeRequest("TO400", 'N');
	addTurnoutStateChangeRequest("TO403", 'R');
	addTurnoutStateChangeRequest("TO405", 'N');

	executePanelStateChangeRequests();
}

function class6NorthPath()
{
	addTurnoutStateChangeRequest("TO410", 'N');
	addTurnoutStateChangeRequest("TO411", 'R');
	addTurnoutStateChangeRequest("TO413", 'N');
	addTurnoutStateChangeRequest("TO415", 'N');
	addTurnoutStateChangeRequest("TO417", 'N');

	executePanelStateChangeRequests();
}

function class7SouthPath()
{
	addTurnoutStateChangeRequest("TO400", 'N');
	addTurnoutStateChangeRequest("TO403", 'R');
	addTurnoutStateChangeRequest("TO405", 'R');

	executePanelStateChangeRequests();									
}

function class7NorthPath()
{
	addTurnoutStateChangeRequest("TO410", 'N');
	addTurnoutStateChangeRequest("TO411", 'R');
	addTurnoutStateChangeRequest("TO413", 'R');

	executePanelStateChangeRequests();
}

function class8Path()
{
	addTurnoutStateChangeRequest("TO410", 'R');
	addTurnoutStateChangeRequest("TO416", 'R');

	executePanelStateChangeRequests();
}

function mmPreLeadPath()
{
	addTurnoutStateChangeRequest("TO410", 'R');
    
	executePanelStateChangeRequests();
}

function mmLeadPath()
{
	addTurnoutStateChangeRequest("TO410", 'R');
	addTurnoutStateChangeRequest("TO416", 'N');
    
	executePanelStateChangeRequests();
}

function mmPath()
{
	addTurnoutStateChangeRequest("TO410", 'R');
	addTurnoutStateChangeRequest("TO416", 'N');
	addTurnoutStateChangeRequest("TO419", 'R');
    
	executePanelStateChangeRequests();
}

function mmLumberPath()
{
	addTurnoutStateChangeRequest("TO410", 'R');
	addTurnoutStateChangeRequest("TO416", 'N');
	addTurnoutStateChangeRequest("TO419", 'N');

	executePanelStateChangeRequests();
}
