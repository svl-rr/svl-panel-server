var JMRI_TURNTABLE_OBJID_PREFIX = "ST";
var BAYSHORE_TURNTABLE_CONTROLLER_ADDR = 57;
var BAYSHORE_TURNTABLE_SPEED = 2; //(360.0/105.0); // degrees of rotation per second

var POWERLED_LIGHT_COLOR = "#e4e4b4";

var AUTO_POWER_TURNTABLE_TRACKS = true;

var NUM_TURNTABLE_TRACKS = 16;

var turntableTimeToRotate = 0;
var bayshoreLastTrackNum = 0;

var turntableTrackPower = new Array();
var roundhouseLightsPower = false;

var TRACK1DIRECTIONPATH = "track1DirectionPath";
var TRACK2DIRECTIONPATH = "track2DirectionPath";

var track1DirectionDefault;
var track2DirectionDefault;

var TRACK1DIRECTIONROTATED = "m 678.72056,378.1528 12.93913,1.69582";
var TRACK2DIRECTIONROTATED = "m 701.55703,326.25168 -13.01142,-6.08934";

var JMRI_LASTBAYSHORETURNTABLETRACK = "LASTBAYSHORETURNTABLETRACK";

function panelInit(evt)
{
    for(var i = 0; i < NUM_TURNTABLE_TRACKS; i++)
        turntableTrackPower.push(false);
    
    updateTurntableStatus(0);
    
    var path = svgDocument.getElementById(TRACK1DIRECTIONPATH);
    
    if(path != null)
        track1DirectionDefault = path.getAttribute("d");

    path = svgDocument.getElementById(TRACK2DIRECTIONPATH);
    
    if(path != null)
        track2DirectionDefault = path.getAttribute("d");
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
        var deviceAddr = getDCCAddr(serverObject.name);
    
        var trackNum = getTrackNumFromAddr(deviceAddr);
    
        displayTurntableTrack(trackNum);
        
        return true;
    }
    else if((serverObject.type == SERVER_TYPE_TURNOUT) && (serverObject.name.search(JMRI_TURNOUT_OBJID_PREFIX) == 0))
    {
        var deviceAddr = getDCCAddr(serverObject.name);
    
        if(deviceAddr == 800)
        {
            displayRoundhouseLightsPower(serverObject.value == 'R');
            return true;
        }
        else if((deviceAddr >= 801) && (deviceAddr <= 816))
        {
            displayTurntableTrackPower(deviceAddr - 800, serverObject.value == 'N');
            return true;
        }
    }
    else if((serverObject.type == SERVER_TYPE_DISPATCH) && (serverObject.name.search(JMRI_LASTBAYSHORETURNTABLETRACK) == 0))
    {
        var whichTrack = Number(serverObject.value);
    
        if((bayshoreLastTrackNum == 0) && (whichTrack >= 1) && (whichTrack <= 18))
        {
            displayTurntableTrack(whichTrack);
        }
        
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
        
        if((deviceAddr >= 800) && (deviceAddr <= 816))
            return 'R';
    }
    
    return undefined;
}

function displayTurntableTrack(trackNum)
{
    if(turntableTimeToRotate > 0)
    {
        //alert("Turntable is busy!");
        return;
    }
    
    var bridge = svgDocument.getElementById('turntableBridge');
    
    if(bridge != null)
    {
        var transform = getTurntableTrackTransform(trackNum);
        
        if(bayshoreLastTrackNum > 0)
        {
            var angleDeg = getTurntableTrackAngle(trackNum);
            
            var angleOldDeg = getTurntableTrackAngle(bayshoreLastTrackNum);
            
            var rotateDeg = Math.abs(angleDeg - angleOldDeg);
            
            if(rotateDeg > 180)
                rotateDeg = 360 - rotateDeg;
            
            var angleRad = angleDeg / 360.0 * 2.0 * Math.PI;

            turntableTimeToRotate = rotateDeg / BAYSHORE_TURNTABLE_SPEED + 2;
            
            //var a = -Math.cos(angleRad);
            //var b = Math.sin(angleRad);
            //var c = -b;
            //var d = a;
            //var e = 38.7478;
            //var f = -140.09141;
        
            //transform = "matrix(" + a + "," + b + "," + c + "," + d + "," + e + "," + f + ")";
        }
        else
            turntableTimeToRotate = 0;
        
        bridge.setAttribute("transform", transform);
        
        updateTurntableStatus(0);
    }
    
    bayshoreLastTrackNum = trackNum;
}

