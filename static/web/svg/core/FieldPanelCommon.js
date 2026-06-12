function setSensorState(sensorID, sensorState)
{
    if(sensorState == undefined)
		return;

	// Search for any blocks with this as a class name component.
	var elements = svgDocument.getElementsByClassName(sensorID);
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];

		// Require the "sensor" class on this element.
		var classesStr = element.getAttribute("class");
        var classes = classesStr.split(" ");
        var foundSensorClass = false;
        for (var cIdx = 0; cIdx < classes.length; cIdx++) {
            if (classes[cIdx] == 'sensor') {
            	foundSensorClass = true;
            	break;
            }
        }
        if (foundSensorClass) {
        	if (sensorState == JMRI_SENSOR_ACTIVE) {
				setStyleSubAttribute(element, "stroke", "red");
			} else {
				setStyleSubAttribute(element, "stroke", "white");
			}
        }
	}

	if (sensorID.indexOf("LS") == 0) {
		// like "block123"
		sensorID = sensorID.replace("LS", "block");
	}
	console.log("Trying sensorID ", sensorID, "as a class name");

	// Some block segments may be identified by class name.
	// This is because some panels have multi-segment blocks.
	var blockPaths = svgDocument.getElementsByClassName(sensorID);
	for (var i = 0; i < blockPaths.length; i++) {
		var element = blockPaths[i];
		if (sensorState == JMRI_SENSOR_ACTIVE) {
			setStyleSubAttribute(element, "stroke", "red");
		} else {
			setStyleSubAttribute(element, "stroke", "white");
		}
	}

	// Search for any blocks with this as the ID.
	console.log("Trying", sensorID, "as an element ID");
	blockElement = svgDocument.getElementById(sensorID);

	if (blockElement == null) {
		return;
	}

	if (sensorState == JMRI_SENSOR_ACTIVE) {
		setStyleSubAttribute(blockElement, "stroke", "red");
	} else {
		setStyleSubAttribute(blockElement, "stroke", "white");
	}
}

// ── Unauthorized Occupancy Alarm (shared field-panel engine) ────────────────
// Surfaces the dispatcher's unauthorized-occupancy alarm on field panels when
// the "Field Alarms" toggle is on. Self-discovers which blocks this panel shows
// (by sensor class), subscribes to their authorization memory (BA<n>), pulses
// the block, and shows a banner. Banner + flash style are injected at runtime,
// so no per-panel SVG edits are needed.
//
// Panels that define their own getPanelSpecificStates / setPanelSpecificState
// (e.g. BayshoreEngine, Jacksonville) override the defaults below, so they must
// also call fieldAlarmSubscriptions() and fieldAlarmHandle() from those hooks.

// Sensor-class -> block number. The first group is taken from the dispatch
// panels' BLOCK<n> sensor classes; the mainline additions are confirmed names.
// Extend this as more blocks gain detection.
var FIELD_BLOCK_BY_SENSOR = {
    JacksonvilleSB:202, JacksonvilleNB:203, IgoNB:252, IgoSB:253,
    JerichoNB:300, JerichoSB:301, KaosMain:330, Hallelujah:179,
    Greeley:178, Eagle:150, EbbettsPass:173, FrytonMain:174, FrytonSiding:177,
    SiliconMain:602, SiliconSiding:603, PasoMain:574, RavineMain:599,
    MtMarvell:450, LoopOuter:331, LoopInner:332, BayshoreSingle:102,
    TracyMain:652, TracySiding:649, UptonMain:705, UptonSiding:706, VictoriaMain:726
};
var FIELD_UNAUTH_LABEL = "UNAUTHORIZED TRAIN!";
var FIELD_SVGNS = "http://www.w3.org/2000/svg";
var fieldAlarms = {};          // block number -> true while unauthorized-occupied
var fieldPanelBlocks = null;   // {number: sensorClass} present on this panel
var fieldAlarmBannerTspan = null;

// Discover this panel's alarm-capable blocks and inject the banner + flash style.
function fieldAlarmInit()
{
    if(fieldPanelBlocks != null)
        return;
    fieldPanelBlocks = {};
    try
    {
        for(var cls in FIELD_BLOCK_BY_SENSOR)
        {
            if(svgDocument.getElementsByClassName(cls).length > 0)
                fieldPanelBlocks[FIELD_BLOCK_BY_SENSOR[cls]] = cls;
        }
        var hasBlocks = false;
        for(var k in fieldPanelBlocks) { hasBlocks = true; break; }
        if(hasBlocks)
            fieldAlarmInjectDom();
    }
    catch(e) { console.log("fieldAlarmInit error: " + e); }
}

