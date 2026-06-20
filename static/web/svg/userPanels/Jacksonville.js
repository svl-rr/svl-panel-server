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

registerPathFunctions({
    AshgroveQuarryLeadPath: ["TO297.R"],
    AQXchangeLeadPath: ["TO297.N"],
    AQXchange2Path: ["TO296.N", "TO295.R"],
    AQXchange1Path: ["TO296.R", "TO295.N"],
    Igo3Path: ["TO273.R"],
    Igo2Path: ["TO273.N", "TO274.N"],
    Igo1Path: ["TO273.N", "TO274.R"],
    KawValleyPlasticsPath: ["TO320.N", "TO319.R"],
    GulfportGrain2Path: ["TO321.N", "TO320.R", "TO319.R"],
    GulfportGrain1Path: ["TO321.R", "TO320.R", "TO319.R"],
    JacksonvilleSidingPath: ["TO319.N"],
    UnionCoalUniversalExportsPreLeadPath: ["TO322.N"],
    UnionCoalRampPath: ["TO322.R"]
});
