// #region *** MÓDULOS EXISTENTES ***
// No se usan todos en app.js

// -> Variables globales (sólo contiene los elementos HTML de la página web).
import * as HTMLElements from "./HTMLElements.js"

// -> Clases.
import { Task } from "./Task.js";
import { TaskManager } from "./TaskManager.js";
import { APIManager } from "./APIManager.js";

// -> Event Handlers.
// Son funciones para agregar a los eventos asociados a los elementos HTML.
// Permiten no repetir código.
import * as Handlers from "./eventHandlers.js";

// -> Event Listeners.
import { addEventListeners } from "./eventListeners.js";

// #endregion

// #region *** INICIALIZACIÓN DE APLICACIÓN ***

// Inicialización de Event Listeners. Agrega un event listener al elemento HTML que le corresponda.
addEventListeners();

// #endregion