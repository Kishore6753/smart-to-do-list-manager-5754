# Smart To-Do List Manager - Monorepo

This repository contains the frontend UI for the Smart To-Do List Manager.

Containers:
- frontend_ui (React + Vite): User interface with task management, filters, categories, due dates, theme toggle, and hybrid persistence.
- backend_api: Express.js backend (not included in this workspace).
- database: MongoDB database (managed by backend, not directly by frontend).

Quick start for frontend:
1. cd frontend_ui
2. npm install
3. npm run start
4. Optional: create .env with VITE_BACKEND_URL=http://localhost:3001

For more details see frontend_ui/README.md.