function panelInitPreSocket(evt)
{
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

function pass1SouthPath()
{
	lineSouthMainsForPassenger();
	
	executePathArray(["TO469.R", "TO471.R", "TO473A.R"]);
}

function pass1NorthPath()
{
	pass123NorthPathToggle();

	executePathArray(["TO517.R", "TO514A.R"]);
}

function pass2SouthPath()
{
	lineSouthMainsForPassenger();

	executePathArray(["TO469.R", "TO471.R", "TO473A.N"]);
}

function pass2NorthPath()
{
	pass123NorthPathToggle();
	
	executePathArray(["TO517.R", "TO514A.N"]);
}

function pass3SouthPath()
{
	lineSouthMainsForPassenger();
		
	executePathArray(["TO469.R", "TO471.N"]);
}

function pass3NorthPath()
{
	pass123NorthPathToggle();
	
	executePathArray(["TO517.N"]);
}

function pass4SouthPath()
{
	lineSouthMainsForPassenger();
									
	executePathArray(["TO469.N"]);
}

function pass4NorthPath()
{
	lineNorthMainsForPassenger();

	executePathArray(["TO520.R", "TO515.R"]);
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

registerPathFunctions({
    main1SouthPath: ["TO494A.N", "TO493.R", "TO492.N"],
    main1NorthPath: ["TO508.N", "TO509.R"],
    main2SouthPath: ["TO494A.N", "TO493.N"],
    main2NorthPath: ["TO507.N", "TO508.R", "TO509.R"],
    dinerServicePath: ["TO470.R", "TO472.R", "TO474.R", "TO475.N"],
    commissary2Path: ["TO468.N", "TO470.N", "TO472.R", "TO474.R", "TO475.N"],
    commissary1Path: ["TO467.N", "TO468.R", "TO470.N", "TO472.R", "TO474.R", "TO475.N"],
    coachServicePath: ["TO467.R", "TO468.R", "TO470.N", "TO472.R", "TO474.R", "TO475.N"],
    coachYard3Path: ["TO472.N", "TO474.R", "TO475.N"],
    coachYard2Path: ["TO474.N", "TO475.N"],
    coachYard1Path: ["TO475.R"],
    reaFacilityPath: ["TO514B.N"]
});
