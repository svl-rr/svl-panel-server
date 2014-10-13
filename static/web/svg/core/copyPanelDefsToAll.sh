#!/bin/bash
inputLib="PanelDefs.svg"

if [ -f "$inputLib" ]
then
	echo "$inputLib exists! Finding definitions section..."
	awk '/<defs/,/<\/defs>/' "$inputLib" > /tmp/PanelDefs.tmp

    PANEL_DIR_PATH=../userPanels

	FILES=$PANEL_DIR_PATH/*.svg

	for f in $FILES
	do
		if [[ "$f" != "$inputLib" ]] && [[ "$f" != "$PANEL_DIR_PATH/index.svg" ]] && [[ "$f" != "$PANEL_DIR_PATH/indexAlt.svg" ]];
		then
			echo "Processing file $f"
						
			cp "$f" "$f.orig"
			awk '(NR==1),/<defs/' "$f" > /tmp/f1.tmp
			awk '/<\/defs>/,NevERMatcHthiS' "$f" > /tmp/f2.tmp
			
			awk '$0!~/<defs/' /tmp/f1.tmp > /tmp/f3.tmp
			awk '(NR==2),NevERMatcHthiS' /tmp/f2.tmp > /tmp/f4.tmp
			
			cat /tmp/f3.tmp /tmp/PanelDefs.tmp /tmp/f4.tmp > "$f"
			
			rm /tmp/f1.tmp /tmp/f2.tmp /tmp/f3.tmp /tmp/f4.tmp
		fi
	done
	
	rm /tmp/PanelDefs.tmp
else
	echo "$inputLib does not exist! Source definitions can not be copied to user panels."
fi

