const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ===============================
// Load data from file on startup
// ===============================

const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return { users: [], tasks: [], nextUserId: 1, nextTaskId: 1 };
  }
}

function saveData() {
  const data = {
    users: global.users,
    tasks: global.tasks,
    nextUserId: global.nextUserId,
    nextTaskId: global.nextTaskId,
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const data = loadData();
global.users = data.users;
global.tasks = data.tasks;
global.nextUserId = data.nextUserId;
global.nextTaskId = data.nextTaskId;
global.saveData = saveData;

// ===============================
// Routes
// ===============================

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ===============================
// Health check route
// ===============================

app.get("/", (req, res) => {
  res.json({ message: "Student Task Manager API is running" });
});

// ===============================
// Start server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});