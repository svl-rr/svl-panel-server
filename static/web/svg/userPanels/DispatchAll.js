// This function initializes both the north and south portions of the 
// all panel, utilizing common code. Panel must include both
// DispatchNorth.js and DispatchSouth.js files
function panelInitPreSocket(evt)
{
    panelInitPreSocketNorth(evt);
    panelInitPreSocketSouth(evt);
}
