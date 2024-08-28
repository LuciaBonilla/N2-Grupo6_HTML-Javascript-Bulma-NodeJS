// *** VARIABLES GLOBALES ***

// *** ELEMENTOS DEL HTML

// -> Encabezado.
const HTML_HEADER = document.getElementsByClassName("header")[0];
const HTML_BUTTON_ADD_TASK = document.getElementsByClassName("header__add-task-button")[0];

const HTML_MAIN = document.getElementsByClassName("main")[0];

// -> Contenedores para las tareas en cada columna.
const HTML_CONTAINER_BACKLOG = document.getElementsByClassName("task-column__container--backlog")[0];
const HTML_CONTAINER_TO_DO = document.getElementsByClassName("task-column__container--to-do")[0];
const HTML_CONTAINER_IN_PROGRESS = document.getElementsByClassName("task-column__container--in-progress")[0];
const HTML_CONTAINER_BLOCKED = document.getElementsByClassName("task-column__container--blocked")[0];
const HTML_CONTAINER_DONE = document.getElementsByClassName("task-column__container--done")[0];

// -> Modal.
const HTML_TASK_MODAL = document.getElementsByClassName("task-modal")[0];

//      -> Títulos.
const HTML_TASK_MODAL_ADD_TASK_TITLE = document.getElementsByClassName("task-modal__title--add-task")[0];
const HTML_TASK_MODAL_CHANGE_TASK_TITLE = document.getElementsByClassName("task-modal__title--change-task")[0];

//      -> Inputs del modal.
const HTML_TASK_MODAL_INPUT_TITLE = document.getElementById("title");
const HTML_TASK_MODAL_INPUT_DESCRIPTION = document.getElementById("description");
const HTML_TASK_MODAL_INPUT_ASSIGNED = document.getElementById("assigned");
const HTML_TASK_MODAL_INPUT_PRIORITY = document.getElementById("priority");
const HTML_TASK_MODAL_INPUT_STATE = document.getElementById("state");
const HTML_TASK_MODAL_INPUT_LIMIT_DATE = document.getElementById("limit-date");

//      -> Botones del modal.

//          -> Para añadir tarea.
const HTML_ADD_TASK_MODAL_BUTTON_CANCEL_TASK = document.getElementsByClassName("task-form__button--cancel-add-task")[0];
const HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK = document.getElementsByClassName("task-form__button--accept-add-task")[0];

//          -> Para editar tarea.
const HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK = document.getElementsByClassName("task-form__button--delete-change-task")[0];
const HTML_CHANGE_TASK_MODAL_BUTTON_CANCEL_TASK = document.getElementsByClassName("task-form__button--cancel-change-task")[0];
const HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK = document.getElementsByClassName("task-form__button--accept-change-task")[0];

//------------------------------------------------------------------------------------------------------------------------

// ***CLASES***

// ***Clase Task
// Función: Guarda la info y la tarjeta HTML de la tarea.
class Task {
    static #ID = 0;

    // Info de la tarea.
    #id;
    #title;
    #description;
    #assigned;
    #priority;
    #limitDate;
    #state;

    // Elementos HTML de la tarjeta que representa la tarea.
    #HTMLCard; // Encapsula el resto de elementos HTML.
    #HTMLTitle;
    #HTMLDescription;
    #HTMLAssigned;
    #HTMLPriority;
    #HTMLLimitDate;

