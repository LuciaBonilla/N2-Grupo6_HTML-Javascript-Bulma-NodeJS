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
    HTMLElements.HTML_TASK_MODAL_INPUT_TITLE.value = TaskManager.TASK_TO_EDIT.title;
    HTMLElements.HTML_TASK_MODAL_INPUT_DESCRIPTION.value = TaskManager.TASK_TO_EDIT.description;
    HTMLElements.HTML_TASK_MODAL_INPUT_ASSIGNED.value = TaskManager.TASK_TO_EDIT.assigned;
    HTMLElements.HTML_TASK_MODAL_INPUT_PRIORITY.value = TaskManager.TASK_TO_EDIT.priority;
    HTMLElements.HTML_TASK_MODAL_INPUT_STATE.value = TaskManager.TASK_TO_EDIT.state;
    HTMLElements.HTML_TASK_MODAL_INPUT_LIMIT_DATE.value = TaskManager.TASK_TO_EDIT.limitDate;
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

// -> Mueve la tarjeta de una tarea dentro de un contenedor mediante drag - parte frontend.
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

// -> Después de mover una tarjeta de tarea a un contenedor, cambia el estado de la tarea según el contenedor donde quedó la tarjeta - parte backend.
export function handleDropTaskCard(e, container) {
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