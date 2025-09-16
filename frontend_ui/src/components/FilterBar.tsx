import React from 'react';
import { useTasksStore } from '../store/useTasksStore';
import clsx from 'clsx';

const filters = ['all', 'active', 'completed'] as const;
type Filter = typeof filters[number];

// PUBLIC_INTERFACE
export default function FilterBar() {
  /** Render filter tabs with task counts and update store filter state. */
  const { filter, setFilter, counts } = useTasksStore((s) => ({
    filter: s.filter,
    setFilter: s.setFilter,
    counts: s.counts
  }));

  const getCount = (f: Filter) => {
    switch (f) {
      case 'all': return counts.all;
      case 'active': return counts.active;
      case 'completed': return counts.completed;
    }
  };

  return (
    <div className="flex gap-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-2 shadow-card">
      {filters.map((f) => {
        const selected = filter === f;
        return (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1.5 rounded-md text-sm font-medium',
              selected
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800'
            )}
            aria-pressed={selected}
          >
            {f[0].toUpperCase() + f.slice(1)} ({getCount(f)})
          </button>
        );
      })}
    </div>
  );
}
```

Explanation: TaskList renders TaskCards with transitions; applies filtering in selector.
````write file="smart-to-do-list-manager-5754/frontend_ui/src/components/TaskList.tsx"
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TaskCard from './TaskCard';
import { useTasksStore } from '../store/useTasksStore';

// PUBLIC_INTERFACE
export default function TaskList() {
  /**
   * Renders a list of TaskCard items based on current filter.
   * Uses TransitionGroup for entry/exit animations.
   */
  const tasks = useTasksStore((s) => s.filteredTasks);

  if (!tasks.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No tasks to show. Add your first task above.
      </div>
    );
  }

  return (
    <TransitionGroup component="div" className="space-y-3 sm:space-y-4">
      {tasks.map((t) => (
        <CSSTransition key={t.id} timeout={150} classNames="fade">
          <TaskCard task={t} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}
