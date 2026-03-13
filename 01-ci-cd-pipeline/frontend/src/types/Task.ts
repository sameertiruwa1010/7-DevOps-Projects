export type Priority = 'low' | 'medium' | 'high';
export type Category = 'general' | 'work' | 'personal' | 'shopping' | 'health';

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string | null;
  completedAt: string | null;
  tags: string[];
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: Priority;
  category?: Category;
  dueDate?: string | null;
  tags?: string[];
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  completed?: boolean;
}

export interface TaskFilters {
  completed?: 'true' | 'false';
  priority?: Priority;
  category?: Category;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: Record<Priority, number>;
  byCategory: Record<Category, number>;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Array<{ field: string; message: string }>;
}
