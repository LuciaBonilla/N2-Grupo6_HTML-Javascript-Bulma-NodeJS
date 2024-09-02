// #region *** VARIABLES GLOBALES ***

// *** ELEMENTOS DEL HTML

// -> Encabezado.
const HTML_HEADER = document.getElementsByClassName("header")[0];
const HTML_BUTTON_ADD_TASK = document.getElementsByClassName("header__add-task-button")[0];

// -> Para el modo oscuro.
const HTML_SWITCH_MODE_BUTTON = document.getElementsByClassName("header__switch-mode-button")[0];
const HTML_EMOJI_MODE = document.getElementsByClassName("fa-solid fa-sun")[0];

// -> Main.
const HTML_MAIN = document.getElementsByClassName("main")[0];

// -> Contenedores para las tareas en cada columna.
const HTML_CONTAINER_BACKLOG = document.getElementsByClassName("task-column__container--backlog")[0];
const HTML_CONTAINER_TO_DO = document.getElementsByClassName("task-column__container--to-do")[0];
const HTML_CONTAINER_IN_PROGRESS = document.getElementsByClassName("task-column__container--in-progress")[0];
const HTML_CONTAINER_BLOCKED = document.getElementsByClassName("task-column__container--blocked")[0];
const HTML_CONTAINER_DONE = document.getElementsByClassName("task-column__container--done")[0];

// Botones para expandir columnas (sólo para Mobile y Tablet).
const HTML_EXPAND_COLUMN_BUTTONS = document.getElementsByClassName("task-column__expand-button");

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
// #endregion

// #region *** CLASES ***

// *** Clase Task
// Función: Guarda la info y la tarjeta HTML de la tarea.
class Task {
    // ID de clase para ayudar a poner IDs individuales a las tareas.
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

    // Método constructor.
    constructor(id, title, description, assigned, priority, limitDate, state) {
        // Esto es en caso de que sea la primera vez que se crea la tarjeta y que no haya sido cargada en el Local Storage.
        if (id === -1) {
            ++Task.#ID;
            id = Task.#ID;
        }

        // Inicialización de la info.
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#assigned = assigned;
        this.#priority = priority;
        this.#limitDate = limitDate;
        this.#state = state;

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
        const card = this.#HTMLCard;

        // Se le asigna events listeners a la tarjeta.

        // Evento para cuando se quiere editar la tarea.
        card.addEventListener("click", function () {
            // Le dice al TaskManager que es la tarea a editar.
            TaskManager.changeTaskToEdit(task);

            // Muestra el modal para editar tarea.
            showChangeTaskModal();
        });

        // Evento para cuando se inicia el arrastre de la tarjeta.
        card.addEventListener("dragstart", function (event) {
            // Le dice al TaskManager que es la tarea a editar.
            TaskManager.changeTaskToEdit(task);

            // Establece los datos que se transferirán en el arrastre, en este caso, la tarjeta.
            event.dataTransfer.setData("text/plain", event.target.id);

            // Indica que se está draggeando.
            card.classList.add("dragging");
        });

        // Evento para cuando se termina el arrastre de la tarjeta.
        card.addEventListener("dragend", function () {
            // Indica que no se está draggeando.
            card.classList.remove("dragging");
        });
    }

    // Getters y setters.
    static set ID(id) {
        if (typeof id === "number") {
            Task.#ID = id;
        }
    }

