import React from "react";

function TaskCard({ task, onToggle, onDelete, deadlineStatus }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`task-card priority-${task.priority} ${task.status === "completed" ? "done" : ""}`}
    >
      <div className="task-info" style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="task-title">{task.title}</div>
          {task.deadline && deadlineStatus && (
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                padding: "4px 12px",
                borderRadius: "20px",
                background: deadlineStatus.bg,
                color: deadlineStatus.color,
                whiteSpace: "nowrap",
                marginLeft: "12px",
                flexShrink: 0,
              }}
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
          {task.deadline && (
            <span style={{ fontSize: "12px", color: "#888" }}>
              📅 Due: {formatDate(task.deadline)}
            </span>
          )}
          {!task.deadline && (
            <span style={{ fontSize: "11px", color: "#ccc" }}>No deadline set</span>
          )}
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