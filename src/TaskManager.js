import * as HTMLElements from "./HTMLElements.js";
import { Task } from "./Task.js";
import { APIManager } from "./APIManager.js";
import * as Handlers from "./eventHandlers.js";

// *** Clase TaskManager ***
// Responsabilidad: Guarda las tareas y las administra; las crea, destruye y actualiza.
// Trabaja con BACKEND y FRONTEND.
// Estereotipo de clase: Structurer.
export class TaskManager {
    // -> Tarea actual que se está editando.
    static #CURRENT_TASK_TO_EDIT;

    // -> Estado inicial de la tarea actual que se está editando.
    static #CURRENT_TASK_TO_EDIT_INITIAL_STATUS;

    // -> Listas que guardan las tareas a nivel de frontend.
    static #TASKS = [];

    // -> Getters y setters.
    static get CURRENT_TASK_TO_EDIT() {
        return this.#CURRENT_TASK_TO_EDIT;
    }

    static set CURRENT_TASK_TO_EDIT_INITIAL_STATUS(newStatus) {
        if (newStatus === "Backlog" || newStatus === "To Do" || newStatus === "In Progress" || newStatus === "Blocked" || newStatus === "Done") {
            this.#CURRENT_TASK_TO_EDIT_INITIAL_STATUS = newStatus;
        }
    }

    // -> Cambia la tarea a editar actual por otra.
    static changeTaskToEdit(task) {
        this.#CURRENT_TASK_TO_EDIT = task;
        this.#CURRENT_TASK_TO_EDIT_INITIAL_STATUS = task.status;
    }

    // -> Añande una tarea a backend y a frontend.
    static async addNewTask(title, description, assignedTo, endDate, status, priority) {
        // Añade la tarea a backend y recibe un objeto JSON representándola. El JSON se parsea a un objeto plano.
        const taskPlainObject = await APIManager.postNewTask(
            {
                title: `${title}`,
                description: `${description}`,
                assignedTo: `${assignedTo}`,
                startDate: `${new Date().toLocaleDateString('en-CA')}`,
                endDate: `${endDate}`,
                status: `${status}`,
                priority: `${priority}`
            }
        );

        // Añade la tarea a frontend.
        const newTask = new Task(
            taskPlainObject.id,
            taskPlainObject.title,
            taskPlainObject.description,
            taskPlainObject.assignedTo,
            taskPlainObject.startDate,
            taskPlainObject.endDate,
            taskPlainObject.status,
            taskPlainObject.priority
        );
        this.#TASKS.push(newTask);
        this.#addEventListenersToTaskCard(newTask);

        // Se establece la nueva tarea como la tarea a editar.
        this.#CURRENT_TASK_TO_EDIT = newTask;
        // No tiene estado inicial porque no está en ningún contenedor su tarjeta.
        this.#CURRENT_TASK_TO_EDIT_INITIAL_STATUS = null;

        // Mueve la tarjeta de tarea al contenedor correcto.
        this.#moveTaskToEditToCorrectContainer();

        // Se quita la tarea actual para editar.
        this.#CURRENT_TASK_TO_EDIT = null;
    }

    // -> Añade los event listeners asociados a una tarjeta de tarea.
    static #addEventListenersToTaskCard(task) {
        const taskCard = task.HTMLCard;

        // Evento para cuando se quiere editar la tarea.
        taskCard.addEventListener("click", function () {
            // Cambia la tarea a editar.
            TaskManager.changeTaskToEdit(task);

            // Muestra el modal para editar tarea.
            Handlers.handleShowChangeTaskModal();
        });

        // Evento para cuando se inicia el arrastre de la tarjeta.
        taskCard.addEventListener("dragstart", function (event) {
            // Establece los datos que se transferirán en el arrastre, en este caso, la tarjeta.
            event.dataTransfer.setData("text/plain", event.target.id);

            // Indica que se está draggeando.
            taskCard.classList.add("dragging");
        });

