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
	createPanelTurnout("TO494B", false);
	
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
    
    // North Arrival
    createPanelTurnout("TO506", true);
	createPanelTurnout("TO504A", true);
	createPanelTurnout("TO504B", true);
	createPanelTurnout("TO503", true);
	createPanelTurnout("TO512", true);
	createPanelTurnout("TO510A", true);
	createPanelTurnout("TO510B", true);
    createPanelTurnout("TO502", true);
	createPanelTurnout("TO501", true);
	createPanelTurnout("TO500", true);
//	createPanelTurnout("TO991", true); // not hooked up
    
    // South Arrival
    createPanelTurnout("TO495", true);
	createPanelTurnout("TO478", true);
	createPanelTurnout("TO496", true);
	createPanelTurnout("TO497", true);
	createPanelTurnout("TO498A", true);
	createPanelTurnout("TO498B", false);
//    createPanelTurnout("TO985", true); // not hooked up

    // Class Yard
    createPanelTurnout("TO491", true);
	createPanelTurnout("TO490", true);
	createPanelTurnout("TO489", true);
	createPanelTurnout("TO488", true);
	createPanelTurnout("TO487", true);
    createPanelTurnout("TO486", true);
    createPanelTurnout("TO485", true);
    createPanelTurnout("TO484", true);
    
    // Fuel/Engine
    createPanelTurnout("TO466", true);
	createPanelTurnout("TO465", true);
	createPanelTurnout("TO463A", true);
	createPanelTurnout("TO463B", true);
	createPanelTurnout("TO483", true);
	createPanelTurnout("TO482", false);
	createPanelTurnout("TO481", true);
    createPanelTurnout("TO480", true);
    createPanelTurnout("TO479", true);
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



function arrDep1NorthPath()
{
    addTurnoutStateChangeRequest("TO506", 'N');
	
	executePanelStateChangeRequests();
}

function arrDep1SouthPath()
{
    addTurnoutStateChangeRequest("TO495", 'R');
	
	executePanelStateChangeRequests();
}

function pfeNorthPath()
{
    addTurnoutStateChangeRequest("TO503", 'N');
    addTurnoutStateChangeRequest("TO512", 'N');
	
	executePanelStateChangeRequests();
}

function pfeSouthPath()
{
    addTurnoutStateChangeRequest("TO478", 'N');
    addTurnoutStateChangeRequest("TO495", 'N');
    addTurnoutStateChangeRequest("TO496", 'N');
	
	executePanelStateChangeRequests();
}

function arrDep2NorthPath()
{
    addTurnoutStateChangeRequest("TO503", 'N');
    addTurnoutStateChangeRequest("TO512", 'R');
    	
	executePanelStateChangeRequests();
}

function arrDep2SouthPath()
{
    addTurnoutStateChangeRequest("TO478", 'R');
    addTurnoutStateChangeRequest("TO495", 'N');
    addTurnoutStateChangeRequest("TO496", 'N');
    	
	executePanelStateChangeRequests();
}

function arrDep3NorthPath()
{
    addTurnoutStateChangeRequest("TO503", 'R');
    addTurnoutStateChangeRequest("TO502", 'N');
	
	executePanelStateChangeRequests();
}

function arrDep3SouthPath()
{
    addTurnoutStateChangeRequest("TO495", 'N');
    addTurnoutStateChangeRequest("TO496", 'R');
    addTurnoutStateChangeRequest("TO497", 'N');
    	
	executePanelStateChangeRequests();
}

function arrDep4NorthPath()
{
    addTurnoutStateChangeRequest("TO503", 'R');
    addTurnoutStateChangeRequest("TO502", 'R');
    addTurnoutStateChangeRequest("TO501", 'N');
    	
	executePanelStateChangeRequests();
}

function arrDep4SouthPath()
{
    addTurnoutStateChangeRequest("TO495", 'N');
    addTurnoutStateChangeRequest("TO496", 'R');
    addTurnoutStateChangeRequest("TO497", 'R');
    addTurnoutStateChangeRequest("TO498A", 'N');
    	
	executePanelStateChangeRequests();
}

function pwrReadyNorthPath()
{
    addTurnoutStateChangeRequest("TO503", 'R');
    addTurnoutStateChangeRequest("TO502", 'R');
    addTurnoutStateChangeRequest("TO501", 'R');
    addTurnoutStateChangeRequest("TO500", 'N');

	executePanelStateChangeRequests();
}

function pwrReadySouthPath()
{
    //addTurnoutStateChangeRequest("TO985", 'N');
	
	//executePanelStateChangeRequests();
}

function cabooseTrkNorthPath()
{
    /*
    addTurnoutStateChangeRequest("TO503", 'N');
    addTurnoutStateChangeRequest("TO502", 'N');
    addTurnoutStateChangeRequest("TO501", 'N');
    addTurnoutStateChangeRequest("TO500", 'N');
    addTurnoutStateChangeRequest("TO991", 'N');
    
	executePanelStateChangeRequests();
    */
}

function cabooseTrkSouthPath()
{
    //addTurnoutStateChangeRequest("TO985", 'N');
	
	//executePanelStateChangeRequests();
}

