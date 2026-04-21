import React from "react";

function TaskCard({ task, onToggle, onDelete, onEdit, deadlineStatus }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={`task-card priority-${task.priority} ${task.status === "completed" ? "done" : ""}`}>
      <div className="task-info">

        <div className="task-top-row">
          <div className="task-title">{task.title}</div>
          {task.deadline && deadlineStatus && (
            <span
              className="deadline-badge"
              style={{ background: deadlineStatus.bg, color: deadlineStatus.color }}
            >
              {deadlineStatus.label}
            </span>
          )}
        </div>

        {task.description && (
          <div className="task-desc">{task.description}</div>
        )}

        <div className="task-meta">
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          <span className={`badge badge-${task.status}`}>{task.status}</span>
          {task.category && (
            <span className="badge-cat">{task.category}</span>
          )}
          {task.deadline && (
            <span className="due-date-text">📅 {formatDate(task.deadline)}</span>
          )}
        </div>

      </div>

      <div className="task-actions">
        {task.status === "pending" && (
          <button className="btn-done" onClick={() => onToggle(task.id)}>Done</button>
        )}
        <button className="btn-edit" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}

export default TaskCard;