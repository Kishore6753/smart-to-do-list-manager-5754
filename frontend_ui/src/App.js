import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { TasksAPI, CategoriesAPI, RemindersAPI } from "./api";

// Simple utility to format date strings as local friendly
function fmtDate(s) {
  if (!s) return "";
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleString();
  } catch {
    return s;
  }
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root app holding theme state and layout */
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="App">
      <nav className="navbar">
        <div className="brand">Smart To-Do</div>
        <button
          className="theme-toggle"
          onClick={() =>
            setTheme((t) => (t === "light" ? "dark" : "light"))
          }
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>

      <div className="container">
        <div className="grid">
          <aside className="card">
            <CategoriesPanel />
          </aside>
          <main className="card">
            <TasksPanel />
          </main>
        </div>
      </div>
    </div>
  );
}

function useAsync(asyncFn, deps) {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  useEffect(() => {
    let mounted = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    asyncFn()
      .then((data) => mounted && setState({ loading: false, error: null, data }))
      .catch((error) => mounted && setState({ loading: false, error, data: null }));
    return () => {
      mounted = false;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await CategoriesAPI.list().catch(() => []);
      setCategories(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { categories, setCategories, loading, error, refresh };
}

function CategoriesPanel() {
  const { categories, setCategories, loading, error, refresh } = useCategories();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#E87A41");
  const colorPresets = [
    { label: "Orange", value: "#E87A41" },
    { label: "Blue", value: "#2563EB" },
    { label: "Green", value: "#059669" },
    { label: "Purple", value: "#7C3AED" },
    { label: "Gray", value: "#6B7280" },
  ];

  const addCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const created = await CategoriesAPI.create({ name: name.trim(), color });
      setCategories((prev) => [...prev, created]);
      setName("");
    } catch (err) {
      alert(`Failed to add category: ${err.message}`);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await CategoriesAPI.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
    } catch (err) {
      alert(`Failed to delete category: ${err.message}`);
    }
  };

  return (
    <div>
      <h3 className="section-title">Categories</h3>

      <form onSubmit={addCategory} style={{ marginBottom: 12 }}>
        <div className="row">
          <input
            className="input"
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Category name"
          />
          <select
            className="select"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Preset color"
            title="Choose a preset color"
            style={{ minWidth: 140 }}
          >
            {colorPresets.map((p) => (
              <option value={p.value} key={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Pick color"
            style={{ width: 50, padding: 4 }}
          />
          <button className="btn primary" type="submit">
            Add
          </button>
        </div>
      </form>

      <div className="divider" />

      {loading ? (
        <div className="empty">Loading categories...</div>
      ) : error ? (
        <div className="empty">Failed to load categories</div>
      ) : categories.length === 0 ? (
        <div className="empty">No categories yet</div>
      ) : (
        <ul className="list" aria-label="Category list">
          {categories.map((c) => {
            const id = c.id ?? c._id;
            return (
              <li
                key={id}
                className="task-item"
                style={{ gridTemplateColumns: "1fr auto" }}
              >
                <div>
                  <div className="task-title">{c.name}</div>
                  <div className="task-meta">
                    <span className="badge">
                      <span
                        className="dot"
                        style={{ background: c.color || "#ccc" }}
                      />
                      {c.color || "No color"}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => remove(id)}
                    aria-label={`Delete ${c.name}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button className="btn ghost" style={{ marginTop: 10 }} onClick={refresh}>
        Refresh
      </button>
    </div>
  );
}

function TasksPanel() {
  const { categories } = useCategories();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [draggingId, setDraggingId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterCategory) params.category_id = filterCategory;
      if (onlyActive) params.completed = false;
      if (query) params.q = query;
      const data = await TasksAPI.list(params);
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, onlyActive]);

  const onSubmitNew = async (payload) => {
    // Ensure category_id is numeric if present to satisfy backend validation
    const normalized = {
      ...payload,
      category_id:
        payload.category_id !== undefined && payload.category_id !== ""
          ? Number(payload.category_id)
          : undefined,
    };
    const created = await TasksAPI.create(normalized);
    // Some backends may not include all computed fields; fetch latest list for consistency
    try {
      // Optimistically prepend created item if it has an id
      if (created && (created.id ?? created._id)) {
        setTasks((prev) => [created, ...prev]);
      } else {
        await fetchTasks();
      }
    } catch {
      await fetchTasks();
    }
  };

  const onUpdate = async (id, payload) => {
    const updated = await TasksAPI.update(id, payload);
    setTasks((prev) =>
      prev.map((t) => (String(t.id ?? t._id) === String(id) ? updated : t))
    );
  };

  const onDelete = async (id) => {
    await TasksAPI.remove(id);
    setTasks((prev) => prev.filter((t) => String(t.id ?? t._id) !== String(id)));
  };

  const onToggleCompleted = async (id, completed) => {
    await onUpdate(id, { completed });
  };

  // Drag and drop reordering (HTML5 Drag)
  const onDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = async (e, overId) => {
    e.preventDefault();
    const fromId = draggingId ?? e.dataTransfer.getData("text/plain");
    if (!fromId || fromId === overId) {
      setDraggingId(null);
      return;
    }

    const curr = [...tasks];
    const fromIndex = curr.findIndex(
      (t) => String(t.id ?? t._id) === String(fromId)
    );
    const overIndex = curr.findIndex(
      (t) => String(t.id ?? t._id) === String(overId)
    );
    if (fromIndex === -1 || overIndex === -1) {
      setDraggingId(null);
      return;
    }

    const [moved] = curr.splice(fromIndex, 1);
    curr.splice(overIndex, 0, moved);
    // Update local order
    setTasks(curr);

    // Persist order
    const body = curr.map((t, idx) => ({
      id: t.id ?? t._id,
      order_index: idx,
    }));
    try {
      await TasksAPI.reorder(body);
    } catch (err) {
      console.error("Failed to persist order", err);
      // Optional: refetch to get server state
      fetchTasks();
    } finally {
      setDraggingId(null);
    }
  };

  const filtered = useMemo(() => {
    let arr = tasks;
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (t) =>
          String(t.title || "")
            .toLowerCase()
            .includes(q) ||
          String(t.description || "")
            .toLowerCase()
            .includes(q)
      );
    }
    return arr;
  }, [tasks, query]);

  return (
    <div>
      <h3 className="section-title">Tasks</h3>

      <TaskForm categories={categories} onSubmit={onSubmitNew} />

      <div className="row" style={{ marginTop: 10 }}>
        <input
          className="input"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tasks"
        />
        <select
          className="select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => {
            const id = c.id ?? c._id;
            return (
              <option key={id} value={id}>
                {c.name}
              </option>
            );
          })}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
          />
          Hide completed
        </label>
        <button className="btn ghost" onClick={fetchTasks}>
          Refresh
        </button>
      </div>

      <div className="divider" />

      {loading ? (
        <div className="empty">Loading tasks...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">No tasks</div>
      ) : (
        <ul className="list" aria-label="Tasks list">
          {filtered.map((t) => {
            const id = t.id ?? t._id;
            const category =
              categories.find((c) => String(c.id ?? c._id) === String(t.category_id)) ||
              null;
            return (
              <li
                key={id}
                className={"task-item" + (draggingId === id ? " dragging" : "")}
                draggable
                onDragStart={(e) => onDragStart(e, id)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, id)}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={!!t.completed}
                    onChange={(e) => onToggleCompleted(id, e.target.checked)}
                    aria-label={`Mark ${t.title} as ${t.completed ? "incomplete" : "completed"}`}
                  />
                </div>
                <div>
                  <div className="task-title">
                    {t.title}{" "}
                    {category && (
                      <span className="badge" title={category.name}>
                        <span
                          className="dot"
                          style={{ background: category.color || "#ccc" }}
                        />
                        {category.name}
                      </span>
                    )}
                  </div>
                  {t.description && (
                    <div className="task-meta">{t.description}</div>
                  )}
                  <div className="task-meta">
                    {t.due_date && <span>Due: {fmtDate(t.due_date)} </span>}
                    {t.reminder_at && (
                      <span style={{ marginLeft: 8 }}>
                        Reminder: {fmtDate(t.reminder_at)}
                      </span>
                    )}
                  </div>

                  <TaskReminderInline task={t} onUpdated={onUpdate} />
                </div>
                <div className="row">
                  <EditTaskButton task={t} categories={categories} onUpdate={onUpdate} />
                  <button className="btn danger" onClick={() => onDelete(id)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function TaskForm({ categories, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [due, setDue] = useState("");
  const [reminder, setReminder] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      // Coerce category to number if selected
      category_id: categoryId ? Number(categoryId) : undefined,
      due_date: due || undefined,
      reminder_at: reminder || undefined,
      completed: false,
    };
    try {
      await onSubmit(payload);
      setTitle("");
      setDescription("");
      setCategoryId("");
      setDue("");
      setReminder("");
    } catch (err) {
      alert(`Failed to create task: ${err.message}`);
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ marginBottom: 12 }}>
      <div className="form-grid">
        <div>
          <label>Title</label>
          <input
            className="input"
            placeholder="What do you need to do?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Task title"
            required
          />
        </div>
        <div>
          <label>Category</label>
          <select
            className="select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            aria-label="Select category"
          >
            <option value="">None</option>
            {categories.map((c) => {
              const id = c.id ?? c._id;
              return (
                <option key={id} value={id}>
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Description</label>
          <textarea
            className="textarea"
            rows={2}
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Task description"
          />
        </div>
        <div>
          <label>Due date</label>
          <input
            className="input"
            type="datetime-local"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            aria-label="Due date"
          />
        </div>
        <div>
          <label>Reminder</label>
          <input
            className="input"
            type="datetime-local"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            aria-label="Reminder"
          />
        </div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn primary" type="submit">
          Add Task
        </button>
      </div>
    </form>
  );
}

function EditTaskButton({ task, categories, onUpdate }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>
        Edit
      </button>
      {open && (
        <EditTaskModal
          task={task}
          categories={categories}
          onClose={() => setOpen(false)}
          onSave={async (id, payload) => {
            await onUpdate(id, payload);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function EditTaskModal({ task, categories, onClose, onSave }) {
  const id = task.id ?? task._id;
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [categoryId, setCategoryId] = useState(task.category_id || "");
  const [due, setDue] = useState(task.due_date ? toLocalInput(task.due_date) : "");
  const [reminder, setReminder] = useState(
    task.reminder_at ? toLocalInput(task.reminder_at) : ""
  );
  const [completed, setCompleted] = useState(!!task.completed);

  function toLocalInput(val) {
    try {
      const d = new Date(val);
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = d.getFullYear();
      const MM = pad(d.getMonth() + 1);
      const DD = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      return `${yyyy}-${MM}-${DD}T${hh}:${mm}`;
    } catch {
      return "";
    }
  }

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      category_id: categoryId || undefined,
      due_date: due || undefined,
      reminder_at: reminder || undefined,
      completed,
    };
    try {
      await onSave(id, payload);
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit task"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: "min(640px, 96vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="section-title">Edit Task</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div>
              <label>Title</label>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Category</label>
              <select
                className="select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">None</option>
                {categories.map((c) => {
                  const cid = c.id ?? c._id;
                  return (
                    <option key={cid} value={cid}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Description</label>
              <textarea
                className="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Due date</label>
              <input
                className="input"
                type="datetime-local"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </div>
            <div>
              <label>Reminder</label>
              <input
                className="input"
                type="datetime-local"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
              Completed
            </label>
          </div>
          <div className="row" style={{ marginTop: 12, justifyContent: "flex-end" }}>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskReminderInline({ task, onUpdated }) {
  const id = task.id ?? task._id;
  const [remAt, setRemAt] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const noteRef = useRef(null);

  const addReminder = async (e) => {
    e.preventDefault();
    if (!remAt) return;
    setSaving(true);
    try {
      await RemindersAPI.create({ task_id: id, reminder_at: remAt, note: note || undefined });
      // reflect to task immediate for UX (backend might also update task's reminder_at)
      await onUpdated(id, { reminder_at: remAt });
      setRemAt("");
      setNote("");
      noteRef.current?.blur();
    } catch (err) {
      alert(`Failed to add reminder: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={addReminder} style={{ marginTop: 8 }}>
      <div className="row">
        <input
          className="input"
          type="datetime-local"
          value={remAt}
          onChange={(e) => setRemAt(e.target.value)}
          aria-label="Reminder at"
        />
        <input
          ref={noteRef}
          className="input"
          placeholder="Reminder note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          aria-label="Reminder note"
        />
        <button className="btn" type="submit" disabled={saving}>
          Add reminder
        </button>
      </div>
    </form>
  );
}
