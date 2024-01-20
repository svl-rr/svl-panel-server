To add the red detection indicator on panels that currently do not have detections you must add the following to the respective panel.svg eg silicon.svg near the top but below the script referenceing panelcommon.js

  <script
     xlink:href="/web/svg/core/FieldPanelCommon.js"
     id="field_panel_common"
     type="application/ecmascript" />

Then using either Inkscape or your favorite browsers Dev Tools find the paths you want a particular sensor to stroke red. It may be more than one. For uniformity sake insert the following below id= but above d=

class="sensor sensorname"

where sensorname is the UserName in the sensors table in JRMI.