import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import "./styles/common.css";

/**
 * Internal icon renderer using simple Unicode/emoji placeholders to avoid extra deps.
 * In a real project, swap with an SVG icon system.
 */
function Icon({ name, label, style }) {
  const map = {
    home: "🏠",
    today: "📅",
    upcoming: "🗓️",
    folder: "📁",
    check: "✅",
    trash: "🗑️",
    settings: "⚙️",
    bell: "🔔",
    user: "👤",
    plus: "➕",
    search: "🔎",
    sun: "☀️",
    moon: "🌙",
    menu: "☰",
  };
  return (
    <span aria-hidden="true" style={{ display: "inline-block", ...style }} title={label || name}>
      {map[name] || "•"}
    </span>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return { theme, toggle };
}

function useResponsiveSidebar() {
  const [open, setOpen] = useState(() => window.innerWidth >= 1024);
  const location = useLocation();
  useEffect(() => {
    // Close drawer on route change for small screens
    if (window.innerWidth < 1024) setOpen(false);
  }, [location]);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { open, setOpen };
}

// PUBLIC_INTERFACE
export default function AppShell() {
  /** App shell: Top navbar + sidebar + main content area (routes render via <Outlet/>) */
  const { theme, toggle } = useTheme();
  const { open, setOpen } = useResponsiveSidebar();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const onSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to dashboard/home with q param
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  return (
    <div className="App">
      <header className="app-navbar" role="banner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}
          >
            <Icon name="menu" />
          </button>
          <Link to="/" className="app-brand" style={{ color: "inherit", textDecoration: "none" }}>
            Smart To-Do
          </Link>
        </div>

        <form onSubmit={onSearchSubmit} style={{ maxWidth: 520, flex: 1, margin: "0 16px" }} role="search">
          <div className="row" style={{ alignItems: "center" }}>
            <span aria-hidden="true" style={{ marginRight: 8 }}>
              <Icon name="search" />
            </span>
            <input
              className="input"
              placeholder="Search tasks..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Global search"
            />
          </div>
        </form>

        <div className="row" style={{ alignItems: "center" }}>
          <Link to="/task/new" className="btn primary" aria-label="New Task">
            <Icon name="plus" /> <span style={{ marginLeft: 6 }}>New Task</span>
          </Link>
          <button className="btn" aria-label="Notifications">
            <Icon name="bell" />
          </button>
          <Link to="/settings" className="btn" aria-label="Settings">
            <Icon name="settings" />
          </Link>
          <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? <Icon name="moon" /> : <Icon name="sun" />}{" "}
            <span style={{ marginLeft: 6 }}>{theme === "light" ? "Dark" : "Light"}</span>
          </button>
          <button className="btn" aria-label="User menu">
            <Icon name="user" />
          </button>
        </div>
      </header>

      <div style={{ display: "flex" }}>
        <aside
          role="complementary"
          aria-label="Sidebar Navigation"
          className="card"
          style={{
            position: "sticky",
            top: 64,
            alignSelf: "flex-start",
            width: open ? 240 : 0,
            padding: open ? "12px" : 0,
            overflow: "hidden",
            height: "calc(100vh - 64px)",
            borderRight: "1px solid var(--color-border)",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            background: "var(--color-surface-2)",
          }}
        >
          <SidebarNav />
        </aside>

        <main role="main" className="container" style={{ flex: 1, minHeight: "calc(100vh - 64px)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarNav() {
  const sections = useMemo(
    () => [
      {
        header: null,
        items: [
          { to: "/", label: "Home", icon: "home", end: true },
          { to: "/today", label: "Today", icon: "today" },
          { to: "/upcoming", label: "Upcoming", icon: "upcoming" },
        ],
      },
      {
        header: "Projects",
        items: [
          { to: "/projects/1", label: "Personal", icon: "folder", color: "#E87A41" },
          { to: "/projects/2", label: "Work", icon: "folder", color: "#2563EB" },
        ],
      },
      {
        header: null,
        items: [
          { to: "/completed", label: "Completed", icon: "check" },
          { to: "/trash", label: "Trash", icon: "trash" },
          { to: "/settings", label: "Settings", icon: "settings" },
        ],
      },
    ],
    []
  );

  return (
    <nav>
      {sections.map((sec, idx) => (
        <div key={idx} style={{ marginBottom: 12 }}>
          {sec.header && (
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", margin: "8px 8px" }}>
              {sec.header}
            </div>
          )}
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {sec.items.map((it) => (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  end={it.end}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 8,
                    color: "inherit",
                    textDecoration: "none",
                    background: isActive ? "var(--color-muted)" : "transparent",
                  })}
                >
                  <Icon name={it.icon} />
                  {it.color && (
                    <span className="category-color-sample" style={{ background: it.color }} aria-hidden="true"></span>
                  )}
                  <span>{it.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
