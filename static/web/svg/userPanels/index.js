var svgDocument;

var xmlns="http://www.w3.org/2000/svg";
var xlinkns="http://www.w3.org/1999/xlink";

/* init([Event] evt)
 * Called by each SVG file to initialize the panel.
 *
 */
function init(evt)
{
	svgDocument=evt.target.ownerDocument;

	var desiredWinWidth = window.outerWidth - window.innerWidth + svgDocument.rootElement.scrollWidth;
	var desiredWinHeight = window.outerHeight - window.innerHeight + svgDocument.rootElement.scrollHeight;
	
	if(desiredWinWidth > screen.width)
		desiredWinWidth = screen.width;
	
	if(desiredWinHeight > screen.height)
		desiredWinHeight = screen.height;
	
	window.resizeTo(desiredWinWidth, desiredWinHeight);
}
