function panelInitPreSocket(evt)
{
}

function IgoLNG1Path()
{
	executePathArray(["TO245.R"]);
	//executePathArray(["TO252.N"]);  // Main
}

function IgoLNG2Path()
{
	executePathArray(["TO245.N"]);
	//executePathArray(["TO252.N"]);  // Main
}

function PaperPlantInboundPath()
{
	executePathArray(["TO232.N", "TO231.N", "TO230.N"]);    //lower lead
	executePathArray(["TO236.N", "TO237.R"]);               //upper lead
	executePathArray(["TO247.N"]);  //CRL
}

function PaperPlantOutboundPath()
{
	executePathArray(["TO232.R", "TO231.N", "TO230.N"]);    //lower lead
	executePathArray(["TO236.R", "TO237.R"]);               //upper lead
	executePathArray(["TO247.N"]);  //CRL
}

function PaperPlantRunaroundPath()
{
	executePathArray(["TO231.R", "TO230.N"]);   //lower lead
	executePathArray(["TO235.N", "TO237.N"]);   //upper lead
	executePathArray(["TO247.N"]);  //CRL
}

function PaperPlantMainPath()
{
	executePathArray(["TO230.R", "TO233.N"]);               //lower lead
	executePathArray(["TO237.N", "TO235.R", "TO234.R"]);   //upper lead
	executePathArray(["TO247.N"]);  //CRL
}

function HemetWalnutStephensGrocPath()
{
	executePathArray(["TO243A.R"]);
    HemetWalnutStephensGrocPreLeadPath();
}

function HemetCACoop2PreLeadPath()
{
	executePathArray(["TO243A.R"]);     // left x-over
	executePathArray(["TO242A.R"]);     // right x-over
	executePathArray(["TO240.N", "TO239.N"]);
}

function HemetTeamTrackPath()
{
	executePathArray(["TO242A.R"]);
    HemetTeamTrackPreLeadPath();
}

registerPathFunctions({
    HallelujahIndLeadPath: ["TO246.N"],
    HellenbegoneLeadPath: ["TO247.N"],
    ContinuousRunLoopPath: ["TO248.R"],
    HellenbegoneMine2Path: ["TO248.N", "TO249.N"],
    HellenbegoneMine1Path: ["TO248.N", "TO249.R"],
    PaperPlantDoors4Thru7Path: ["TO237.N", "TO235.R", "TO234.N"],
    PaperPlantChemUnloadPowerStationPath: ["TO233.R"],
    PaperPlantRecycledPaperPath: ["TO228.R", "TO229.R"],
    PaperPlantWoodchipsPath: ["TO228.R", "TO229.N"],
    PaperPlantPulpPath: ["TO228.N"],
    HemetGrowersPath: ["TO246.R"],
    HemetDillLumberPath: ["TO241.R", "TO240.R", "TO239.N"],
    HemetWalnutStephensGrocPreLeadPath: ["TO241.N", "TO240.R", "TO239.N"],
    HemetCACoop2Path: ["TO244.R"],
    HemetCACoop1Path: ["TO244.N"],
    HemetTeamTrackPreLeadPath: ["TO239.R"]
});
