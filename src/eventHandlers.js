import * as HTMLElements from "./HTMLElements.js";
import { TaskManager } from "./TaskManager.js";
import { Task } from "./Task.js"; // De forma dinámica se necesita este import.

// *** HANDLERS ***

// -> Muestra el modal en modo Agregar tarea.
export function handleShowAddTaskModal() {
    HTMLElements.HTML_TASK_MODAL.classList.remove("down");
    HTMLElements.HTML_TASK_MODAL.classList.add("over");

    // Muestra el título correspondiente.
    HTMLElements.HTML_TASK_MODAL_ADD_TASK_TITLE.classList.remove("hidden");
    HTMLElements.HTML_TASK_MODAL_CHANGE_TASK_TITLE.classList.add("hidden");

    // Muestra y oculta los botones correspondientes.
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK.classList.add("hidden");
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_CANCEL_TASK.classList.add("hidden");
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK.classList.add("hidden");
    HTMLElements.HTML_ADD_TASK_MODAL_BUTTON_CANCEL_TASK.classList.remove("hidden");
    HTMLElements.HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK.classList.remove("hidden");
}

// -> Muestra el modal en modo Editar tarea.
export function handleShowChangeTaskModal() {
    HTMLElements.HTML_TASK_MODAL.classList.remove("down");
    HTMLElements.HTML_TASK_MODAL.classList.add("over");

    // Muestra el título correspondiente.
    HTMLElements.HTML_TASK_MODAL_ADD_TASK_TITLE.classList.add("hidden");
    HTMLElements.HTML_TASK_MODAL_CHANGE_TASK_TITLE.classList.remove("hidden");

    // Muestra y oculta los botones correspondientes.
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK.classList.remove("hidden");
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_CANCEL_TASK.classList.remove("hidden");
    HTMLElements.HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK.classList.remove("hidden");
    HTMLElements.HTML_ADD_TASK_MODAL_BUTTON_CANCEL_TASK.classList.add("hidden");
    HTMLElements.HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK.classList.add("hidden");

    // Pone en los inputs los atributos de la tarea actual a editar.
    HTMLElements.HTML_TASK_MODAL_INPUT_TITLE.value = TaskManager.CURRENT_TASK_TO_EDIT.title;
    HTMLElements.HTML_TASK_MODAL_INPUT_DESCRIPTION.value = TaskManager.CURRENT_TASK_TO_EDIT.description;
    HTMLElements.HTML_TASK_MODAL_INPUT_ASSIGNED_TO.value = TaskManager.CURRENT_TASK_TO_EDIT.assignedTo;
    HTMLElements.HTML_TASK_MODAL_INPUT_PRIORITY.value = TaskManager.CURRENT_TASK_TO_EDIT.priority;
    HTMLElements.HTML_TASK_MODAL_INPUT_STATUS.value = TaskManager.CURRENT_TASK_TO_EDIT.status;
    HTMLElements.HTML_TASK_MODAL_INPUT_END_DATE.value = TaskManager.CURRENT_TASK_TO_EDIT.endDate;
}

// -> Muestra la pantalla principal.
export function handleShowPrincipalPage() {
    // Muestra la página principal y oculta el modal.
    HTMLElements.HTML_TASK_MODAL.classList.remove("over");
    HTMLElements.HTML_TASK_MODAL.classList.add("down");
}

// -> Limpia los inputs.
export function handleCleanInputs() {
    const modalFields = document.querySelectorAll("input");
    modalFields.forEach(field => {
        field.value = "";
    });
}

// -> Cambia entre dark mode y light mode.
export function handleChangeMode() {
    document.body.classList.toggle("dark-mode");

    if (HTMLElements.HTML_EMOJI_MODE.classList.contains("fa-sun")) {
        HTMLElements.HTML_EMOJI_MODE.classList.remove("fa-sun");
        HTMLElements.HTML_EMOJI_MODE.classList.add("fa-moon"); // Cambiar al icono de luna (modo oscuro)
    } else {
        HTMLElements.HTML_EMOJI_MODE.classList.remove("fa-moon");
        HTMLElements.HTML_EMOJI_MODE.classList.add("fa-sun"); // Cambiar al icono de sol (modo claro)
    }
}

// -> Mueve la tarjeta de una tarea dentro de un contenedor mediante drag.
export function handleDragTaskCardkOver(e, container) {
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

// -> Después de mover una tarjeta de tarea a un contenedor, cambia el estado de la tarea según el contenedor donde quedó la tarjeta.
export async function handleDropTaskCard(e, container) {
    e.preventDefault(); // Evita la apertura de enlaces si hay algún drop inesperado.

    const draggingCard = document.querySelector(".dragging");
    const taskCardId = draggingCard.id.split("__")[1];
    const task = TaskManager.searchTaskById(taskCardId);
    const containerName = container.classList[1].split("--")[1];
    TaskManager.changeTaskToEdit(task);

    let newStatus;
    switch (containerName) {
        case "backlog":
            newStatus = "Backlog";
            break;
        case "to-do":
            newStatus = "To Do";
            break;
        case "in-progress":
            newStatus = "In Progress";
            break;
        case "blocked":
            newStatus = "Blocked"
            break;
        case "done":
            newStatus = "Done";
    }
    // Ya se movió al contenedor correcto en handleDragTaskCardOver(), así que su estado inicial es newStatus.
    TaskManager.CURRENT_TASK_TO_EDIT_INITIAL_STATUS = newStatus;

    await TaskManager.editTaskToEdit(
        taskCardId,
        task.title,
        task.description,
        task.assignedTo,
        task.endDate,
        newStatus,
        task.priority
    );
}

// -> Obtiene el elemento después del cual se soltará la tarjeta.
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