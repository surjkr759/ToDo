//when window loads, run listToDo() and load any todo if already created earlier
window.onload = function() {
    // localStorage.clear();
    listToDo();
}


const listToDo = () => {
    let varId;
    let chDiv;

    let data = getItemFromMyTodoArray();       //handler for get todo
    let checkedData = getItemFromMyCheckedTodoArray();      //handler for getting checkedTodo list
    // console.log('data initially: ' + data);
    // console.log('checked data initially: ' + checkedData); 
    if(data) {
        data.forEach(addTodoInDOM);
    }
    if(checkedData) {
        checkedData.forEach(addTodoInDOM);
    }
}


document.addEventListener('keydown', (event) => {
    const key = event.key;
    const input = document.getElementById('input');
    if(key === 'Enter' && input.value.trim() !== '' && document.activeElement.tagName === 'INPUT'){ //when cursor is in input bar, and input is not blank, and when enter button is pressed, execute beow:
        const x = addItemInMyTodoArray(input.value.trim());             //handler for adding item into local storage
        if(x) addTodoInDOM(input.value);         // handler for creating html elements and displaying them on screen
    }
});

const addItemInMyTodoArray = (value) => {            //responsible for creating or modifying values of myToDo arraylist
    // debugger;
    // localStorage.clear();
    if(getItemFromMyTodoArray(value)) {      //if item already present in mytodo arraylist, generate a prompt on the screen
        alert('Item already added in to-do list');
        return false;
    }
    else if(getItemFromMyCheckedTodoArray(value)) { //if item already present in myCheckedTodo arraylist, generate a prompt on the screen
        alert('Item already checked in to-do list');
        return false;
    }
    else {
        //Immplementing for local data storage

        let data = getItemFromMyTodoArray();       //call getItemFromMyTodoArray handler to get data from list
        data = (data !== false) ? data : [];    //if data present fetch it, else initialise data variable to empty array
        data.push(value);     //push value into data array 
        data = JSON.stringify(data);       //convert data into json string before adding into local storage
        /*
        * localStorage.setItem(<itemname>,<itemvalue>) main method 
        * (predefined method of js) for set item into localstorage
        */
        localStorage.setItem('mytodo', data);   //add data item to mytodo list and store in localstorage
        //Implementation for local data storage end
    } 
    return true;   
}

const addItemInMyCheckedTodoArray = (value) => {            //responsible for creating or modifying values of myCheckedToDo arraylist
    // localStorage.clear();
    if(getItemFromMyCheckedTodoArray(value)) {      //if item already present, generate a prompt on the screen
        alert('Item already added in checked to-do list');
    }
    else {
        //Immplementing for local data storage

        let checkedData = getItemFromMyCheckedTodoArray();       //call getItemFromMyCheckedTodoArray handler to get data from list
        checkedData = (checkedData !== false) ? checkedData : [];    //if checkedData present fetch it, else initialise checkedData variable to empty array
        checkedData.push(value);     //push value into checkedData array 
        checkedData = JSON.stringify(checkedData);       //convert checkedData into json string before adding into local storage
        /*
        * localStorage.setItem(<itemname>,<itemvalue>) main method 
        * (predefined method of js) for set item into localstorage
        */
        localStorage.setItem('myCheckedTodo', checkedData);   //add checkedData item to mytodo list and store in localstorage
        //Implementation for local data storage end

        //addTodoInDOM(input.value);         // handler for creating html elements and displaying them on screen
    }    
}

let k=1;    //necessary to declare globally, as it is being used by 2 functions - addTodoInDOM & listToDo 


const getItemFromMyTodoArray = (item = null) => {              /* handler for getting mytodo arraylist*/
    /*
    * localStorage.getItem(<itemname>) main method 
    * (predefined method of js) for getting item from localstorage
    */
   const data = JSON.parse(localStorage.getItem('mytodo'));     //get the mytodo list and convert JSON string to object before storing in variable
   if(data) {                               //if data is present then proceed further or return false
        if(item) {                          //if item being passed is not null, proceed further or return data array object 
            let ind = data.indexOf(item);   //find index of item in data array object
            if(data.indexOf(item) !== -1)   //if item present in data, return the node, or return false
                return data[ind];
            else
                return false;
        }
        return data;
   }
   return false;
}

