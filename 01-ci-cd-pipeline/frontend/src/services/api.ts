import axios, { AxiosError } from 'axios';
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilters,
  PaginatedResponse,
  TaskStats,
} from '../types/Task';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error normalization
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; details?: any[] }>) => {
    if (error.response) {
      const message = error.response.data?.error || `Request failed (${error.response.status})`;
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  }
);

export const getTasks = async (filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.append(key, String(value));
  });
  const response = await api.get<PaginatedResponse<Task>>(`/tasks?${params.toString()}`);
  return response.data;
};

export const getTaskStats = async (): Promise<TaskStats> => {
  const response = await api.get<{ success: boolean; data: TaskStats }>('/tasks/stats');
  return response.data.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<{ success: boolean; data: Task }>(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await api.post<{ success: boolean; data: Task }>('/tasks', payload);
  return response.data.data;
};

export const updateTask = async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
  const response = await api.put<{ success: boolean; data: Task }>(`/tasks/${id}`, payload);
  return response.data.data;
};

export const toggleTask = async (id: string): Promise<Task> => {
  const response = await api.patch<{ success: boolean; data: Task }>(`/tasks/${id}/toggle`);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const deleteCompletedTasks = async (): Promise<string> => {
  const response = await api.delete<{ success: boolean; message: string }>('/tasks/completed');
  return response.data.message;
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
};
