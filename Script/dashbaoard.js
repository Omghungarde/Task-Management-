console.log("dashboard.js is loaded");

async function loadTasks() {
    try {
        console.log("Fetching tasks...");

        const response = await fetch("http://localhost:3000/tasks");
        const tasks = await response.json();

        console.log("Fetched Tasks:", tasks);

        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = "";

        tasks.forEach(task => {
            console.log("Task ID:", task.id); 

            const row = `
                    <tr>
                        <td><input class="checkbox12" type="checkbox" ></td>
                        <td>
                            <div class="d-flex align-items-center flex-wrap">
                                <img src="../assest/christopher-campbell-rDEOVtE7vOs-unsplash.jpg" class="profile-img me-3 rounded-circle" img-fluid alt="User" width="40" height="40">
                                <div class="flex-grow-1 text-truncate">
                                    <div class="task-title fw-bold">${task.task_name}</div>
                                    <div class="task-details text-muted text-truncate">${task.description}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex flex-wrap gap-2">
                                <a href="./edit_task.html?id=${task.id}" class="btn btn-warning btnfont">Edit</a>
                                <button class="btn btn-danger btnfont" onclick="deleteTask(${task.id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                    `;


            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}
document.addEventListener("DOMContentLoaded", loadTasks);


async function deleteTask(taskId) {
    console.log("Delete button clicked for Task ID:", taskId);

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, { method: "DELETE" });

        console.log("Delete API Response:", response.status);

        if (response.ok) {
            alert("Task deleted successfully!");
            loadTasks();
        } else {
            const errorMessage = await response.json();
            alert(`Error: ${errorMessage.error || "Failed to delete task."}`);
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to connect to the server.");
    }
}

window.onload = loadTasks;