    constructor() {
        // Inicialización de la info; la toma de los inputs del modal.
        this.#id = ++Task.#ID;
        this.#title = HTML_TASK_MODAL_INPUT_TITLE.value;
        this.#description = HTML_TASK_MODAL_INPUT_DESCRIPTION.value;
        this.#assigned = HTML_TASK_MODAL_INPUT_ASSIGNED.value;
        this.#priority = HTML_TASK_MODAL_INPUT_PRIORITY.value;
        this.#limitDate = HTML_TASK_MODAL_INPUT_LIMIT_DATE.value;
        this.#state = HTML_TASK_MODAL_INPUT_STATE.value;

        // Inicialización de la tarjeta.
        this.#HTMLCard = document.createElement("article");
        this.#HTMLCard.classList.add("task-card");

        this.#HTMLTitle = document.createElement("h4");
        this.#HTMLDescription = document.createElement("p");
        this.#HTMLAssigned = document.createElement("p");
        this.#HTMLPriority = document.createElement("p");
        this.#HTMLLimitDate = document.createElement("p");

        this.#HTMLCard.appendChild(this.#HTMLTitle);
        this.#HTMLCard.appendChild(this.#HTMLDescription);
        this.#HTMLCard.appendChild(this.#HTMLAssigned);
        this.#HTMLCard.appendChild(this.#HTMLPriority);
        this.#HTMLCard.appendChild(this.#HTMLLimitDate);

        // Actualiza el contenido de la tarjeta.
        this.#updateHTMLCard();

        const task = this;
        // Se le asigna un event listener.
        this.#HTMLCard.addEventListener("click", function () {
            TaskManager.changeTaskToEdit(task);
            showChangeTaskModal();
        });
    }

    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get assigned() {
        return this.#assigned;
    }

    get priority() {
        return this.#priority;
    }

    get limitDate() {
        return this.#limitDate;
    }

    get state() {
        return this.#state;
    }

    get HTMLCard() {
        return this.#HTMLCard;
    }

    // Actualiza los atributos de la tarea y la tarjeta HTML.
    updateTask() {
        this.#title = HTML_TASK_MODAL_INPUT_TITLE.value;
        this.#description = HTML_TASK_MODAL_INPUT_DESCRIPTION.value;
        this.#assigned = HTML_TASK_MODAL_INPUT_ASSIGNED.value;
        this.#priority = HTML_TASK_MODAL_INPUT_PRIORITY.value;
        this.#limitDate = HTML_TASK_MODAL_INPUT_LIMIT_DATE.value;
        this.#state = HTML_TASK_MODAL_INPUT_STATE.value;

        this.#updateHTMLCard();
    }

    // Actualiza sólo la tarjeta HTML.
    #updateHTMLCard() {
        this.#HTMLCard.id = `${this.#state}-${this.#id}`;

        this.#HTMLTitle.innerHTML = this.#title;

        this.#HTMLDescription.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            ${this.#description}
        `;

        this.#HTMLAssigned.innerHTML = `
            <i class="fa-solid fa-user"></i>
            ${this.#assigned}
        `;

        this.#HTMLPriority.innerHTML = `
            <i class="fa-solid fa-star"></i>
            ${this.#priority}
        `;

        this.#HTMLLimitDate.innerHTML = `
            <i class="fa-regular fa-calendar-days"></i>
            ${this.#limitDate}
        `;
    }
};

class TaskManager {
    // Tarea que se está editando.
    static #TASK_TO_EDIT;

    // Estado de la tarea que se está editando.
    static #TASK_TO_EDIT_STATE;

    // Listas que guardan las tareas.
    static #BACKLOG = [];
    static #TO_DO = [];
    static #IN_PROGRESS = [];
    static #BLOCKED = [];
    static #DONE = [];

    static get GET_TASK_TO_EDIT() {
        return this.#TASK_TO_EDIT;
    }

    // Cambia la tarea a editar actual por otra.
    static changeTaskToEdit(task) {
        this.#TASK_TO_EDIT = task;
        this.#TASK_TO_EDIT_STATE = task.state;
    }

    // Añande la tarea a backend y a frontend.
    static addTask() {
        const newTask = new Task();
        const newTaskState = newTask.state;
        let container;
        let list;

        switch (newTaskState) {
            case "Backlog":
                container = HTML_CONTAINER_BACKLOG;
                list = this.#BACKLOG;
                break;
            case "To Do":
                container = HTML_CONTAINER_TO_DO;
                list = this.#TO_DO;
                break;
            case "In Progress":
                container = HTML_CONTAINER_IN_PROGRESS;
                list = this.#IN_PROGRESS;
                break;
            case "Blocked":
                container = HTML_CONTAINER_BLOCKED;
                list = this.#BLOCKED;
                break;
            case "Done":
                container = HTML_CONTAINER_DONE;
                list = this.#DONE;
                break;
        }
        list.push(newTask);
        container.appendChild(newTask.HTMLCard);
    };

    // Elimina la tarea a editar de backend y de frontend.
    static deleteTaskToEdit() {
        const taskToDeleteId = this.#TASK_TO_EDIT.id;
        const taskToDeleteState = this.#TASK_TO_EDIT.state;
        let container;
        let list;

        switch (taskToDeleteState) {
            case "Backlog":
                container = HTML_CONTAINER_BACKLOG;
                list = this.#BACKLOG;
                break;
            case "To Do":
                container = HTML_CONTAINER_TO_DO;
                list = this.#TO_DO;
                break;
            case "In Progress":
                container = HTML_CONTAINER_IN_PROGRESS;
                list = this.#IN_PROGRESS;
                break;
            case "Blocked":
                container = HTML_CONTAINER_BLOCKED;
                list = this.#BLOCKED;
                break;
            case "Done":
                container = HTML_CONTAINER_DONE;
                list = this.#DONE;
                break;
        }
        container.removeChild(this.#TASK_TO_EDIT.HTMLCard);
        list.forEach((task, index) => {
            if (task.id === taskToDeleteId) {
                list.splice(index, 1);
                return;
            }
        });
        this.#TASK_TO_EDIT = null;
        this.#TASK_TO_EDIT_STATE = null;
    };

    // Edita la tarea 
    static editTaskToEdit() {
        this.#TASK_TO_EDIT.updateTask();
        this.#moveTaskToEdit();
    };

    // Mueve la tarea de contenedor si corresponde.
    static #moveTaskToEdit() {
        const taskToMoveId = this.#TASK_TO_EDIT.id;
        const taskToMoveOldState = this.#TASK_TO_EDIT_STATE;
        const taskToMoveActualState = this.#TASK_TO_EDIT.state;

        if (taskToMoveOldState !== taskToMoveActualState) {
            let oldContainer;
            let oldList;
            switch (taskToMoveOldState) {
                case "Backlog":
                    oldContainer = HTML_CONTAINER_BACKLOG;
                    oldList = this.#BACKLOG;
                    break;
                case "To Do":
                    oldContainer = HTML_CONTAINER_TO_DO;
                    oldList = this.#TO_DO;
                    break;
                case "In Progress":
                    oldContainer = HTML_CONTAINER_IN_PROGRESS;
                    oldList = this.#IN_PROGRESS;
                    break;
                case "Blocked":
                    oldContainer = HTML_CONTAINER_BLOCKED;
                    oldList = this.#BLOCKED;
                    break;
                case "Done":
                    oldContainer = HTML_CONTAINER_DONE;
                    oldList = this.#DONE;
                    break;
            }

            let newContainer;
            let newList;
            switch (taskToMoveActualState) {
                case "Backlog":
                    newContainer = HTML_CONTAINER_BACKLOG;
                    newList = this.#BACKLOG;
                    break;
                case "To Do":
                    newContainer = HTML_CONTAINER_TO_DO;
                    newList = this.#TO_DO;
                    break;
                case "In Progress":
                    newContainer = HTML_CONTAINER_IN_PROGRESS;
                    newList = this.#IN_PROGRESS;
                    break;
                case "Blocked":
                    newContainer = HTML_CONTAINER_BLOCKED;
                    newList = this.#BLOCKED;
                    break;
                case "Done":
                    newContainer = HTML_CONTAINER_DONE;
                    newList = this.#DONE;
                    break;
            }

            oldList.forEach((task, index) => {
                if (task.id === taskToMoveId) {
                    oldList.splice(index, 1);
                }
            });
            newList.push(this.#TASK_TO_EDIT);

            oldContainer.removeChild(this.#TASK_TO_EDIT.HTMLCard);
            newContainer.appendChild(this.#TASK_TO_EDIT.HTMLCard);
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------
// *** EVENTOS ***

// Muestra el modal en modo Agregar tarea.
function showAddTaskModal() {
    // Oculta la pantalla principal.
    HTML_HEADER.classList.add("hidden");
    HTML_MAIN.classList.add("hidden");

    // Muestra el modal en modo Agregar tarea.
    HTML_TASK_MODAL.classList.remove("hidden");

    // Muestra el título correspondiente.
    HTML_TASK_MODAL_ADD_TASK_TITLE.classList.remove("hidden");
    HTML_TASK_MODAL_CHANGE_TASK_TITLE.classList.add("hidden");

    // Muestra y oculta los botones correspondientes.
    HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK.classList.add("hidden");
    HTML_CHANGE_TASK_MODAL_BUTTON_CANCEL_TASK.classList.add("hidden");
    HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK.classList.add("hidden");
    HTML_ADD_TASK_MODAL_BUTTON_CANCEL_TASK.classList.remove("hidden");
    HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK.classList.remove("hidden");
}

// Muestra el modal en modo Editar tarea.
function showChangeTaskModal() {
    // Oculta la pantalla principal.
    HTML_HEADER.classList.add("hidden");
    HTML_MAIN.classList.add("hidden");

    // Muestra el modal en modo Editar tarea.
    HTML_TASK_MODAL.classList.remove("hidden");

    // Muestra el título correspondiente.
    HTML_TASK_MODAL_ADD_TASK_TITLE.classList.add("hidden");
    HTML_TASK_MODAL_CHANGE_TASK_TITLE.classList.remove("hidden");

    // Muestra y oculta los botones correspondientes.
    HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK.classList.remove("hidden");
    HTML_CHANGE_TASK_MODAL_BUTTON_CANCEL_TASK.classList.remove("hidden");
    HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK.classList.remove("hidden");
    HTML_ADD_TASK_MODAL_BUTTON_CANCEL_TASK.classList.add("hidden");
    HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK.classList.add("hidden");

    // Pone en los inputs los atributos de la tarea actual a editar.
    HTML_TASK_MODAL_INPUT_TITLE.value = TaskManager.GET_TASK_TO_EDIT.title;
    HTML_TASK_MODAL_INPUT_DESCRIPTION.value = TaskManager.GET_TASK_TO_EDIT.description;
    HTML_TASK_MODAL_INPUT_ASSIGNED.value = TaskManager.GET_TASK_TO_EDIT.assigned;
    HTML_TASK_MODAL_INPUT_PRIORITY.value = TaskManager.GET_TASK_TO_EDIT.priority;
    HTML_TASK_MODAL_INPUT_STATE.value = TaskManager.GET_TASK_TO_EDIT.state;
    HTML_TASK_MODAL_INPUT_LIMIT_DATE.value = TaskManager.GET_TASK_TO_EDIT.limitDate;
}

// Muestra la pantalla principal.
function showPrincipalPage() {
    // Muestra la página principal y oculta el modal.
    HTML_HEADER.classList.remove("hidden");
    HTML_MAIN.classList.remove("hidden");
    HTML_TASK_MODAL.classList.add("hidden");
}

// Limpia los inputs.
function cleanInputs() {
    const modalFields = document.querySelectorAll("input");
    modalFields.forEach(field => {
        field.value = "";
    });
}

// *** PÁGINA PRINCIPAL
// -> Botón AGREGAR TAREA en la página principal.
HTML_BUTTON_ADD_TASK.addEventListener("click", function () {
    showAddTaskModal();
});

// *** MODAL AGREGAR TAREA
// -> Botón ACEPTAR en modo Agregar tarea.
HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK.addEventListener("click", function (event) {
    // Para evitar el submit.
    event.preventDefault();

    TaskManager.addTask();
    showPrincipalPage();
    cleanInputs();
});

// -> Botón CANCELAR en modo Agregar tarea.
HTML_ADD_TASK_MODAL_BUTTON_CANCEL_TASK.addEventListener("click", function (event) {
    // Para evitar el submit.
    event.preventDefault();

    showPrincipalPage();
    cleanInputs();
});

// *** MODAL EDITAR TAREA
// -> Botón ACEPTAR en modo Editar tarea.
HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK.addEventListener("click", function (event) {
    // Para evitar el submit.
    event.preventDefault();

    TaskManager.editTaskToEdit();
    showPrincipalPage();
    cleanInputs();
});

// -> Botón CANCELAR en modo Editar tarea.
HTML_CHANGE_TASK_MODAL_BUTTON_CANCEL_TASK.addEventListener("click", function (event) {
    // Para evitar el submit.
    event.preventDefault();

    showPrincipalPage();
    cleanInputs();
});

// -> Botón ELIMINAR en modo Editar tarea.
HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK.addEventListener("click", function (event) {
    // Para evitar el submit.
    event.preventDefault();

    TaskManager.deleteTaskToEdit();
    showPrincipalPage();
    cleanInputs();
});