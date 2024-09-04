export class APIManager {
    static #API_URL = 'http://localhost:3000/api/tasks';

    // GET all tasks
    static async getAllTasks() {
        try {
            const response = await fetch(this.#API_URL, { method: "GET" });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al hacer un fetch de tareas:", error);
        }
    }

    // DELETE a task by ID
    static async deleteTaskById(taskId) {
        try {
            const response = await fetch(`${this.#API_URL}/${taskId}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error("Error al eliminar la tarea:", error);
        }
    }

    // POST a new task
    static async postNewTask(body) {
        try {
            const response = await fetch(this.#API_URL, { method: "POST", body: body });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error("Error al crear la tarea:", error);
        }
    }

    // PUT (update) a task by ID
    static async putTaskById(taskId) {
        try {
            const response = await fetch(`${this.#API_URL}/${taskId}`, { method: "PUT", body: body });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    }
}