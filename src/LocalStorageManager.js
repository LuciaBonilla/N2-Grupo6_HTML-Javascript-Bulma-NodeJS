import { Task } from "./Task.js";
import { TaskManager } from "./TaskManager.js";

// *** Clase LocalStorageManager ***
// Función: Guardar las listas de tareas y la ID de la clase Task en el Local Storage.
export class LocalStorageManager {

    // -> Guarda las listas de tareas en el Local Storage.
    static saveTaskListsToStorage() {
        localStorage.setItem("TASKS_BACKLOG", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.BACKLOG)));
        localStorage.setItem("TASKS_TO_DO", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.TO_DO)));
        localStorage.setItem("TASKS_IN_PROGRESS", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.IN_PROGRESS)));
        localStorage.setItem("TASKS_BLOCKED", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.BLOCKED)));
        localStorage.setItem("TASKS_DONE", JSON.stringify(this.#getTaskListOfPlainObjects(TaskManager.DONE)));
    }

    // -> Obtiene una lista de objetos planos.
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

    // -> Guarda la ID de la clase Task en el Local Storage.
    static saveIdOfTaskClassToStorage() {
        localStorage.setItem("TASK_CLASS_ID", `${Task.ID}`);
    }

    // -> Carga las listas de tareas del Local Storage.
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

    // -> Carga la ID de la clase Task del Local Storage.
    static loadIdOfTaskClassFromStorage() {
        const value = parseInt(localStorage.getItem("TASK_CLASS_ID"));
        if (isNaN(value)) {
            Task.ID = 0;
        } else {
            Task.ID = value;
        }
    }
}