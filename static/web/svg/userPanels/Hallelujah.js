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

function HallelujahIndLeadPath()
{
	executePathArray(["TO246.N"]);
}

function HellenbegoneLeadPath()
{
	executePathArray(["TO247.N"]);
}

function ContinuousRunLoopPath()
{
	executePathArray(["TO248.R"]);
}

function HellenbegoneMine2Path()
{
	executePathArray(["TO248.N", "TO249.N"]);
}

function HellenbegoneMine1Path()
{
	executePathArray(["TO248.N", "TO249.R"]);
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

function PaperPlantDoors4Thru7Path()
{
	executePathArray(["TO237.N", "TO235.R", "TO234.N"]);
}

function PaperPlantChemUnloadPowerStationPath()
{
	executePathArray(["TO233.R"]);
}

function PaperPlantRecycledPaperPath()
{
	executePathArray(["TO228.R", "TO229.R"]);
}

function PaperPlantWoodchipsPath()
{
	executePathArray(["TO228.R", "TO229.N"]);
}

function PaperPlantPulpPath()
{
	executePathArray(["TO228.N"]);
}

function HemetGrowersPath()
{
	executePathArray(["TO246.R"]);
}

function HemetDillLumberPath()
{
	executePathArray(["TO241.R", "TO240.R", "TO239.N"]);
}

function HemetWalnutStephensGrocPath()
{
	executePathArray(["TO243A.R"]);
    HemetWalnutStephensGrocPreLeadPath();
}

function HemetWalnutStephensGrocPreLeadPath()
{
	executePathArray(["TO241.N", "TO240.R", "TO239.N"]);
}

function HemetCACoop2Path()
{
	executePathArray(["TO244.R"]);
}

function HemetCACoop1Path()
{
	executePathArray(["TO244.N"]);
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

function HemetTeamTrackPreLeadPath()
{
	executePathArray(["TO239.R"]);
}
