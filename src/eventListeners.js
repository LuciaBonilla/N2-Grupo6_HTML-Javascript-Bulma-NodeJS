import * as HTMLElements from "./HTMLElements.js";
import * as Handlers from "./eventHandlers.js";
import { TaskManager } from "./TaskManager.js";

export function addEventListeners() {
    // *** PÁGINA PRINCIPAL

    // -> Botón AGREGAR TAREA en la página principal.
    HTMLElements.HTML_BUTTON_ADD_TASK.addEventListener("click", function () {
        Handlers.handleCleanInputs();
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
    HTMLElements.HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK.addEventListener("click", async function (event) {
        // Para evitar el submit.
        event.preventDefault();

        await TaskManager.addNewTask(
            HTMLElements.HTML_TASK_MODAL_INPUT_TITLE.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_DESCRIPTION.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_ASSIGNED_TO.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_END_DATE.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_STATUS.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_PRIORITY.value
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
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK.addEventListener("click", async function (event) {
        // Para evitar el submit.
        event.preventDefault();

        await TaskManager.editTaskToEdit(
            TaskManager.CURRENT_TASK_TO_EDIT.id,
            HTMLElements.HTML_TASK_MODAL_INPUT_TITLE.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_DESCRIPTION.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_ASSIGNED_TO.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_END_DATE.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_STATUS.value,
            HTMLElements.HTML_TASK_MODAL_INPUT_PRIORITY.value
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
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK.addEventListener("click", async function (event) {
        // Para evitar el submit.
        event.preventDefault();

        const operationStatus = await TaskManager.deleteTaskToEdit();
        Handlers.handleShowPrincipalPage();
        Handlers.handleCleanInputs();
        if (!operationStatus.success) {
            alert("No se ha podido eliminar la tarea!!!");
        }
    });

    // *** CARGA LAS TAREAS DEL BACKEND EN EL FRONTEND

    // Para cargar.
    window.addEventListener("DOMContentLoaded", function () {
        TaskManager.loadTasksFromDatabase();
    });
}