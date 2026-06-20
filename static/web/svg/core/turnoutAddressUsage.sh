#!/bin/bash
cd ../userPanels
mkdir -p reports
grep 'id="TO' *.svg > turnoutAddressList.tmp
#remove closing xml tags
perl -p -i -e 's/ \/>//g' turnoutAddressList.tmp
#remove individual route segment identifiers
perl -p -i -e 's/\.R//g' turnoutAddressList.tmp
perl -p -i -e 's/\.N//g' turnoutAddressList.tmp
#remove id
perl -p -i -e 's/id=//g' turnoutAddressList.tmp
#remove quotes
perl -p -i -e 's/"//g' turnoutAddressList.tmp
#remove colon
perl -p -i -e 's/://g' turnoutAddressList.tmp
#remove file extenstion
perl -p -i -e 's/\.svg//g' turnoutAddressList.tmp
#remove whitespace
perl -p -i -e 's/ +/ /g' turnoutAddressList.tmp
#remove index, indexAlt, PanelDefs.svg entries
perl -p -i -e 's/^index\s.*$//g' turnoutAddressList.tmp
perl -p -i -e 's/^indexAlt\s.*$//g' turnoutAddressList.tmp
perl -p -i -e 's/PanelDefs\sTO\d+[A-Z]?//g' turnoutAddressList.tmp
grep -v "^$" turnoutAddressList.tmp > turnoutAddressList3.tmp
mv turnoutAddressList3.tmp turnoutAddressList.tmp
#sort results
sort -d turnoutAddressList.tmp > turnoutAddressList2.tmp
mv turnoutAddressList2.tmp turnoutAddressList.tmp
#remove duplicates
perl -ne 'print unless $seen{$_}++' turnoutAddressList.tmp > reports/turnoutAddressBlockRoutes.txt
rm turnoutAddressList.tmp
#find unique addresses
cp reports/turnoutAddressBlockRoutes.txt turnoutAddressUnique.tmp
perl -p -i -e 's/[A-Z]$//g' turnoutAddressUnique.tmp
#remove duplicates
perl -ne 'print unless $seen{$_}++' turnoutAddressUnique.tmp > reports/turnoutAddressBlockUnique.txt
rm turnoutAddressUnique.tmp
#find turnouts on dispatch panels
grep 'Dispatch' reports/turnoutAddressBlockUnique.txt > reports/dispatchTurnouts.txt
cp reports/dispatchTurnouts.txt dispatchTurnouts.tmp
perl -p -i -e 's/^\w+\sTO//g' dispatchTurnouts.tmp
sort -g dispatchTurnouts.tmp > dispatchTurnouts2.tmp
perl -ne 'print unless $seen{$_}++' dispatchTurnouts2.tmp > reports/dispatchTurnouts.txt
rm dispatchTurnouts.tmp
rm dispatchTurnouts2.tmp
#find layout unique
cp reports/turnoutAddressBlockUnique.txt reports/turnoutAddressLayoutUnique.txt
perl -p -i -e 's/^\w+\sTO//g' reports/turnoutAddressLayoutUnique.txt
sort -g reports/turnoutAddressLayoutUnique.txt > turnoutAddressLayoutUnique.tmp
perl -ne 'print unless $seen{$_}++' turnoutAddressLayoutUnique.tmp > reports/turnoutAddressLayoutUnique.txt
rm turnoutAddressLayoutUnique.tmp
#make JMRI config file entries for each turnout found
cp reports/turnoutAddressLayoutUnique.txt turnouts.xml
perl -p -i -e 's/^r\d+\n//g' turnouts.xml
perl -p -i -e 's/(\d+)/<turnout systemName=\"NT$1\" feedback=\"DIRECT\" inverted=\"false\" automate=\"Default\">\n\t<systemName>NT$1<\/systemName>\n<\/turnout>/g' turnouts.xml
#more reports/turnoutAddressBlockRoutes.txt
#more reports/turnoutAddressBlockUnique.txt
#more reports/turnoutAddressLayoutUnique.txt
wc -l reports/turnoutAddressBlockRoutes.txt
wc -l reports/turnoutAddressBlockUnique.txt
wc -l reports/turnoutAddressLayoutUnique.txt
wc -l reports/dispatchTurnouts.txt
cd ../core
