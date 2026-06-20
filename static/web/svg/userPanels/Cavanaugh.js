function panelInitPreSocket(evt)
{
}

function industrialMainPath()
{
	executePathArray(["TO116.N", "TO117.N"]);
	executePathArray(["TO118.N"]);
}

function industrialSidingPath()
{
	executePathArray(["TO116.R", "TO117.R"]);
	executePathArray(["TO118.N"]);
}

function dockPath()
{
	//executePathArray(["TO123.N", "TO122.N", "TO121A.N"]);
	executePathArray(["TO121A.T"]);
}

registerPathFunctions({
    elsinoreBrewery2Path: ["TO118.R"],
    continuousRunLeadPath: ["TO105.R", "TO124.N"],
    cavanaughJunkPath: ["TO102.R"],
    departureMain1Path: ["TO105.N", "TO100A.N"],
    departureMain2Path: ["TO103.N"],
    departureMain3Path: ["TO106.N", "TO101.N"],
    elsinoreBrewery1Path: ["TO106.R"],
    arrivalMain1Path: ["TO101.R"],
    arrivalMain2Path: ["TO102.N", "TO100B.N"],
    carFloat1Path: ["TO123.R", "TO120.R"],
    carFloat2Path: ["TO123.R", "TO120.N", "TO119.N"],
    carFloat3Path: ["TO123.R", "TO120.N", "TO119.R"],
    delucciTradingPath: ["TO123.N", "TO122.R", "TO121B.N"],
    idlerStoragePath: ["TO123.N", "TO122.R"],
    idlerBypassPath: ["TO123.N", "TO122.N"]
});
