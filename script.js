//when window loads, run listToDo() and load any todo if already created earlier
window.onload = function() {
    listToDo();
}


const listToDo = () => {
    let varId;
    let chDiv;

    let data = getData();       //handler for get todo
    console.log('data initially: ' + data);
    if(data) {
        data.forEach(createToDo);
    }
}


document.addEventListener('keydown', (event) => {
    const key = event.key;
    const input = document.getElementById('input');
    if(key === 'Enter' && input.value.trim() !== '' && document.activeElement.tagName === 'INPUT'){ //when cursor is in input bar, and input is not blank, and when enter button is pressed, execute beow:
        setData(input);             //handler for adding item into local storage
    }
});

const setData = (input) => {
    // localStorage.clear();
    if(getData(input.value)) {      //if item already present, generate a prompt on the screen
        alert('Item already added in to-do list');
    }
    else {
        //Immplementing for local data storage

        let data = getData();       //call getData handler to get data from list
        data = (data !== false) ? data : [];    //if data present fetch it, else initialise data variable to empty array
        data.push(input.value);     //push value into data array 
        data = JSON.stringify(data);       //convert data into json string before adding into local storage
        /*
        * localStorage.setItem(<itemname>,<itemvalue>) main method 
        * (predefined method of js) for set item into localstorage
        */
        localStorage.setItem('mytodo', data);   //add data item to mytodo list and store in localstorage
        //Implementation for local data storage end

        createToDo(input.value);         // handler for creating html elements and displaying them on screen
    }    
}

let k=1;    //necessary to declare globally, as it is being used by 2 functions - createToDo & listToDo 

/* handler for get todo  */
const getData = (item = null) => {
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

const createToDo = (value) => { //function for iterating and fetching each todo element using local data storage to display on the screen
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

    chbox.addEventListener('click', perform);       // on clicking checkbox, do perform functions

    const item = document.createElement('label');   // dynamically creating a label for checkbox in newDiv for each todo
    item.setAttribute('for', `${varId}`);
    item.setAttribute('class', 'items');
    item.innerText = value;

    newDiv.append(chbox);                           //appending checkbox & label to newDiv
    newDiv.append(item);

    div.prepend(newDiv);                            //prepending the newDiv to grand parent div
    
    const input = document.getElementById('input');
    input.value = '';       //clear the input field once enter button is pressed
    k++;
}

const perform = (event) => {
    const val = event.target.checked;
    if(val) {       // proceed inside only if checkbox is checked
        const parentDiv = event.target.parentNode;      //parent div of corresponding checkbox
        parentDiv.classList.add('checkedDiv');          //add a strikethrough the label
        parentDiv.addEventListener('change', blink);    //blink for few milliseconds

        const gparentDiv = parentDiv.parentNode;        //to remove the checked element from its current position and append it at last
        gparentDiv.removeChild(parentDiv);
        gparentDiv.appendChild(parentDiv);

        const del = document.createElement('div');      //to create a delete button at RHS
        del.setAttribute('id', 'delete'+k);
        del.setAttribute('class', 'delete');
        const img = document.createElement('img');
        img.setAttribute('src', 'delete.png');
        img.setAttribute('alt', 'Del');
        del.append(img);
        parentDiv.append(del);

        const r = del.addEventListener('click', deleteItem) === undefined ? false : true;   //on clicking delete, if deleteItem fn returns undefined, set r to false, else true
    
        parentDiv.children[0].addEventListener('click', undo);  //if checkbox is clicked, perform undo function
    }
}

const deleteItem = (event) => {
    const parent = event.target.parentNode.parentNode;
    const gparent = event.target.parentNode.parentNode.parentNode;
    const item = parent.children[1].innerText;      //get the label value of checkbox
    gparent.removeChild(parent);                    //remove the parent div from the list

    const data = getData();                         //handler for get todo
    if(data){
        let newData = data.filter((v, i) => { return v !== item });     //apply filter function for each element of the data array, and return a new array with item not in it
        newData = JSON.stringify(newData);          //convert to JSON string before storing into local storage
        localStorage.setItem('mytodo', newData);
    } else {
        alert('no data found');
    }
    return true;
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
