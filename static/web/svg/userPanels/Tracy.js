function panelInitPreSocket(evt)
{
}

function EngineServicingPath()
{
    executePathArray(["TO690.N"]);
    EngineLeadPath();
}

function EngineRunaroundPath()
{
    executePathArray(["TO690.R", "TO691.R"]);
    EngineLeadPath();
}

function EngineReadyPath()
{
    executePathArray(["TO690.R", "TO691.N"]);
    EngineLeadPath();
}

registerPathFunctions({
    DairyTrack2Path: ["TO672.R", "TO673.N"],
    DairyTrack1Path: ["TO672.N", "TO673.N"],
    IndustrialSidingLeftPath: ["TO673.R"],
    SwitcherSpurPath: ["TO674.N", "TO675.N"],
    PrivateCarSpurPath: ["TO674.N", "TO675.R"],
    IndustrialSidingRightPath: ["TO674.R"],
    Depot3LeftPath: ["TO685.N"],
    Depot2LeftPath: ["TO685.R", "TO686.N"],
    Depot1LeftPath: ["TO685.R", "TO686.R", "TO687.N"],
    EngineLeadPath: ["TO685.R", "TO686.R", "TO687.R"],
    EngineRunaroundPath: ["TO690.R", "TO691.R"],
    REASpurPath: ["TO697B.T"],
    Depot3RightPath: ["TO699.R"],
    Depot2RightPath: ["TO698.R", "TO699.N"],
    Depot1RightPath: ["TO697A.N", "TO698.N", "TO699.N"]
});
