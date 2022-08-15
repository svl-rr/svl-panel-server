function panelInitPreSocket(evt)
{
}

function RunaroundPath()
{
	executePathArray(["TO571A.R", "TO572A.N"]);
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

function ScrapMillTrack2Path()
{
	executePathArray(["TO573.R"]);
}

function ScrapMillTrack1BothPath()
{
    ScrapMillTrack1LeftPath();
    ScrapMillTrack1RightPath();
}

function ScrapMillTrack1LeftPath()
{
	executePathArray(["TO573.N"]);
}

function ScrapMillTrack1RightPath()
{
	executePathArray(["TO574.N"]);
}

function ShippingReceivingNorthPath()
{
	executePathArray(["TO574.R"]);
}

function ShippingReceivingSouthPath()
{
	executePathArray(["TO572B.N"]);
}
