import axios from 'axios';

const baseURL = (import.meta as any).env?.VITE_BACKEND_URL || '/api';

export type ApiTask = {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
  dueDate?: string; // ISO date string
  // order?: number; // for future feature
};

export const api = axios.create({ baseURL, timeout: 5000 });

// PUBLIC_INTERFACE
export async function fetchTasks(): Promise<ApiTask[]> {
  /** Fetch tasks from backend. Throws if the request fails. */
  const res = await api.get<ApiTask[]>('/tasks');
  return res.data;
}

// PUBLIC_INTERFACE
export async function createTask(payload: Partial<ApiTask>): Promise<ApiTask> {
  /** Create a new task via backend. */
  const res = await api.post<ApiTask>('/tasks', payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateTaskApi(id: string, payload: Partial<ApiTask>): Promise<ApiTask> {
  /** Update a task by id via backend. */
  const res = await api.put<ApiTask>(`/tasks/${id}`, payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteTask(id: string): Promise<void> {
  /** Delete a task by id via backend. */
  await api.delete(`/tasks/${id}`);
}
