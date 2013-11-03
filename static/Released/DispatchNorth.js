function panelInitNorth(evt)
{
<<<<<<< HEAD
    var pathArray = ["TO725A.N", "TO725B.N"];

    for(var i in pathArray)
    {
        var panelTurnout = getPanelTurnoutFromElemID(pathArray[i]);
=======
    var normalCrossoverPathArray = ["TO725A.N", "TO725B.N"];

    var reverseCrossoverPathArray = [];

    for(var i in normalCrossoverPathArray)
    {
        var panelTurnout = getPanelTurnoutFromElemID(normalCrossoverPathArray[i]);
>>>>>>> master

        if(panelTurnout != null)
            panelTurnout.allowMultipleNormalAuthorizations = true;
    }
<<<<<<< HEAD
=======
    
    for(var i in reverseCrossoverPathArray)
    {
        var panelTurnout = getPanelTurnoutFromElemID(reverseCrossoverPathArray[i]);

        if(panelTurnout != null)
            panelTurnout.allowMultipleReverseAuthorizations = true;
    }
>>>>>>> master
}
