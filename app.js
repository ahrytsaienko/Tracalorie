// Storage Controller

// Item Controller
const ItemCtrl = (() => {
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure/ State
    const data = {
        items: [
            // { id: 0, name: 'Steak Dinner', calories: 1200 },
            // { id: 1, name: 'Cookie', calories: 400 },
            // { id: 2, name: 'Eggs', calories: 300 }
        ],
        currentItem: null,
        totalCalories: 0
    }

    // for public invoke
    return {
        getItems: function () {
            return data.items;
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            })

            return found;
        },
        getCurrentItem: function(){
            return data.currentItem
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        addItem: function (name, calories) {
            //Create ID
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1
            } else {
                id = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(id, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        logData: function () {
            return data;
        },
        getTotalCalories: function () {
            let total = 0;
            data.items.forEach(function (item) {
                total += item.calories;
            });

            data.totalCalories = total;
            return data.totalCalories;
        }
    }

})();

// UI 
const UICtrl = (function () {

    const UISelectors = {
        //buttons
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',

        //
        itemList: '#item-list',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
    }

    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:
                        <em>${item.calories} Calories</em>
                    </strong>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function () {
            return UISelectors;
        },
        addListItem: function (item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <strong>${item.name}: <em>${item.calories} Calories</em>
            </strong>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
            `;

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        // When 0 items in item list it still the line on UI
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        showTotalCalories: function (total) {
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        // Show edit buttons where click on edit item.
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
    }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
    //Load event listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    }

    const itemAddSubmit = function (e) {
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Show total calories in UI
            UICtrl.showTotalCalories(totalCalories);

            //Clear input fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Edit item. Event delegation
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id; // get only id from all posible

            const listIdArr = listId.split('-'); // item-0
            // Get the actual id
            const id = parseInt(listIdArr[1]);
            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();

        }
        
        e.preventDefault();
    }

    return {
        init: function () {

            // Hide buttons
            UICtrl.clearEditState();
            
            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            };

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Show total calories in UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();

        }
    }

})(ItemCtrl, UICtrl);

App.init();
