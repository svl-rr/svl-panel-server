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
#remove whitespace
perl -p -i -e 's/         / /g' turnoutAddressList.tmp
perl -p -i -e 's/        / /g' turnoutAddressList.tmp
perl -p -i -e 's/       / /g' turnoutAddressList.tmp
perl -p -i -e 's/      / /g' turnoutAddressList.tmp
perl -p -i -e 's/     / /g' turnoutAddressList.tmp
perl -p -i -e 's/    / /g' turnoutAddressList.tmp
perl -p -i -e 's/   / /g' turnoutAddressList.tmp
perl -p -i -e 's/  / /g' turnoutAddressList.tmp
#remove duplicates
perl -ne '0==$H{$_}++ or print' < turnoutAddressList.tmp > turnoutAddressIndivid.tmp
rm turnoutAddressList.tmp
#find unique addresses
cp turnoutAddressIndivid.tmp turnoutAddressUnique.tmp
perl -p -i -e 's/A$//g' turnoutAddressUnique.tmp
perl -p -i -e 's/B$//g' turnoutAddressUnique.tmp
perl -p -i -e 's/C$//g' turnoutAddressUnique.tmp
perl -p -i -e 's/D$//g' turnoutAddressUnique.tmp
perl -p -i -e 's/E$//g' turnoutAddressUnique.tmp
perl -p -i -e 's/F$//g' turnoutAddressUnique.tmp
perl -p -i -e 's/G$//g' turnoutAddressUnique.tmp
perl -p -i -e 's/H$//g' turnoutAddressUnique.tmp
#remove duplicates
#perl -ne '0==$H{$_}++ or print' < turnoutAddressUnique.tmp > turnoutAddressUniqueOut.tmp
#mv turnoutAddressUniqueOut.tmp turnoutAddressUnique.tmp
more turnoutAddressUnique.tmp

