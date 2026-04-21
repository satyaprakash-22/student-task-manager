const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Simple in-memory store (no DB needed for CBP)
// users: [{ id, name, email, password }]
// tasks: [{ id, userId, title, description, priority, status, createdAt }]
global.users = [];
global.tasks = [];
global.nextUserId = 1;
global.nextTaskId = 1;

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Student Task Manager API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});