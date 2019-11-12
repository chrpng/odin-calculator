const multiply = (x, y) => {
    return parseFloat(x) * parseFloat(y);
}
const divide = (x, y) => {
    return parseFloat(x) / parseFloat(y);
}
const add = (x, y) => {
    return parseFloat(x) + parseFloat(y);
}
const subtract = (x, y) => {
    return parseFloat(x) - parseFloat(y);
}

//Regex for any operand with at least 1 digit preceding it
const opReg = /\d+ [\*\/\+\-] \d+/;
//Regex to check if the last input is an operator
const endReg = /[\*\/\+\-]$/;

const multReg = /(\d*(?:\.\d+)?) \* (\d*(?:\.\d+)?)/;
const divReg = /(\d*(?:\.\d+)?) \/ (\d*(?:\.\d+)?)/;
const addReg = /(\d*(?:\.\d+)?) \+ (\d*(?:\.\d+)?)/;
const subReg = /(\d*(?:\.\d+)?) \- (\d*(?:\.\d+)?)/;

const numArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const opArray = ['*', '/', '+', '-'];

const display = document.querySelector('.display');
const subDisplay = document.querySelector('.sub-display');

let displayValue = '0';

const handleKeyDown = (e) => {
    if(numArray.includes(e.key)) {
        populateDisplay('number', e.key);
    } else if(e.key === ".") {
        populateDisplay('decimal', e.key);
    } else if(opArray.includes(e.key)) {
        populateDisplay('operand', e.key);
    } else if(e.key === 'Backspace' || e.key === 'Delete') {
        deleteChar();
    } else if(e.key === '=') {
        performCalculation();
    }
}

const handleClick = (e) => {
    if(e.target.className === 'number') {
        populateDisplay('number', e.target.innerText);
    } else if(e.target.className === 'decimal') {
        populateDisplay('decimal', e.target.innerText);
    } else if(e.target.classList.contains('op')) {
        populateDisplay('operand', e.target.innerText);
    }
}

const deleteChar = () => {
    if(Number(display.innerText)) {
        display.innerText = display.innerText.slice(0, -1);
        // displayValue = displayValue.slice(0, -1);
    }
    if(display.innerText === '') {
        display.innerText = '0';
        // if(displayValue.charAt(length-1) !== '0') {
        //     displayValue = displayValue + '0';
        // }
    }
}

const clearDisplays = () => {
    display.innerText = '0';
    subDisplay.innerText = '';
}

const populateDisplay = (className, input) => {
    //display.innerText holds the last float

    if(className === 'number') {
        //Replace 0 with number input
        if(display.innerText === '0') {
            display.innerText = input;
        } else {
            display.innerText += input;
        }
    } else if(className === 'decimal') {
        //Log decimal if decimal isn't already logged
        if(!display.innerText.includes(".")) {
            display.innerText += input;
        }
    } else if(className === 'operand') {
        /* This condition is lengthy because part of the expression can shift 
        from display to subdisplay when an operand is added */
        
        //If the last input is an operand, then replace existing last operand with newest operand
        //last input is operand if subDisplay last char is operand and display is empty
        if(endReg.test(subDisplay.innerText) && display.innerText === '') {
            subDisplay.innerText = subDisplay.innerText.slice(0, -2);
        }

        //Additional styling - the display text moves to the subdisplay and the display is cleared
        if(subDisplay.innerText.includes('=')) {
            //resets subDisplay with new input if expression has been evaluated
            subDisplay.innerText = display.innerText + ' ' + input;
        } else {
            subDisplay.innerText += ' ' + display.innerText + ' ' + input;
        }
        display.innerText = '';
    }
}

const performCalculation = () => {
    let updateFlag = false;

    const opsArray = [
        { string: '*', op: multiply, reg: multReg },
        { string: '/', op: divide, reg: divReg },
        { string: '+', op: add, reg: addReg },
        { string: '-', op: subtract, reg: subReg },
    ]

    //The space at the end of subDisplay.innerText doesn't transfer over in populateDisplay for some reason
    //so I'm manually adding it in here.
    displayValue = subDisplay.innerText + ' ' + display.innerText;

    while (opReg.test(displayValue)) {
        opsArray.forEach((opObject) => {
            if(displayValue.includes(opObject.string)) {
                //Puts regex matched expression and capture groups into array
                expression = opObject.reg.exec(displayValue);
                result = opObject.op(expression[1], expression[2]);
                /* NOTE: The replace fn takes a pattern and a replacement string as input.
                If the pattern is in the form of a regex it will replace all occurrences if the regex's global flag is set. */
                displayValue = displayValue.replace(opObject.reg, result);
                //Rounds result if it would overflows screen
                if(displayValue.length > 10) {
                    displayValue = roundTo10Dec(parseFloat(displayValue), displayValue.length - 10).toString();
                }
                console.log(displayValue);
            }
        })
        updateFlag = true;
    }
    if(updateFlag) {
        //Shows final result on calculator displays
        subDisplay.innerText += ' ' + display.innerText + ' =';
        display.innerText = displayValue;
    }
}

const roundTo10Dec = (num) => {
    return Math.round(num * Math.pow(10, 10)) / Math.pow(10, 10);
}

displayButtons = document.querySelectorAll('.numbers-grid button, .operands-grid button');
displayButtons.forEach((displayButton) => {
    displayButton.addEventListener('click', handleClick);
});

equalButton = document.querySelector('.equals');
equalButton.addEventListener('click', performCalculation)

clearButton = document.querySelector('.clear');
clearButton.addEventListener('click', clearDisplays)

delButton = document.querySelector('.delete');
delButton.addEventListener('click', deleteChar)

document.addEventListener('keydown', handleKeyDown);