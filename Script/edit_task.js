
function formatDateToInput(dateString) {
    if (!dateString) return "";
    return dateString.split("T")[0];
}

function formatDateTimeToInput(dateTimeString) {
    if (!dateTimeString) return "";
    return dateTimeString.slice(0, 16); 
}
async function loadTaskDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id");

    if (!taskId) {
        alert("Task ID is missing!");
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
        const task = await response.json();

        console.log("🔹 Loaded Task Data:", task);

        document.getElementById("task_owner").value = task.assigned_to;
        document.getElementById("task_name").value = task.task_name;
        document.getElementById("description").value = task.description;
        document.getElementById("start_date").value = formatDateToInput(task.start_date);
        document.getElementById("due_date").value = formatDateToInput(task.due_date);
        document.getElementById("reminder").value = formatDateTimeToInput(task.reminder);
        document.getElementById("priority").value = task.priority;
        document.getElementById("status").value = task.status;
        document.getElementById("assigned_to").value = task.assigned_to;
        document.getElementById("status").value = task.status; 
        updateStatusText();
    } catch (error) {
        console.error(" Error loading task:", error);
        alert("Failed to load task details.");
    }
}
window.onload = loadTaskDetails;
window.loadTaskDetails = loadTaskDetails; 

async function updateTask() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id");

    if (!taskId) {
        alert("Task ID is missing!");
        return;
    }
    const updatedTask = {
        task_name: document.getElementById("task_name").value.trim(),
        description: document.getElementById("description").value.trim(),
        start_date: document.getElementById("start_date").value,
        due_date: document.getElementById("due_date").value,
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value,
        assigned_to: document.getElementById("assigned_to").value.trim(),
        reminder: document.getElementById("reminder").value
    };

    console.log("🔹 Updating Task:", updatedTask);

    try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });

        console.log("Server Response Status:", response.status);

        if (response.ok) {
            alert("Task updated successfully!");
            window.location.href = "index.html"; 
        } else {
            alert("Error updating task. Please try again.");
        }
    } catch (error) {
        console.error("Error updating task:", error);
        alert("Failed to connect to the server.");
    }
}
// Function to update the status text dynamically
function updateStatusText() {
    const selectedStatus = document.getElementById("status").value; // ✅ Get selected value
    const statusText = document.getElementById("statusText"); // ✅ Get the text element
    
    if (statusText) {
        statusText.textContent = selectedStatus; // ✅ Update text
        console.log("✅ Status updated to:", selectedStatus); // ✅ Debug log

        // ✅ Optional: Change the class dynamically based on status
        statusText.className = ""; // Remove previous class
        if (selectedStatus === "Open") {
            statusText.classList.add("status-open");
        } else if (selectedStatus === "In Progress") {
            statusText.classList.add("status-in-progress");
        } else if (selectedStatus === "Completed") {
            statusText.classList.add("status-completed");
        }
    } else {
        console.error("❌ Element #statusText not found!");
    }
}

window.updateStatusText = updateStatusText;
window.updateTask = updateTask;     