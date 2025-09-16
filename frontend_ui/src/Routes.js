import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppShell from "./AppShell";
import DashboardPage from "./pages/DashboardPage";
import ProjectBoardPage from "./pages/ProjectBoardPage";
import SettingsPage from "./pages/SettingsPage";
import TaskModalPage from "./pages/TaskModalPage";

// PUBLIC_INTERFACE
export default function AppRoutes() {
  /** Application routes with AppShell layout and child pages. */
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppShell />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "today", element: <DashboardPage section="today" /> },
        { path: "upcoming", element: <DashboardPage section="upcoming" /> },
        { path: "projects/:projectId", element: <ProjectBoardPage /> },
        { path: "settings", element: <SettingsPage /> },
        { path: "task/new", element: <TaskModalPage mode="create" /> },
        { path: "task/:taskId", element: <TaskModalPage mode="edit" /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
