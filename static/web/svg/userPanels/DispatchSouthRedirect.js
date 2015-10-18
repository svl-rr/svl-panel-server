// This function just redirects the init process into another file so that
// the north and south files can both be loaded and used by the all panel.
// Any code placed here will not be availabed by the all panel!
function panelInitPreSocket(evt)
{
    panelInitPreSocketSouth(evt);
}
