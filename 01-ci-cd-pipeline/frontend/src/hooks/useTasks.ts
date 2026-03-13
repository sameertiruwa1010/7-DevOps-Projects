import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
  getTaskStats,
} from '../services/api';
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskFilters, TaskStats } from '../types/Task';

export interface UseTasksReturn {
  tasks: Task[];
  stats: TaskStats | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  successMessage: string | null;
  total: number;
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  addTask: (payload: CreateTaskPayload) => Promise<void>;
  editTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  refreshTasks: () => void;
  clearError: () => void;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<TaskFilters>({});
  const refreshKey = useRef(0);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTasks(filters);
      setTasks(result.data);
      setTotal(result.pagination.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, refreshKey.current]); // eslint-disable-line

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await getTaskStats();
      setStats(data);
    } catch {
      // Stats are non-critical
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchStats(); }, [fetchStats, tasks.length]);

  const refreshTasks = () => {
    refreshKey.current += 1;
    fetchTasks();
  };

  const addTask = async (payload: CreateTaskPayload) => {
    try {
      const newTask = await createTask(payload);
      setTasks((prev) => [newTask, ...prev]);
      setTotal((t) => t + 1);
      showSuccess('Task created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      throw err;
    }
  };

  const editTask = async (id: string, payload: UpdateTaskPayload) => {
    try {
      const updated = await updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      showSuccess('Task updated!');
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      throw err;
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err: any) {
      // Revert
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );
      setError(err.message || 'Failed to update task');
    }
  };

  const removeTask = async (id: string) => {
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== id));
    setTotal((t) => t - 1);
    try {
      await deleteTask(id);
      showSuccess('Task deleted.');
    } catch (err: any) {
      setTasks(prevTasks);
      setTotal((t) => t + 1);
      setError(err.message || 'Failed to delete task');
    }
  };

  const clearCompleted = async () => {
    try {
      const message = await deleteCompletedTasks();
      setTasks((prev) => prev.filter((t) => !t.completed));
      showSuccess(message);
    } catch (err: any) {
      setError(err.message || 'Failed to clear completed tasks');
    }
  };

  return {
    tasks,
    stats,
    loading,
    statsLoading,
    error,
    successMessage,
    total,
    filters,
    setFilters,
    addTask,
    editTask,
    toggleTaskCompletion,
    removeTask,
    clearCompleted,
    refreshTasks,
    clearError: () => setError(null),
  };
};