    static get ID() {
        return Task.#ID;
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

    set state(newState) {
        if (newState === "Backlog" || newState === "To Do" || newState === "In Progress" || newState === "Blocked" || newState === "To Do") {
            this.#state = newState;
        }
    }

    get state() {
        return this.#state;
    }

    get HTMLCard() {
        return this.#HTMLCard;
    }

    // Actualiza los atributos de la tarea y la tarjeta HTML.
    updateTask(title, description, assigned, priority, limitDate, state) {
        this.#title = title;
        this.#description = description;
        this.#assigned = assigned;
        this.#priority = priority;
        this.#limitDate = limitDate;
        this.#state = state;
        this.#updateHTMLCard();
    }

    // Actualiza sólo la tarjeta HTML.
    #updateHTMLCard() {
        this.#HTMLCard.id = `task-card_${this.#id}`;
        this.#HTMLCard.draggable = true;

        this.#HTMLTitle.innerHTML = this.#title;
        this.#HTMLTitle.classList.add("task-card__title");

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

// *** Clase TaskManager
// Función: Guarda las tareas y las administra; las crea, destruye y actualiza.
class TaskManager {
    // Tarea actual que se está editando.
    static #TASK_TO_EDIT;

    // Estado de la tarea actual que se está editando.
    static #TASK_TO_EDIT_STATE;

    // Listas que guardan las tareas.
    static #BACKLOG = [];
    static #TO_DO = [];
    static #IN_PROGRESS = [];
    static #BLOCKED = [];
    static #DONE = [];

    // Getters.
    static get TASK_TO_EDIT() {
        return this.#TASK_TO_EDIT;
    }

    static get BACKLOG() {
        return this.#BACKLOG;
    }

    static get TO_DO() {
        return this.#TO_DO;
    }

    static get IN_PROGRESS() {
        return this.#IN_PROGRESS;
    }

    static get BLOCKED() {
        return this.#BLOCKED;
    }

    static get DONE() {
        return this.#DONE;
    }

    // Cambia la tarea a editar actual por otra.
    static changeTaskToEdit(task) {
        this.#TASK_TO_EDIT = task;
        this.#TASK_TO_EDIT_STATE = task.state;
    }

    // Añande la tarea a backend y a frontend.
    static addNewTask(id, title, description, assigned, priority, limitDate, state) {
        const newTask = new Task(id, title, description, assigned, priority, limitDate, state);
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

    // Edita todos los atributos de la tarea actual que se está editando; la cambia de lugar en backend y frontend si corresponde.
    static editTaskToEdit(title, description, assigned, priority, limitDate, state) {
        this.#TASK_TO_EDIT.updateTask(title, description, assigned, priority, limitDate, state);
        this.moveTaskToEditToCorrectList();
        this.#moveTaskToEditToCorrectContainer();
    };

    // Mueve la tarjeta de la tarea al contenedor correcto - parte frontend.
    static #moveTaskToEditToCorrectContainer() {
        const taskToMoveOldState = this.#TASK_TO_EDIT_STATE;
        const taskToMoveActualState = this.#TASK_TO_EDIT.state;

        if (taskToMoveOldState !== taskToMoveActualState) {
            let oldContainer;
            switch (taskToMoveOldState) {
                case "Backlog":
                    oldContainer = HTML_CONTAINER_BACKLOG;
                    break;
                case "To Do":
                    oldContainer = HTML_CONTAINER_TO_DO;
                    break;
                case "In Progress":
                    oldContainer = HTML_CONTAINER_IN_PROGRESS;
                    break;
                case "Blocked":
                    oldContainer = HTML_CONTAINER_BLOCKED;
                    break;
                case "Done":
                    oldContainer = HTML_CONTAINER_DONE;
                    break;
            }

            let newContainer;
            switch (taskToMoveActualState) {
                case "Backlog":
                    newContainer = HTML_CONTAINER_BACKLOG;
                    break;
                case "To Do":
                    newContainer = HTML_CONTAINER_TO_DO;
                    break;
                case "In Progress":
                    newContainer = HTML_CONTAINER_IN_PROGRESS;
                    break;
                case "Blocked":
                    newContainer = HTML_CONTAINER_BLOCKED;
                    break;
                case "Done":
                    newContainer = HTML_CONTAINER_DONE;
                    break;
            }
            oldContainer.removeChild(this.#TASK_TO_EDIT.HTMLCard);
            newContainer.appendChild(this.#TASK_TO_EDIT.HTMLCard);
        }
    }

    // Mueve la tarea a la lista correcta - parte backend.
    static moveTaskToEditToCorrectList() {
        const taskToMoveId = this.#TASK_TO_EDIT.id;
        const taskToMoveOldState = this.#TASK_TO_EDIT_STATE;
        const taskToMoveActualState = this.#TASK_TO_EDIT.state;

        if (taskToMoveOldState !== taskToMoveActualState) {
            let oldList;
            switch (taskToMoveOldState) {
                case "Backlog":
                    oldList = this.#BACKLOG;
                    break;
                case "To Do":
                    oldList = this.#TO_DO;
                    break;
                case "In Progress":
                    oldList = this.#IN_PROGRESS;
                    break;
                case "Blocked":
                    oldList = this.#BLOCKED;
                    break;
                case "Done":
                    oldList = this.#DONE;
                    break;
            }

            let newList;
            switch (taskToMoveActualState) {
                case "Backlog":
                    newList = this.#BACKLOG;
                    break;
                case "To Do":
                    newList = this.#TO_DO;
                    break;
                case "In Progress":
                    newList = this.#IN_PROGRESS;
                    break;
                case "Blocked":
                    newList = this.#BLOCKED;
                    break;
                case "Done":
                    newList = this.#DONE;
                    break;
            }

            oldList.forEach((task, index) => {
                if (task.id === taskToMoveId) {
                    oldList.splice(index, 1);
                    return;
                }
            });
            newList.push(this.#TASK_TO_EDIT);
        }
    }

    // Retorna una tarea por la id.
    static searchTaskById(taskToSearchId) {
        // Buscar en cada lista y retornar la primera coincidencia encontrada
        return this.#BACKLOG.find(task => task.id === taskToSearchId) ||
            this.#TO_DO.find(task => task.id === taskToSearchId) ||
            this.#IN_PROGRESS.find(task => task.id === taskToSearchId) ||
            this.#BLOCKED.find(task => task.id === taskToSearchId) ||
            this.#DONE.find(task => task.id === taskToSearchId);
    }
}

// *** Clase LocalStorageManager
// Función: Guardar las listas de tareas y la ID de la clase Task en el Local Storage.
class LocalStorageManager {
    // Guarda las listas de tareas en el Local Storage.
    static saveTaskListsToStorage() {
        localStorage.setItem("TASKS_BACKLOG", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.BACKLOG)));
        localStorage.setItem("TASKS_TO_DO", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.TO_DO)));
        localStorage.setItem("TASKS_IN_PROGRESS", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.IN_PROGRESS)));
        localStorage.setItem("TASKS_BLOCKED", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.BLOCKED)));
        localStorage.setItem("TASKS_DONE", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.DONE)));
    }

    // Obtiene una lista de objetos planos.
    static #getTaskListOfPlainObjects(taskList) {
        const taskListOfPlainObjects = [];
        if (taskList.length !== 0) {
            taskList.forEach((task) => {
                taskListOfPlainObjects.push(
                    {
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        assigned: task.assigned,
                        priority: task.priority,
                        limitDate: task.limitDate,
                        state: task.state
                    }
                );
            });
        }
        return taskListOfPlainObjects;
    }

    // Guarda la ID de la clase Task en el Local Storage.
    static saveIdOfTaskClassToStorage() {
        localStorage.setItem("TASK_CLASS_ID", `${Task.ID}`);
    }

    // Carga las listas de tareas del Local Storage.
    static loadTaskListsFromStorage() {
        this.#loadTaskListFromStorage(localStorage.getItem("TASKS_BACKLOG"));
        this.#loadTaskListFromStorage(localStorage.getItem("TASKS_TO_DO"));
        this.#loadTaskListFromStorage(localStorage.getItem("TASKS_IN_PROGRESS"));
        this.#loadTaskListFromStorage(localStorage.getItem("TASKS_BLOCKED"));
        this.#loadTaskListFromStorage(localStorage.getItem("TASKS_DONE"));
    }

    static #loadTaskListFromStorage(taskListInJSON) {
        if (taskListInJSON) {
            const taskListData = JSON.parse(taskListInJSON);
            // Reconstruye cada tarea usando el constructor de la clase.
            taskListData.forEach(taskData => {
                TaskManager.addNewTask(
                    taskData.id,
                    taskData.title,
                    taskData.description,
                    taskData.assigned,
                    taskData.priority,
                    taskData.limitDate,
                    taskData.state
                );
            });
        }
    }

    // Carga la ID de la clase Task del Local Storage.
    static loadIdOfTaskClassFromStorage() {
        Task.ID = parseInt(localStorage.getItem("TASK_CLASS_ID"));
    }
}
// #endregion