function classLeadPath()
{
    addTurnoutStateChangeRequest("TO503", 'R');
    addTurnoutStateChangeRequest("TO502", 'R');
    addTurnoutStateChangeRequest("TO501", 'R');
    addTurnoutStateChangeRequest("TO500", 'R');
    addTurnoutStateChangeRequest("TO991", 'R');
    addTurnoutStateChangeRequest("TO490", 'N');
    	
	executePanelStateChangeRequests();
}

function class1Path()
{
    addTurnoutStateChangeRequest("TO489", 'R');
    addTurnoutStateChangeRequest("TO488", 'N');
    addTurnoutStateChangeRequest("TO485", 'R');
    addTurnoutStateChangeRequest("TO484", 'R');
    
	executePanelStateChangeRequests();
}

function class2Path()
{
    addTurnoutStateChangeRequest("TO489", 'R');
    addTurnoutStateChangeRequest("TO488", 'N');
    addTurnoutStateChangeRequest("TO485", 'R');
    addTurnoutStateChangeRequest("TO484", 'N');
    	
	executePanelStateChangeRequests();
}

function class3Path()
{
    addTurnoutStateChangeRequest("TO489", 'R');
    addTurnoutStateChangeRequest("TO488", 'N');
    addTurnoutStateChangeRequest("TO485", 'N');
    	
	executePanelStateChangeRequests();
}

function class4Path()
{
    addTurnoutStateChangeRequest("TO489", 'R');
    addTurnoutStateChangeRequest("TO488", 'R');
    	
	executePanelStateChangeRequests();
}

function class5Path()
{
    addTurnoutStateChangeRequest("TO489", 'N');
    addTurnoutStateChangeRequest("TO487", 'N');
    	
	executePanelStateChangeRequests();
}

function class6Path()
{
    addTurnoutStateChangeRequest("TO489", 'N');
    addTurnoutStateChangeRequest("TO487", 'R');
    addTurnoutStateChangeRequest("TO486", 'N');
    	
	executePanelStateChangeRequests();
}

function class7Path()
{
    addTurnoutStateChangeRequest("TO489", 'N');
    addTurnoutStateChangeRequest("TO487", 'R');
    addTurnoutStateChangeRequest("TO486", 'R');
    	
	executePanelStateChangeRequests();
}

function drillLeadPath()
{
    addTurnoutStateChangeRequest("TO504A", 'T');
	
	executePanelStateChangeRequests();
}

function classRunaroundNorthPath()
{
    addTurnoutStateChangeRequest("TO504B", 'R');
	
	executePanelStateChangeRequests();
}

function classRunaroundSouthPath()
{
    addTurnoutStateChangeRequest("TO491", 'N');
    addTurnoutStateChangeRequest("TO490", 'R');
	
	executePanelStateChangeRequests();
}

function runoffSpurPath()
{
    addTurnoutStateChangeRequest("TO491", 'R');
    addTurnoutStateChangeRequest("TO490", 'R');
	
	executePanelStateChangeRequests();
}

function fuel1Path()
{
    addTurnoutStateChangeRequest("TO466", 'R');
	
	executePanelStateChangeRequests();
}

function fuel2NorthPath()
{
    addTurnoutStateChangeRequest("TO466", 'N');
    addTurnoutStateChangeRequest("TO465", 'N');
	
	executePanelStateChangeRequests();
}

function fuel2SouthPath()
{
    addTurnoutStateChangeRequest("TO483", 'N');
    addTurnoutStateChangeRequest("TO463B", 'R');
	
	executePanelStateChangeRequests();
}

function fuel3NorthPath()
{
    addTurnoutStateChangeRequest("TO466", 'N');
    addTurnoutStateChangeRequest("TO465", 'R');
    	
	executePanelStateChangeRequests();
}

function fuel3SouthPath()
{
    addTurnoutStateChangeRequest("TO483", 'R');
	
	executePanelStateChangeRequests();
}

function engine1Path()
{
    addTurnoutStateChangeRequest("TO482", 'R');
    addTurnoutStateChangeRequest("TO479", 'R');
	
	executePanelStateChangeRequests();
}

function engine2Path()
{
    addTurnoutStateChangeRequest("TO482", 'R');
    addTurnoutStateChangeRequest("TO479", 'N');
    	
	executePanelStateChangeRequests();
}

function engine3Path()
{
    addTurnoutStateChangeRequest("TO482", 'N');
    addTurnoutStateChangeRequest("TO480", 'R');
    	
	executePanelStateChangeRequests();
}

function engine4Path()
{
    addTurnoutStateChangeRequest("TO482", 'N');
    addTurnoutStateChangeRequest("TO480", 'N');
    	
	executePanelStateChangeRequests();
}

function sandUnloadPath()
{
    addTurnoutStateChangeRequest("TO463A", 'R');
    addTurnoutStateChangeRequest("TO481", 'R');
	
	executePanelStateChangeRequests();
}

function fuelUnloadPath()
{
    addTurnoutStateChangeRequest("TO463A", 'R');
    addTurnoutStateChangeRequest("TO481", 'N');
	
	executePanelStateChangeRequests();
}
