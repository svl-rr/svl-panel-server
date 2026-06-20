function panelInitPreSocket(evt)
{
}

function EscapeBranchlineDSPath()
{
	executePathArray(["TO128.N", "TO129.R"]);
	executePathArray(["TO130A.R"]);
}

function BakersfieldDSPath()
{
	executePathArray(["TO128.R", "TO129.N"]);
	executePathArray(["TO127.N"]);
}

registerPathFunctions({
    DPL3Path: ["TO174.R", "TO172.N"],
    DPL2Path: ["TO174.N", "TO172.N"],
    DPL1Path: ["TO173.N", "TO172.R"],
    PeacheyBrothersPath: ["TO163.R", "TO173.R", "TO172.R"],
    GamerAndThronesPath: ["TO163.N", "TO173.R", "TO172.R"],
    DaytonIndustrialLeadPath: ["TO170.R", "TO171.R"],
    IndRunaroundNorthPath: ["TO170.N", "TO171.R"],
    IndRunaroundSouthPath: ["TO169.N"],
    ScrantonCRLLeadPath: ["TO171.N"],
    ScrantonElectricPath: ["TO168.R"],
    WiebeScrantonCRLPath: ["TO167.N", "TO168.N"],
    WiebeWafersPath: ["TO167.R"],
    WiebeCRLLeadPath: ["TO169.R"],
    WarehouseNo9Path: ["TO165.N", "TO166.R"],
    CavanaughLeadPath: ["TO165.R", "TO166.R"],
    MegAWatt2Path: ["TO164.N", "TO166.N"],
    MegAWatt1Path: ["TO164.R", "TO166.N"],
    TeamTrackPath: ["TO132A.N"],
    DodgeNorthMainPath: ["TO19.N"],
    DodgeNorthSidingPath: ["TO19.R"],
    DodgeSouthMainPath: ["TO18.R"],
    DodgeSouthSidingPath: ["TO18.N"]
});
