function panelInit(evt)
{
}

function mainSouthPath()
{
    arrivalLeadPath();
    executePathArray(["TO24.R"]);
}

function cabooseTrkPath()
{
    executePathArray(["TO23.N"]);
}

function arrivalSubLeadPath()
{
    executePathArray(["TO36.N"]);
}

function arrivalLeadPath()
{
    executePathArray(["TO36.N", "TO38.R", "TO23.R"]);
}

function arrivalNorthPath()
{
    arrivalLeadPath();
    executePathArray(["TO24.N"]);
}

function arrivalSouthPath()
{
    executePathArray(["TO34.R"]);
}

function class1NorthPath()
{
    executePathArray(["TO36.N", "TO38.N"]);
}

function class1SouthPath()
{
    executePathArray(["TO34.N", "TO33.N"]);
}

function class2NorthPath()
{
    executePathArray(["TO36.R", "TO37.N"]);
}

function class2SouthPath()
{
    executePathArray(["TO34.N", "TO33.R", "TO32.N"]);	
}

function class3NorthPath()
{
    executePathArray(["TO36.R", "TO37.R"]);
}

function class3SouthPath()
{
    executePathArray(["TO34.N", "TO33.R", "TO32.R", "TO31.N"]);
}

function class4NorthPath()
{
    executePathArray(["TO39.R", "TO40.R"]);
}

function class4SouthPath()
{
    executePathArray(["TO34.N", "TO33.R", "TO32.R", "TO31.R", "TO30.N"]);
}

function class5NorthPath()
{
    executePathArray(["TO39.R", "TO40.N", "TO41.N"]);
}

function class5SouthPath()
{
    executePathArray(["TO34.N", "TO33.R", "TO32.R", "TO31.R", "TO30.R", "TO29.N", "TO28.R"]);
}

function class6NorthPath()
{
    executePathArray(["TO39.R", "TO40.N", "TO41.R", "TO42.N"]);
}

function class6SouthPath()
{
    executePathArray(["TO27B.R", "TO34.N", "TO33.R", "TO32.R", "TO31.R", "TO30.R", "TO29.R", "TO28.N"]);
}

function departureNorthPath()
{
    executePathArray(["TO39.R", "TO40.N", "TO41.R", "TO42.R"]);
}

function departureSouthPath()
{
    executePathArray(["TO26B.R"]);
}

function mainNorthLeadPath()
{
    executePathArray(["TO39.N", "TO25.N"]);	
}
