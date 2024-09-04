import * as HTMLElements from "./HTMLElements.js";
import { Task } from "./Task.js";

// *** Clase TaskManager ***
// Función: Guarda las tareas y las administra; las crea, destruye y actualiza.
export class TaskManager {
    // -> Tarea actual que se está editando.
    static #TASK_TO_EDIT;

    // -> Estado de la tarea actual que se está editando.
    static #TASK_TO_EDIT_STATE;

    // -> Listas que guardan las tareas.
    static #BACKLOG = [];
    static #TO_DO = [];
    static #IN_PROGRESS = [];
    static #BLOCKED = [];
    static #DONE = [];

    // -> Getters.
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

    // -> Cambia la tarea a editar actual por otra.
    static changeTaskToEdit(task) {
        this.#TASK_TO_EDIT = task;
        this.#TASK_TO_EDIT_STATE = task.state;
    }

    // -> Añande la tarea a backend y a frontend.
    static addNewTask(id, title, description, assigned, priority, limitDate, state) {
        const newTask = new Task(id, title, description, assigned, priority, limitDate, state);
        const newTaskState = newTask.state;
        let container;
        let list;

        switch (newTaskState) {
            case "Backlog":
                container = HTMLElements.HTML_CONTAINER_BACKLOG;
                list = this.#BACKLOG;
                break;
            case "To Do":
                container = HTMLElements.HTML_CONTAINER_TO_DO;
                list = this.#TO_DO;
                break;
            case "In Progress":
                container = HTMLElements.HTML_CONTAINER_IN_PROGRESS;
                list = this.#IN_PROGRESS;
                break;
            case "Blocked":
                container = HTMLElements.HTML_CONTAINER_BLOCKED;
                list = this.#BLOCKED;
                break;
            case "Done":
                container = HTMLElements.HTML_CONTAINER_DONE;
                list = this.#DONE;
                break;
        }
        list.push(newTask);
        container.appendChild(newTask.HTMLCard);
    };

    // -> Elimina la tarea a editar de backend y de frontend.
    static deleteTaskToEdit() {
        const taskToDeleteId = this.#TASK_TO_EDIT.id;
        const taskToDeleteState = this.#TASK_TO_EDIT.state;
        let container;
        let list;

        switch (taskToDeleteState) {
            case "Backlog":
                container = HTMLElements.HTML_CONTAINER_BACKLOG;
                list = this.#BACKLOG;
                break;
            case "To Do":
                container = HTMLElements.HTML_CONTAINER_TO_DO;
                list = this.#TO_DO;
                break;
            case "In Progress":
                container = HTMLElements.HTML_CONTAINER_IN_PROGRESS;
                list = this.#IN_PROGRESS;
                break;
            case "Blocked":
                container = HTMLElements.HTML_CONTAINER_BLOCKED;
                list = this.#BLOCKED;
                break;
            case "Done":
                container = HTMLElements.HTML_CONTAINER_DONE;
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

    // -> Edita todos los atributos de la tarea actual que se está editando; la cambia de lugar en backend y frontend si corresponde.
    static editTaskToEdit(title, description, assigned, priority, limitDate, state) {
        this.#TASK_TO_EDIT.updateTask(title, description, assigned, priority, limitDate, state);
        this.moveTaskToEditToCorrectList();
        this.#moveTaskToEditToCorrectContainer();
    };

    // -> Mueve la tarjeta de la tarea al contenedor correcto - parte frontend.
    static #moveTaskToEditToCorrectContainer() {
        const taskToMoveOldState = this.#TASK_TO_EDIT_STATE;
        const taskToMoveActualState = this.#TASK_TO_EDIT.state;

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
            oldContainer.removeChild(this.#TASK_TO_EDIT.HTMLCard);
            newContainer.appendChild(this.#TASK_TO_EDIT.HTMLCard);
        }
    }

    // -> Mueve la tarea a la lista correcta - parte backend.
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

    // -> Retorna una tarea por la id.
    static searchTaskById(taskToSearchId) {
        // Buscar en cada lista y retornar la primera coincidencia encontrada
        return this.#BACKLOG.find(task => task.id === taskToSearchId) ||
            this.#TO_DO.find(task => task.id === taskToSearchId) ||
            this.#IN_PROGRESS.find(task => task.id === taskToSearchId) ||
            this.#BLOCKED.find(task => task.id === taskToSearchId) ||
            this.#DONE.find(task => task.id === taskToSearchId);
    }
}