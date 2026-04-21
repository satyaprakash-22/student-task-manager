const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* CORS Configuration
   Allow frontend deployed on Vercel.
   During testing, "*" can be used.
*/
app.use(cors({
  origin: "*", // change to Vercel URL after deployment
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ===============================
// In-memory storage (temporary)
// ===============================

global.users = [];
global.tasks = [];

global.nextUserId = 1;
global.nextTaskId = 1;

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
  res.json({
    message: "Student Task Manager API is running"
  });
});

// ===============================
// Start server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});