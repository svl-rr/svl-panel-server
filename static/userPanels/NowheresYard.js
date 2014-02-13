function panelInit(evt)
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

function main1SouthPath()
{
	executePathArray(["TO494A.N", "TO493.R", "TO492.N"]);
}

function main1NorthPath()
{
	executePathArray(["TO508.N", "TO509.R"]);
}

function main2SouthPath()
{
	executePathArray(["TO494A.N", "TO493.N"]);
}

function main2NorthPath()
{
	executePathArray(["TO507.N", "TO508.R", "TO509.R"]);
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

function dinerServicePath()
{
	executePathArray(["TO470.R", "TO472.R", "TO474.R", "TO475.N"]);
}

function commissary2Path()
{
	executePathArray(["TO468.N", "TO470.N", "TO472.R", "TO474.R", "TO475.N"]);
}

function commissary1Path()
{
	executePathArray(["TO467.N", "TO468.R", "TO470.N", "TO472.R", "TO474.R", "TO475.N"]);
}

function coachServicePath()
{									
	executePathArray(["TO467.R", "TO468.R", "TO470.N", "TO472.R", "TO474.R", "TO475.N"]);
}

function coachYard3Path()
{
	executePathArray(["TO472.N", "TO474.R", "TO475.N"]);
}

function coachYard2Path()
{
	executePathArray(["TO474.N", "TO475.N"]);
}

function coachYard1Path()
{	
	executePathArray(["TO475.R"]);
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
	executePathArray(["TO514B.N"]);
}



function arrDep1NorthPath()
{
	executePathArray(["TO506.N"]);
}

function arrDep1SouthPath()
{	
	executePathArray(["TO495.R"]);
}

function pfeNorthPath()
{
	executePathArray(["TO503.N", "TO512.N"]);
}

function pfeSouthPath()
{	
	executePathArray(["TO478.N", "TO495.N", "TO496.N"]);
}

function arrDep2NorthPath()
{
	executePathArray(["TO503.N", "TO512.R"]);
}

function arrDep2SouthPath()
{
	executePathArray(["TO478.R", "TO495.N", "TO496.N"]);
}

function arrDep3NorthPath()
{
	executePathArray(["TO503.R", "TO502.N"]);
}

function arrDep3SouthPath()
{
    executePathArray(["TO495.N", "TO496.R", "TO497.N"]);
}

function arrDep4NorthPath()
{
	executePathArray(["TO503.R", "TO502.R", "TO501.N"]);
}

function arrDep4SouthPath()
{
	executePathArray(["TO495.N", "TO496.R", "TO497.R", "TO498A.N"]);
}

function pwrReadyNorthPath()
{
    executePathArray(["TO503.R", "TO502.R", "TO501.R", "TO500.N"]);
}

function pwrReadySouthPath()
{	
	executePathArray(["TO476.R"]);
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

function cabooseTrkNorthPath()
{
	executePathArray(["TO503.R", "TO502.R", "TO501.R", "TO500.R", "TO499.N"]);
}

function cabooseTrkSouthPath()
{	
	executePathArray(["TO476.N"]);
}

function classLeadPath()
{
	executePathArray(["TO503.R", "TO502.R", "TO501.R", "TO500.R", "TO499.R", "TO490.N"]);
}

function class1Path()
{
	executePathArray(["TO489.R", "TO488.N", "TO485.R", "TO484.R"]);
}

function class2Path()
{    	
	executePathArray(["TO489.R", "TO488.N", "TO485.R", "TO484.N"]);
}

function class3Path()
{
	executePathArray(["TO489.R", "TO488.N", "TO485.N"]);
}

function class4Path()
{
	executePathArray(["TO489.R", "TO488.R"]);
}

function class5Path()
{    	
	executePathArray(["TO489.N", "TO487.N"]);
}

function class6Path()
{
	executePathArray(["TO489.N", "TO487.R", "TO486.N"]);
}

function class7Path()
{
	executePathArray(["TO489.N", "TO487.R", "TO486.R"]);
}

function drillLeadPath()
{
	executePathArray(["TO504A.T"]);
}

function classRunaroundNorthPath()
{
	executePathArray(["TO504B.R"]);
}

function classRunaroundSouthPath()
{
    executePathArray(["TO491.N", "TO490.R"]);
}

function runoffSpurPath()
{
	executePathArray(["TO491.R", "TO490.R"]);
}

function fuel1Path()
{	
	executePathArray(["TO466.R"]);
}

function fuel2NorthPath()
{
	executePathArray(["TO466.N", "TO465.N"]);
}

function fuel2SouthPath()
{
	executePathArray(["TO483.N", "TO463B.R"]);
}

function fuel3NorthPath()
{
	executePathArray(["TO466.N", "TO465.R"]);
}

function fuel3SouthPath()
{
	executePathArray(["TO483.R"]);
}

function engine1Path()
{
    executePathArray(["TO482.R", "TO479.R"]);
}

function engine2Path()
{
    executePathArray(["TO482.R", "TO479.N"]);
}

function engine3Path()
{
	executePathArray(["TO482.N", "TO480.R"]);
}

function engine4Path()
{
	executePathArray(["TO482.N", "TO480.N"]);
}

function sandUnloadPath()
{
	executePathArray(["TO463A.R", "TO481.R"]);
}

function fuelUnloadPath()
{
	executePathArray(["TO463A.R", "TO481.N"]);
}
