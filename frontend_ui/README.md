# Smart To-Do List Manager - Frontend (React)

A modern, responsive React frontend for the Smart To-Do List application. It includes header/navigation, task input with validation, styled task cards with inline editing, filter tabs with counts, category and due-date fields, a theme toggle with dark mode, micro-interactions with transitions, hybrid persistence (backend/localStorage), and accessibility-focused design.

## Tech Stack
- React 18 + Vite
- TailwindCSS for styling and dark mode via class strategy
- Zustand for state management and persistence
- Axios for API calls
- date-fns for date utilities
- react-transition-group for subtle animations

## Getting Started

1. Install dependencies:
   - npm install

2. Run the development server:
   - npm run start
   This starts Vite at http://localhost:5173

3. Configure API backend:
   - The app proxies `/api` to `VITE_BACKEND_URL` (default `http://localhost:3001`).
   - Create a `.env` file at the project root (frontend_ui):
     ```
     VITE_BACKEND_URL=http://localhost:3001
     ```
   - If no backend is available, the app will still work using localStorage.

4. Build for production:
   - npm run build
   - npm run preview

## Features Implemented
- Header with title, theme toggle, settings/profile placeholders.
- Task input with:
  - Non-empty title validation
  - Enter-to-add
  - Category select
  - Due date picker (min = today)
  - Button disabled when invalid or submitting
- Task cards:
  - Complete via checkbox
  - Inline edit on double click or edit button
  - Delete
  - Category badge and due date chip with overdue highlighting
  - Micro-interactions/animations
- Filter bar:
  - Tabs: All, Active, Completed
  - Count badges
- Theme:
  - Toggle light/dark, persisted
  - Tailwind dark styles with class strategy
- Persistence:
  - Tries backend first; falls back to localStorage if offline/unavailable
  - Optimistic updates and graceful rollback
- Responsive:
  - Mobile-first layout, adaptive paddings and spacing
- Accessibility:
  - Semantic regions, aria-labels, focus-visible ring

## Project Structure
- src/
  - App.tsx — Composes header, input, filters, and task list
  - components/ — UI components
  - store/useTasksStore.ts — Zustand store with hybrid persistence
  - services/api.ts — Axios API client
  - services/storage.ts — LocalStorage utilities
  - theme/ThemeProvider.tsx — Theme context with persistence
  - index.css — Tailwind and custom transitions
  - main.tsx — Entrypoint

## Environment Variables
- VITE_BACKEND_URL: Backend API base URL (default http://localhost:3001). Do not commit secrets.
  - Example .env:
    ```
    VITE_BACKEND_URL=http://localhost:3001
    ```

## Notes on Backend Integration
- The app expects REST endpoints:
  - GET /api/tasks → list of tasks
  - POST /api/tasks → create task
  - PUT /api/tasks/:id → update task fields
  - DELETE /api/tasks/:id → delete task
- If the backend is unavailable, the UI continues to function using localStorage to store tasks.

## Future Enhancements (Scaffold-ready)
- Drag-and-drop ordering (e.g., via @dnd-kit)
- Category management and filters
- Reminders and notifications
- Modal dialog for advanced edit/create
- User profile/preferences integration

## License
MIT
