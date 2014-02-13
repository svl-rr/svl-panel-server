#!/bin/bash
inputLib="PanelDefs.svg"

if [ -f "$inputLib" ]
then
	echo "$inputLib exists! Finding definitions section..."
	awk '/<defs/,/<\/defs>/' "$inputLib" > /tmp/PanelDefs.tmp
	
	FILES=../userPanels/*.svg
	for f in $FILES
	do
		if [[ "$f" != "$inputLib" ]] && [[ "$f" != "../userPanels/index.svg" ]] && [[ "$f" != "../userPanels/indexAlt.svg" ]];
		then
			echo "Processing $f file..."
						
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
fi

