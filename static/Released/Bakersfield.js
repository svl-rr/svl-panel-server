function panelInit(evt)
{
}

function track1Path()
{
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
}

function track2Path()
{
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'N');
    addTurnoutStateChangeRequest("TO10", 'N');
    addTurnoutStateChangeRequest("TO9", 'R');
    addTurnoutStateChangeRequest("TO15B", 'N');
    addTurnoutStateChangeRequest("TO16B", 'R');

	executePanelStateChangeRequests();									
}

function track3Path()
{
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'N');
    addTurnoutStateChangeRequest("TO10", 'N');
    addTurnoutStateChangeRequest("TO9", 'R');
    addTurnoutStateChangeRequest("TO15B", 'R');

	executePanelStateChangeRequests();									
}

function track4Path()
{
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'N');
    addTurnoutStateChangeRequest("TO10", 'N');
    addTurnoutStateChangeRequest("TO9", 'N');

	executePanelStateChangeRequests();									
}

function track5Path()
{
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'N');
    addTurnoutStateChangeRequest("TO10", 'R');

	executePanelStateChangeRequests();									
}

function track6Path()
{
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'R');
    addTurnoutStateChangeRequest("TO11", 'R');

	executePanelStateChangeRequests();									
}

function track7Path()
{
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'N');
    addTurnoutStateChangeRequest("TO12", 'N');

	executePanelStateChangeRequests();									
}

function track8Path()
{
	addTurnoutStateChangeRequest("TO14", 'R');
	addTurnoutStateChangeRequest("TO13", 'R');

	executePanelStateChangeRequests();									
}

function track9Path()
{
	addTurnoutStateChangeRequest("TO14", 'N');
	addTurnoutStateChangeRequest("TO15A", 'N');

	executePanelStateChangeRequests();									
}

function track10Path()
{
	addTurnoutStateChangeRequest("TO14", 'N');
	addTurnoutStateChangeRequest("TO15A", 'R');
    addTurnoutStateChangeRequest("TO16A", 'R');
    
	executePanelStateChangeRequests();									
}

function track11Path()
{
	addTurnoutStateChangeRequest("TO14", 'N');
	addTurnoutStateChangeRequest("TO15A", 'R');
    addTurnoutStateChangeRequest("TO16A", 'N');
    addTurnoutStateChangeRequest("TO17A", 'R');
    
	executePanelStateChangeRequests();									
}

function track12Path()
{
	addTurnoutStateChangeRequest("TO14", 'N');
	addTurnoutStateChangeRequest("TO15A", 'R');
    addTurnoutStateChangeRequest("TO16A", 'N');
    addTurnoutStateChangeRequest("TO17A", 'N');

	executePanelStateChangeRequests();									
}
