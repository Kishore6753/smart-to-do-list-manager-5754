# Smart To-Do Frontend (React)

A modern, lightweight React UI for the Smart To-Do List application. It supports:
- Tasks CRUD (create, list, edit, delete)
- Mark as completed
- Categories CRUD
- Reminders (inline add on a task)
- Drag-and-drop task reordering (HTML5 drag)
- Search/filter, hide completed
- Dark mode toggle (persisted to localStorage)
- Backend API integration via REST

## Quick start

1) Install dependencies
   npm install

2) Configure backend URL (if not default)
   - Copy `.env.example` to `.env` and set REACT_APP_API_BASE_URL
   - If omitted, defaults to http://localhost:3001

3) Start the app
   npm start

Open http://localhost:3000

## Configuration

- REACT_APP_API_BASE_URL: Base URL for the backend_api (Express). Provided by orchestrator in CI.
  Example: https://vscode-internal-10173-beta.beta01.cloud.kavia.ai:3001

## Code notes

- API client: src/api.js
- Main UI: src/App.js
- Styles: src/App.css, src/index.css

The UI avoids extra dependencies and uses native drag-and-drop and simple components.

## Accessibility

- Buttons and inputs have labels/aria attributes where applicable.
- Color scheme respects color-scheme and supports dark and light modes.
