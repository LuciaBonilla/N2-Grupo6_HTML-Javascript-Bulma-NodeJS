// *** Clase Task ***
// Responsabilidad: Guardar la info y la tarjeta HTML de la tarea.
// Estereotipo de clase: Information Holder.
export class Task {
    // -> Info de la tarea.
    #id;
    #title;
    #description;
    #assignedTo;
    #startDate
    #endDate;
    #status;
    #priority;

    // -> Elementos HTML de la tarjeta que representa la tarea.
    #HTMLCard; // HTMLCard encapsula el resto de elementos HTML.
    #HTMLTitle;
    #HTMLDescription;
    #HTMLAssignedTo;
    #HTMLStartDate;
    #HTMLEndDate;
    #HTMLStatus;
    #HTMLPriority;

    // -> Método constructor.
    constructor(id, title, description, assignedTo, startDate, endDate, status, priority) {
        // Inicialización de la info.
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#assignedTo = assignedTo;
        this.#startDate = startDate;
        this.#endDate = endDate;
        this.#status = status;
        this.#priority = priority;

        // Inicialización de la tarjeta.
        this.#HTMLCard = document.createElement("article");
        this.#HTMLCard.classList.add("task-card");
        this.#HTMLCard.id = `task-card__${this.#id}`;
        this.#HTMLCard.draggable = true;

        this.#HTMLTitle = document.createElement("h4");
        this.#HTMLTitle.classList.add("task-card__title");
        this.#HTMLDescription = document.createElement("p");
        this.#HTMLAssignedTo = document.createElement("p");
        this.#HTMLStartDate = document.createElement("p");
        this.#HTMLEndDate = document.createElement("p");
        this.#HTMLStatus = document.createElement("p");
        this.#HTMLPriority = document.createElement("p");

        this.#HTMLCard.appendChild(this.#HTMLTitle);
        this.#HTMLCard.appendChild(this.#HTMLDescription);
        this.#HTMLCard.appendChild(this.#HTMLAssignedTo);
        this.#HTMLCard.appendChild(this.#HTMLStartDate);
        this.#HTMLCard.appendChild(this.#HTMLEndDate);
        this.#HTMLCard.appendChild(this.#HTMLStatus);
        this.#HTMLCard.appendChild(this.#HTMLPriority);

        // Actualiza el contenido de la tarjeta.
        this.#updateHTMLCard();
    }

    // -> Getters.
    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get assignedTo() {
        return this.#assignedTo;
    }

    get startDate() {
        return this.#startDate;
    }

    get endDate() {
        return this.#endDate;
    }

    get status() {
        return this.#status;
    }

    get priority() {
        return this.#priority;
    }

    get HTMLCard() {
        return this.#HTMLCard;
    }

    // -> Actualiza los atributos de la tarea (menos la id y la fecha de inicio) y la tarjeta HTML.
    updateTask(title, description, assignedTo, endDate, status, priority) {
        this.#title = title;
        this.#description = description;
        this.#assignedTo = assignedTo;
        this.#endDate = endDate;
        this.#status = status;
        this.#priority = priority;
        this.#updateHTMLCard();
    }

    // -> Actualiza los atributos de la tarjeta HTML (menos la fecha de inicio).
    #updateHTMLCard() {
        this.#HTMLTitle.innerHTML = this.#title;

        this.#HTMLDescription.innerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            ${this.#description}
        `;

        this.#HTMLAssignedTo.innerHTML = `
            <i class="fa-solid fa-user"></i>
            ${this.#assignedTo}
        `;

        this.#HTMLStartDate.innerHTML = `
            <i class="fa-regular fa-calendar-days"></i>
            Inicio: ${this.#startDate}
        `;

        this.#HTMLEndDate.innerHTML = `
            <i class="fa-regular fa-calendar-days"></i>
            Fin: ${this.#startDate}
        `;

        this.#HTMLPriority.innerHTML = `
            <i class="fa-solid fa-star"></i>
            ${this.#priority}
        `;
    }
}