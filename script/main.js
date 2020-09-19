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
    const temp = [];
    let numbers = '';
    let expression = [];
    let expressionIndex = 0;


    function getHtml() {
        outHtml.history = getS('.calculator__history_info_output')
        outHtml.main = getS('.calculator__main_info_output')
    };

    function event() {
        getS('.calculator__button_container').addEventListener('click', e => {
            if (e.target.classList.contains('calculator__button')) {
                calc(e.target.getAttribute('data-value'))
            }
        })
    };

    function save(data) {

    };
    
    function evaluate(str){
        let result;
        
        let numRegExp = /d+\.?d?/
        console.log(numRegExp.test(str))
        
    }
    
    function calc(type) {
        if (type === 'c') {
            innerData = ''

        } else if (type === '=') {
            let oldInnerData = innerData;
            console.log('here')
            evaluate(innerData)
           
        } else {
            temp.push(numbers)
            innerData += type
        }

        refresh();
    }

    function refresh() {
        outHtml.main.textContent = innerData;
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