// #region *** EVENTOS ***

// Muestra el modal en modo Agregar tarea.
function showAddTaskModal() {
    HTML_TASK_MODAL.classList.remove("down");
    HTML_TASK_MODAL.classList.add("over");

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
    HTML_TASK_MODAL.classList.remove("down");
    HTML_TASK_MODAL.classList.add("over");

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
    HTML_TASK_MODAL_INPUT_TITLE.value = TaskManager.TASK_TO_EDIT.title;
    HTML_TASK_MODAL_INPUT_DESCRIPTION.value = TaskManager.TASK_TO_EDIT.description;
    HTML_TASK_MODAL_INPUT_ASSIGNED.value = TaskManager.TASK_TO_EDIT.assigned;
    HTML_TASK_MODAL_INPUT_PRIORITY.value = TaskManager.TASK_TO_EDIT.priority;
    HTML_TASK_MODAL_INPUT_STATE.value = TaskManager.TASK_TO_EDIT.state;
    HTML_TASK_MODAL_INPUT_LIMIT_DATE.value = TaskManager.TASK_TO_EDIT.limitDate;
}

// Muestra la pantalla principal.
function showPrincipalPage() {
    // Muestra la página principal y oculta el modal.
    HTML_TASK_MODAL.classList.remove("over");
    HTML_TASK_MODAL.classList.add("down");
}

