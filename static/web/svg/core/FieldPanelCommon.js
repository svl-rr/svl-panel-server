function setSensorState(sensorID, sensorState)
{
    if(sensorState == undefined)
		return;

	// like "block123"
	var pathId = sensorID.replace("LS", "block");

	console.log("sensorID: " + sensorID);

	// Some block segments may be identified by class name.
	// This is because some panels have multi-segment blocks.
	blockPaths = svgDocument.getElementsByClassName(pathId);
	for (var i = 0; i < blockPaths.length; i++) {
		var element = blockPaths[i];
		if (sensorState == JMRI_SENSOR_ACTIVE) {
			setStyleSubAttribute(element, "stroke", "red");
		} else {
			setStyleSubAttribute(element, "stroke", "white");
		}
	}

	// Search for any blocks with this as the ID.
	blockElement = svgDocument.getElementById(pathId);

	if (blockElement == null) {
		return;
	}

	if (sensorState == JMRI_SENSOR_ACTIVE) {
		setStyleSubAttribute(blockElement, "stroke", "red");
	} else {
		setStyleSubAttribute(blockElement, "stroke", "white");
	}
}