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
            {id: 0, name: 'Fish salad', calories: '450'},
            {id: 0, name: 'Coffee', calories: '300'},
            {id: 0, name: 'Eggs', calories: '150'}
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
        logData: function(){
            return data
        }
    }
})()

const UICtrl = (() => {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemcaloriesInput: '#item-calories'
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
    }

   const itemAddSubmit = (e) => {
      e.preventDefault()
        const input = UICtrl.getItemInput()
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem)
            UICtrl.clearInput()
        } 
    }

    return {
        init: function(){
            const items = Item.getItems()
            if(!items.length){
                UICtrl.hideList()
            } else {
                UI.populateItems(items)
            }
            
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl)

App.init()