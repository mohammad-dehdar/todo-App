const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const filterButtons = document.querySelectorAll(".filter-todos")
const alertMessage = document.getElementById("alert-message")
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
return Math.floor(Math.random() * Math.random() * Math.pow(10, 15).toString())
}


const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
}

const showAlert = (message, type) => {
    alertMessage.innerHTML = "";
    const alert = document.createElement("p")
    alert.innerHTML = message;
    alert.classList.add("alert")
    alert.classList.add(`alert-${type}`)
    alertMessage.append(alert)
    setTimeout(() => {
        alert.style.display = "none"
    }, 800)
}

const displaytodos = (data) => {
    const todosList = data || todos;

    todosBody.innerHTML = ""
    if (!todosList.length) {
        todosBody.innerHTML = "<tr><td colspan='4'>No Task Found</td></tr>"
        return;
    }

    todosList.forEach(todo => {
        todosBody.innerHTML +=
            `
        <tr>
            <td>${todo.task}</td>
            <td>${todo.date || "No Date"}</td>
            <td>${todo.completed ? "Completed" : "Pending"}</td>
            <td>
                <button onclick="editHandler(+${todo.id})">edit</button>
                <button onclick= "toggleHandler(+${todo.id})">
                    ${todo.completed ? "undo" : "do"}
                </button>
                <button onclick="deleteHandler(+${todo.id})">delete</button>
            </td>
        </tr>
        `
    })
}
displaytodos()

const addHandler = () => {
    const task = taskInput.value;
    const date = dateInput.value;
    const todo = {
        id: generateId(),
        completed: false,
        task,
        date,
    }
    if (task) {
        todos.push(todo);
        taskInput.value = "";
        dateInput.value = "";
        showAlert("Todo Add succesfully", "success")
    } else {
        showAlert("No Todo for Add", "error")
    }
    saveToLocalStorage();
    displaytodos();
}

const editHandler = (id) => {
    const todo = todos.find(todo => todo.id === id);
    taskInput.value = todo.task
    dateInput.value = todo.date
    editButton.style.display = "inline-block"
    addButton.style.display = "none"
    editButton.dataset.id = id;
}

const applyEditHandler = (event) => {
const id = parseInt(event.target.dataset.id);
    const todo = todos.find((todo) => todo.id === id);
    todo.task = taskInput.value;
    todo.date = dateInput.value;
    taskInput.value = ""
    dateInput.value = ""
    addButton.style.display = "inline-block"
    editButton.style.display = "none";
    saveToLocalStorage()
    displaytodos()
    showAlert("todo edited successfully", "success")
}

const toggleHandler = (id) => {
    const todo = todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    saveToLocalStorage();
    displaytodos()
    showAlert("Todo changed successfuly", "success")
};

const deleteHandler = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    todos = newTodos;
    saveToLocalStorage();
    displaytodos();
    showAlert("Todo Delete succesfully", "success")
}

const deleteAllHandler = () => {
    if (todos.length) {
        todos = [];
        saveToLocalStorage();
        displaytodos();
        showAlert("All Todos deleted successfully", "success")
    } else {
        showAlert("No Todo for Delete", "error")
    }
}

const filterHandler = (event) => {
    let filterTodos = null;;
    const filter = event.target.dataset.filter;
    
    switch (filter) {
        case "pending" : 
        filterTodos = todos.filter( (todos) => todos.completed === false)
        break;

        case "completed" : 
        filterTodos = todos.filter( (todos) => todos.completed === true)
        break;

        default :
        filterTodos = todos;
        break;
    }

    displaytodos(filterTodos);
}


window.addEventListener("load", () => displaytodos)
addButton.addEventListener("click", addHandler)
deleteAllButton.addEventListener("click", deleteAllHandler)
editButton.addEventListener("click", applyEditHandler)
filterButtons.forEach(button => { button.addEventListener("click", filterHandler) })