import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TasksAPI } from "../api";

/**
 * Project Board (Kanban) – simplified static grouping by completed status.
 * Replace with true status columns when backend provides status field.
 */
export default function ProjectBoardPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Using category_id as a simple proxy for project here
        const data = await TasksAPI.list({ category_id: projectId });
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  const columns = [
    { key: "todo", title: "To Do", filter: (t) => !t.completed },
    { key: "done", title: "Done", filter: (t) => t.completed },
  ];

  return (
    <section className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>
          Project #{projectId} <span className="badge">Board</span>
        </h2>
        <div className="row">
          <button className="btn">Filter</button>
          <button className="btn">Sort</button>
          <button className="btn">Group</button>
          <button className="btn">View</button>
        </div>
      </div>

      {loading ? (
        <div className="empty">Loading project...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {columns.map((col) => {
            const list = tasks.filter(col.filter);
            return (
              <div key={col.key} className="card" style={{ background: "var(--color-surface-2)" }}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                    {col.title}
                  </div>
                  <span className="badge">{list.length}</span>
                </div>
                <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                  {list.length === 0 ? (
                    <div className="empty">No tasks</div>
                  ) : (
                    list.map((t) => (
                      <div key={t.id ?? t._id} className="card">
                        <div style={{ fontWeight: 600 }}>{t.title}</div>
                        {t.description && (
                          <div style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>{t.description}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <button className="btn ghost" style={{ marginTop: 8 }}>
                  + Add task
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
