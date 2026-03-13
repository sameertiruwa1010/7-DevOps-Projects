import React, { useState } from 'react';
import { Task } from '../types/Task';
import { format, isPast, parseISO } from 'date-fns';
import './TaskCard.css';

interface Props {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const PRIORITY_LABELS = { low: 'Low', medium: 'Med', high: 'High' };
const CATEGORY_ICONS: Record<string, string> = {
  general: '◆', work: '💼', personal: '👤', shopping: '🛒', health: '💚',
};

const TaskCard: React.FC<Props> = ({ task, onToggle, onEdit, onDelete, isDeleting }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOverdue = task.dueDate && !task.completed && isPast(parseISO(task.dueDate));

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  return (
    <article className={`task-card ${task.completed ? 'task-completed' : ''} ${isDeleting ? 'task-deleting' : ''}`}>
      {/* Priority indicator */}
      <div className={`task-priority-bar priority-${task.priority}`} aria-hidden />

      {/* Checkbox */}
      <label className="task-checkbox-wrap" aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}>
        <input
          type="checkbox"
          className="task-checkbox-input sr-only"
          checked={task.completed}
          onChange={onToggle}
        />
        <span className="task-checkbox" aria-hidden>
          {task.completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
      </label>

      {/* Content */}
      <div className="task-body">
        <div className="task-top">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-badges">
            <span className={`task-badge badge-priority priority-${task.priority}`}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            <span className="task-badge badge-category">
              {CATEGORY_ICONS[task.category] || '◆'} {task.category}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          {task.dueDate && (
            <span className={`task-meta-item ${isOverdue ? 'meta-overdue' : ''}`}>
              <span aria-hidden>{isOverdue ? '⚠' : '📅'}</span>
              {format(parseISO(task.dueDate), 'MMM d, yyyy')}
              {isOverdue && ' · Overdue'}
            </span>
          )}
          {task.completed && task.completedAt && (
            <span className="task-meta-item meta-done">
              <span aria-hidden>✓</span>
              Done {format(parseISO(task.completedAt), 'MMM d')}
            </span>
          )}
          {task.tags.length > 0 && (
            <div className="task-tags">
              {task.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="task-tag">#{tag}</span>
              ))}
              {task.tags.length > 3 && <span className="task-tag">+{task.tags.length - 3}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button
          className="task-action-btn"
          onClick={onEdit}
          aria-label="Edit task"
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 2L12 4.5L5 11.5H2.5V9L9.5 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className={`task-action-btn ${confirmDelete ? 'action-danger' : ''}`}
          onClick={handleDeleteClick}
          disabled={isDeleting}
          aria-label={confirmDelete ? 'Click again to confirm delete' : 'Delete task'}
          title={confirmDelete ? 'Click to confirm' : 'Delete'}
        >
          {isDeleting ? (
            <span className="spinner" aria-hidden />
          ) : confirmDelete ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4H12M5 4V2.5H9V4M5.5 6.5V10.5M8.5 6.5V10.5M3 4L3.5 11.5H10.5L11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
