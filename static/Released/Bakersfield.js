function panelInit(evt)
{
<<<<<<< HEAD
    createPanelTurnout("TO9", true);
	createPanelTurnout("TO10", false);
	createPanelTurnout("TO11", false);
	createPanelTurnout("TO12", true);
	createPanelTurnout("TO13", false);
	createPanelTurnout("TO14", false);
	createPanelTurnout("TO15A", false);
	createPanelTurnout("TO15B", false);
	createPanelTurnout("TO16A", false);
	createPanelTurnout("TO16B", false);
	createPanelTurnout("TO17A", false);
	createPanelTurnout("TO17B", false);
=======
>>>>>>> dispatchFriendlyTurnouts
}

function track1Path()
{
<<<<<<< HEAD
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'N');
    addTurnoutStateChangeRequest("TO10", 'N');
    addTurnoutStateChangeRequest("TO9", 'R');
    addTurnoutStateChangeRequest("TO15B", 'N');
    addTurnoutStateChangeRequest("TO16B", 'N');
    addTurnoutStateChangeRequest("TO17B", 'R');
    
	executePanelStateChangeRequests();									
=======
    executePathArray(["TO14.R", "TO13.N", "TO12.R", "TO11.N", "TO10.N", "TO9.R", "TO15B.N", "TO16B.N", "TO17B.R"]);
>>>>>>> dispatchFriendlyTurnouts
}

function track2Path()
{
<<<<<<< HEAD
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'N');
    addTurnoutStateChangeRequest("TO10", 'N');
    addTurnoutStateChangeRequest("TO9", 'R');
    addTurnoutStateChangeRequest("TO15B", 'N');
    addTurnoutStateChangeRequest("TO16B", 'R');

	executePanelStateChangeRequests();									
=======
    executePathArray(["TO14.R", "TO13.N", "TO12.R", "TO11.N", "TO10.N", "TO9.R", "TO15B.N", "TO16B.R"]);
>>>>>>> dispatchFriendlyTurnouts
}

function track3Path()
{
<<<<<<< HEAD
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'N');
    addTurnoutStateChangeRequest("TO10", 'N');
    addTurnoutStateChangeRequest("TO9", 'R');
    addTurnoutStateChangeRequest("TO15B", 'R');

	executePanelStateChangeRequests();									
=======
    executePathArray(["TO14.R", "TO13.N", "TO12.R", "TO11.N", "TO10.N", "TO9.R", "TO15B.R"]);
>>>>>>> dispatchFriendlyTurnouts
}

function track4Path()
{
<<<<<<< HEAD
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'N');
    addTurnoutStateChangeRequest("TO10", 'N');
    addTurnoutStateChangeRequest("TO9", 'N');

	executePanelStateChangeRequests();									
=======
    executePathArray(["TO14.R", "TO13.N", "TO12.R", "TO11.N", "TO10.N", "TO9.N"]);
>>>>>>> dispatchFriendlyTurnouts
}

function track5Path()
{
    executePathArray(["TO14.R", "TO13.N", "TO12.R", "TO11.N", "TO10.R"]);
}

function track6Path()
{    
    executePathArray(["TO14.R", "TO13.N", "TO12.R", "TO11.R"]);
}

function track7Path()
{
    executePathArray(["TO14.R", "TO13.N", "TO12.N"]);
}

function track8Path()
{
    executePathArray(["TO14.R", "TO13.R"]);
}

function track9Path()
{
    executePathArray(["TO14.N", "TO15A.N"]);
}

function track10Path()
{    
    executePathArray(["TO14.N", "TO15A.R", "TO16A.R"]);
}

function track11Path()
{
    executePathArray(["TO14.N", "TO15A.R", "TO16A.N", "TO17A.R"]);
}

function track12Path()
{
    executePathArray(["TO14.N", "TO15A.R", "TO16A.N", "TO17A.N"]);
}
