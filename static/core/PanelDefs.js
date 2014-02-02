function panelInit(evt)
{
}

function path1click()
{
    executePathArray(["TO01.N"]);
	setPanelStatus("Path 1 Clicked");
}

function path2click()
{
	executePathArray(["TO01.R", "TO02.N"]);
	setPanelStatus("Path 2 Clicked");
}

function path3click()
{
	executePathArray(["TO01.R", "TO02.R"]);
    
	setPanelStatus("Path 3 Clicked");
}