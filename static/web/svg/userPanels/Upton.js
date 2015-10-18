function panelInitPreSocket(evt)
{
}

function LocoReadyPath()
{
	executePathArray(["TO720.R", "TO722.N"]);
}

function IntermodalTrack3LeftPath()
{
    executePathArray(["TO721.N"]);
}

function IntermodalTrack2LeftPath()
{
    executePathArray(["TO721.R", "TO722.N", "TO720.R"]);
}

function IntermodalTrack1LeftPath()
{
    executePathArray(["TO721.R", "TO722.R", "TO720.N"]);
}

function IntermodalTrack1RightPath()
{
    executePathArray(["TO723.R", "TO724.R"]);
}

function IntermodalTrack2RightPath()
{
    executePathArray(["TO723.N", "TO724.R"]);
}

function IntermodalTrack3RightPath()
{
    executePathArray(["TO724.N"]);
}