// Limpia los inputs.
function cleanInputs() {
    const modalFields = document.querySelectorAll("input");
    modalFields.forEach(field => {
        field.value = "";
    });
}

// Cambia entre dark mode y light mode.
function changeMode() {
    document.body.classList.toggle("dark-mode");

    if (HTML_EMOJI_MODE.classList.contains("fa-sun")) {
        HTML_EMOJI_MODE.classList.remove("fa-sun");
        HTML_EMOJI_MODE.classList.add("fa-moon"); // Cambiar al icono de luna (modo oscuro)
    } else {
        HTML_EMOJI_MODE.classList.remove("fa-moon");
        HTML_EMOJI_MODE.classList.add("fa-sun"); // Cambiar al icono de sol (modo claro)
    }
}

// Mueve la tarjeta de una tarea dentro de un contenedor mediante drag - parte frontend.
function dragTaskCardkOver(e, container) {
    e.preventDefault(); // Necesario para permitir el drop.

    // Selecciona la tarjeta actual que se está arrastrando.
    const draggingCard = document.querySelector(".dragging");

    // Busca la tarjeta hermana inferior para colocar la tarjeta que se está arrastrando encima de ella.
    // clientY es la posición actual en Y del mouse.
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
        container.appendChild(draggingCard);
    } else {
        container.insertBefore(draggingCard, afterElement);
    }
}

// Después de mover una tarjeta de tarea a un contenedor, cambia el estado de la tarea según el contenedor donde quedó la tarjeta - parte backend.
function dropTaskCard(e, container) {
    e.preventDefault(); // Evita la apertura de enlaces si hay algún drop inesperado.

    const draggingCard = document.querySelector(".dragging");
    const taskCardId = parseInt(draggingCard.id.split("_")[1]);
    const task = TaskManager.searchTaskById(taskCardId);
    const containerName = container.classList[1].split("--")[1];

    let newState;
    switch (containerName) {
        case "backlog":
            newState = "Backlog";
            break;
        case "to-do":
            newState = "To Do";
            break;
        case "in-progress":
            newState = "In Progress";
            break;
        case "blocked":
            newState = "Blocked"
            break;
        case "done":
            newState = "Done";
    }

    task.state = newState;
    TaskManager.moveTaskToEditToCorrectList();
}

