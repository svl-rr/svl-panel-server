function panelInitNorth(evt)
{
    var pathArray = ["TO725A.N", "TO725B.N"];

    for(var i in pathArray)
    {
        var panelTurnout = getPanelTurnoutFromElemID(pathArray[i]);

        if(panelTurnout != null)
            panelTurnout.allowMultipleNormalAuthorizations = true;
    }
}
