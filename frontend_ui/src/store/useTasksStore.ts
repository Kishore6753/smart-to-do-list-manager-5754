import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createTask, deleteTask, fetchTasks, updateTaskApi, type ApiTask } from '../services/api';
import { loadTasks, saveTasks } from '../services/storage';

export type Filter = 'all' | 'active' | 'completed';
export type Task = ApiTask;

type State = {
  tasks: Task[];
  filter: Filter;
  counts: { all: number; active: number; completed: number };
  filteredTasks: Task[];
};

type Actions = {
  setTasks: (tasks: Task[]) => void;
  setFilter: (filter: Filter) => void;
  hydrate: () => Promise<void>;
  addTask: (t: { title: string; category?: string; dueDate?: string }) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
};

// Helpers
const count = (tasks: Task[]) => ({
  all: tasks.length,
  active: tasks.filter((t) => !t.completed).length,
  completed: tasks.filter((t) => t.completed).length
});

const selectByFilter = (tasks: Task[], filter: Filter): Task[] => {
  if (filter === 'active') return tasks.filter((t) => !t.completed);
  if (filter === 'completed') return tasks.filter((t) => t.completed);
  return tasks;
};

// PUBLIC_INTERFACE
export const useTasksStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      tasks: [],
      filter: 'all',
      counts: { all: 0, active: 0, completed: 0 },
      filteredTasks: [],

      setTasks: (tasks) => {
        const { filter } = get();
        set({
          tasks,
          counts: count(tasks),
          filteredTasks: selectByFilter(tasks, filter)
        });
        // Keep localStorage in sync as a backup/offline cache
        saveTasks(tasks);
      },

      setFilter: (filter) => {
        const { tasks } = get();
        set({ filter, filteredTasks: selectByFilter(tasks, filter) });
      },

      hydrate: async () => {
        // Try backend first; fallback to local cache
        try {
          const serverTasks = await fetchTasks();
          get().setTasks(serverTasks);
        } catch {
          const cached = loadTasks();
          get().setTasks(cached);
        }
      },

      addTask: async ({ title, category, dueDate }) => {
        // optimistic add with temporary id
        const tempId = 'tmp-' + Date.now();
        const optimistic: Task = {
          id: tempId,
          title,
          completed: false,
          category,
          dueDate
        };
        const prev = get().tasks;
        get().setTasks([optimistic, ...prev]);
        try {
          let created: Task;
          try {
            created = await createTask({ title, category, dueDate });
          } catch {
            // fallback to local save if backend unavailable
            created = { ...optimistic, id: String(Date.now()) };
          }
          const replaced = get().tasks.map((t) => (t.id === tempId ? created : t));
          get().setTasks(replaced);
        } catch {
          // rollback on failure
          get().setTasks(prev);
        }
      },

      updateTask: async (id, updates) => {
        const prev = get().tasks;
        const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
        get().setTasks(next);
        try {
          try {
            await updateTaskApi(id, updates);
          } catch {
            // if backend fails, rely on localStorage persistence already done by setTasks
          }
        } catch {
          // rollback on severe error
          get().setTasks(prev);
        }
      },

      toggleComplete: async (id) => {
        const t = get().tasks.find((x) => x.id === id);
        if (!t) return;
        await get().updateTask(id, { completed: !t.completed });
      },

      removeTask: async (id) => {
        const prev = get().tasks;
        const next = prev.filter((t) => t.id !== id);
        get().setTasks(next);
        try {
          try {
            await deleteTask(id);
          } catch {
            // ignore if backend not reachable
          }
        } catch {
          // rollback
          get().setTasks(prev);
        }
      }
    }),
    {
      name: 'smarttodo_store',
      // Persist only minimal UI state (filter). Tasks are handled via custom save to keep schema controlled.
      partialize: (state) => ({ filter: state.filter })
    }
  )
);

// PUBLIC_INTERFACE
export async function hydrateFromStorage() {
  /**
   * PUBLIC helper to hydrate store on app load.
   * Attempts server fetch, falling back to local cache.
   */
  await useTasksStore.getState().hydrate();
}
