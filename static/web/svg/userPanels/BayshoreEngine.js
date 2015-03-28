function panelInit(evt)
{
    setDispatchMainlineLockLEDColor(svgDocument.getElementById('dispatchMainlineLockedLED'), mainlineLocked == true ? "#ff0000" : "off");
}

function arrivalLeadPath()
{
    executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}
