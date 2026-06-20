function panelInitPreSocket(evt)
{
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

registerPathFunctions({
    LumberMill1Path: ["TO444.N"],
    LumberMill2Path: ["TO444.R"],
    EngineHousePath: ["TO445.R", "TO446.N"],
    RIPTrackPath: ["TO445.R", "TO446.R"],
    OutboundPath: ["TO447.N", "TO449.N"],
    InboundPath: ["TO449.R"],
    MtMarvelLeadPath: ["TO425A.T"],
    MtMarvelMainPath: ["TO425A.R"],
    LoopNBPath: ["TO329.N"],
    LoopSBPath: ["TO329.R"]
});