const getItemFromMyCheckedTodoArray = (item = null) => {           /* handler for getting myCheckedTodo arraylist*/
    /*
    * localStorage.getItem(<itemname>) main method 
    * (predefined method of js) for getting item from localstorage
    */
   const checkedData = JSON.parse(localStorage.getItem('myCheckedTodo'));     //get the mytodo list and convert JSON string to object before storing in variable
   if(checkedData) {                               //if data is present then proceed further or return false
        if(item) {                          //if item being passed is not null, proceed further or return data array object 
            let ind = checkedData.indexOf(item);   //find index of item in data array object
            if(checkedData.indexOf(item) !== -1)   //if item present in data, return the node, or return false
                return checkedData[ind];
            else
                return false;
        }
        return checkedData;
   }
   return false;
}

const addTodoInDOM = (value) => { //function for iterating and fetching each todo element, either from mytodo or myCheckedTodo arraylist, using local data storage to display on the screen
    let varId = "item" + k;     //fetch current k and initialise the variables accordingly
    let chDiv = "div" + k;

    const div = document.getElementById('list');    // grand parent div

    const newDiv = document.createElement('div');   // dynamically creating a div for each todo
    newDiv.setAttribute('id', `${chDiv}`);
    newDiv.setAttribute('class', 'newDiv');

    const chbox = document.createElement('input');  // dynamically creating a checkbox in newDiv for each todo
    chbox.setAttribute('type', 'checkbox');
    chbox.setAttribute('id', `${varId}`);
    chbox.setAttribute('name', `${varId}`);
    chbox.setAttribute('class', 'checkbox');

    const item = document.createElement('label');   // dynamically creating a label for checkbox in newDiv for each todo
    item.setAttribute('for', `${varId}`);
    item.setAttribute('class', 'items');
    item.innerText = value;

    newDiv.append(chbox);                           //appending checkbox & label to newDiv
    newDiv.append(item);

    if(getItemFromMyCheckedTodoArray(value) === false) {           //if value is not present in myCheckedTodo arraylist then do this
        chbox.addEventListener('click', perform);       // on clicking checkbox, do perform functions
        div.prepend(newDiv);                            //prepending the newDiv to grand parent div
    } 
    else {                                          //if value is present in myCheckedTodo arraylist then do this
        newDiv.classList.add('checkedDiv');          //add a strikethrough the label
        const del = createDelButton();              //create a delete button
        newDiv.append(del);                         //append the del button in newDiv element
        del.addEventListener('click', removeItemFromMyCheckedTodoArray);   //perform removeItemFromMyCheckedTodoArray fn when del button is clicked
        del.addEventListener('click', deleteFromDOM);   //perform deleteFromDOM fn when del button is clicked
        newDiv.children[0].setAttribute('checked', 'checked');      //checkbox is set to checked by default
        chbox.addEventListener('click', undo);       // on clicking checkbox, do undo functions
        div.append(newDiv);                            //prepending the newDiv to grand parent div
    }

    const input = document.getElementById('input');
    input.value = '';       //clear the input field once enter button is pressed
    k++;
}

const perform = (event) => {                    //when checkbox is clicked to be checked, perform this fn
    const val = event.target.checked;
    if(val) {       // proceed inside only if checkbox is checked
        const parentDiv = event.target.parentNode;      //parent div of corresponding checkbox
        parentDiv.classList.add('checkedDiv');          //add a strikethrough the label
        parentDiv.addEventListener('change', blink);    //blink for few milliseconds

        const gparentDiv = parentDiv.parentNode;        //to remove the checked element from its current position and append it at last
        gparentDiv.removeChild(parentDiv);
        gparentDiv.appendChild(parentDiv);

        removeItemFromMyTodoArray(event);               //fn removes the item from mytodo arraylist
        // console.log("Checked Item: " + parentDiv.children[1].innerText);
        addItemInMyCheckedTodoArray(parentDiv.children[1].innerText);    //fn appends the item in myCheckedTodo arraylist

        const del = createDelButton();                  //create del button and append in parent div
        parentDiv.append(del);

        // const r = del.addEventListener('click', removeItemFromMyCheckedTodoArray) === undefined ? false : true;   //on clicking delete, if removeItemFromMyTodoArray fn returns undefined, set r to false, else true
        del.addEventListener('click', removeItemFromMyCheckedTodoArray);   //on clicking delete, remove the item from myCheckedTodo arraylist
        del.addEventListener('click', deleteFromDOM);       //on clicking delete, remove the item from DOM as well

        parentDiv.children[0].addEventListener('click', undo);  //if checkbox is clicked, perform undo function
    }
}

