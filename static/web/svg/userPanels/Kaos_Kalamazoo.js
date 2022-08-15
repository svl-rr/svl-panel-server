function panelInitPreSocket(evt)
{
}

function RailEx2Path()
{
	executePathArray(["TO370.N", "TO371.N"]);
    RailExLeadPath();
}

function RailEx1Path()
{
	executePathArray(["TO370.R", "TO371.R"]);
    RailExLeadPath();
}

function RailExLeadPath()
{
	executePathArray(["TO374B.N"]);
	//executePathArray(["TO373.N"]);  // CRL to Kalamazoo Main (Klamath)
}

function KalamazooTeamTrackPath()
{
	executePathArray(["TO374A.N"]);
}
