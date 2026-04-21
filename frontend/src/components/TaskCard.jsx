import React from "react";

function TaskCard({ task, onToggle, onDelete }) {
  return (
    <div className={`task-card priority-${task.priority} ${task.status === "completed" ? "done" : ""}`}>
      <div className="task-info">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-desc">{task.description}</div>
        )}
        <div className="task-meta">
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          <span className={`badge badge-${task.status}`}>{task.status}</span>
          <span style={{ fontSize: "11px", color: "#bbb" }}>
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="task-actions">
        {task.status === "pending" && (
          <button className="btn-done" onClick={() => onToggle(task.id)}>
            Done
          </button>
        )}
        <button className="btn-delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;