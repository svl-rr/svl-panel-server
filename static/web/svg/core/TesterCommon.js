/* Shared helpers for the address-range tester/toggler panels
 * (TurnoutTester.svg, TurnoutToggler.svg). */

function promptAndSetField(whichObj, message, validator)
{
    var currentText = getSVGText(whichObj);

    var newText = prompt(message, currentText);

    var value = Number(getDCCAddr(newText));

    if (validator)
        value = validator(value);

    setSVGText(whichObj, "" + value);
}

function validateAddrRange(inAddr)
{
    if (inAddr < 1)
        return 1;
    else if (inAddr > 2044)
        return 2044;
    else
        return inAddr;
}

function validateDelayRange(inDelay)
{
    if (inDelay < 1)
        return 1;
    else if (inDelay > 10)
        return 10;
    else
        return inDelay;
}
