function panelInitPreSocket(evt)
{
}

registerPathFunctions({
    LocoReadyPath: ["TO720.R", "TO722.N"],
    IntermodalTrack3LeftPath: ["TO721.N"],
    IntermodalTrack2LeftPath: ["TO721.R", "TO722.N", "TO720.R"],
    IntermodalTrack1LeftPath: ["TO721.R", "TO722.R", "TO720.N"],
    IntermodalTrack1RightPath: ["TO723.R", "TO724.R"],
    IntermodalTrack2RightPath: ["TO723.N", "TO724.R"],
    IntermodalTrack3RightPath: ["TO724.N"]
});
