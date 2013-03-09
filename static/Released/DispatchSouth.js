function panelInitSouth(evt)
{
    // South Loop
    createPanelTurnout("TO328", false);
    
    // Kaos
    createPanelTurnout("TO327", true);
    createPanelTurnout("TO326", false);
    createPanelTurnout("TO325A", false);
    createPanelTurnout("TO325B", false);
    
    // Jerico-Jacksonville
    createPanelTurnout("TO275A", true);
    createPanelTurnout("TO275B", true);
    
    // Jacksonville-Igo
    createPanelTurnout("TO250A", true);
    createPanelTurnout("TO250B", true);
    
    // Hellelujah Jct
    createPanelTurnout("TO226A", true);
    createPanelTurnout("TO226B", true);
    createPanelTurnout("TO225A", true);
    createPanelTurnout("TO225B", true);
    
    // Fryton
    createPanelTurnout("TO176", true);
    createPanelTurnout("TO175", false);
    
    // Dayton Jct.
    createPanelTurnout("TO126", false);
    createPanelTurnout("TO127", false);
    
    // S. Dayton
    createPanelTurnout("TO125", false);
    
    // Cavanaugh
    createPanelTurnout("TO101", false);
    createPanelTurnout("TO100A", false);
    createPanelTurnout("TO100B", false);
    
    // Dayton Jct. Doubleslip
    createPanelTurnout("TO128", false);
    createPanelTurnout("TO129", true);
    
    // Dodge
    createPanelTurnout("TO19", false);
    createPanelTurnout("TO18", true);
}
