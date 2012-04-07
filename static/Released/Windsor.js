function panelInit(evt)
{
    createPanelTurnout("TO980", false);
	createPanelTurnout("TO982A", true);
	createPanelTurnout("TO982B", false);
	createPanelTurnout("TO984A", false);
	createPanelTurnout("TO984B", false);
	createPanelTurnout("TO986A", false);
	createPanelTurnout("TO986B", false);
	createPanelTurnout("TO989", false);
	createPanelTurnout("TO990A", true);
	createPanelTurnout("TO990B", true);
	createPanelTurnout("TO992A", true);
	createPanelTurnout("TO992B", true);
	createPanelTurnout("TO993", false);
}

function track1Path()
{
	addTurnoutStateChangeRequest("TO980", 'R');
	addTurnoutStateChangeRequest("TO982B", 'N');
    addTurnoutStateChangeRequest("TO984B", 'N');
    addTurnoutStateChangeRequest("TO986B", 'N');
    addTurnoutStateChangeRequest("TO990B", 'R');

	executePanelStateChangeRequests();									
}

function track2Path()
{
	addTurnoutStateChangeRequest("TO980", 'R');
	addTurnoutStateChangeRequest("TO982B", 'N');
    addTurnoutStateChangeRequest("TO984B", 'N');
    addTurnoutStateChangeRequest("TO986B", 'N');
    addTurnoutStateChangeRequest("TO990B", 'N');
    
	executePanelStateChangeRequests();									
}

function track3Path()
{
	addTurnoutStateChangeRequest("TO980", 'R');
	addTurnoutStateChangeRequest("TO982B", 'N');
    addTurnoutStateChangeRequest("TO984B", 'N');
    addTurnoutStateChangeRequest("TO986B", 'R');

	executePanelStateChangeRequests();									
}

function track4Path()
{
	addTurnoutStateChangeRequest("TO980", 'R');
	addTurnoutStateChangeRequest("TO982B", 'N');
    addTurnoutStateChangeRequest("TO984B", 'R');

	executePanelStateChangeRequests();									
}

function track5Path()
{
	addTurnoutStateChangeRequest("TO980", 'R');
	addTurnoutStateChangeRequest("TO982B", 'R');

	executePanelStateChangeRequests();									
}

function track6Path()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'R');

	executePanelStateChangeRequests();									
}

function track7Path()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'R');

	executePanelStateChangeRequests();									
}

function track8Path()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'N');
	addTurnoutStateChangeRequest("TO986A", 'R');

	executePanelStateChangeRequests();									
}

function track9Path()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'N');
	addTurnoutStateChangeRequest("TO986A", 'N');
	addTurnoutStateChangeRequest("TO990A", 'N');

	executePanelStateChangeRequests();									
}

function track10Path()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'N');
	addTurnoutStateChangeRequest("TO986A", 'N');
	addTurnoutStateChangeRequest("TO990A", 'R');
	addTurnoutStateChangeRequest("TO989", 'R');

	executePanelStateChangeRequests();									
}

function track11Path()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'N');
	addTurnoutStateChangeRequest("TO986A", 'N');
	addTurnoutStateChangeRequest("TO990A", 'R');
	addTurnoutStateChangeRequest("TO989", 'N');
	addTurnoutStateChangeRequest("TO992B", 'R');

	executePanelStateChangeRequests();									
}

function track12Path()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'N');
	addTurnoutStateChangeRequest("TO986A", 'N');
	addTurnoutStateChangeRequest("TO990A", 'R');
	addTurnoutStateChangeRequest("TO989", 'N');
	addTurnoutStateChangeRequest("TO992B", 'N');
	addTurnoutStateChangeRequest("TO993", 'R');

	executePanelStateChangeRequests();									
}

function track13Path()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'N');
	addTurnoutStateChangeRequest("TO986A", 'N');
	addTurnoutStateChangeRequest("TO990A", 'R');
	addTurnoutStateChangeRequest("TO989", 'N');
	addTurnoutStateChangeRequest("TO992B", 'N');
	addTurnoutStateChangeRequest("TO993", 'N');

	executePanelStateChangeRequests();									
}

function track14Path()
{
	addTurnoutStateChangeRequest("TO992A", 'R');

	executePanelStateChangeRequests();									
}

function track11LeadPath()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'N');
	addTurnoutStateChangeRequest("TO986A", 'N');
	addTurnoutStateChangeRequest("TO990A", 'R');
	addTurnoutStateChangeRequest("TO989", 'N');

	executePanelStateChangeRequests();									
}

function track12LeadPath()
{
	addTurnoutStateChangeRequest("TO980", 'N');
	addTurnoutStateChangeRequest("TO982A", 'N');
	addTurnoutStateChangeRequest("TO984A", 'N');
	addTurnoutStateChangeRequest("TO986A", 'N');
	addTurnoutStateChangeRequest("TO990A", 'R');
	addTurnoutStateChangeRequest("TO989", 'N');
	addTurnoutStateChangeRequest("TO992B", 'N');

	executePanelStateChangeRequests();									
}