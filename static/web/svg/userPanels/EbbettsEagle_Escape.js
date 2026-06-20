function panelInitPreSocket(evt)
{
}

registerPathFunctions({
    BranchLeadPath: ["TO180.N"],
    RanchSpurPath: ["TO180.R"],
    FaridayFertilizerPath: ["TO184B.R", "TO181.R"],
    CoopFeedMillPath: ["TO182.R", "TO184A.R"],
    EscapeSidingPath: ["TO182.R", "TO184A.N", "TO184B.N", "TO181.R"],
    EscapeBranchRightPath: ["TO181.N"],
    EscapeBranchLeftPath: ["TO182.N"]
});
