const todoText = document.getElementById("to-do");
const listContainer = document.getElementById("todo-list");
const toDoContainer = document.getElementById("todo-container");
let clearButtonCreated = false;

document.addEventListener("DOMContentLoaded", function () {
  loadToDoListFromLocalStorage();
});

todoText.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    createNewTodo();

    //create clear button as soon as item add on the list
    if (!clearButtonCreated) {
      clearButtonCreated = true;
      createClearButton();
    }
  }
});

listContainer.addEventListener("change", function (event) {
  if (event.target.tagName === "INPUT") {
    // Toggle the "completed" class on the parent LI element based on checkbox state
    const listItem = event.target.parentElement;
    const isChecked = event.target.checked;
    listItem.classList.toggle("completed", isChecked);

    //if the items is chekced push to bottom
    reorderTodoList(listItem, isChecked);
  }
});

function createClearButton() {
  clearButtonCreated = true;
  const clearButton = document.createElement("button");
  clearButton.innerText = "Clear All";
  toDoContainer.append(clearButton);

  clearButton.addEventListener("click", function () {
    // Implement the logic to clear all todos
    const allLists = document.querySelectorAll("ul>li");
    allLists.forEach((list) => list.remove());

    // Reset the clearButtonCreated flag and remove local stroge adn clear button
    clearButtonCreated = false;

    localStorage.removeItem("todoItems");

    if (!clearButtonCreated) {
      clearButton.remove();
    }
  });
}

function createNewTodo() {
  const newTodo = document.createElement("li");
  newTodo.innerText = todoText.value;
  listContainer.prepend(newTodo);

  const checkmark = document.createElement(`input`);
  checkmark.type = "checkbox";
  newTodo.appendChild(checkmark);

  saveToDoListLocalStorage();

  todoText.value = "";
}

function saveToDoListLocalStorage() {
  let todoItems = listContainer.innerHTML;
  localStorage.setItem("todoItems", todoItems);
}

function loadToDoListFromLocalStorage() {
  if (localStorage.getItem("todoItems")) {

    //get all the items from local storage and insert to ul
    let savedLocalStorageItems = localStorage.getItem("todoItems");
    listContainer.innerHTML = savedLocalStorageItems;

    //there was issue with checkboxes, all of them comes with unchecked
    //this one checked their parent element if they has compled class it makes checked again
    const checkboxes = listContainer.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
      const listItem = checkbox.parentElement;
      const isChecked = listItem.classList.contains("completed");
      checkbox.checked = isChecked;
    });

    createClearButton();
  }
}

function reorderTodoList(listItem, isChecked) {
  // Check if the parent LI element has the "completed" class after toggling
  if (isChecked) {
    // If it has the "completed" class, move it to the end of the list
    listContainer.appendChild(listItem);
  } else {
    // If it doesn't have the "completed" class, move it to the beginning of the list
    listContainer.prepend(listItem);
  }

  // Save the updated todo list to local storage
  saveToDoListLocalStorage();
}
