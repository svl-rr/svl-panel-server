function panelInit(evt)
{
}

function LumberMill1Path()
{
	executePathArray(["TO444.N"]);
}

function LumberMill2Path()
{
	executePathArray(["TO444.R"]);
}

function EngineHousePath()
{
	executePathArray(["TO445.R", "TO446.N"]);
}

function RIPTrackPath()
{
	executePathArray(["TO445.R", "TO446.R"]);
}

function OutboundPath()
{
	executePathArray(["TO447.N", "TO449.N"]);
}

function InboundPath()
{
	executePathArray(["TO449.R"]);
}

function SwitchLeadPath()
{
    var turnout = getPanelTurnoutFromElemID("TO425B.R");
    
    if(turnout != null)
    {
        if(turnout.getSVGState() == 'N')
            executePathArray(["TO425B.R"]);
        else
            executePathArray(["TO449.T"]);
    }
    else
        alert("SwitchLeadPath failed to find proper turnout");
}

function MtMarvelLeadPath()
{
	executePathArray(["TO425A.T"]);
}

function MtMarvelMainPath()
{
	executePathArray(["TO425A.R"]);
}

function LoopNBPath()
{
    executePathArray(["TO329.N"]);
}

function LoopSBPath()
{
	executePathArray(["TO329.R"]);
}
