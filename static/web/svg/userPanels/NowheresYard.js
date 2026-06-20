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

function powerReadyFuelLeadPath()
{
    if(getTurnoutState("TO498B") == 'R')
		addTurnoutStateChangeRequest("TO498B", 'N');
	else
    {
        addTurnoutStateChangeRequest("TO495", 'N');
        addTurnoutStateChangeRequest("TO496", 'R');
        addTurnoutStateChangeRequest("TO497", 'R');
        addTurnoutStateChangeRequest("TO498A", 'R');
    }
    
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
    reaFacilityPath: ["TO514B.N"],
    arrDep1NorthPath: ["TO506.N"],
    arrDep1SouthPath: ["TO495.R"],
    pfeNorthPath: ["TO503.N", "TO512.N"],
    pfeSouthPath: ["TO478.N", "TO495.N", "TO496.N"],
    arrDep2NorthPath: ["TO503.N", "TO512.R"],
    arrDep2SouthPath: ["TO478.R", "TO495.N", "TO496.N"],
    arrDep3NorthPath: ["TO503.R", "TO502.N"],
    arrDep3SouthPath: ["TO495.N", "TO496.R", "TO497.N"],
    arrDep4NorthPath: ["TO503.R", "TO502.R", "TO501.N"],
    arrDep4SouthPath: ["TO495.N", "TO496.R", "TO497.R", "TO498A.N"],
    pwrReadyNorthPath: ["TO503.R", "TO502.R", "TO501.R", "TO500.N"],
    pwrReadySouthPath: ["TO476.R"],
    cabooseTrkNorthPath: ["TO503.R", "TO502.R", "TO501.R", "TO500.R", "TO499.N"],
    cabooseTrkSouthPath: ["TO476.N"],
    classLeadPath: ["TO503.R", "TO502.R", "TO501.R", "TO500.R", "TO499.R", "TO490.N"],
    class1Path: ["TO489.R", "TO488.N", "TO485.R", "TO484.R"],
    class2Path: ["TO489.R", "TO488.N", "TO485.R", "TO484.N"],
    class3Path: ["TO489.R", "TO488.N", "TO485.N"],
    class4Path: ["TO489.R", "TO488.R"],
    class5Path: ["TO489.N", "TO487.N"],
    class6Path: ["TO489.N", "TO487.R", "TO486.N"],
    class7Path: ["TO489.N", "TO487.R", "TO486.R"],
    drillLeadPath: ["TO504A.T"],
    classRunaroundNorthPath: ["TO504B.R"],
    classRunaroundSouthPath: ["TO491.N", "TO490.R"],
    runoffSpurPath: ["TO491.R", "TO490.R"],
    fuel1Path: ["TO466.R"],
    fuel2NorthPath: ["TO466.N", "TO465.N"],
    fuel2SouthPath: ["TO483.N", "TO463B.R"],
    fuel3NorthPath: ["TO466.N", "TO465.R"],
    fuel3SouthPath: ["TO483.R"],
    engine1Path: ["TO482.R", "TO479.R"],
    engine2Path: ["TO482.R", "TO479.N"],
    engine3Path: ["TO482.N", "TO480.R"],
    engine4Path: ["TO482.N", "TO480.N"],
    sandUnloadPath: ["TO463A.R", "TO481.R"],
    fuelUnloadPath: ["TO463A.R", "TO481.N"]
});
