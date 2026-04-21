import React, { useState, useEffect } from "react";
import API from "../api";
import TaskCard from "../components/TaskCard";

const CATEGORIES = ["General", "Academics", "Project", "Personal", "Exam", "Other"];

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [taskError, setTaskError] = useState("");

  const emptyForm = { title: "", description: "", priority: "medium", deadline: "", category: "General" };
  const [form, setForm] = useState(emptyForm);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks", authHeader);
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks", err);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const openAddModal = () => {
    setEditTask(null);
    setForm(emptyForm);
    setTaskError("");
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline || "",
      category: task.category || "General",
    });
    setTaskError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setTaskError("Title cannot be empty"); return; }
    if (!form.deadline) { setTaskError("Please set a deadline"); return; }
    try {
      if (editTask) {
        await API.put(`/api/tasks/${editTask.id}`, form, authHeader);
      } else {
        await API.post("/api/tasks", form, authHeader);
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditTask(null);
      setTaskError("");
      fetchTasks();
    } catch (err) {
      setTaskError("Something went wrong");
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.put(`/api/tasks/${id}`, { status: "completed" }, authHeader);
      fetchTasks();
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/tasks/${id}`, authHeader);
      fetchTasks();
    } catch (err) { console.log(err); }
  };

  const priorityWeight = { high: 1, medium: 2, low: 3 };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(deadline);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    if (diff < 0)   return { label: "Overdue",          color: "#c53030", bg: "#fff5f5" };
    if (diff === 0) return { label: "Due today",         color: "#c05621", bg: "#fffaf0" };
    if (diff === 1) return { label: "Due tomorrow",      color: "#b7791f", bg: "#fefcbf" };
    if (diff <= 3)  return { label: `${diff} days left`, color: "#b7791f", bg: "#fefcbf" };
    return           { label: `${diff} days left`,       color: "#276749", bg: "#f0fff4" };
  };

  const isOverdue = (task) => {
    if (!task.deadline || task.status === "completed") return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(task.deadline) < today;
  };

  const filtered = tasks
    .filter((t) => {
      if (filter === "all") return true;
      if (filter === "pending") return t.status === "pending";
      if (filter === "completed") return t.status === "completed";
      if (filter === "high") return t.priority === "high";
      if (filter === "overdue") return isOverdue(t);
      return true;
    })
    .filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      const da = a.deadline ? new Date(a.deadline) : new Date("9999-12-31");
      const db = b.deadline ? new Date(b.deadline) : new Date("9999-12-31");
      if (da - db !== 0) return da - db;
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const overdue = tasks.filter(isOverdue).length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Hello, <span>{user.name || "Student"}</span> 👋</h2>
        <button className="btn-add" onClick={openAddModal}>+ Add Task</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: overdue > 0 ? "#e53e3e" : "var(--accent)" }}>
            {overdue}
          </div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {total > 0 ? Math.round((completed / total) * 100) : 0}%
          </div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      <input
        className="search-bar"
        placeholder="Search by title, description or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
        <button
          className={`filter-btn overdue-btn ${filter === "overdue" ? "active" : ""}`}
          onClick={() => setFilter("overdue")}
        >
          Overdue {overdue > 0 && `(${overdue})`}
        </button>
      </div>

      <div className="tasks-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {search ? "No tasks match your search." : "No tasks here. Click '+ Add Task' to get started!"}
          </div>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={openEditModal}
              deadlineStatus={getDeadlineStatus(task.deadline)}
            />
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editTask ? "Edit task" : "Add new task"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Complete DSA assignment"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  rows="2"
                  placeholder="Any details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
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
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
              {taskError && <p className="error-msg">{taskError}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editTask ? "Save changes" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;