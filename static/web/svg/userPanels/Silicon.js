function panelInitPreSocket(evt)
{
}

registerPathFunctions({
    IdealCementSidingLeftPath: ["TO648.R"],
    SiliconMainMidLeftPath: ["TO648.N"],
    IdealCementSidingRightPath: ["TO649.N"],
    SiliconMainMidRightPath: ["TO649.R"],
    SiliconMainLeftPath: ["TO600.R"],
    SiliconSidingLeftPath: ["TO600.N", "TO630.N"],
    IdealCement2LeftPath: ["TO631.N"],
    IdealCement1LeftPath: ["TO631.R", "TO632.N"],
    FrontRunaroundLeftPath: ["TO631.R", "TO632.R", "TO638.R"],
    SiliconMainRightPath: ["TO601.N"],
    SiliconSidingMidPath: ["TO633.N"],
    SiliconSidingRightPath: ["TO601.R"],
    IdealCement2RightPath: ["TO634.N", "TO633.R"],
    IdealCement1RightPath: ["TO635A.N", "TO634.R", "TO633.R"],
    FrontRunaroundRightPath: ["TO635A.R", "TO634.R", "TO633.R"],
    TeamTrackPath: ["TO635A.N", "TO636A.R"],
    QMPath: ["TO636A.T"],
    BagHouse2Path: ["TO637.R", "TO636B.R"],
    BagHouse1Path: ["TO637.N", "TO636B.R"],
    HillPropane: ["TO638.N"]
});
