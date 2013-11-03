function panelInitSouth(evt)
{
<<<<<<< HEAD
    var pathArray = ["TO325A.N", "TO325B.N", "TO275A.N", "TO275B.N", "TO250A.N", "TO250B.N", "TO226A.N", "TO226B.N", "TO225A.N", "TO225B.N", "TO100A.N", "TO100B.N"];

    for(var i in pathArray)
    {
        var panelTurnout = getPanelTurnoutFromElemID(pathArray[i]);
=======
    var normalCrossoverPathArray = ["TO325A.N", "TO325B.N", "TO100A.N", "TO100B.N"];

    var reverseCrossoverPathArray = ["TO275A.N", "TO275B.N", "TO250A.N", "TO250B.N", "TO226A.N", "TO226B.N", "TO225A.N", "TO225B.N"];

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
