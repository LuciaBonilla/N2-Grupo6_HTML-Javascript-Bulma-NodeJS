import * as HTMLElements from "./HTMLElements.js";
import * as Handlers from "./eventHandlers.js";
import { TaskManager } from "./TaskManager.js";
import { LocalStorageManager } from "./LocalStorageManager.js";

export function addEventListeners() {
    // *** PÁGINA PRINCIPAL

    // -> Botón AGREGAR TAREA en la página principal.
    HTMLElements.HTML_BUTTON_ADD_TASK.addEventListener("click", function () {
        Handlers.handleShowAddTaskModal();
    });

    // -> Modo oscuro.
    HTMLElements.HTML_SWITCH_MODE_BUTTON.addEventListener("click", function () {
        Handlers.handleChangeMode();
    });

    // -> Botones para expandir columnas (sólo para Mobile y Tablet).
    Array.from(HTMLElements.HTML_EXPAND_COLUMN_BUTTONS).forEach(button => button.addEventListener("click", function () {
        const siblingContainerTasks = button.previousElementSibling;
        siblingContainerTasks.classList.toggle("occupyAllHeight");
    }));

    // -> Drag and drop para los contenedores de tarjetas de tarea.
    HTMLElements.HTML_CONTAINER_BACKLOG.addEventListener("dragover", function (event) {
        Handlers.handleDragTaskCardkOver(event, HTMLElements.HTML_CONTAINER_BACKLOG);
    });
    HTMLElements.HTML_CONTAINER_BACKLOG.addEventListener("drop", function (event) {
        Handlers.handleDropTaskCard(event, HTMLElements.HTML_CONTAINER_BACKLOG);
    });

    HTMLElements.HTML_CONTAINER_TO_DO.addEventListener("dragover", function (event) {
        Handlers.handleDragTaskCardkOver(event, HTMLElements.HTML_CONTAINER_TO_DO);
    });
    HTMLElements.HTML_CONTAINER_TO_DO.addEventListener("drop", function (event) {
        Handlers.handleDropTaskCard(event, HTMLElements.HTML_CONTAINER_TO_DO);
    });

    HTMLElements.HTML_CONTAINER_IN_PROGRESS.addEventListener("dragover", function (event) {
        Handlers.handleDragTaskCardkOver(event, HTMLElements.HTML_CONTAINER_IN_PROGRESS);
    });
    HTMLElements.HTML_CONTAINER_IN_PROGRESS.addEventListener("drop", function (event) {
        Handlers.handleDropTaskCard(event, HTMLElements.HTML_CONTAINER_IN_PROGRESS);
    });

    HTMLElements.HTML_CONTAINER_BLOCKED.addEventListener("dragover", function (event) {
        Handlers.handleDragTaskCardkOver(event, HTMLElements.HTML_CONTAINER_BLOCKED);
    });
    HTMLElements.HTML_CONTAINER_BLOCKED.addEventListener("drop", function (event) {
        Handlers.handleDropTaskCard(event, HTMLElements.HTML_CONTAINER_BLOCKED);
    });

    HTMLElements.HTML_CONTAINER_DONE.addEventListener("dragover", function (event) {
        Handlers.handleDragTaskCardkOver(event, HTMLElements.HTML_CONTAINER_DONE);
    });
    HTMLElements.HTML_CONTAINER_DONE.addEventListener("drop", function (event) {
        Handlers.handleDropTaskCard(event, HTMLElements.HTML_CONTAINER_DONE);
    });

    // *** MODAL AGREGAR TAREA

    // -> Botón ACEPTAR en modo Agregar tarea.
    HTMLElements.HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK.addEventListener("click", function (event) {
        // Para evitar el submit.
        event.preventDefault();

        TaskManager.addNewTask(
            -1,
            HTMLElements.HTML_TASK_MODAL_INPUT_TITLE.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_DESCRIPTION.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_ASSIGNED.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_PRIORITY.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_LIMIT_DATE.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_STATE.value
        );
        Handlers.handleShowPrincipalPage();
        Handlers.handleCleanInputs();
    });

    // -> Botón CANCELAR en modo Agregar tarea.
    HTMLElements.HTML_ADD_TASK_MODAL_BUTTON_CANCEL_TASK.addEventListener("click", function (event) {
        // Para evitar el submit.
        event.preventDefault();

        Handlers.handleShowPrincipalPage();
        Handlers.handleCleanInputs();
    });

    // *** MODAL EDITAR TAREA

    // -> Botón ACEPTAR en modo Editar tarea.
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK.addEventListener("click", function (event) {
        // Para evitar el submit.
        event.preventDefault();

        TaskManager.editTaskToEdit(
            HTMLElements.HTML_TASK_MODAL_INPUT_TITLE.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_DESCRIPTION.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_ASSIGNED.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_PRIORITY.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_LIMIT_DATE.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_STATE.value
        );
        Handlers.handleShowPrincipalPage();
        Handlers.handleCleanInputs();
    });

    // -> Botón CANCELAR en modo Editar tarea.
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_CANCEL_TASK.addEventListener("click", function (event) {
        // Para evitar el submit.
        event.preventDefault();

        Handlers.handleShowPrincipalPage();
        Handlers.handleCleanInputs();
    });

    // -> Botón ELIMINAR en modo Editar tarea.
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK.addEventListener("click", function (event) {
        // Para evitar el submit.
        event.preventDefault();

        TaskManager.deleteTaskToEdit();
        Handlers.handleShowPrincipalPage();
        Handlers.handleCleanInputs();
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
}