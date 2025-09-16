import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoriesAPI, TasksAPI } from "../api";

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

/**
 * Task Modal Page – create/edit task in a centered modal surface.
 */
export default function TaskModalPage({ mode = "create" }) {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    due_date: "",
    reminder_at: "",
    completed: false,
  });

  useEffect(() => {
    CategoriesAPI.list().then((list) => setCategories(Array.isArray(list) ? list : []));
    if (mode === "edit" && taskId) {
      TasksAPI.list().then((list) => {
        const t =
          (Array.isArray(list) ? list : []).find((x) => String(x.id ?? x._id) === String(taskId)) || null;
        if (t) {
          setForm({
            title: t.title || "",
            description: t.description || "",
            category_id: t.category_id || "",
            due_date: t.due_date ? toLocalInput(t.due_date) : "",
            reminder_at: t.reminder_at ? toLocalInput(t.reminder_at) : "",
            completed: !!t.completed,
          });
        }
        setLoading(false);
      });
    }
  }, [mode, taskId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category_id: form.category_id ? Number(form.category_id) : undefined,
      due_date: form.due_date || undefined,
      reminder_at: form.reminder_at || undefined,
      completed: !!form.completed,
    };
    if (mode === "edit" && taskId) {
      await TasksAPI.update(taskId, payload);
    } else {
      await TasksAPI.create(payload);
    }
    navigate(-1);
  };

  if (loading) return <div className="empty">Loading...</div>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Task"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 60,
      }}
      onClick={() => navigate(-1)}
    >
      <div className="card" style={{ width: "min(720px, 96vw)" }} onClick={(e) => e.stopPropagation()}>
        <h3 className="section-title">{mode === "edit" ? "Edit Task" : "New Task"}</h3>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div>
              <label>Title</label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label>Category</label>
              <select
                className="select"
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
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
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label>Due date</label>
              <input
                className="input"
                type="datetime-local"
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
              />
            </div>
            <div>
              <label>Reminder</label>
              <input
                className="input"
                type="datetime-local"
                value={form.reminder_at}
                onChange={(e) => setForm((f) => ({ ...f, reminder_at: e.target.value }))}
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={form.completed}
                onChange={(e) => setForm((f) => ({ ...f, completed: e.target.checked }))}
              />
              Completed
            </label>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
            <button type="button" className="btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="btn primary" type="submit">
              {mode === "edit" ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
