import React from "react";
import { useSearchParams } from "react-router-dom";
import { CategoriesPanel, TasksPanel } from "../sections/TasksAndCategories";

/**
 * Dashboard/Home page
 * - Left: Categories (Sidebar-like card within content for modularity on small screens)
 * - Right: Tasks list with Quick Add and filters
 */
export default function DashboardPage({ section }) {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  return (
    <div className="app-grid" style={{ gridTemplateColumns: "320px 1fr" }}>
      <aside className="card" aria-label="Categories">
        <CategoriesPanel />
      </aside>
      <section className="card" aria-label="Dashboard Tasks">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>{section === "today" ? "Today" : section === "upcoming" ? "Upcoming" : "Dashboard"}</h2>
          <div className="row" role="group" aria-label="Filters and sort">
            {/* View switch placeholder */}
            <button className="btn">List</button>
            <button className="btn">Board</button>
            {/* Sort/filter placeholders */}
            <button className="btn">Sort</button>
            <button className="btn">Filter</button>
          </div>
        </div>
        <TasksPanel initialQuery={q} />
      </section>
    </div>
  );
}
