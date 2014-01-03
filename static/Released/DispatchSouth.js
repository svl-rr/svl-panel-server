function panelInitSouth(evt)
{
    var normalCrossoverPathArray = ["TO325A.N", "TO325B.N", "TO100A.N", "TO100B.N"];

    var reverseCrossoverPathArray = ["TO276A.N", "TO276B.N", "TO275A.N", "TO275B.N", "TO251A.N", "TO251B.N", "TO250A.N", "TO250B.N"];

    for(var i in normalCrossoverPathArray)
    {
        var panelTurnout = getPanelTurnoutFromElemID(normalCrossoverPathArray[i]);

        if(panelTurnout != null)
            panelTurnout.allowMultipleNormalAuthorizations = true;
    }
    
    for(var i in reverseCrossoverPathArray)
    {
        var panelTurnout = getPanelTurnoutFromElemID(reverseCrossoverPathArray[i]);

        if(panelTurnout != null)
            panelTurnout.allowMultipleReverseAuthorizations = true;
    }
}
