import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskFilters, CreateTaskPayload, UpdateTaskPayload, Task, Priority, Category } from '../types/Task';
import StatsBar from './StatsBar';
import TaskForm from './TaskForm';
import TaskFiltersBar from './TaskFiltersBar';
import TaskCard from './TaskCard';
import Toast from './Toast';
import './TaskManager.css';

const TaskManager: React.FC = () => {
  const {
    tasks, stats, loading, statsLoading, error, successMessage,
    total, filters, setFilters, addTask, editTask,
    toggleTaskCompletion, removeTask, clearCompleted, clearError,
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async (payload: CreateTaskPayload) => {
    await addTask(payload);
    setShowForm(false);
  };

  const handleEdit = async (id: string, payload: UpdateTaskPayload) => {
    await editTask(id, payload);
    setEditingTask(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await removeTask(id);
    } finally {
      setDeletingId(null);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="tm-shell">
      {/* Background decoration */}
      <div className="tm-bg-glow" aria-hidden />

      {/* Header */}
      <header className="tm-header">
        <div className="tm-header-inner">
          <div className="tm-brand">
            <div className="tm-brand-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="2" fill="var(--accent)" />
                <rect x="11" y="2" width="7" height="7" rx="2" fill="var(--accent)" opacity="0.5" />
                <rect x="2" y="11" width="7" height="7" rx="2" fill="var(--accent)" opacity="0.5" />
                <rect x="11" y="11" width="7" height="7" rx="2" fill="var(--accent)" opacity="0.3" />
              </svg>
            </div>
            <span className="tm-brand-name">Taskboard</span>
          </div>
          <div className="tm-header-actions">
            {completedCount > 0 && (
              <button className="tm-btn tm-btn-ghost tm-btn-sm" onClick={clearCompleted}>
                Clear {completedCount} done
              </button>
            )}
            <button
              className="tm-btn tm-btn-primary"
              onClick={() => { setShowForm(true); setEditingTask(null); }}
            >
              <span aria-hidden>+</span> New Task
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="tm-main">
        {/* Stats */}
        <StatsBar stats={stats} loading={statsLoading} />

        {/* Filters */}
        <TaskFiltersBar filters={filters} onFilterChange={setFilters} total={total} />

        {/* Task list */}
        <section className="tm-task-section">
          {loading ? (
            <div className="tm-skeleton-list">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="tm-skeleton-card" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState hasFilters={Object.keys(filters).some((k) => filters[k as keyof TaskFilters])} />
          ) : (
            <ul className="tm-task-list" role="list">
              {tasks.map((task) => (
                <li key={task._id}>
                  <TaskCard
                    task={task}
                    onToggle={() => toggleTaskCompletion(task._id)}
                    onEdit={() => { setEditingTask(task); setShowForm(false); }}
                    onDelete={() => handleDelete(task._id)}
                    isDeleting={deletingId === task._id}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Slide-in Form Panel */}
      {(showForm || editingTask) && (
        <div className="tm-overlay" onClick={() => { setShowForm(false); setEditingTask(null); }}>
          <aside className="tm-panel" onClick={(e) => e.stopPropagation()}>
            <div className="tm-panel-header">
              <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
              <button
                className="tm-btn tm-btn-icon"
                onClick={() => { setShowForm(false); setEditingTask(null); }}
                aria-label="Close panel"
              >✕</button>
            </div>
            <TaskForm
              initialValues={editingTask ?? undefined}
              onSubmit={editingTask
                ? (p) => handleEdit(editingTask._id, p as UpdateTaskPayload)
                : handleCreate}
              onCancel={() => { setShowForm(false); setEditingTask(null); }}
              isEditing={!!editingTask}
            />
          </aside>
        </div>
      )}

      {/* Toasts */}
      {error && <Toast message={error} type="error" onClose={clearError} />}
      {successMessage && <Toast message={successMessage} type="success" />}
    </div>
  );
};

const EmptyState: React.FC<{ hasFilters: boolean }> = ({ hasFilters }) => (
  <div className="tm-empty">
    <div className="tm-empty-icon" aria-hidden>
      {hasFilters ? '🔍' : '✦'}
    </div>
    <p className="tm-empty-title">{hasFilters ? 'No matching tasks' : 'All clear!'}</p>
    <p className="tm-empty-sub">
      {hasFilters
        ? 'Try adjusting your filters to see more tasks.'
        : 'Create a task to get started.'}
    </p>
  </div>
);

export default TaskManager;
