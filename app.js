const budgetController = (function(){
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }
    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }
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
        addItem: function(type, desc, val) {
            let newItem;
            let ID = 0;
            //Creating new ID equal to the last element's ID + 1
            //Or leaving ID=0 if it's the first element in the array
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            //Deciding whether the new input is expense or income
            if(type === "exp") {
                newItem = new Expense(ID, desc, val);
            } else if(type === "inc") {
                newItem = new Income(ID, desc, val);
            }
            //Adding new item to the exp/inc list
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Either inc or exp (see html)
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        addListItem: function(obj, type) {
            //Creating HTML code with exp/inc values
            let html, element;
            const { id, description, value } = obj;
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = `<div class="item clearfix" id="income-${id}">
                            <div class="item__description">${description}</div>
                            <div class="right clearfix"><div class="item__value">${value}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn">
                                    <ion-icon name="close-circle-outline"></ion-icon>
                                </button>
                            </div>
                        </div>`;
            } else if(type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = `<div class="item clearfix" id="expense-${id}">
                            <div class="item__description">${description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${value}</div>
                                <div class="item__percentage">${value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn">
                                        <ion-icon name="close-circle-outline"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        </div>`;
            }
            //Inserting HTML code to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
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
        // 1. Get the field input data;
        const input = UICtrl.getInput();
        const { type, description, value } = input;

        // 2. Add the item to the budget controller;
        const newItem = budgetCtrl.addItem(type, description, value);
        // 3. Add the item to the UI;
        UICtrl.addListItem(newItem, type);
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