function fieldAlarmInjectDom()
{
    var root = svgDocument.documentElement;
    if(root == null) return;

    if(svgDocument.getElementById("fieldAlarmStyle") == null)
    {
        var style = svgDocument.createElementNS(FIELD_SVGNS, "style");
        style.setAttribute("id", "fieldAlarmStyle");
        style.appendChild(svgDocument.createTextNode(
            ".fieldAlarmFlash{animation:fieldAlarmFlash 0.8s infinite;}" +
            "@keyframes fieldAlarmFlash{0%,50%{stroke:#ff0000;stroke-width:8;}50.01%,100%{stroke:#ffff00;stroke-width:16;}}"));
        root.appendChild(style);
    }

    var banner = svgDocument.getElementById("alarmBanner");
    if(banner == null)
    {
        var w = parseFloat(root.getAttribute("width"));
        if(!w && root.viewBox && root.viewBox.baseVal) w = root.viewBox.baseVal.width;
        if(!w) w = 1000;
        banner = svgDocument.createElementNS(FIELD_SVGNS, "g");
        banner.setAttribute("id", "alarmBanner");
        banner.setAttribute("visibility", "hidden");
        var rect = svgDocument.createElementNS(FIELD_SVGNS, "rect");
        rect.setAttribute("x", "0"); rect.setAttribute("y", "0");
        rect.setAttribute("width", String(w)); rect.setAttribute("height", "44");
        rect.setAttribute("style", "fill:#cc0000;stroke:#ffff00;stroke-width:3");
        banner.appendChild(rect);
        var text = svgDocument.createElementNS(FIELD_SVGNS, "text");
        text.setAttribute("id", "alarmBannerText");
        text.setAttribute("x", String(w / 2)); text.setAttribute("y", "30");
        text.setAttribute("style", "font-family:'Trebuchet MS';font-weight:bold;font-size:24px;text-anchor:middle;fill:#ffffff");
        var tspan = svgDocument.createElementNS(FIELD_SVGNS, "tspan");
        tspan.setAttribute("x", String(w / 2)); tspan.setAttribute("y", "30");
        tspan.appendChild(svgDocument.createTextNode("⚠ UNAUTHORIZED TRAIN!"));
        text.appendChild(tspan);
        banner.appendChild(text);
        root.appendChild(banner);
        fieldAlarmBannerTspan = tspan;
    }
    else
    {
        var existing = svgDocument.getElementById("alarmBannerText");
        var spans = existing ? existing.getElementsByTagName("tspan") : null;
        fieldAlarmBannerTspan = (spans && spans.length) ? spans[0] : existing;
    }
}

// Subscriptions for this panel's blocks (call from getPanelSpecificStates).
function fieldAlarmSubscriptions()
{
    fieldAlarmInit();
    var states = [];
    for(var num in fieldPanelBlocks)
        states.push(new ServerObject("BA" + num, SERVER_TYPE_DISPATCH));
    return states;
}

// Handle a block-authorization object (call from setPanelSpecificState).
// Returns true when it consumed the object.
function fieldAlarmHandle(obj)
{
    if(obj == null || obj.type != SERVER_TYPE_DISPATCH)
        return false;
    var m = /^BA(\d+)$/.exec(obj.name);
    if(m == null)
        return false;
    fieldAlarmInit();
    var num = m[1];
    if(!fieldPanelBlocks.hasOwnProperty(num))
        return false;
    if((obj.value != null) && (obj.value.indexOf(FIELD_UNAUTH_LABEL) >= 0))
        fieldAlarms[num] = true;
    else
        delete fieldAlarms[num];
    renderFieldAlarms();
    return true;
}

function fieldSetFlash(el, on)
{
    var cls = el.getAttribute("class") || "";
    var has = (" " + cls + " ").indexOf(" fieldAlarmFlash ") >= 0;
    if(on && !has)
        el.setAttribute("class", cls + " fieldAlarmFlash");
    else if(!on && has)
        el.setAttribute("class", (" " + cls + " ").replace(" fieldAlarmFlash ", " ").replace(/^\s+|\s+$/g, ""));
}

function renderFieldAlarms()
{
    try
    {
        if(fieldPanelBlocks == null)
            return;
        var enabled = (typeof fieldAuthAlarmEnabled != 'undefined') && fieldAuthAlarmEnabled;
        var activeClasses = [];
        for(var num in fieldPanelBlocks)
        {
            var on = enabled && (fieldAlarms[num] === true);
            var cls = fieldPanelBlocks[num];
            var els = svgDocument.getElementsByClassName(cls);
            for(var j = 0; j < els.length; j++)
                fieldSetFlash(els[j], on);
            if(on)
                activeClasses.push(cls);
        }
        var banner = svgDocument.getElementById("alarmBanner");
        if(banner != null)
        {
            if(activeClasses.length > 0)
            {
                if(fieldAlarmBannerTspan != null && fieldAlarmBannerTspan.firstChild != null)
                    fieldAlarmBannerTspan.firstChild.nodeValue = "⚠ UNAUTHORIZED TRAIN! " + activeClasses.join(", ");
                banner.setAttribute("visibility", "visible");
            }
            else
            {
                banner.setAttribute("visibility", "hidden");
            }
        }
    }
    catch(e) { console.log("renderFieldAlarms error: " + e); }
}

// Called by PanelCommon when the shared Field Alarms flag flips.
function onFieldAuthAlarmToggled()
{
    renderFieldAlarms();
}

// Default per-panel hooks. Panels that define their own override these.
function getPanelSpecificStates()
{
    return fieldAlarmSubscriptions();
}

function setPanelSpecificState(obj)
{
    return fieldAlarmHandle(obj);
}