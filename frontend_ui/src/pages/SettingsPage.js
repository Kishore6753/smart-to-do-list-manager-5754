import React, { useState } from "react";

/**
 * Settings page – presentational two-column layout
 */
export default function SettingsPage() {
  const tabs = ["Profile", "Preferences", "Notifications", "Theme"];
  const [active, setActive] = useState("Profile");

  return (
    <div className="app-grid" style={{ gridTemplateColumns: "240px 1fr" }}>
      <aside className="card">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {tabs.map((t) => (
            <li key={t}>
              <button
                className="btn"
                onClick={() => setActive(t)}
                style={{ width: "100%", justifyContent: "flex-start", background: active === t ? "var(--color-muted)" : undefined }}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{active}</h2>
        {active === "Profile" && <ProfileSection />}
        {active === "Preferences" && <PreferencesSection />}
        {active === "Notifications" && <NotificationsSection />}
        {active === "Theme" && <ThemeSection />}
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn">Reset</button>
          <button className="btn primary">Save</button>
        </div>
      </section>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="form-grid">
      <div>
        <label>Name</label>
        <input className="input" placeholder="Full name" />
      </div>
      <div>
        <label>Email</label>
        <input className="input" type="email" placeholder="name@example.com" />
      </div>
      <div>
        <label>Timezone</label>
        <select className="select">
          <option>UTC</option>
          <option>GMT</option>
          <option>PST</option>
        </select>
      </div>
      <div>
        <label>Date format</label>
        <select className="select">
          <option>YYYY-MM-DD</option>
          <option>MM/DD/YYYY</option>
          <option>DD/MM/YYYY</option>
        </select>
      </div>
    </div>
  );
}

function PreferencesSection() {
  return (
    <div className="form-grid">
      <div>
        <label>Default view</label>
        <select className="select">
          <option>List</option>
          <option>Board</option>
        </select>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" /> Smart schedule
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" /> Auto-archive completed
      </label>
      <div>
        <label>Start week on</label>
        <select className="select">
          <option>Monday</option>
          <option>Sunday</option>
        </select>
      </div>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="form-grid">
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" /> Email notifications
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" /> Push notifications
      </label>
    </div>
  );
}

function ThemeSection() {
  return (
    <div className="form-grid">
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input name="theme" type="radio" /> Light
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input name="theme" type="radio" /> Dark
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input name="theme" type="radio" /> Auto
      </label>
    </div>
  );
}
