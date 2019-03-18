const budgetController = (function(){
    
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round(this.value * 100 / totalIncome);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };

    const calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(el) {
            sum += el.value;
        });
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type, id) {
            //Creating an array with all IDs
            const ids = data.allItems[type].map(function(el) {
                return el.id;
            });
            // Getting the index of the item to delete
            const index = ids.indexOf(id);
            // Deleting the item (if index is found)
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            //Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //Calculate the percentage of the income already spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp * 100 / data.totals.inc);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(el) {
                el.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            const allPerc = data.allItems.exp.map(function(el) {
                return el.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        expensesPercentageLabel: '.item__percentage',
        container: '.container'
    };

    const formatNumber = function(num, type) {
        //The purpose is to format numbers nicely: 2345.6789 -> +2,345.68
        num = Math.abs(num);
        num = num.toFixed(2);
        num = Number(num).toLocaleString('en');
        return (type === 'exp' ? '-' : '+') + ' ' + num;
    };

    return {

        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Either inc or exp (see html)
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            //Creating HTML code with exp/inc values
            let html, element;
            const { id, description, value } = obj;
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-${id}">
                            <div class="item__description">${description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(value, type)}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn">
                                        <ion-icon name="close-circle-outline"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        </div>`;
            } else if(type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = `<div class="item clearfix" id="exp-${id}">
                            <div class="item__description">${description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(value, type)}</div>
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

        deleteListItem: function(selectorID) {
            const el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            //Selecting fields to clear
            const fields = document.querySelectorAll(DOMStrings.inputDescription + ' ,' + DOMStrings.inputValue);
            //Coverting returned LIST to ARRAY
            const fieldsArray = Array.prototype.slice.call(fields);
            //Clearing the fields
            for(field of fieldsArray) {
                field.value = '';
            }
            //Returning focus to the description
            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            let type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '----';
            }
        },

        displayPercentages: function(array) {
            const fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);
            const nodeListForEach = function(list, callback) {
                for(let i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
            nodeListForEach(fields, function(field, index) {
                if(array[index] > 0) {
                    field.textContent = array[index] + "%";
                } else {
                    field.textContent = "----";
                }
            });
        },

        getDOMStrings: function() { return DOMStrings; }
    };
})();

const controller = (function(budgetCtrl, UICtrl) {

    const setupEventListeners = function() {
        const DOM = UICtrl.getDOMStrings();
        //Adding event listener to button
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        //Adding event listener to ENTER key
        document.addEventListener("keydown", function(event) {
            if(event.key === "Enter" || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    const updateBudget = function() {
        // 1. Calculate the budget;
        budgetCtrl.calculateBudget();
        // 2. Return the budget;
        const budget = budgetCtrl.getBudget();
        // 3. Display the budget in the UI.
        UICtrl.displayBudget(budget);
    };

    const updatePercentages = function() {
        //Calculate the percentage
        budgetCtrl.calculatePercentages();
        //Read percentages from BudgetController
        const percentages = budgetCtrl.getPercentages();
        //Update the UI with new values
        UICtrl.displayPercentages(percentages);
    };

    const ctrlAddItem = function() {
        // 1. Get the field input data;
        const input = UICtrl.getInput();
        const { type, description, value } = input;
        if(description !== '' && !Number.isNaN(value) && value > 0) {
            // 2. Add the item to the budget controller;
            const newItem = budgetCtrl.addItem(type, description, value);
            // 3. Add the item to the UI;
            UICtrl.addListItem(newItem, type);
            // 4. Clear fields;
            UICtrl.clearFields();
            // 5. Calculate and update budget;
            updateBudget();
            // 6. Calculate and update percentages;
            updatePercentages();
        }

    };

    const ctrlDeleteItem = function(event) {
        let splitID, type, ID;
        //Traversing the DOM in search of the DIV to delete, not very elegantly :(
        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
            splitID = itemID.split("-"); // => array in a format ['inc', '1']
            type = splitID[0]; // => 'exp' or 'inc'
            ID = parseInt(splitID[1]);
        }
        // Delete the item from the data structure
        budgetCtrl.deleteItem(type, ID);
        // Delete the item from the UI
        UICtrl.deleteListItem(itemID);
        // Update and show new budget
        updateBudget();
        // Calculate and update percentages;
        updatePercentages();
    };

    return {
        //App initialization
        init: function() {
            //Adding event listeners
            setupEventListeners();
            //setting everything to 0;
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    };

})(budgetController, UIController);

controller.init();
