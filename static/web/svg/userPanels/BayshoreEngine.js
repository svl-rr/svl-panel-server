var JMRI_TURNTABLE_OBJID_PREFIX = "ST";
var BAYSHORE_TURNTABLE_CONTROLLER_ADDR = 57;
var BAYSHORE_TURNTABLE_SPEED = 2; //(360.0/105.0); // degrees of rotation per second

var POWERLED_LIGHT_COLOR = "#e4e4b4";

var NUM_TURNTABLE_TRACKS = 16;

var turntableTimeToRotate = 0;
var bayshoreLastTrackNum = 0;

var turntableTrackPower = new Array();
var roundhouseLightsPower = false;

function panelInit(evt)
{
    for(var i = 0; i < NUM_TURNTABLE_TRACKS; i++)
        turntableTrackPower.push(false);
    
    updateTurntableStatus(0);
}

function addTurntableStateChangeRequest(id)
{
    var turnoutAddr = getDCCAddr(id);
    
	stateChangeRequests.push(new ServerObject(JMRI_TURNTABLE_OBJID_PREFIX + turnoutAddr, SERVER_TYPE_TURNOUT, 'N'));
}

function setTurntableState(id)
{
    var savedStateChangeRequests = stateChangeRequests;

    stateChangeRequests = [];
    
    addTurntableStateChangeRequest(id);
    
    executePanelStateChangeRequestsLowLevel(stateChangeRequests, false);
    
    stateChangeRequests = savedStateChangeRequests;
}

function getAddrFromTrackNum(trackNum)
{
    return (((BAYSHORE_TURNTABLE_CONTROLLER_ADDR - 1)*4) + trackNum);
}

function getTrackNumFromAddr(addr)
{
    return (addr - ((BAYSHORE_TURNTABLE_CONTROLLER_ADDR - 1)*4));
}

function setPanelSpecificState(serverObject)
{
    if((serverObject.type == SERVER_TYPE_TURNOUT) && (serverObject.name.search(JMRI_TURNTABLE_OBJID_PREFIX) == 0))
    {
        console.log("setPanelSpecificState " + serverObject.name + " " + serverObject.value);
    
        var deviceAddr = getDCCAddr(serverObject.name);
    
        var trackNum = getTrackNumFromAddr(deviceAddr);
    
        updateTurntableGraphics(trackNum);
        
        return true;
    }
    
    return false;
}

function getPanelSpecificState(serverObject)
{
    if((serverObject.type == SERVER_TYPE_TURNOUT) && (serverObject.name.search(JMRI_TURNTABLE_OBJID_PREFIX) == 0))
    {
        return undefined;
    }
    else if((serverObject.type == SERVER_TYPE_TURNOUT) && (serverObject.name.search(JMRI_TURNOUT_OBJID_PREFIX) == 0))
    {
        var deviceAddr = getDCCAddr(serverObject.name);
        
        if((deviceAddr >= getAddrFromTrackNum(1)) && (deviceAddr <= getAddrFromTrackNum(18)))
            return 'N';
    }
    
    return undefined;
}

function updateTurntableGraphics(trackNum)
{
    if(turntableTimeToRotate > 0)
    {
        //alert("Turntable is busy!");
        return;
    }
    
    var bridge = svgDocument.getElementById('turntableBridge');
    
    if(bridge != null)
    {
        var angleDeg = getTurntableTrackAngle(trackNum);
        var transform = getTurntableTrackTransform(trackNum);
        
        var angleOldDeg = getTurntableTrackAngle(bayshoreLastTrackNum);
        
        var rotateDeg = Math.abs(angleDeg - angleOldDeg);
        
        if(rotateDeg > 180)
            rotateDeg = 360 - rotateDeg;
        
        var angleRad = angleDeg / 360.0 * 2.0 * Math.PI;
        
        var a = -Math.cos(angleRad);
        var b = Math.sin(angleRad);
        var c = -b;
        var d = a;
        var e = 38.7478;
        var f = -140.09141;
    
        //bridge.setAttribute("transform", "matrix(" + a + "," + b + "," + c + "," + d + "," + e + "," + f + ")");
        bridge.setAttribute("transform", transform);
        
        turntableTimeToRotate = rotateDeg / BAYSHORE_TURNTABLE_SPEED + 2;
        bayshoreLastTrackNum = trackNum;
        
        updateTurntableStatus(0);
    }
    
    var actualTrackNum = (trackNum > NUM_TURNTABLE_TRACKS ? trackNum - NUM_TURNTABLE_TRACKS : trackNum);
    
    for(var i = 1; i <= NUM_TURNTABLE_TRACKS; i++)
    {
        setTurntableTrackPower(i, i == actualTrackNum);
    }
}

function setBayshoreTurntableTrack(trackNum)
{
    if((trackNum >= 1) && (trackNum <= 28))
    {
        if(trackNum != bayshoreLastTrackNum)
        {
            setTurntableState('ST' + getAddrFromTrackNum(trackNum));
        }
        else
        {
            alert("Turntable should already be set to track " + trackNum + ". If turntable is out of sync with panel, try selecting an adjacent track and then reselecting track " + trackNum + ".");
        }
    }
    else
        alert("Track number must be range of 1 to 28 for Walthers turntable. (" + trackNum + " was passed.)");
}

