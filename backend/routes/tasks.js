const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, (req, res) => {
  const userTasks = global.tasks.filter((t) => t.userId === req.user.id);
  res.json(userTasks);
});

router.post("/", verifyToken, (req, res) => {
  const { title, description, priority, deadline, category } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = {
    id: global.nextTaskId++,
    userId: req.user.id,
    title,
    description: description || "",
    priority: priority || "medium",
    deadline: deadline || null,
    category: category || "General",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  global.tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put("/:id", verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = global.tasks.findIndex(
    (t) => t.id === taskId && t.userId === req.user.id
  );

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  global.tasks[taskIndex] = { ...global.tasks[taskIndex], ...req.body };
  res.json(global.tasks[taskIndex]);
});

router.delete("/:id", verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = global.tasks.findIndex(
    (t) => t.id === taskId && t.userId === req.user.id
  );

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  global.tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted successfully" });
});

module.exports = router;