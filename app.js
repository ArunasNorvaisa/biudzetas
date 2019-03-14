const budgetController = (function(){
    //qqq
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

    const DOM = UIController.getDOMStrings();

    const ctrlAddItem = function() {
        // 1. Get the field input data;
        const input = UICtrl.getInput();
        console.log('input:', input)

        // 2. Add the item to the budget controller;
        // 3. Add the item to the UI;
        // 4. Calculate the budget;
        // 5. Display the budget in the UI.
    };

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener("keydown", function(event) {
        if(event.key === "Enter") {
            ctrlAddItem();
        }
    });
})(budgetController, UIController);
