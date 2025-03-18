async function addTask(resetForm = false) {
    const taskData = {
        task_name: document.getElementById("task_name").value || "Untitled Task",
        description: document.getElementById("description").value || "No description",
        start_date: document.getElementById("start_date").value || null,
        due_date: document.getElementById("due_date").value || null,
        priority: document.getElementById("priority").value || "Low",
        status: document.getElementById("status").value || "Open",
 
        reminder: document.getElementById("reminder").value || null
    };

    console.log("Sending Task Data:", taskData);

    try {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });

        console.log("Server Response Status:", response.status);

        if (response.ok) {
            alert(" Task added successfully!");
            if (resetForm) {
                document.getElementById("task_name").value = "";
                document.getElementById("description").value = "";
                document.getElementById("start_date").value = "";
                document.getElementById("due_date").value = "";
                document.getElementById("reminder").value = "";
                document.getElementById("priority").value = "Moderate";
                document.getElementById("status").value = "Open";
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert("Error adding task. Please try again.");
        }
    } catch (error) {
        console.error(" Error adding task:", error);
        alert("Failed to connect to the server.");
    }
}

window.addTask = addTask;