// Obtiene el elemento después del cual se soltará la tarjeta.
function getDragAfterElement(container, y) {
    // Obtiene todas las tarjetas que no se están arrastrando actualmente.
    const draggableElements = [...container.querySelectorAll(".task-card:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// *** PÁGINA PRINCIPAL

// -> Botón AGREGAR TAREA en la página principal.
HTML_BUTTON_ADD_TASK.addEventListener("click", function () {
    showAddTaskModal();
});

// -> Modo oscuro.
HTML_SWITCH_MODE_BUTTON.addEventListener("click", function () {
    changeMode();
});

// -> Botones para expandir columnas (sólo para Mobile y Tablet).
Array.from(HTML_EXPAND_COLUMN_BUTTONS).forEach(button => button.addEventListener("click", function () {
    const siblingContainerTasks = button.previousElementSibling;
    siblingContainerTasks.classList.toggle("occupyAllHeight");
}));

// -> Drag and drop para los contenedores de tarjetas de tarea.
HTML_CONTAINER_BACKLOG.addEventListener("dragover", function (event) {
    dragTaskCardkOver(event, HTML_CONTAINER_BACKLOG);
});
HTML_CONTAINER_BACKLOG.addEventListener("drop", function (event) {
    dropTaskCard(event, HTML_CONTAINER_BACKLOG);
});

HTML_CONTAINER_TO_DO.addEventListener("dragover", function (event) {
    dragTaskCardkOver(event, HTML_CONTAINER_TO_DO);
});
HTML_CONTAINER_TO_DO.addEventListener("drop", function (event) {
    dropTaskCard(event, HTML_CONTAINER_TO_DO);
});

HTML_CONTAINER_IN_PROGRESS.addEventListener("dragover", function (event) {
    dragTaskCardkOver(event, HTML_CONTAINER_IN_PROGRESS);
});
HTML_CONTAINER_IN_PROGRESS.addEventListener("drop", function (event) {
    dropTaskCard(event, HTML_CONTAINER_IN_PROGRESS);
});

HTML_CONTAINER_BLOCKED.addEventListener("dragover", function (event) {
    dragTaskCardkOver(event, HTML_CONTAINER_BLOCKED);
});
HTML_CONTAINER_BLOCKED.addEventListener("drop", function (event) {
    dropTaskCard(event, HTML_CONTAINER_BLOCKED);
});

HTML_CONTAINER_DONE.addEventListener("dragover", function (event) {
    dragTaskCardkOver(event, HTML_CONTAINER_DONE);
});
HTML_CONTAINER_DONE.addEventListener("drop", function (event) {
    dropTaskCard(event, HTML_CONTAINER_DONE);
});

// *** MODAL AGREGAR TAREA

// -> Botón ACEPTAR en modo Agregar tarea.
HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK.addEventListener("click", function (event) {
    // Para evitar el submit.
    event.preventDefault();

    TaskManager.addNewTask(
        -1,
        HTML_TASK_MODAL_INPUT_TITLE.value,
        HTML_TASK_MODAL_INPUT_DESCRIPTION.value,
        HTML_TASK_MODAL_INPUT_ASSIGNED.value,
        HTML_TASK_MODAL_INPUT_PRIORITY.value,
        HTML_TASK_MODAL_INPUT_LIMIT_DATE.value,
        HTML_TASK_MODAL_INPUT_STATE.value
    );
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

    TaskManager.editTaskToEdit(
        HTML_TASK_MODAL_INPUT_TITLE.value,
        HTML_TASK_MODAL_INPUT_DESCRIPTION.value,
        HTML_TASK_MODAL_INPUT_ASSIGNED.value,
        HTML_TASK_MODAL_INPUT_PRIORITY.value,
        HTML_TASK_MODAL_INPUT_LIMIT_DATE.value,
        HTML_TASK_MODAL_INPUT_STATE.value
    );
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

// *** LOCAL STORAGE

// Para cargar.
window.addEventListener("DOMContentLoaded", function () {
    LocalStorageManager.loadIdOfTaskClassFromStorage();
    LocalStorageManager.loadTaskListsFromStorage();
});

// Para guardar.
window.addEventListener("beforeunload", function (event) {
    LocalStorageManager.saveIdOfTaskClassToStorage();
    LocalStorageManager.saveTaskListsToStorage();
});
// #endregion