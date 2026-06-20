function panelInitPreSocket(evt)
{
}

function mainSouthPath()
{
    arrivalLeadPath();
    executePathArray(["TO24.R"]);
}

function arrivalNorthPath()
{
    arrivalLeadPath();
    executePathArray(["TO24.N"]);
}

registerPathFunctions({
    cabooseTrkPath: ["TO23.N"],
    arrivalSubLeadPath: ["TO35.N"],
    arrivalLeadPath: ["TO35.N", "TO38.R", "TO23.R"],
    arrivalSouthPath: ["TO34.R"],
    class1NorthPath: ["TO35.N", "TO38.N"],
    class1SouthPath: ["TO34.N", "TO33.N"],
    class2NorthPath: ["TO35.R", "TO36.N"],
    class2SouthPath: ["TO34.N", "TO33.R", "TO32.N"],
    class3NorthPath: ["TO35.R", "TO36.R"],
    class3SouthPath: ["TO34.N", "TO33.R", "TO32.R", "TO31.N"],
    class4NorthPath: ["TO39.R", "TO40.R"],
    class4SouthPath: ["TO34.N", "TO33.R", "TO32.R", "TO31.R", "TO30.N"],
    class5NorthPath: ["TO39.R", "TO40.N", "TO41.N"],
    class5SouthPath: ["TO34.N", "TO33.R", "TO32.R", "TO31.R", "TO30.R", "TO29.N", "TO28.R"],
    class6NorthPath: ["TO39.R", "TO40.N", "TO41.R", "TO42.N"],
    class6SouthPath: ["TO27B.R", "TO34.N", "TO33.R", "TO32.R", "TO31.R", "TO30.R", "TO29.R", "TO28.N"],
    departureNorthPath: ["TO39.R", "TO40.N", "TO41.R", "TO42.R"],
    departureSouthPath: ["TO26B.R"],
    mainNorthLeadPath: ["TO39.N", "TO25.N"],
    hardestyIndustriesPath: ["TO25.R"]
});
