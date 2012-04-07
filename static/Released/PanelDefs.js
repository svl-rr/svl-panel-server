function panelInit(evt)
{
	createPanelTurnout("TO467", false);
	createPanelTurnout("TO468", false);
	
	createPanelTurnout("TO470", false);
	createPanelTurnout("TO472", false);
	
	createPanelTurnout("TO518A", false);
	createPanelTurnout("TO518B", false);
	
	createPanelTurnout("TO001", true);
	createPanelTurnout("TO002", false);
	
	createPanelTurnout("TO999A", false);
	createPanelTurnout("TO999B", false);
	
	createPanelTurnout("TO998A", false);
	createPanelTurnout("TO998B", false);
	createPanelTurnout("TO998C", false);
	createPanelTurnout("TO998D", false);
	
	createPanelTurnout("TO996", false);
	createPanelTurnout("TO997", false);
	
	createPanelTurnout("TO995", false);
	createPanelTurnout("TO994", false);
}

function path1click()
{
	addTurnoutStateChangeRequest("TO001", 'R');

	executePanelStateChangeRequests();
	setPanelStatus("click1path");
}

function path2click()
{
	addTurnoutStateChangeRequest("TO001", 'N');
	addTurnoutStateChangeRequest("TO002", 'R');

	executePanelStateChangeRequests();
	setPanelStatus("click2path");
}

function path3click()
{
	addTurnoutStateChangeRequest("TO001", 'N');
	addTurnoutStateChangeRequest("TO002", 'N');

	executePanelStateChangeRequests();
	setPanelStatus("click3path");
}