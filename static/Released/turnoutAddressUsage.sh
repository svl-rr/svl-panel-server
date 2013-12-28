#!/bin/bash
grep TO *.svg > turnoutAddressList.tmp
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
#remove PanelDefs entries
perl -p -i -e 's/PanelDefs\sTO\d+[A-Z]?//g' turnoutAddressList.tmp
grep -v "^$" turnoutAddressList.tmp > turnoutAddressList3.tmp
mv turnoutAddressList3.tmp turnoutAddressList.tmp
#sort results
sort -d turnoutAddressList.tmp > turnoutAddressList2.tmp
mv turnoutAddressList2.tmp turnoutAddressList.tmp
#remove duplicates
perl -ne 'print unless $seen{$_}++' turnoutAddressList.tmp > turnoutAddressIndivid.txt
rm turnoutAddressList.tmp
#find unique addresses
cp turnoutAddressIndivid.txt turnoutAddressUnique.tmp
perl -p -i -e 's/[A-Z]$//g' turnoutAddressUnique.tmp
#remove duplicates
perl -ne 'print unless $seen{$_}++' turnoutAddressUnique.tmp > turnoutAddressUnique.txt
rm turnoutAddressUnique.tmp
#more turnoutAddressIndivid.txt
#more turnoutAddressUnique.txt
