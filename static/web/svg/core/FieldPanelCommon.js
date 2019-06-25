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
        for (var cIdx in classes) {
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