const createDelButton = () => {         //fn to create del button
    const del = document.createElement('div');      //to create a div for delete button
    del.setAttribute('id', 'delete'+k);
    del.setAttribute('class', 'delete');
    const img = document.createElement('img');      //create a img tag, set image
    img.setAttribute('src', 'delete.png');
    img.setAttribute('alt', 'Del');
    del.append(img);                                //append img tag to the div
    return del;
}

const removeItemFromMyTodoArray = (event) => {
    const parent = event.target.parentNode;
    const item = parent.children[1].innerText;      //get the label value of checkbox

    const data = getItemFromMyTodoArray();                         //handler for get item from mytodo arraylist
    if(data) {
        let newData = data.filter((v, i) => { return v !== item });     //apply filter function for each element of the data array, and return a new array with item not in it
        newData = JSON.stringify(newData);          //convert to JSON string before storing into local storage
        localStorage.setItem('mytodo', newData);
    } else {
        alert('no data found');
    }

    return true;
}

const removeItemFromMyCheckedTodoArray = (event) => {       //self-explanatory by name
    let parent;
    const attr = event.target.parentNode.getAttribute('class');     //this fn is being accesses twice, one when del button is clicked, and other instance when checkbox is unchecked, hence for their implication:
    if(attr === 'delete')       //when del button is clicked, parent set as below, or execute else part
        parent = event.target.parentNode.parentNode;
    else
        parent = event.target.parentNode;
    
    const item = parent.children[1].innerText;      //get the label value of checkbox
    const data = getItemFromMyCheckedTodoArray();                         //handler for get todo
    if(data) {
        let newData = data.filter((v, i) => { return v !== item });     //apply filter function for each element of the data array, and return a new array with item not in it
        newData = JSON.stringify(newData);          //convert to JSON string before storing into local storage
        localStorage.setItem('myCheckedTodo', newData);
    } else {
        alert('no data found');
    }
    
    return true;
}

const deleteFromDOM = (event) => {      // function to remove the element from DOM
    const parent = event.target.parentNode.parentNode;
    const gparent = event.target.parentNode.parentNode.parentNode;
    const item = parent.children[1].innerText;      //get the label value of checkbox
    gparent.removeChild(parent);                    //remove the parent div from the list
}

const undo = (event) => {                   //function to perform when checkbox is unchecked
    // debugger;
    const val = event.target.checked;
    if(!val) {                              //if checked box is clicked to uncheck, perform below:
        const parentDiv = event.target.parentNode;
        parentDiv.classList.remove('checkedDiv');       //remove strikethrough in label
        parentDiv.addEventListener('change', blink);    //blink when checkbox is clicked to uncheck

        const del = parentDiv.children[2];              //when checkbox is clicked to uncheck, remove the delete button
        parentDiv.removeChild(del);

        const gparentDiv = parentDiv.parentNode;        //remove the child from list, and prepend it at the beginning of the list
        gparentDiv.removeChild(parentDiv);
        gparentDiv.prepend(parentDiv);

        removeItemFromMyCheckedTodoArray(event);        //remove item from myCheckedTodo arraylist and add it in myTodo arraylist
        addItemInMyTodoArray(parentDiv.children[1].innerText);

        event.target.addEventListener('click', perform) //when the checkbox is clicked again, do perform function
    }
}

const blink = (event) => {
    const div = event.target;               //checkbox
    div.classList.add('blinkItem');

    //stop blinking after 2 seconds
    setTimeout(() => {
        div.classList.remove('blinkItem');  //remove blink effect after 700 ms
    }, 700);
}
