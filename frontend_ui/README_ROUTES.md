# Frontend Routes and Pages

This app uses React Router v6.

- AppShell (layout): src/AppShell.js
  - Top Navbar, Sidebar, Main content area
- Routes definition: src/Routes.js

Pages:
- DashboardPage: /
  - Uses sections/TasksAndCategories for Categories and Tasks panels
  - Accepts ?q= for search
- Today: /today
- Upcoming: /upcoming
- Project Board: /projects/:projectId
- Settings: /settings
- Task Modal:
  - Create: /task/new
  - Edit: /task/:taskId

Sections:
- TasksAndCategories:
  - useCategories
  - CategoriesPanel
  - TasksPanel
