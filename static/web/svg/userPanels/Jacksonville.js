function panelInitPreSocket(evt)
{
}

// ── Unauthorized Occupancy Alarm (field panel) ─────────────────────────────
// When the dispatcher's "Field Alarms" toggle is on, surface the dispatch
// panel's unauthorized-occupancy alarm here. Block authorization lives in the
// IMBA<n> memory (received as "BA<n>"); the sentinel train id flags it.

// Block number -> the sensor class used on this panel's track element(s).
var JAX_ALARM_BLOCKS = {
    202: 'JacksonvilleSB',
    203: 'JacksonvilleNB',
    252: 'IgoNB',
    253: 'IgoSB',
    300: 'JerichoNB',
    301: 'JerichoSB'
};
var JAX_UNAUTH_LABEL = "UNAUTHORIZED TRAIN!";
var jaxAlarms = {};   // block number -> true while unauthorized-occupied

// Subscribe to this panel's block authorization memory (IMBA<n> over the wire).
function getPanelSpecificStates()
{
    var states = [];
    for(var num in JAX_ALARM_BLOCKS)
        states.push(new ServerObject("BA" + num, SERVER_TYPE_DISPATCH));
    return states;
}

// Consume block authorization updates; flag a block when its train id is the
// unauthorized sentinel. Returns true when handled (so PanelCommon stops).
function panelSpecificSetState(obj)
{
    if(obj == null || obj.type != SERVER_TYPE_DISPATCH)
        return false;
    var m = /^BA(\d+)$/.exec(obj.name);
    if(m == null)
        return false;
    var num = m[1];
    if(!JAX_ALARM_BLOCKS.hasOwnProperty(num))
        return false;

    if((obj.value != null) && (obj.value.indexOf(JAX_UNAUTH_LABEL) >= 0))
        jaxAlarms[num] = true;
    else
        delete jaxAlarms[num];

    renderJaxAlarms();
    return true;
}

// Called by PanelCommon when the shared Field Alarms flag flips.
function onFieldAuthAlarmToggled()
{
    renderJaxAlarms();
}

function jaxBlockLabel(num)
{
    if(typeof window != "undefined" && window.SVL_BLOCK_NAMES && window.SVL_BLOCK_NAMES[num])
        return window.SVL_BLOCK_NAMES[num] + " (" + num + ")";
    return "Block " + num;
}

// Add/remove the CSS flash class so the cleared block reverts to its
// occupancy-managed stroke automatically (no manual color restore needed).
function jaxSetFlash(el, on)
{
    var cls = el.getAttribute("class") || "";
    var has = (" " + cls + " ").indexOf(" fieldAlarmFlash ") >= 0;
    if(on && !has)
        el.setAttribute("class", cls + " fieldAlarmFlash");
    else if(!on && has)
        el.setAttribute("class", (" " + cls + " ").replace(" fieldAlarmFlash ", " ").replace(/^\s+|\s+$/g, ""));
}

function renderJaxAlarms()
{
    try
    {
        var enabled = (typeof fieldAuthAlarmEnabled != 'undefined') && fieldAuthAlarmEnabled;
        var nums = [];
        for(var n in jaxAlarms) nums.push(n);

        // Flash each block element (or clear it).
        for(var num in JAX_ALARM_BLOCKS)
        {
            var on = enabled && (jaxAlarms[num] === true);
            var els = svgDocument.getElementsByClassName(JAX_ALARM_BLOCKS[num]);
            for(var j = 0; j < els.length; j++)
                jaxSetFlash(els[j], on);
        }

        // Banner.
        var banner = svgDocument.getElementById("alarmBanner");
        if(banner != null)
        {
            if(enabled && nums.length > 0)
            {
                var labels = [];
                for(var i = 0; i < nums.length; i++) labels.push(jaxBlockLabel(nums[i]));
                setSVGText("alarmBannerText", "⚠ UNAUTHORIZED TRAIN! " + labels.join(", "));
                banner.setAttribute("visibility", "visible");
            }
            else
            {
                banner.setAttribute("visibility", "hidden");
            }
        }
    }
    catch(e)
    {
        console.log("renderJaxAlarms error: " + e);
    }
}

function AshgroveQuarry3Path()
{
	executePathArray(["TO298.N", "TO299.R"]);
	AshgroveQuarryLeadPath();
}

function AshgroveQuarry2Path()
{
	executePathArray(["TO298.N", "TO299.N"]);
	AshgroveQuarryLeadPath();
}

function AshgroveQuarry1Path()
{
	executePathArray(["TO298.R"]);
	AshgroveQuarryLeadPath();
}

function AshgroveQuarryLeadPath()
{
	executePathArray(["TO297.R"]);
}

function AQXchangeLeadPath()
{
	executePathArray(["TO297.N"]);
}

function AQXchange2Path()
{
	executePathArray(["TO296.N", "TO295.R"]);
}

function AQXchange1Path()
{
	executePathArray(["TO296.R", "TO295.N"]);
}

function Igo3Path()
{
	executePathArray(["TO273.R"]);
}

function Igo2Path()
{
	executePathArray(["TO273.N", "TO274.N"]);
}

function Igo1Path()
{
	executePathArray(["TO273.N", "TO274.R"]);
}

function KawValleyPlasticsPath()
{
	executePathArray(["TO320.N", "TO319.R"]);
}

function GulfportGrain2Path()
{
	executePathArray(["TO321.N", "TO320.R", "TO319.R"]);
}

function GulfportGrain1Path()
{
	executePathArray(["TO321.R", "TO320.R", "TO319.R"]);
}

function JacksonvilleSidingPath()
{
	executePathArray(["TO319.N"]);
}

function UniversalExportsPath()
{
	executePathArray(["TO323.R", "TO322.N"]);
    UnionCoalUniversalExportsPreLeadPath();
}

function UnionCoal2Path()
{
	executePathArray(["TO324.R", "TO323.N", "TO322.N"]);
    UnionCoalUniversalExportsPreLeadPath();
}

function UnionCoal1Path()
{
	executePathArray(["TO324.N", "TO323.N", "TO322.N"]);
    UnionCoalUniversalExportsPreLeadPath();
}

function UnionCoalUniversalExportsPreLeadPath()
{
	executePathArray(["TO322.N"]);
}

function UnionCoalRampPath()
{
	executePathArray(["TO322.R"]);
}
