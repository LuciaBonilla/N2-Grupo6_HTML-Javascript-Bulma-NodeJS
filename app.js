// VARIABLES GLOBALES

// ELEMENTO DEL HTML.

// Encabezado
const htmlHeader = document.getElementsByClassName("header")[0];
const htmlButtonAddTask = document.getElementsByClassName("header__add-task-button")[0];

const htmlMain = document.getElementsByClassName("main")[0];
// Columnas
const htmlColumnBacklog = document.getElementById("backlog-container");
const htmlColumnToDo = document.getElementById("to-do-container");
const htmlColumnInProgress = document.getElementById("in-progress-container");
const htmlColumnBlocked = document.getElementById("blocked-container");
const htmlColumnDone = document.getElementById("done-container");

// Modal
const htmlTaskModal = document.getElementsByClassName("task-modal")[0];
const htmlTaskModalAddTaskTitle = document.getElementsByClassName("task-modal__title--add-task")[0];
const htmlTaskModalChangeTaskTitle = document.getElementsByClassName("task-modal__title--change-task")[0];

// Inputs
const htmlTaskModalInputTitle = document.getElementById("title");
const htmlTaskModalInputDescription = document.getElementById("description");
const htmlTaskModalInputAssigned = document.getElementById("assigned");
const htmlTaskModalInputPriority = document.getElementById("priority");
const htmlTaskModalInputState = document.getElementById("state");
const htmlTaskModalInputLimitDate = document.getElementById("limit-date");

// Botones del modal
const htmlTaskModalButtonCancelTask = document.getElementsByClassName("task-modal__button-form--cancel")[0];
const htmlTaskModalButtonDeleteTask = document.getElementsByClassName("task-modal__button-form--delete")[0];
const htmlTaskModalButtonAcceptTask = document.getElementsByClassName("task-modal__button-form--accept")[0];

// Listas
const tasksBacklog = [];
const tasksToDo = [];
const tasksInProgress = [];
const tasksBlocked = [];
const tasksDone = [];

//------------------------------------------------------------------------------------------------------------------------

// Clase Tareas

class Tarea {
    constructor(title, description, assigned, priority, state, limitDate) {
        this.id = 1;
        this.title = title;
        this.description = description;
        this.assigned = assigned;
        this.priority = priority;
        this.state = state;
        this.limitDate = limitDate;
    }

    get getId() {
        return this.id;
    }

    // Crea una tarjeta.
    get getCard() {
        const card = document.createElement("article");
        card.id = this.id;
        card.classList.add("main__card");

        card.innerHTML = `
                <h4 class="main__card-title">${this.title}</h4>
                <p class="main__card-description">
                    <i class="fa-regular fa-pen-to-square"></i>
                    ${this.description}
                </p>
                <p class="main__card-assigned">
                    <i class="fa-solid fa-user"></i>
                    ${this.assigned}
                </p>
                <p class="main__card-priority">
                    <i class="fa-solid fa-star"></i>
                    ${this.priority}
                </p>
                <p class="main__card-limit-date">
                    <i class="fa-regular fa-calendar-days"></i>
                    ${this.limitDate}
                </p>`;
        return card;
    }

    editSelf() {
        this.title = htmlTaskModalInputTitle.innerHTML;
        this.description = htmlTaskModalInputDescription.innerHTML;
        thi
        d
    }
};

// FUNCIONES
function addTask() {

    const newTask = new Tarea(
        htmlTaskModalInputTitle.value,
        htmlTaskModalInputDescription.value,
        htmlTaskModalInputAssigned.value,
        htmlTaskModalInputPriority.value,
        htmlTaskModalInputState.value,
        htmlTaskModalInputLimitDate.value
    );

    const state = htmlTaskModalInputState.value;
    let column;
    let list;

    switch (state) {
        case "Backlog":
            column = htmlColumnBacklog;
            list = tasksBacklog;
            break;
        case "To Do":
            column = htmlColumnToDo;
            list = tasksToDo;
            break;
        case "In Progress":
            column = htmlColumnInProgress;
            list = tasksInProgress;
            break;
        case "Blocked":
            column = htmlColumnBlocked;
            list = tasksBlocked;
            break;
        case "Done":
            column = htmlColumnDone;
            list = tasksDone;
            break;
    }
    list.push(newTask);
    column.appendChild(newTask.getCard);
};

function editTask(editId, editState) {
    let list;
    let column;
    switch (editState) {
        case "Backlog":
            column = htmlColumnBacklog;
            list = tasksBacklog;
            break;
        case "To Do":
            column = htmlColumnToDo;
            list = tasksToDo;
            break;
        case "In Progress":
            column = htmlColumnInProgress;
            list = tasksInProgress;
            break;
        case "Blocked":
            column = htmlColumnBlocked;
            list = tasksBlocked;
            break;
        case "Done":
            column = htmlColumnDone;
            list = tasksDone;
            break;
    }

    list.array.forEach(task => {
        if (task.id === editId) {
            task.editSelf();
        }
    });;
}

//-------------------------------------------------------------------------------------------------------------
// EVENTOS

// Para el botón de Agregar tarea
htmlButtonAddTask.addEventListener("click", function () {
    // Oculta la pantalla principal.
    htmlHeader.style.display = "none";
    htmlMain.style.display = "none";

    // Muestra el modal en modo Agregar tarea.
    htmlTaskModal.style.display = "block";

    // Muestra el título correspondiente (el de agregar tarea).
    htmlTaskModalAddTaskTitle.style.display = "block";
    htmlTaskModalChangeTaskTitle.style.display = "none";

    // Oculta el botón de eliminar y hace un acomodo al botón de cancelar.
    htmlTaskModalButtonDeleteTask.style.display = "none";
    htmlTaskModalButtonCancelTask.style.gridColumnStart = "1";
    htmlTaskModalButtonCancelTask.style.gridColumnEnd = "3";
});

// Para el botón Aceptar tarea.
htmlTaskModalButtonAcceptTask.addEventListener("click", function (event) {
    // Crea la tarea y pone la tarjeta en la columna correspondiente.
    addTask();

    // Muetra la página principal y oculta el modal.
    htmlHeader.style.display = "block";
    htmlMain.style.display = "block";
    htmlTaskModal.style.display = "none";

    // Para evitar el submit.
    event.preventDefault();

    //Eliminar lo ingresado en los inputs
    var modalFields = document.querySelectorAll("input");
    modalFields.forEach(field => {
        field.value = "";
    });
});