import { TaskManager } from "./TaskManager.js";
import * as Handlers from "./eventHandlers.js";

// *** Clase Task ***
// Función: Guarda la info y la tarjeta HTML de la tarea.
export class Task {
    // -> ID de clase para ayudar a poner IDs individuales a las tareas.
    static #ID = 0;

    // -> Info de la tarea.
    #id;
    #title;
    #description;
    #assigned;
    #priority;
    #limitDate;
    #state;

    // -> Elementos HTML de la tarjeta que representa la tarea.
    #HTMLCard; // Encapsula el resto de elementos HTML.
    #HTMLTitle;
    #HTMLDescription;
    #HTMLAssigned;
    #HTMLPriority;
    #HTMLLimitDate;

    // -> Método constructor.
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
            Handlers.handleShowChangeTaskModal();
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

    // -> Getters y setters.
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
        if (newState === "Backlog" || newState === "To Do" || newState === "In Progress" || newState === "Blocked" || newState === "Done") {
            this.#state = newState;
        }
    }

    get state() {
        return this.#state;
    }

    get HTMLCard() {
        return this.#HTMLCard;
    }

    // -> Actualiza los atributos de la tarea y la tarjeta HTML.
    updateTask(title, description, assigned, priority, limitDate, state) {
        this.#title = title;
        this.#description = description;
        this.#assigned = assigned;
        this.#priority = priority;
        this.#limitDate = limitDate;
        this.#state = state;
        this.#updateHTMLCard();
    }

    // -> Actualiza sólo la tarjeta HTML.
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
}