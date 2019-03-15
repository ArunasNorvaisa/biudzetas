const budgetController = (function(){
   const Expense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
   };
    const Income = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
   };
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function(type, dec, val) {
            let newItem;
            let ID;
            //Creating new ID equal to the last element's ID+1;
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else if(data.allItems[type][data.allItems[type].length] === 0) {
                ID = 0;
            }
            //Deciding whether the new input is expense or income
            if(type === "exp") {
                newItem = new Expense(ID, dec, val);
            } else if(type === "inc") {
                newItem = new Income(ID, dec, val);
            }
            //Adding new item to the expe/inc list
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    };
})();

const UIController = (function() {
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Either inc or exp (see html)
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        getDOMStrings: function() { return DOMStrings; }
    };
})();

const controller = (function(budgetCtrl, UICtrl) {

    const setupEventListeners = function() {
        const DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener("keydown", function(event) {
            if(event.key === "Enter" || event.which === 13) {
                ctrlAddItem();
            }
        });

    };

    const ctrlAddItem = function() {
        let input;
        let newItem;
        // 1. Get the field input data;
        input = UICtrl.getInput();
        const {type, description, value} = input;

        // 2. Add the item to the budget controller;
        newItem = budgetCtrl.addItem(type, description, value);
        // 3. Add the item to the UI;
        // 4. Calculate the budget;
        // 5. Display the budget in the UI.
    };

    return {
        init: function() {
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
