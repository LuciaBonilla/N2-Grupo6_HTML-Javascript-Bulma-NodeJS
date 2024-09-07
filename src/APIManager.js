// *** Clase APIManager
// Responsabilidad: Enviar requests a los endpoints correspondientes y retornar las responses.
// Estereotipo de clase: Service Provider.
export class APIManager {
    static #API_URL = 'http://localhost:3000/api/tasks';

    // GET all tasks -> Retorna objetos planos representando las tareas.
    static async getAllTasks() {
        try {
            const response = await fetch(this.#API_URL, { method: "GET" });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // El resultado no es JSON sino el resultado de tomar JSON como entrada y analizarlo para producir un objeto JavaScript.
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener todas las tareas:", error);
        }
    }

    // DELETE a task by ID -> Retorna el resultado de la operación.
    static async deleteTaskById(taskId) {
        try {
            const response = await fetch(`${this.#API_URL}/${taskId}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
            return { success: false };
        }
    }

    // POST a new task -> Retorna un objeto plano representando la tarea subida a backend.
    static async postNewTask(obj) {
        try {
            const response = await fetch(this.#API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj)
                });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // El resultado no es JSON sino el resultado de tomar JSON como entrada y analizarlo para producir un objeto JavaScript.
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al crear la tarea:", error);
        }
    }

    // PUT (update) a task by ID -> Retorna un objeto plano representando la tarea actualizada en backend.
    static async putTaskById(taskId, obj) {
        try {
            const response = await fetch(`${this.#API_URL}/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    }
}