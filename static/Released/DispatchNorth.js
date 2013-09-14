function panelInitNorth(evt)
{
}

function nowheresMain1SouthPath()
{
	executePathArray(["TO494A.N", "TO493.R", "TO492.N"]);
}

function nowheresMain1NorthPath()
{
	executePathArray(["TO508.N", "TO509.R"]);
}

function nowheresMain2SouthPath()
{
	executePathArray(["TO494A.N", "TO493.N"]);
}

function nowheresMain2NorthPath()
{
	executePathArray(["TO507.N", "TO508.R", "TO509.R"]);
}

function nowheresYardSouthPath()
{
	executePathArray(["TO494A.R"]);
}

function nowheresYardNorthPath()
{
	executePathArray(["TO507.R", "TO508.R", "TO509.R"]);
}

function nowheresPassSouthPath()
{
	executePathArray(["TO492.R", "TO494A.N", "TO493.R"]);
}

function nowheresPassNorthPath()
{
	executePathArray(["TO509.N"]);
}

function nowheresPassThru()
{
	nowheresPassNorthPath();
	nowheresPassSouthPath();
}

function nowheresMain1Thru()
{
	nowheresMain1NorthPath();
	nowheresMain1SouthPath();
}

function nowheresMain2Thru()
{
	nowheresMain2NorthPath();
	nowheresMain2SouthPath();
}

function nowheresYardThru()
{
	nowheresYardNorthPath();
	nowheresYardSouthPath();
}
