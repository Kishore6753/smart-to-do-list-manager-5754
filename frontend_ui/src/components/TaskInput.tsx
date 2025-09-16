import React, { useMemo, useState } from 'react';
import { useTasksStore } from '../store/useTasksStore';
import { format } from 'date-fns';

const categories = ['General', 'Work', 'Personal', 'Errand', 'Learning'];

// PUBLIC_INTERFACE
export default function TaskInput() {
  /**
   * Controlled input for creating tasks:
   * - Validates non-empty title
   * - Optional category and due date
   * - Enter key submits
   * - Button disabled when invalid or submitting
   */
  const addTask = useTasksStore((s) => s.addTask);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [dueDate, setDueDate] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => title.trim().length > 0, [title]);

  const submit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        category,
        dueDate: dueDate || undefined
      });
      setTitle('');
      setCategory(categories[0]);
      setDueDate('');
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-3 sm:p-4 shadow-card">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="What needs to be done?"
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
          aria-label="Task title"
        />
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            aria-label="Category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            aria-label="Due date"
            min={format(new Date(), 'yyyy-MM-dd')}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!isValid || submitting}
            className="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={!isValid || submitting}
          >
            Add Task
          </button>
        </div>
      </div>
      {!isValid && (
        <p className="mt-2 text-sm text-red-600">Task title cannot be empty.</p>
      )}
    </div>
  );
}
