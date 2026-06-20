function panelInitPreSocket(evt)
{
}

function BigCreekLumberPath()
{
	executePathArray(["TO568.N", "TO569.N", "TO570.R"]);
	executePathArray(["TO571B.R"]);
}

function BetteraviaPath()
{
	executePathArray(["TO568.R", "TO569.N", "TO570.R"]);
	executePathArray(["TO571B.R"]);
}

function ScrapYardTrack2Path()
{
	executePathArray(["TO569.R", "TO570.R"]);
	executePathArray(["TO571B.R"]);
}

function ScrapYardTrack1Path()
{
	executePathArray(["TO570.N"]);
	executePathArray(["TO571B.R"]);
}

function ScrapMillTrack1BothPath()
{
    ScrapMillTrack1LeftPath();
    ScrapMillTrack1RightPath();
}

registerPathFunctions({
    RunaroundPath: ["TO571A.R", "TO572A.N"],
    ScrapMillTrack2Path: ["TO573.R"],
    ScrapMillTrack1LeftPath: ["TO573.N"],
    ScrapMillTrack1RightPath: ["TO574.N"],
    ShippingReceivingNorthPath: ["TO574.R"],
    ShippingReceivingSouthPath: ["TO572B.N"]
});
