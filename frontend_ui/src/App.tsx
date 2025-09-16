import React from 'react';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import { useTasksStore } from './store/useTasksStore';

// PUBLIC_INTERFACE
export default function App() {
  /**
   * This is the main application layout. It renders:
   * - Header: title, theme toggle, settings/profile placeholder
   * - TaskInput: add task with validation, category, due date
   * - FilterBar: filter chips with counts (All, Active, Completed)
   * - TaskList: list of task cards with complete/edit/delete and inline edit
   * State is managed by Zustand store and persisted to backend/localStorage.
   */
  const tasks = useTasksStore((s) => s.tasks);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <section aria-labelledby="add-task">
          <h2 id="add-task" className="sr-only">Add a new task</h2>
          <TaskInput />
        </section>

        <section aria-labelledby="filters" className="mt-4 sm:mt-6">
          <h2 id="filters" className="sr-only">Task filters</h2>
          <FilterBar />
        </section>

        <section aria-labelledby="tasks" className="mt-4 sm:mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 id="tasks" className="text-lg font-semibold">Tasks</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tasks.length} total</p>
          </div>
          <TaskList />
        </section>
      </main>
    </div>
  );
}
