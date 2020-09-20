const getS = selector => document.querySelector(selector);

function generate() {
    let arr = ['1', '2', '3', '+', '-', '4', '5', '6', '*', '/', '7', '8', '9', '(', ')', '.', '0', '00', '^', 'sqrt', 'cos', 'sin', 'c', 'history', '='];
    arr.forEach(data => {
        let btn = document.createElement('button');
        if (data == '=') {
            btn.classList.add('calculator__button_equal');
        } else if (data == 'history') {
            btn.classList.add('calculator__button_history');
        } else if (data == 'c') {
            btn.classList.add('calculator__button_clean');
        }
        btn.setAttribute('data-value', data);
        btn.classList.add('calculator__button')
        btn.textContent = data;
        getS('.calculator__button_container').append(btn);
    })
}
generate();




const calculatorModule = (function () {
    const outHtml = {};
    let innerData = '';
    let oldInnerData = '';
    const temp = [];
    let numbers = '';
    let expression = [];
    let expressionIndex = 0;

    let count = 0;

    function getHtml() {
        outHtml.history = getS('.calculator__history_info_output')
        outHtml.main = getS('.calculator__main_info_output')
    };

    function event() {
        getS('.calculator__button_container').addEventListener('click', e => {
            if (e.target.classList.contains('calculator__button')) {
                inner(e.target.getAttribute('data-value'))
            }
        })
    };

    function save(data) {

    };

    function calculate(str) {
        console.log(str)
        let output = getExpression(str);
        console.log(output)
        let result = counting(output);
        return result;

    }

    function getExpression(input) {
        console.log(input.length)
        let output = '';
        let operStack = [];
        for(let i = 0; i < input.length; i++) {
            console.log(i)
            console.log('here')
            if (isDelimeter(input[i])) {
                continue;
            }
            if (!isNaN(parseInt(input[i]))) {
                while (!isDelimeter(input[i]) && !isOperator(input[i])) {
                    output += input[i];
                    i++;
                    if (i == input.Length) break;
                }
                output += " ";
                i--;
            }
            if (isOperator(input[i])) {
                if (input[i] == '(') {
                    operStack.push(input[i]);
                } else if (input[i] == ')') {
                    let s = operStack.pop();
                    while (s != '(') {
                        output += s.toString() + ' '; ///!!!!
                        s = operStack.pop();
                    }
                } else {
                    if (operStack.length > 0) {
                        if (getPriority(input[i]) <= getPriority(operStack[operStack.length - 1])) {
                            output += operStack.pop().toString() + " ";
                        }
                        operStack.push(Number.parseInt(input[i].toString()));
                    }
                }
            }
            console.log(operStack)
            console.log(output)
        }
        console.log(operStack)
        while (operStack.length > 0) {
            output += operStack.pop() + " "
        }

        return output;

    }

    function counting(str) {

    }

    function isDelimeter(c) {
        if ((" =".indexOf(c) != -1)) {
            return true;
        }
        return false;
    }

    function isOperator(c) {///!!!!!
        if (("+-/*^()".indexOf(с) != -1)) {
            return true;
        }
        return false;
    }

    function getPrioryty(s) {
        switch (s) {
            case '(':
                return 0;
            case ')':
                return 1;
            case '+':
                return 2;
            case '-':
                return 3;
            case '*':
                return 4;
            case '/':
                return 4;
            case '^':
                return 5;
            default:
                return 6;
        }
    }

    function inner(type) {
        if (type === 'c') {
            innerData = '0';
            oldInnerData = '';
            refresh();
            count = 0;

        } else if (type.match(/=/)) {
            oldInnerData = innerData;
            innerData = calculate(innerData);
            refresh();

        } else if (!isNaN(parseInt(type)) || type.match(/\.|\(|\)/)) {
            if (innerData == '0') innerData = ''
            innerData += type;
        } else {
            innerData += type;
        }
        refresh();


    }

    function refresh() {

        outHtml.main.textContent = innerData;
        if (oldInnerData != '') {
            outHtml.history.textContent = oldInnerData
        }
    }

    function init() {
        event();
        getHtml()
    };
    return {
        init: init
    };
})();

calculatorModule.init();
