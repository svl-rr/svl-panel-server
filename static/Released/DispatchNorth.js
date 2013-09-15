function panelInitNorth(evt)
{
    var panelTurnout = getPanelTurnoutFromElemID("TO725A.N");

    if(panelTurnout != null)
        panelTurnout.allowMultipleNormalAuthorizations = true;
    
    panelTurnout = getPanelTurnoutFromElemID("TO725B.N");
    
    if(panelTurnout != null)
        panelTurnout.allowMultipleNormalAuthorizations = true;
}
