function panelInit(evt)
{
}

function DPL3Path()
{
	addTurnoutStateChangeRequest("TO174", 'R');
	addTurnoutStateChangeRequest("TO172", 'N');

	executePanelStateChangeRequests();
}

function DPL2Path()
{
	addTurnoutStateChangeRequest("TO174", 'N');
	addTurnoutStateChangeRequest("TO172", 'N');

	executePanelStateChangeRequests();
}

function DPL1Path()
{
	addTurnoutStateChangeRequest("TO173", 'N');
	addTurnoutStateChangeRequest("TO172", 'R');

	executePanelStateChangeRequests();
}

function PeacheyBrothersPath()
{
	addTurnoutStateChangeRequest("TO173", 'R');
	addTurnoutStateChangeRequest("TO172", 'R');

	executePanelStateChangeRequests();
}

function DaytonIndustrialLeadPath()
{
	addTurnoutStateChangeRequest("TO170", 'R');
	addTurnoutStateChangeRequest("TO171", 'R');

	executePanelStateChangeRequests();
}

function IndRunaroundNorthPath()
{
	addTurnoutStateChangeRequest("TO170", 'N');
	addTurnoutStateChangeRequest("TO171", 'R');

	executePanelStateChangeRequests();
}

function IndRunaroundSouthPath()
{
	addTurnoutStateChangeRequest("TO169", 'N');

	executePanelStateChangeRequests();
}

function OnthaCRLLeadPath()
{
	addTurnoutStateChangeRequest("TO171", 'N');

	executePanelStateChangeRequests();
}

function OnthaSkidsPath()
{
	addTurnoutStateChangeRequest("TO168", 'R');

	executePanelStateChangeRequests();
}

function WiebeOnthaCRLPath()
{
    addTurnoutStateChangeRequest("TO167", 'N');
	addTurnoutStateChangeRequest("TO168", 'N');

	executePanelStateChangeRequests();
}

function WiebeWafersPath()
{
	addTurnoutStateChangeRequest("TO167", 'R');

	executePanelStateChangeRequests();
}

function WiebeCRLLeadPath()
{
	addTurnoutStateChangeRequest("TO169", 'R');

	executePanelStateChangeRequests();
}

function WarehouseNo9Path()
{
	addTurnoutStateChangeRequest("TO165", 'N');
	addTurnoutStateChangeRequest("TO166", 'R');

	executePanelStateChangeRequests();
}

function CavanaughLeadPath()
{
	addTurnoutStateChangeRequest("TO165", 'R');
	addTurnoutStateChangeRequest("TO166", 'R');

	executePanelStateChangeRequests();
}

function MegaWattPath()
{
	addTurnoutStateChangeRequest("TO164", 'N');
	addTurnoutStateChangeRequest("TO166", 'N');

	executePanelStateChangeRequests();
}

function GoodMorningCerealPath()
{
	addTurnoutStateChangeRequest("TO164", 'R');
	addTurnoutStateChangeRequest("TO166", 'N');

	executePanelStateChangeRequests();
}

function TeamTrackPath()
{
	addTurnoutStateChangeRequest("TO132A", 'N');

	executePanelStateChangeRequests();
}