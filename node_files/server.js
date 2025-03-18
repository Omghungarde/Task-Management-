const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db"); 
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", async (req, res) => {
    try {
        const [tasks] = await db.execute("SELECT * FROM tasks");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.execute("DELETE FROM tasks WHERE id=?", [id]);

        if (result.affectedRows > 0) {
            res.json({ message: "Task deleted successfully" });
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/tasks", async (req, res) => {
    console.log("Received data from frontend:", req.body);

    const { task_name, description, start_date, due_date, priority, status, reminder } = req.body;

    const missingFields = [];
    if (!task_name) missingFields.push("task_name");
    if (!description) missingFields.push("description");
    if (!start_date) missingFields.push("start_date");
    if (!due_date) missingFields.push("due_date");
    if (!priority) missingFields.push("priority");
    if (!status) missingFields.push("status");
    if (!reminder) missingFields.push("reminder");

    if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
    }

    try {
        const sqlQuery = `
            INSERT INTO tasks (task_name, description, start_date, due_date, priority, status, reminder) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        console.log("Executing SQL Query:", sqlQuery);
        console.log("Values:", [task_name, description, start_date, due_date, priority, status, reminder]);

        const [result] = await db.execute(sqlQuery, [
            task_name, description, start_date, due_date, priority, status, reminder
        ]);

        res.status(201).json({ id: result.insertId, message: "Task created successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [task] = await db.execute("SELECT * FROM tasks WHERE id=?", [id]);

        if (task.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { task_name, description, start_date, due_date, priority, status, assigned_to, reminder } = req.body;

    try {
        const sqlQuery = `
            UPDATE tasks 
            SET task_name=?, description=?, start_date=?, due_date=?, priority=?, status=?, assigned_to=?, reminder=? 
            WHERE id=?
        `;

        console.log("Executing SQL Query:", sqlQuery);
        console.log("Values:", [task_name, description, start_date, due_date, priority, status, assigned_to, reminder, id]);

        const [result] = await db.execute(sqlQuery, [
            task_name, description, start_date, due_date, priority, status, assigned_to, reminder, id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found or no changes made" });
        }

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.error(" Database error:", error);
        res.status(500).json({ error: error.message });
    }
});


