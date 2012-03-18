function panelInit(evt)
{
	// Coach Yard
    createPanelTurnout("TO467", true);
	createPanelTurnout("TO468", true);
	createPanelTurnout("TO470", true);
	createPanelTurnout("TO472", true);
	createPanelTurnout("TO474", true);
	createPanelTurnout("TO475", true);

    // South Passenger Lead
	createPanelTurnout("TO469", true);    
    createPanelTurnout("TO471", true);
	createPanelTurnout("TO473A", true);
	createPanelTurnout("TO473B", false);
    
    // South Mains
	createPanelTurnout("TO492", true);
	createPanelTurnout("TO493", true);
	createPanelTurnout("TO494A", false);
	
    // North Mains
	createPanelTurnout("TO507", true);
	createPanelTurnout("TO508", true);
	createPanelTurnout("TO509", true);
	
    // North Passenger Lead
	createPanelTurnout("TO514A", true);
	createPanelTurnout("TO514B", false);
	createPanelTurnout("TO515", true);
	createPanelTurnout("TO517", true);
	createPanelTurnout("TO519", true);
	createPanelTurnout("TO518", false);
	createPanelTurnout("TO520", true);
}

function lineSouthMainsForPassenger()
{
	addTurnoutStateChangeRequest("TO494A", 'N');
	addTurnoutStateChangeRequest("TO493", 'R');
	addTurnoutStateChangeRequest("TO492", 'R');
}

function lineNorthMainsForPassenger()
{
	addTurnoutStateChangeRequest("TO509", 'N');
}

function main1SouthPath()
{
	addTurnoutStateChangeRequest("TO494A", 'N');
	addTurnoutStateChangeRequest("TO493", 'R');
	addTurnoutStateChangeRequest("TO492", 'N');

	executePanelStateChangeRequests();									
}

function main1NorthPath()
{
	addTurnoutStateChangeRequest("TO508", 'N');
	addTurnoutStateChangeRequest("TO509", 'R');

	executePanelStateChangeRequests();
}

function main2SouthPath()
{
	addTurnoutStateChangeRequest("TO494A", 'N');
	addTurnoutStateChangeRequest("TO493", 'N');

	executePanelStateChangeRequests();
}

function main2NorthPath()
{
	addTurnoutStateChangeRequest("TO507", 'N');
	addTurnoutStateChangeRequest("TO508", 'R');
	addTurnoutStateChangeRequest("TO509", 'R');

	executePanelStateChangeRequests();
}

function pass1SouthPath()
{
	lineSouthMainsForPassenger();
	
	addTurnoutStateChangeRequest("TO469", 'R');
	addTurnoutStateChangeRequest("TO471", 'R');
	addTurnoutStateChangeRequest("TO473A", 'R');
	
	executePanelStateChangeRequests();
}

function pass1NorthPath()
{
	pass123NorthPathToggle();
	
	addTurnoutStateChangeRequest("TO517", 'R');
	addTurnoutStateChangeRequest("TO514A", 'R');

	executePanelStateChangeRequests();
}

function pass2SouthPath()
{
	lineSouthMainsForPassenger();
									
	addTurnoutStateChangeRequest("TO469", 'R');
	addTurnoutStateChangeRequest("TO471", 'R');
	addTurnoutStateChangeRequest("TO473A", 'N');

	executePanelStateChangeRequests();
}

function pass2NorthPath()
{
	pass123NorthPathToggle();
									
	addTurnoutStateChangeRequest("TO517", 'R');
	addTurnoutStateChangeRequest("TO514A", 'N');

	executePanelStateChangeRequests();
}

function pass3SouthPath()
{
	lineSouthMainsForPassenger();
		
	addTurnoutStateChangeRequest("TO469", 'R');
	addTurnoutStateChangeRequest("TO471", 'N');

	executePanelStateChangeRequests();
}

function pass3NorthPath()
{
	pass123NorthPathToggle();
	
	addTurnoutStateChangeRequest("TO517", 'N');
	
	executePanelStateChangeRequests();
}

