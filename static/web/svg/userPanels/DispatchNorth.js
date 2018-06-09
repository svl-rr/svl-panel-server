function panelInitPreSocketNorth(evt)
{
    var normalCrossoverPathArray = ["TO725A.N", "TO725B.N"];

    var reverseCrossoverPathArray = [];

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
