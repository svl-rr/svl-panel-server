function panelInitPreSocket(evt)
{
}

function FrytonSidingLeftPath()
{
	executePathArray(["TO178.R"]);
}

function FrytonSidingRightPath()
{
	executePathArray(["TO177.R"]);
}

function FrytonStorageLeftPath()
{
	executePathArray(["TO178.N"]);
}

function FrytonStorageRightPath()
{
	executePathArray(["TO177.N"]);
}



function EAJensenShippingPath()
{
	executePathArray(["TO192.N", "TO191.N", "TO190.N"]);
}

function EAJensenReceivingPath()
{
	executePathArray(["TO192.R", "TO191.N", "TO190.N"]);
}

function FremontSidingRightPath()
{
	executePathArray(["TO191.R", "TO190.N"]);
}

function FremontBranchRightPath()
{
	executePathArray(["TO190.R"]);
}

function FremontSidingLeftPath()
{
	executePathArray(["TO193.R"]);
}

function FremontBranchLeftPath()
{
	executePathArray(["TO193.N"]);
}

function FremontTeamTrackPath()
{
	executePathArray(["TO194B.N"]);
}

function ParkfieldGravelPath()
{
	executePathArray(["TO194B.R"]);
}
