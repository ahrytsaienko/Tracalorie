// Storage Controller

// Item Controller
const ItemCtrl = (() => {
    const Item = function (add, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure/ State
    const data = {
        items: [
            { id: 0, name: 'Steak Dinner', calories: 1200 },
            { id: 1, name: 'Cookie', calories: 400 },
            { id: 2, name: 'Eggs', calories: 300 }
        ],
        currentItem: null,
        totalCalories: 0
    }

    // for public invoke
    return {
        logData: function(){
            return data;
        }
    }

})();

// UI 
const UICtrl = (function () {
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {

    return {
        init: function(){
            console.log(ItemCtrl.logData());
        }
    }

})(ItemCtrl, UICtrl);

App.init();
