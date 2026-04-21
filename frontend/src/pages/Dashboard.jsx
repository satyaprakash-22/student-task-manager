import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium", deadline: "" });
  const [taskError, setTaskError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks", authHeader);
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setTaskError("Task title cannot be empty");
      return;
    }
    if (!newTask.deadline) {
      setTaskError("Please set a deadline");
      return;
    }
    try {
      await axios.post("/api/tasks", newTask, authHeader);
      setNewTask({ title: "", description: "", priority: "medium", deadline: "" });
      setShowModal(false);
      setTaskError("");
      fetchTasks();
    } catch (err) {
      setTaskError("Failed to add task");
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`/api/tasks/${id}`, { status: "completed" }, authHeader);
      fetchTasks();
    } catch (err) {
      console.log("Error updating task", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, authHeader);
      fetchTasks();
    } catch (err) {
      console.log("Error deleting task", err);
    }
  };

  const priorityWeight = { high: 1, medium: 2, low: 3 };

  const sortedAndFiltered = tasks
    .filter((t) => {
      if (filter === "all") return true;
      if (filter === "pending") return t.status === "pending";
      if (filter === "completed") return t.status === "completed";
      if (filter === "high") return t.priority === "high";
      return true;
    })
    .sort((a, b) => {
      // completed tasks always go to bottom
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;

      const deadlineA = a.deadline ? new Date(a.deadline) : new Date("9999-12-31");
      const deadlineB = b.deadline ? new Date(b.deadline) : new Date("9999-12-31");

      // first sort by deadline
      if (deadlineA - deadlineB !== 0) return deadlineA - deadlineB;

      // if same deadline, sort by priority
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(deadline);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: "Overdue", color: "#c53030", bg: "#fff5f5" };
    if (diffDays === 0) return { label: "Due today", color: "#c05621", bg: "#fffaf0" };
    if (diffDays === 1) return { label: "Due tomorrow", color: "#b7791f", bg: "#fefcbf" };
    if (diffDays <= 3) return { label: `${diffDays} days left`, color: "#b7791f", bg: "#fefcbf" };
    return { label: `${diffDays} days left`, color: "#276749", bg: "#f0fff4" };
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Hello, <span>{user.name || "Student"}</span> </h2>
        <button className="btn-add" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-label">Total tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pendingTasks}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
          </div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      <div className="filter-bar">
        {["all", "pending", "completed", "high"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="tasks-list">
        {sortedAndFiltered.length === 0 ? (
          <div className="empty-state">
            No tasks here. Click "+ Add Task" to get started!
          </div>
        ) : (
          sortedAndFiltered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              deadlineStatus={getDeadlineStatus(task.deadline)}
            />
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Add new task</h3>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Complete DSA assignment"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  rows="3"
                  placeholder="Any details..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
              {taskError && <p className="error-msg">{taskError}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;