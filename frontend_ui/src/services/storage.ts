import type { ApiTask } from './api';

const KEY = 'smarttodo_tasks';

// PUBLIC_INTERFACE
export function loadTasks(): ApiTask[] {
  /** Load tasks from localStorage. */
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ApiTask[];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveTasks(tasks: ApiTask[]): void {
  /** Save tasks to localStorage. */
  localStorage.setItem(KEY, JSON.stringify(tasks));
}