        // Evento para cuando se termina el arrastre de la tarjeta.
        taskCard.addEventListener("dragend", function () {
            // Indica que no se está draggeando.
            taskCard.classList.remove("dragging");
        });
    }

    // -> Elimina la tarea actual que se está editando de backend y de frontend.
    static async deleteTaskToEdit() {
        const taskToDeleteId = this.#CURRENT_TASK_TO_EDIT.id;

        // Elimina la tarea de backend.
        const operationStatus = await APIManager.deleteTaskById(taskToDeleteId);

        // Elimina la tarea de frontend.
        const taskToDeleteStatus = this.#CURRENT_TASK_TO_EDIT.status;
        let container;
        switch (taskToDeleteStatus) {
            case "Backlog":
                container = HTMLElements.HTML_CONTAINER_BACKLOG;
                break;
            case "To Do":
                container = HTMLElements.HTML_CONTAINER_TO_DO;
                break;
            case "In Progress":
                container = HTMLElements.HTML_CONTAINER_IN_PROGRESS;
                break;
            case "Blocked":
                container = HTMLElements.HTML_CONTAINER_BLOCKED;
                break;
            case "Done":
                container = HTMLElements.HTML_CONTAINER_DONE;
                break;
        }
        container.removeChild(this.#CURRENT_TASK_TO_EDIT.HTMLCard);
        const index = this.#TASKS.findIndex(task => task.id === taskToDeleteId);
        if (index !== -1) {
            this.#TASKS.splice(index, 1);
        }
        this.#CURRENT_TASK_TO_EDIT = null;
        this.#CURRENT_TASK_TO_EDIT_INITIAL_STATUS = null;

        return operationStatus;
    };

    // -> Edita los atributos de la tarea actual (menos la id y la fecha de inicio) que se está editando; la actualiza en backend y en frontend.
    static async editTaskToEdit(id, title, description, assignedTo, endDate, status, priority) {
        // Actualiza en backend.
        const taskData = await APIManager.putTaskById(id,
            {
                title: `${title}`,
                description: `${description}`,
                assignedTo: `${assignedTo}`,
                endDate: `${endDate}`,
                status: `${status}`,
                priority: `${priority}`
            });

        // Actualiza en frontend.
        this.#CURRENT_TASK_TO_EDIT.updateTask(taskData.title, taskData.description, taskData.assignedTo, taskData.endDate, taskData.status, taskData.priority);
        this.#moveTaskToEditToCorrectContainer();
    };

    // -> Mueve la tarjeta de la tarea actual a editar al contenedor correcto en frontend.
    static #moveTaskToEditToCorrectContainer() {
        const taskToMoveOldState = this.#CURRENT_TASK_TO_EDIT_INITIAL_STATUS;
        const taskToMoveActualState = this.#CURRENT_TASK_TO_EDIT.status;

        if (taskToMoveOldState !== taskToMoveActualState) {
            let oldContainer;
            switch (taskToMoveOldState) {
                case "Backlog":
                    oldContainer = HTMLElements.HTML_CONTAINER_BACKLOG;
                    break;
                case "To Do":
                    oldContainer = HTMLElements.HTML_CONTAINER_TO_DO;
                    break;
                case "In Progress":
                    oldContainer = HTMLElements.HTML_CONTAINER_IN_PROGRESS;
                    break;
                case "Blocked":
                    oldContainer = HTMLElements.HTML_CONTAINER_BLOCKED;
                    break;
                case "Done":
                    oldContainer = HTMLElements.HTML_CONTAINER_DONE;
                    break;
            }

            let newContainer;
            switch (taskToMoveActualState) {
                case "Backlog":
                    newContainer = HTMLElements.HTML_CONTAINER_BACKLOG;
                    break;
                case "To Do":
                    newContainer = HTMLElements.HTML_CONTAINER_TO_DO;
                    break;
                case "In Progress":
                    newContainer = HTMLElements.HTML_CONTAINER_IN_PROGRESS;
                    break;
                case "Blocked":
                    newContainer = HTMLElements.HTML_CONTAINER_BLOCKED;
                    break;
                case "Done":
                    newContainer = HTMLElements.HTML_CONTAINER_DONE;
                    break;
            }

            if (oldContainer !== undefined) {
                oldContainer.removeChild(this.#CURRENT_TASK_TO_EDIT.HTMLCard);
            }
            newContainer.appendChild(this.#CURRENT_TASK_TO_EDIT.HTMLCard);
        }
    }

    // -> Retorna una tarea de frontend por la id.
    static searchTaskById(taskToSearchId) {
        return this.#TASKS.find(task => task.id === taskToSearchId);
    }

    // -> Trae las tareas de backend a frontend.
    static async loadTasksFromDatabase() {
        const tasks = await APIManager.getAllTasks();

        tasks.forEach((taskData) => {
            const loadedTask = new Task(
                taskData.id,
                taskData.title,
                taskData.description,
                taskData.assignedTo,
                taskData.startDate,
                taskData.endDate,
                taskData.status,
                taskData.priority
            );
            this.#TASKS.push(loadedTask);
            this.#addEventListenersToTaskCard(loadedTask);

            // Se establece la nueva tarea como la tarea a editar.
            this.#CURRENT_TASK_TO_EDIT = loadedTask;

            // No tiene estado inicial porque no está en ningún contenedor su tarjeta.
            this.#CURRENT_TASK_TO_EDIT_INITIAL_STATUS = null;

            // Mueve la tarjeta de tarea al contenedor correcto.
            this.#moveTaskToEditToCorrectContainer();

            // Se quita la tarea actual para editar.
            this.#CURRENT_TASK_TO_EDIT = null;
        });
    }
}