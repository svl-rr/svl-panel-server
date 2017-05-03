#!/bin/bash
cd ../userPanels
grep 'id="BLOCK' *.svg > blockAddressList.tmp
#remove closing xml tags
perl -p -i -e 's/ \/>//g' blockAddressList.tmp
#remove individual route segment identifiers
perl -p -i -e 's/\.R//g' blockAddressList.tmp
perl -p -i -e 's/\.N//g' blockAddressList.tmp
#remove id
perl -p -i -e 's/id=//g' blockAddressList.tmp
#remove quotes
perl -p -i -e 's/"//g' blockAddressList.tmp
#remove colon
perl -p -i -e 's/://g' blockAddressList.tmp
#remove file extension
perl -p -i -e 's/\.svg//g' blockAddressList.tmp
#remove whitespace
perl -p -i -e 's/ +/ /g' blockAddressList.tmp
#remove index, indexAlt, PanelDefs.svg and TrsinLabel entries
perl -p -i -e 's/^index\s.*$//g' blockAddressList.tmp
perl -p -i -e 's/^indexAlt\s.*$//g' blockAddressList.tmp
perl -p -i -e 's/PanelDefs\sBLOCK\d+[A-Z]?//g' blockAddressList.tmp
perl -p -i -e 's/.*BLOCK\d+[A-Z]?TrainLabel.*$//g' blockAddressList.tmp
grep -v "^$" blockAddressList.tmp > blockAddressList3.tmp
mv blockAddressList3.tmp blockAddressList.tmp
#sort results
sort -d blockAddressList.tmp > blockAddressList2.tmp
mv blockAddressList2.tmp blockAddressList.tmp
#remove duplicates
perl -ne 'print unless $seen{$_}++' blockAddressList.tmp > blockAddressSegmentsByPanel.txt
rm blockAddressList.tmp
#find unique addresses
cp blockAddressSegmentsByPanel.txt blockAddressByPanel.tmp
perl -p -i -e 's/[A-Z]$//g' blockAddressByPanel.tmp
#remove duplicates
perl -ne 'print unless $seen{$_}++' blockAddressByPanel.tmp > blockAddressUniqueByPanel.txt
rm blockAddressByPanel.tmp
#find layout unique
cp blockAddressUniqueByPanel.txt blockAddressLayoutUnique.txt
perl -p -i -e 's/^\w+\sBLOCK//g' blockAddressLayoutUnique.txt
sort -g blockAddressLayoutUnique.txt > blockAddressLayoutUnique.tmp
perl -ne 'print unless $seen{$_}++' blockAddressLayoutUnique.tmp > blockAddressLayoutUnique.txt
rm blockAddressLayoutUnique.tmp
cp blockAddressLayoutUnique.txt dispatchBlocks.txt
#make JMRI config file entries for each turnout found
#cp blockAddressLayoutUnique.txt turnouts.xml
#perl -p -i -e 's/^r\d+\n//g' turnouts.xml
#perl -p -i -e 's/(\d+)/<turnout systemName=\"NT$1\" feedback=\"DIRECT\" inverted=\"false\" automate=\"Default\">\n\t<systemName>NT$1<\/systemName>\n<\/turnout>/g' turnouts.xml
#more blockAddressSegmentsByPanel.txt
#more blockAddressUniqueByPanel.txt
#more blockAddressLayoutUnique.txt
wc -l blockAddressSegmentsByPanel.txt
wc -l blockAddressUniqueByPanel.txt
wc -l blockAddressLayoutUnique.txt
wc -l dispatchBlocks.txt
cd ../core