function setBayshoreTurntableTrack(trackNum)
{
    if((trackNum >= 1) && (trackNum <= 28))
    {
        if(trackNum != bayshoreLastTrackNum)
        {
            if((bayshoreLastTrackNum != 0) && (AUTO_POWER_TURNTABLE_TRACKS == true))
                setTurntableTrackPower(bayshoreLastTrackNum, false);
        
            setTurntableMemoryState(trackNum);
            setTurntableState('ST' + getAddrFromTrackNum(trackNum));
            //displayTurntableTrack(trackNum);
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

function setTurntableMemoryState(trackNum)
{
    var savedStateChangeRequests = stateChangeRequests;

    stateChangeRequests = [];
    
    var memObj = new ServerObject(JMRI_LASTBAYSHORETURNTABLETRACK, SERVER_TYPE_DISPATCH, trackNum);
    
    stateChangeRequests.push(memObj);
    
    executePanelStateChangeRequestsLowLevel(stateChangeRequests, false);
    
    stateChangeRequests = savedStateChangeRequests;
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
        
        if((bayshoreLastTrackNum != 0) && (AUTO_POWER_TURNTABLE_TRACKS == true))
        {
            setTurntableTrackPower(bayshoreLastTrackNum, true);
        }
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
    setBayshoreTurntableTrack(getTrack1LogicalTrack());
    //executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}

function ttLead2Path()
{
    setBayshoreTurntableTrack(getTrack2LogicalTrack());
    //executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}

function displayTurntableTrackPower(trackNum, powered)
{
    if((trackNum >= 1) && (trackNum <= NUM_TURNTABLE_TRACKS))
        turntableTrackPower[trackNum - 1] = powered;
    else
        console.error("trackNum (" + trackNum + ") out of range in displayTurntableTrackPower");
    
    if((trackNum >= 4) && (trackNum <= NUM_TURNTABLE_TRACKS))
    {
        setLEDColorByID('turntableTrack' + trackNum + 'PowerLED', turntableTrackPower[trackNum - 1] == true ? POWERLED_LIGHT_COLOR : "off");
    }
}

function setTurntableTrackPower(trackNum, powered)
{
    var savedStateChangeRequests = stateChangeRequests;

    stateChangeRequests = [];
    
    var addr = (800 + trackNum - (trackNum > NUM_TURNTABLE_TRACKS ? NUM_TURNTABLE_TRACKS : 0));
    
    addTurnoutStateChangeRequest(PANEL_TURNOUT_OBJID_PREFIX + addr, powered ? 'N' : 'R');
    
    executePanelStateChangeRequestsLowLevel(stateChangeRequests, false);
    
    stateChangeRequests = savedStateChangeRequests;
}

function toggleTurntableTrackPower(trackNum)
{
    if(trackNum >= 1)
        setTurntableTrackPower(trackNum, !turntableTrackPower[trackNum > NUM_TURNTABLE_TRACKS ? trackNum - NUM_TURNTABLE_TRACKS - 1: trackNum - 1]);
}

function displayRoundhouseLightsPower(powered)
{
    roundhouseLightsPower = powered;
    setLEDColorByID('roundhouseLightsPowerLED', roundhouseLightsPower == true ? POWERLED_LIGHT_COLOR : "off");
}

function setRoundhouseLightsPower(powered)
{
    var savedStateChangeRequests = stateChangeRequests;

    stateChangeRequests = [];
    
    addTurnoutStateChangeRequest(PANEL_TURNOUT_OBJID_PREFIX + "800", powered ? 'N' : 'R');
    
    executePanelStateChangeRequestsLowLevel(stateChangeRequests, false);
    
    stateChangeRequests = savedStateChangeRequests;
}

function toggleRoundhouseLightsPower()
{
    setRoundhouseLightsPower(!roundhouseLightsPower);
}

function cancelTurntableTimer()
{
    if(turntableTimeToRotate > 1)
        turntableTimeToRotate = 1;
}

function track1DirectionToggle()
{
    trackNDirectionToggle(TRACK1DIRECTIONPATH, track1DirectionDefault, TRACK1DIRECTIONROTATED);
}

function track2DirectionToggle()
{
    trackNDirectionToggle(TRACK2DIRECTIONPATH, track2DirectionDefault, TRACK2DIRECTIONROTATED);
}

function trackNDirectionToggle(elemID, defaultD, rotatedD)
{
    path = svgDocument.getElementById(elemID);
    
    if(path != null)
    {
        var currentDir = path.getAttribute("d");
        
        if(currentDir == defaultD)
            path.setAttribute("d", rotatedD);
        else
            path.setAttribute("d", defaultD);
    }
}

function getTrack1LogicalTrack()
{
    path = svgDocument.getElementById(TRACK1DIRECTIONPATH);
    
    if(path != null)
    {
        var currentDir = path.getAttribute("d");
        
        if(currentDir == track1DirectionDefault)
            return 17;
        else
            return 1;
    }
}

function getTrack2LogicalTrack()
{
    path = svgDocument.getElementById(TRACK2DIRECTIONPATH);
    
    if(path != null)
    {
        var currentDir = path.getAttribute("d");
        
        if(currentDir == track2DirectionDefault)
            return 2;
        else
            return 18;
    }
}
