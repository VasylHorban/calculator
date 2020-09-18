const getS = selector => document.querySelector(selector);

function generate(){
    let arr = ['1','2','3','+','-','4','5','6','*','/','7','8','9','(',')','.','0','00', '^', 'sqrt', 'cos', 'sin', 'c', '=','history'];
    arr.forEach(data => {
        let btn = document.createElement('button');
        btn.setAttribute('data-value', data);
        btn.classList.add('calculator__button')
        btn.textContent = data;
        getS('.calculator__button_container').append(btn);
    })
}
generate();

const calculatorModule = (function(){
    const histori = [];
    const outHtml = {};
    const tempHistory =[];
    let innerData = '';
    
    
    function getHtml(){
        outHtml.history = getS('.calculator__history_info_output') 
        outHtml.main = getS('.calculator__main_info_output') 
    };
    function event(){
        getS('.calculator__button_container').addEventListener('click', e => {
            if(e.target.classList.contains('calculator__button')){
                culc(e.target.getAttribute('data-value'))
            }
        })
    };
    function save(data){
        histori.push(data)
        tempHistory.push(data)
    }
    function culc(type){
        let data;
        if(!isNaN(parseInt(type))){
            innerData += type
            
            
        }else{
            save(innerData)

        }
        refresh();
    }
    
    
    
    function refresh(){
        outHtml.main.textContent = innerData;
        console.log(tempHistory.length)
        console.log(tempHistory)
        if(tempHistory.length > 1){
            let out = '';
            tempHistory.forEach((elem, i )=>{
               if((tempHistory.length - 1) == i )
                out += elem
            })
            outHtml.history.textContent = out;
        }
    }
    
    function init(){
        event();
        getHtml()
    };
    return {
        init:init
    };
})();

calculatorModule.init();