function getTurntableTrackAngle(trackNum)
{
    var angleDeg = -999;

    switch(trackNum)
    {
        case  1:          angleDeg =  170.0; break;
        case  2:          angleDeg =  160.0; break;
        case  3:          angleDeg =   60.0; break;
        case  4:          angleDeg =   50.0; break;
        case  5:          angleDeg =   40.0; break;
        case  6:          angleDeg =   30.0; break;
        case  7:          angleDeg =   20.0; break;
        case  8:          angleDeg =   10.0; break;
        case  9:          angleDeg =    0.0; break;
        case 10: case 17: angleDeg =  -10.0; break;
        case 11: case 18: angleDeg =  -20.0; break;
        case 12:          angleDeg =  -30.0; break;
        case 13:          angleDeg =  -40.0; break;
        case 14:          angleDeg =  -50.0; break;
        case 15:          angleDeg =  -60.0; break;
        case 16:          angleDeg =  -70.0; break;
    }
    
    return angleDeg;
}

function getTurntableTrackTransform(trackNum)
{
    var transform = null;

    switch(trackNum)
    {
        case  1:          transform = "matrix(0.98480775,0.17364818,-0.17364818,0.98480775,38.7478,-140.09141)"; break;
        case  2:          transform = "matrix(0.93969262,0.34202015,-0.34202015,0.93969262,140.62586,-264.38011)"; break;
        case  3:          transform = "matrix(-0.34202016,0.93969261,-0.93969261,-0.34202016,1444.3801,-279.37408)"; break;
        case  4:          transform = "matrix(-0.64278762,0.76604443,-0.76604443,-0.64278762,1631.0384,-19.217967)"; break;
        case  5:          transform = "matrix(-0.76604445,0.64278759,-0.64278759,-0.76604445,1687.7365,131.15537)"; break;
        case  6:          transform = "matrix(-0.86602541,0.49999998,-0.49999998,-0.86602541,1717.4612,289.08973)"; break;
        case  7:          transform = "matrix(-0.93969262,0.34202012,-0.34202012,-0.93969262,1719.3093,449.78635)"; break;
        case  8:          transform = "matrix(-0.98480775,0.17364815,-0.17364815,-0.98480775,1693.2247,608.36255)"; break;
        case  9:          transform = "matrix(-0.99999999,-2.6723543e-8,2.6723543e-8,-0.99999999,1639.9999,760.00007)"; break;
        case 10: case 17: transform = "matrix(-0.98480774,-0.1736482,0.1736482,-0.98480774,1561.2521,900.09148)"; break;
        case 11: case 18: transform = "matrix(-0.9396926,-0.34202016,0.34202016,-0.9396926,1459.374,1024.3802)"; break;
        case 12:          transform = "matrix(-0.86602538,-0.50000001,0.50000001,-0.86602538,1337.4612,1129.0897)"; break;
        case 13:          transform = "matrix(-0.76604442,-0.64278762,0.64278762,-0.76604442,1199.2179,1211.0385)"; break;
        case 14:          transform = "matrix(-0.64278759,-0.76604445,0.76604445,-0.64278759,1048.8446,1267.7366)"; break;
        case 15:          transform = "matrix(-0.49999998,-0.86602541,0.86602541,-0.49999998,890.91024,1297.4613)"; break;
        case 16:          transform = "matrix(-0.34202012,-0.93969262,0.93969262,-0.34202012,730.21362,1299.3094)"; break;
    }
    
    return transform;
}

function updateTurntableStatus(decrementAmt)
{
    turntableTimeToRotate = Math.ceil(turntableTimeToRotate - decrementAmt);

    if(turntableTimeToRotate < 0)
        turntableTimeToRotate = 0;

    enableTurntableTrackEvents(turntableTimeToRotate == 0);
    
    if(turntableTimeToRotate > 0)
    {
        setSVGText('turntableStatus', "Turntable Busy");
        setSVGText('turntableTime', "(~" + turntableTimeToRotate + " sec remaining)");

        setTimeout(function() { updateTurntableStatus(1); }, 1000);
    }
    else
    {
        setSVGText('turntableStatus', "Turntable Ready");
        setSVGText('turntableTime', "");
    }
}

function enableTurntableTrackEvents(drawAsEnabled)
{
    for(var i = 1; i <= NUM_TURNTABLE_TRACKS; i++)
    {
        var trackID = 'turntableTrack' + i + 'Path';
        
        var elem = svgDocument.getElementById(trackID);
        
        if(elem != null)
            setStyleSubAttribute(elem, "opacity", drawAsEnabled ? "1.0" : "0.5");
    }
}

function ttLead1Path()
{
    setBayshoreTurntableTrack(17);
    //executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}

function ttLead2Path()
{
    setBayshoreTurntableTrack(2);
    //executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}

function setTurntableTrackPower(trackNum, powered)
{
    if((trackNum >= 1) && (trackNum <= NUM_TURNTABLE_TRACKS))
        turntableTrackPower[trackNum - 1] = powered;

    if((trackNum >= 4) && (trackNum <= NUM_TURNTABLE_TRACKS))
    {
        setLEDColorByID('turntableTrack' + trackNum + 'PowerLED', turntableTrackPower[trackNum - 1] == true ? POWERLED_LIGHT_COLOR : "off");
    }
}

function toggleTurntableTrackPower(trackNum)
{
    if((trackNum >= 1) && (trackNum <= NUM_TURNTABLE_TRACKS))
        setTurntableTrackPower(trackNum, !turntableTrackPower[trackNum - 1]);
}

function setRoundhouseLightsPower(powered)
{
    roundhouseLightsPower = powered;
    setLEDColorByID('roundhouseLightsPowerLED', roundhouseLightsPower == true ? POWERLED_LIGHT_COLOR : "off");
}

function toggleRoundhouseLightsPower()
{
    setRoundhouseLightsPower(!roundhouseLightsPower);
}
