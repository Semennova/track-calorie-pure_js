const ItemCtrl = (() => {
    class Item  {
        constructor(id, name, calories){
            this.id = id
            this.name = name
            this.calories = calories
        }
    }
    const data = {
        items: [
            // {id: 0, name: 'Fish salad', calories: '450'},
            // {id: 0, name: 'Coffee', calories: '300'},
            // {id: 0, name: 'Eggs', calories: '150'}
        ],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function(){
            return data.items
        },
        addItem: function(name, calories){
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id +1
            } else {
                ID = 0
            }
            calories = parseInt(calories)
            const newItem = new Item(ID, name, calories)
            data.items.push(newItem)

            return newItem
        },
        getItemById: function(id){
            let found = null
            data.items.forEach(item => {
                if(item.id === id){
                    found = item   
                }
            })
            return found
        }, 

        setCurrentItem: function(item){
            data.currentItem = item
        },

        getCurrentItem: function(){
            return data.currentItem
        },

        getTotalCalories: function(){
            let total = 0
            data.items.forEach(item => {
                total += Number(item.calories)
            })

            data.totalCalories = total

            return data.totalCalories
        },

        updateItem: function(name, calories){
            let found;
            calories = parseInt(calories)
                data.items.forEach(item => {
                    if(item.id === data.currentItem.id){
                        item.name = name
                        item.calories = calories
                        found = item
                    }
                })
            return found

        },

        logData: function(){
            return data
        }
    }
})()

const UICtrl = (() => {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemcaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    return {
        populateItems: function(items){
            let html = ''
            items.forEach((item)=>(
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `))

            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        setButtons: function(){
            UICtrl.clearInput()
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.updateBtn).style.display = 'none'

        },
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
        },
        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block'
            const li = document.createElement('li')
            li.className = 'collection-item'
            li.id=`item-${item.id}`
            li.innerHTML= `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
                </a>
            `
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemcaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showEditState()
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems)
            listItems = Array.from(listItems)
            listItems.forEach(el => {
            let itemID = el.getAttribute('id').split('-')[1]
               if(itemID === String(item.id)){
                    document.querySelector(`#item-${itemID}`).innerHTML= `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `
               }
            })

        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemcaloriesInput).value
            }
        },
        getUISelectors: function(){
            return UISelectors
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemcaloriesInput).value = ''
        }
    }
})()

const App = (function(Item, UI){

    const loadEventListeners = ()=> {
        const UISelectors = UICtrl.getUISelectors()
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)
        document.addEventListener('keypress', (e)=> {
            if(e.keyCode == 13 || e.which === 13){
                e.preventDefault()
                return false
            }
        })
    }

   const itemAddSubmit = (e) => {
      e.preventDefault()
        const input = UICtrl.getItemInput()
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem)
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            UICtrl.clearInput()
        } 
    }

    const itemEditClick = (e) => {
        if(e.target.classList.contains('edit-item')){
            const itemId = e.target.parentNode.parentNode.id
            const id = parseInt(itemId.split('-')[1])
            const itemToEdit = ItemCtrl.getItemById(id)
            ItemCtrl.setCurrentItem(itemToEdit)
            UICtrl.addItemToForm()
        }
    }

    const itemUpdateSubmit = (e) => {
        e.preventDefault()
        const input = UICtrl.getItemInput()
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        UICtrl.updateListItem(updatedItem)
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.setButtons()
    }

    return {
        init: function(){
            UICtrl.setButtons()
            const items = Item.getItems()
            if(!items.length){
                UICtrl.hideList()
            } else {
                UI.populateItems(items)
            }
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl)

App.init()