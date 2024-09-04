// *** VARIABLES GLOBALES ***

// *** ELEMENTOS DEL HTML

// -> Encabezado.
export const HTML_HEADER = document.getElementsByClassName("header")[0];
export const HTML_BUTTON_ADD_TASK = document.getElementsByClassName("header__add-task-button")[0];

// -> Para el modo oscuro.
export const HTML_SWITCH_MODE_BUTTON = document.getElementsByClassName("header__switch-mode-button")[0];
export const HTML_EMOJI_MODE = document.getElementsByClassName("fa-solid fa-sun")[0];

// -> Main.
export const HTML_MAIN = document.getElementsByClassName("main")[0];

// -> Contenedores para las tareas en cada columna.
export const HTML_CONTAINER_BACKLOG = document.getElementsByClassName("task-column__container--backlog")[0];
export const HTML_CONTAINER_TO_DO = document.getElementsByClassName("task-column__container--to-do")[0];
export const HTML_CONTAINER_IN_PROGRESS = document.getElementsByClassName("task-column__container--in-progress")[0];
export const HTML_CONTAINER_BLOCKED = document.getElementsByClassName("task-column__container--blocked")[0];
export const HTML_CONTAINER_DONE = document.getElementsByClassName("task-column__container--done")[0];

// -> Botones para expandir columnas (sólo para Mobile y Tablet).
export const HTML_EXPAND_COLUMN_BUTTONS = document.getElementsByClassName("task-column__expand-button");

// -> Modal.
export const HTML_TASK_MODAL = document.getElementsByClassName("task-modal")[0];

//      -> Títulos.
export const HTML_TASK_MODAL_ADD_TASK_TITLE = document.getElementsByClassName("task-modal__title--add-task")[0];
export const HTML_TASK_MODAL_CHANGE_TASK_TITLE = document.getElementsByClassName("task-modal__title--change-task")[0];

//      -> Inputs del modal.
export const HTML_TASK_MODAL_INPUT_TITLE = document.getElementById("title");
export const HTML_TASK_MODAL_INPUT_DESCRIPTION = document.getElementById("description");
export const HTML_TASK_MODAL_INPUT_ASSIGNED = document.getElementById("assigned");
export const HTML_TASK_MODAL_INPUT_PRIORITY = document.getElementById("priority");
export const HTML_TASK_MODAL_INPUT_STATE = document.getElementById("state");
export const HTML_TASK_MODAL_INPUT_LIMIT_DATE = document.getElementById("limit-date");

//      -> Botones del modal.

//          -> Para añadir tarea.
export const HTML_ADD_TASK_MODAL_BUTTON_CANCEL_TASK = document.getElementsByClassName("task-form__button--cancel-add-task")[0];
export const HTML_ADD_TASK_MODAL_BUTTON_ACCEPT_TASK = document.getElementsByClassName("task-form__button--accept-add-task")[0];

//          -> Para editar tarea.
export const HTML_CHANGE_TASK_MODAL_BUTTON_DELETE_TASK = document.getElementsByClassName("task-form__button--delete-change-task")[0];
export const HTML_CHANGE_TASK_MODAL_BUTTON_CANCEL_TASK = document.getElementsByClassName("task-form__button--cancel-change-task")[0];
export const HTML_CHANGE_TASK_MODAL_BUTTON_ACCEPT_TASK = document.getElementsByClassName("task-form__button--accept-change-task")[0];