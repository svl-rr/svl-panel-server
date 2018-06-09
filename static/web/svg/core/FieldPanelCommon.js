function setSensorState(sensorID, sensorState)
{
    if(sensorState == undefined)
		return;

	var pathId = sensorID.replace("LS", "block");
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