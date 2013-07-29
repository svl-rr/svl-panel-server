function panelInit(evt)
{
    // Dodge Mains
    createPanelTurnout("TO18", true);
	createPanelTurnout("TO19", false);
    
    // Dayton Mains
    createPanelTurnout("TO125", false);
	createPanelTurnout("TO126", false);
	createPanelTurnout("TO127", false);
    createPanelTurnout("TO128", false);
	createPanelTurnout("TO129", true);
    
    // Dayton Industries
	createPanelTurnout("TO130A", false);
    createPanelTurnout("TO130B", false);
    createPanelTurnout("TO131A", false);
    createPanelTurnout("TO131B", false);
    createPanelTurnout("TO132A", false);
    createPanelTurnout("TO132B", true);
    createPanelTurnout("TO150", false);
	createPanelTurnout("TO164", false);
    createPanelTurnout("TO165", false);
	createPanelTurnout("TO166", false);
	createPanelTurnout("TO167", false);
    createPanelTurnout("TO168", false);
    createPanelTurnout("TO169", false);
    createPanelTurnout("TO170", false);
    createPanelTurnout("TO171", false);
    createPanelTurnout("TO172", false);
    createPanelTurnout("TO173", false);
    createPanelTurnout("TO174", false);
}

function DPL3Path()
{
	addTurnoutStateChangeRequest("TO174", 'N');
	addTurnoutStateChangeRequest("TO172", 'R');

	executePanelStateChangeRequests();
}

function DPL2Path()
{
	addTurnoutStateChangeRequest("TO174", 'R');
	addTurnoutStateChangeRequest("TO172", 'R');

	executePanelStateChangeRequests();
}

function DPL1Path()
{
	addTurnoutStateChangeRequest("TO173", 'N');
	addTurnoutStateChangeRequest("TO172", 'N');

	executePanelStateChangeRequests();
}

function PeacheyBrothersPath()
{
	addTurnoutStateChangeRequest("TO173", 'R');
	addTurnoutStateChangeRequest("TO172", 'N');

	executePanelStateChangeRequests();
}

function WiebeWafersPath()
{
	addTurnoutStateChangeRequest("TO167", 'R');
	//addTurnoutStateChangeRequest("TO169", 'N');

	executePanelStateChangeRequests();
}

function OnthaSkidsPath()
{
	addTurnoutStateChangeRequest("TO168", 'R');

	executePanelStateChangeRequests();
}

function WarehouseNo9Path()
{
	addTurnoutStateChangeRequest("TO165", 'R');
	addTurnoutStateChangeRequest("TO166", 'N');

	executePanelStateChangeRequests();
}

function CavanaughLeadPath()
{
	addTurnoutStateChangeRequest("TO165", 'N');
	addTurnoutStateChangeRequest("TO166", 'N');

	executePanelStateChangeRequests();
}

function MegaWattPath()
{
	addTurnoutStateChangeRequest("TO164", 'R');
	addTurnoutStateChangeRequest("TO166", 'R');

	executePanelStateChangeRequests();
}

function GoodMorningCerealPath()
{
	addTurnoutStateChangeRequest("TO164", 'N');
	addTurnoutStateChangeRequest("TO166", 'R');

	executePanelStateChangeRequests();
}

function TeamTrackPath()
{
	addTurnoutStateChangeRequest("TO132A", 'N');

	executePanelStateChangeRequests();
}