function pass4SouthPath()
{
	lineSouthMainsForPassenger();
									
	addTurnoutStateChangeRequest("TO469", 'N');

	executePanelStateChangeRequests();
}

function pass4NorthPath()
{
	lineNorthMainsForPassenger();

	addTurnoutStateChangeRequest("TO520", 'R');
	addTurnoutStateChangeRequest("TO515", 'R');

	executePanelStateChangeRequests();
}

function pass4SwitchLeadPath()
{
	addTurnoutStateChangeRequest("TO515", 'N');
	
	if(getTurnoutState("TO519") == 'N')
		addTurnoutStateChangeRequest("TO519", 'R');
	else
	{
		addTurnoutStateChangeRequest("TO518", 'T');
		addTurnoutStateChangeRequest("TO520", 'N');
		lineNorthMainsForPassenger();
	}
	
	executePanelStateChangeRequests();
}

function dinerServicePath()
{
	addTurnoutStateChangeRequest("TO470", 'R');
	addTurnoutStateChangeRequest("TO472", 'R');
	addTurnoutStateChangeRequest("TO474", 'R');
	addTurnoutStateChangeRequest("TO475", 'N');

	executePanelStateChangeRequests();
}

function commissary2Path()
{
	addTurnoutStateChangeRequest("TO468", 'N');
	addTurnoutStateChangeRequest("TO470", 'N');
	addTurnoutStateChangeRequest("TO472", 'R');
	addTurnoutStateChangeRequest("TO474", 'R');
	addTurnoutStateChangeRequest("TO475", 'N');
	
	executePanelStateChangeRequests();
}

function commissary1Path()
{
	addTurnoutStateChangeRequest("TO467", 'N');
	addTurnoutStateChangeRequest("TO468", 'R');
	addTurnoutStateChangeRequest("TO470", 'N');
	addTurnoutStateChangeRequest("TO472", 'R');
	addTurnoutStateChangeRequest("TO474", 'R');
	addTurnoutStateChangeRequest("TO475", 'N');

	executePanelStateChangeRequests();
}

function coachServicePath()
{
	addTurnoutStateChangeRequest("TO467", 'R');
	addTurnoutStateChangeRequest("TO468", 'R');
	addTurnoutStateChangeRequest("TO470", 'N');
	addTurnoutStateChangeRequest("TO472", 'R');
	addTurnoutStateChangeRequest("TO474", 'R');
	addTurnoutStateChangeRequest("TO475", 'N');
									
	executePanelStateChangeRequests();
}

function coachYard3Path()
{
	addTurnoutStateChangeRequest("TO472", 'N');
	addTurnoutStateChangeRequest("TO474", 'R');
	addTurnoutStateChangeRequest("TO475", 'N');

	executePanelStateChangeRequests();
}

function coachYard2Path()
{
	addTurnoutStateChangeRequest("TO474", 'N');
	addTurnoutStateChangeRequest("TO475", 'N');

	executePanelStateChangeRequests();
}

function coachYard1Path()
{
	addTurnoutStateChangeRequest("TO475", 'R');
	
	executePanelStateChangeRequests();
}

function pass123NorthPathToggle()
{
	lineNorthMainsForPassenger();

	if(getTurnoutState("TO519") == 'R')
		addTurnoutStateChangeRequest("TO519", 'N');
	else
		addTurnoutStateChangeRequest("TO518", 'T');
		
	addTurnoutStateChangeRequest("TO520", 'N');
}

function switchLeadPath()
{
	if(getTurnoutState("TO518") == 'R')
		addTurnoutStateChangeRequest("TO518", 'N');
	else
		addTurnoutStateChangeRequest("TO519", 'T');
										
	executePanelStateChangeRequests();
}

function reaFacilityPath()
{
	addTurnoutStateChangeRequest("TO514B", 'N');
	
	executePanelStateChangeRequests();
}
