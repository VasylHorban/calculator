'use strict'
/**
 * функція для отримання DOM елемента 
 * 
 * @param {string} selector  - селектор дом елемента.
 * @return {object} - DOM елемент
 */
const getS = selector => document.querySelector(selector);
/**
 * Генерує кнопки калькулятора та виводить їх в HTML
 */
function generate() {
    let arr = ['1', '2', '3', '+', '-', '4', '5', '6', '*', '/', '7', '8', '9', '(', ')', '.', '0', '00', '^', 'sqrt', 'cos', 'sin', 'c', '←', '='];
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
/**
 * модуль функціонування калькулятора 
 *  
 * @return {function} init - метод запуску модуля
 */
const calculatorModule = (function () {
    const outHtml = {};
    let innerData = '';
    let oldInnerData = '';
    /**
     * отримує доступ до DOM елементів виводу і записує їх в об'єкт outHtml 
     */
    function getHtml() {
        outHtml.history = getS('.calculator__history_info_output')
        outHtml.main = getS('.calculator__main_info_output')
    };
    /**
     * вішає івент click на кнопки калькулятора, при кліку викликає функцію inner
     */
    function event() {
        getS('.calculator__button_container').addEventListener('click', e => {
            if (e.target.classList.contains('calculator__button')) {
                inner(e.target.getAttribute('data-value'))
            }
        })
    };
    /**
     * запускає функції отримання виразу(RPN) getExpression та обчислення counting
     * 
     * @param {string} str - вираз, введений користувачем
     * @return {number} result - результат обчислення
     */
    function calculate(str) {
        let output = getExpression(str);
        let result = counting(output);
        return result;
    }
    /**
     * обчислює складні оператори(sqrt, cos, sin)
     * 
     * @param {string} num - число (у вигдяді стрічки), яке обчислюється
     * @param {string} oper - ключ-оператор для обчислення
     * @return {number} result - результат обчислення
     */

    function complexOperators(num, oper) {
        let result = '';
        switch (oper) {
            case 'sqrt':
                result = Math.sqrt(parseInt(num));
                break;
            case 'sin':
                result = Math.sin(parseInt(num));
                break;
            case 'cos':
                result = Math.cos(parseInt(num));
                break;
        }
        return result.toFixed(5)
    }
    /**
     * генерує вираз (RPN)
     * 
     * @param {string} input - вираз, введений користувачем
     * @return {string} output - вираз у вигляді (RPN)
     */
    function getExpression(input) {
        let output = '';
        let operStack = [];
        for (let i = 0; i < input.length; i++) {
            if (isDelimeter(input[i])) {
                continue;
            }
            if (input[i].match(/[cosinqrt]/)) {
                let oper = '';
                let num = '';
                while (input[i].match(/[cosinqert]/)) {
                    oper += input[i];
                    i++;
                    if (input[i] === ' ') break;
                }
                if (isDelimeter(input[i])) {
                    i++;
                }
                while (!isNaN(parseInt(input[i]))) {
                    num += input[i];
                    i++;
                    if (input[i] === ' ' || i === input.length) break;
                }
                output += complexOperators(num, oper) + ' ';
            }
            if (!isNaN(parseInt(input[i]))) {
                while (!isDelimeter(input[i]) && !isOperator(input[i])) {
                    output += input[i];
                    i++;
                    if (i == input.length) break;
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
                        output += s.toString() + ' ';
                        s = operStack.pop();
                    }
                } else {
                    if (operStack.length > 0) {
                        if (getPriority(input[i]) <= getPriority(operStack[operStack.length - 1])) {
                            output += operStack.pop().toString() + " ";
                        }

                    }
                    operStack.push(input[i].toString());
                }
            }
        }
        while (operStack.length > 0) {
            output += operStack.pop() + " "
        }
        return output;
    }
    /**
     * обчислює вираз RPN
     * 
     * @param {string} input - вираз RPN
     * @return {string} - коли неможливо обчислити
     * @return {number} - результат обчислення
     */
    function counting(input) {
        let result = 0;
        let temp = [];
        for (let i = 0; i < input.length; i++) {
            if (input[i] == '-' && !isNaN(parseInt(input[i + 1]))) {
                let a = '-';
                i++;
                while (!isDelimeter(input[i]) && !isOperator(input[i])) {
                    a += input[i];
                    i++;
                    if (i == input.length) break;
                }
                if (a.match('.')) {
                    temp.push(parseFloat(a))
                } else {
                    temp.push(parseInt(a))
                }
                i--;
            } else if (!isNaN(parseInt(input[i]))) {
                let a = '';
                while (!isDelimeter(input[i]) && !isOperator(input[i])) {
                    a += input[i];
                    i++;
                    if (i == input.length) break;
                }
                if (a.match('.')) {
                    temp.push(parseFloat(a))
                } else {
                    temp.push(parseInt(a))
                }
                i--;
            } else if (isOperator(input[i])) {
                let a = temp.pop();
                let b = temp.pop();


                switch (input[i]) {
                    case '+':
                        result = b + a
                        break;
                    case '-':
                        result = b - a
                        break;
                    case '*':
                        result = b * a
                        break;
                    case '/':
                        result = b / a
                        break;
                    case '^':
                        result = Math.round(b ** a);
                        break;
                }
                temp.push(result)
            }
        }
        if (isNaN(temp[temp.length - 1])) {
            return '*invalid data';
        };
        return temp[temp.length - 1];
    }
    /**
     * перевіряє чи є аргумент пробілом чи символом "="
     * 
     * @param {string} с - символ, що перевіряється
     * @return {boolean} - результат перевірки
     */
    function isDelimeter(c) {
        if ((" =".indexOf(c) != -1)) {
            return true;
        }
        return false;
    }
    /**
     * перевіряє чи є аргумент оператором 
     * 
     * @param {string} с - символ, що перевіряється
     * @return {boolean} - результат перевірки
     */
    function isOperator(c) {
        if (("+-/*^()".indexOf(c) != -1)) {
            return true;
        }
        return false;
    }
    /**
     * повертає пріорітетність оператора 
     * 
     * @param {string} s - символ, що перевіряється
     * @return {number} - числове значення пріоритетності
     */
    function getPriority(s) {
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
    /**
     * реагує на дії та записує введені користувачем дані, запускаэ функції обчислення calculate та оновлення виводу даних refresh
     * 
     * @param {string} type - введений рядок
     */
    function inner(type) {
        if (oldInnerData != '') {
            oldInnerData = '';
            refresh();
        }
        if (type === 'c') {
            innerData = '0';
            oldInnerData = '';
        } else if (type.match(/=/)) {
            if (innerData !== '') {
                oldInnerData = innerData;
                innerData = calculate(innerData);
            }
        } else if (type === '←') {
            let arr = innerData.split('');
            if (arr[arr.length - 1] === ' ') {
                arr.splice(arr.length - 3, 3)
            } else {
                arr.pop();
            }
            innerData = arr.join('')
        } else if (!isNaN(parseInt(type)) || type.match(/\.|\(|\)/)) {
            if (innerData == '0') innerData = ''
            innerData += type;
        } else {
            innerData += ' ' + type + ' ';
        }
        refresh();
    }
    /**
     * оновлює вивід калькулятора
     */
    function refresh() {

        outHtml.main.textContent = innerData;
        if (oldInnerData != '') {
            outHtml.history.textContent = oldInnerData
        }
        if (innerData == '*invalid data') {
            setTimeout(() => {
                innerData = oldInnerData;
                oldInnerData = ' ';
                refresh();
            }, 2000)
        }
    }
    /**
     * вмикає функціонування модуля
     */
    function init() {
        event();
        getHtml();
    };
    return {
        init: init
    };
})();

calculatorModule.init();
