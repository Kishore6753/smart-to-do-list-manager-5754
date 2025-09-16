import React from "react";

/**
 * Legacy default export to satisfy imports in tests.
 * AppRoutes renders the actual UI via index.js, this remains a placeholder.
 */
// PUBLIC_INTERFACE
export default function App() {
  /** Placeholder component; real app rendered through Routes in index.js */
  return (
    <div className="App">
      <header className="app-navbar">
        <div className="app-brand">Smart To-Do</div>
      </header>
      <div className="container">
        <div className="card">
          <p>Welcome to Smart To-Do. Use the navigation to explore the app.</p>
        </div>
      </div>
    </div>
  );
}
