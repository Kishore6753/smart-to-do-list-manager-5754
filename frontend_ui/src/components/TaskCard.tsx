import React, { useEffect, useRef, useState } from 'react';
import { Task, useTasksStore } from '../store/useTasksStore';
import clsx from 'clsx';
import { format, parseISO, isBefore } from 'date-fns';

type Props = { task: Task };

// PUBLIC_INTERFACE
export default function TaskCard({ task }: Props) {
  /**
   * Each task presented as a card with:
   * - Checkbox to mark complete
   * - Inline edit on title (double-click or edit button)
   * - Delete button with subtle animation feedback
   * - Category badge and due date chip
   */
  const toggleComplete = useTasksStore((s) => s.toggleComplete);
  const updateTask = useTasksStore((s) => s.updateTask);
  const removeTask = useTasksStore((s) => s.removeTask);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const onSave = async () => {
    const title = draft.trim();
    if (title && title !== task.title) {
      await updateTask(task.id, { title });
    }
    setEditing(false);
  };

  const due = task.dueDate ? parseISO(task.dueDate) : null;
  const overdue = due ? isBefore(due, new Date()) && !task.completed : false;

  return (
    <div className="card-hover bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <input
          id={`task-${task.id}`}
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
          className="mt-1 h-5 w-5 accent-primary"
          aria-label={`Mark ${task.title} as ${task.completed ? 'active' : 'completed'}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {editing ? (
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={onSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSave();
                  if (e.key === 'Escape') { setDraft(task.title); setEditing(false); }
                }}
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                aria-label="Edit task title"
              />
            ) : (
              <label
                htmlFor={`task-${task.id}`}
                onDoubleClick={() => setEditing(true)}
                className={clsx(
                  'font-medium block',
                  task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
                )}
              >
                {task.title}
              </label>
            )}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 text-sm"
                aria-label="Edit task"
                title="Edit"
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => removeTask(task.id)}
                className="px-2 py-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                aria-label="Delete task"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {task.category && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {task.category}
              </span>
            )}
            {task.dueDate && (
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full',
                  overdue ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300'
                )}
              >
                Due {format(parseISO(task.dueDate), 'MMM d, yyyy')}
              </span>
            )}
            {task.completed && (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200">
                Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
