function panelInit(evt)
{
}

function DairyTrack2Path()
{
	executePathArray(["TO672.R", "TO673.N"]);
}

function DairyTrack1Path()
{
	executePathArray(["TO672.N", "TO673.N"]);
}

function IndustrialSidingLeftPath()
{
	executePathArray(["TO673.R"]);
}

function SwitcherSpurPath()
{
	executePathArray(["TO674.N", "TO675.N"]);
}

function PrivateCarSpurPath()
{
	executePathArray(["TO674.N", "TO675.R"]);
}

function IndustrialSidingRightPath()
{
	executePathArray(["TO674.R"]);
}

function Depot3LeftPath()
{
    executePathArray(["TO685.N"]);
}

function Depot2LeftPath()
{
    executePathArray(["TO685.R", "TO686.N"]);
}

function Depot1LeftPath()
{
    executePathArray(["TO685.R", "TO686.R", "TO687.N"]);
}

function EngineLeadPath()
{
    executePathArray(["TO685.R", "TO686.R", "TO687.R"]);
}

function EngineRunaroundPath()
{
    executePathArray(["TO690.R", "TO691.R"]);
}

function EngineServicingPath()
{
    executePathArray(["TO690.N"]);
}

function EngineRunaroundPath()
{
    executePathArray(["TO690.R", "TO691.R"]);
}

function EngineReadyPath()
{
    executePathArray(["TO690.R", "TO691.N"]);
}

function REASpurPath()
{
    executePathArray(["TO697B.T"]);
}

function Depot3RightPath()
{
    executePathArray(["TO699.R"]);
}

function Depot2RightPath()
{
    executePathArray(["TO698.R", "TO699.N"]);
}

function Depot1RightPath()
{
    executePathArray(["TO697A.N", "TO698.N", "TO699.N"]);
}
