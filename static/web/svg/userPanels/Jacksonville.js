function panelInitPreSocket(evt)
{
}

function AshgroveQuarry3Path()
{
	executePathArray(["TO298.N", "TO299.R"]);
	AshgroveQuarryLeadPath();
}

function AshgroveQuarry2Path()
{
	executePathArray(["TO298.N", "TO299.N"]);
	AshgroveQuarryLeadPath();
}

function AshgroveQuarry1Path()
{
	executePathArray(["TO298.R"]);
	AshgroveQuarryLeadPath();
}

function AshgroveQuarryLeadPath()
{
	executePathArray(["TO297.R"]);
}

function AQXchangeLeadPath()
{
	executePathArray(["TO297.N"]);
}

function AQXchange2Path()
{
	executePathArray(["TO296.N", "TO295.R"]);
}

function AQXchange1Path()
{
	executePathArray(["TO296.R", "TO295.N"]);
}

function Igo3Path()
{
	executePathArray(["TO273.R"]);
}

function Igo2Path()
{
	executePathArray(["TO273.N", "TO274.N"]);
}

function Igo1Path()
{
	executePathArray(["TO273.N", "TO274.R"]);
}

function KawValleyPlasticsPath()
{
	executePathArray(["TO320.N", "TO319.R"]);
}

function GulfportGrain2Path()
{
	executePathArray(["TO321.N", "TO320.R", "TO319.R"]);
}

function GulfportGrain1Path()
{
	executePathArray(["TO321.R", "TO320.R", "TO319.R"]);
}

function JacksonvilleSidingPath()
{
	executePathArray(["TO319.N"]);
}

function UniversalExportsPath()
{
	executePathArray(["TO323.R", "TO322.N"]);
    UnionCoalUniversalExportsPreLeadPath();
}

function UnionCoal2Path()
{
	executePathArray(["TO324.R", "TO323.N", "TO322.N"]);
    UnionCoalUniversalExportsPreLeadPath();
}

function UnionCoal1Path()
{
	executePathArray(["TO324.N", "TO323.N", "TO322.N"]);
    UnionCoalUniversalExportsPreLeadPath();
}

function UnionCoalUniversalExportsPreLeadPath()
{
	executePathArray(["TO322.N"]);
}

function UnionCoalRampPath()
{
	executePathArray(["TO322.R"]);
}
