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
const opReg = /\d+[\*\/\+\-]\d+/;


const multReg = /(\d*(?:\.\d+)?)\*(\d*(?:\.\d+)?)/g;
const divReg = /(\d*(?:\.\d+)?)\/(\d*(?:\.\d+)?)/g;
const addReg = /(\d*(?:\.\d+)?)\+(\d*(?:\.\d+)?)/g;
const subReg = /(\d*(?:\.\d+)?)\-(\d*(?:\.\d+)?)/g;

const display = document.querySelector('.display');
const subDisplay = document.querySelector('.sub-display');

let displayValue = '0';

const clearDisplays = () => {
    displayValue = '0';
    display.innerText = '0';
    subDisplay.innerText = '';
}

const populateDisplay = (e) => {
    //displayValue holds full expression
    //display.innerText holds the last float
    [displayValue, display.innerText] = [displayValue, display.innerText].map((ele) => {
        return ele = (ele === '0' && e.target.className === 'number')
                   ? e.target.innerText
                   : (ele + e.target.innerText);
    })
    //When an operator is used, the display text moves to the subdisplay and the display is cleared
    if(e.target.classList.contains('op')) {
        subDisplay.innerText = displayValue;
        display.innerText = '';
    }
}

const performCalculation = () => {
    while (opReg.test(displayValue)) {
        if (displayValue.includes('*')) {
            //Puts regex matched expression and capture groups into array
            expression = multReg.exec(displayValue);
            result = multiply(expression[1], expression[2]);
            displayValue = displayValue.replace(multReg, result);
        }
        if (displayValue.includes('/')) {
            expression = divReg.exec(displayValue);
            result = divide(expression[1], expression[2]);
            displayValue = displayValue.replace(divReg, result);
        }
        if (displayValue.includes('+')) {
            expression = addReg.exec(displayValue);
            result = add(expression[1], expression[2]);
            displayValue = displayValue.replace(addReg, result);
        }
        if (displayValue.includes('-')) {
            expression = subReg.exec(displayValue);
            result = subtract(expression[1], expression[2]);
            displayValue = displayValue.replace(subReg, result);
        }
    }
    //Shows final result on calculator displays
    subDisplay.innerText = subDisplay.innerText + display.innerText;
    display.innerText = displayValue;
}

displayButtons = document.querySelectorAll('.numbers-grid button, .operations-grid button');
displayButtons.forEach((displayButton) => {
    displayButton.addEventListener('click', populateDisplay);
});

equalButton = document.querySelector('.equals');
equalButton.addEventListener('click', performCalculation)

clearButton = document.querySelector('.clear');
clearButton.addEventListener('click', clearDisplays)