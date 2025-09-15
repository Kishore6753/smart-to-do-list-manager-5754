//
// API client for backend_api REST endpoints
//

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /** Generic API request wrapper with JSON handling and error reporting. */
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const resp = await fetch(url, { ...options, headers });
  const contentType = resp.headers.get("content-type") || "";

  let data = null;
  if (contentType.includes("application/json")) {
    data = await resp.json().catch(() => null);
  } else {
    data = await resp.text().catch(() => null);
  }

  if (!resp.ok) {
    const message = data?.message || resp.statusText || "Request failed";
    const error = new Error(message);
    error.status = resp.status;
    error.data = data;
    throw error;
  }

  return data;
}

// PUBLIC_INTERFACE
export const TasksAPI = {
  /** List tasks with optional query params: { category_id, completed, q } */
  async list(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, v);
    });
    const q = query.toString();
    return apiRequest(`/tasks${q ? `?${q}` : ""}`, { method: "GET" });
  },

  /** Create a new task: { title, description?, category_id?, due_date?, reminder_at? } */
  async create(payload) {
    return apiRequest(`/tasks`, { method: "POST", body: JSON.stringify(payload) });
  },

  /** Update task by id */
  async update(id, payload) {
    return apiRequest(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },

  /** Delete task by id */
  async remove(id) {
    return apiRequest(`/tasks/${id}`, { method: "DELETE" });
  },

  /** Reorder tasks: [{ id, order_index }] */
  async reorder(items) {
    return apiRequest(`/tasks/reorder`, { method: "POST", body: JSON.stringify(items) });
  },
};

// PUBLIC_INTERFACE
export const CategoriesAPI = {
  /** List all categories */
  async list() {
    return apiRequest(`/categories`, { method: "GET" });
  },
  /** Create category: { name, color? } */
  async create(payload) {
    return apiRequest(`/categories`, { method: "POST", body: JSON.stringify(payload) });
  },
  /** Update category */
  async update(id, payload) {
    return apiRequest(`/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  /** Delete category */
  async remove(id) {
    return apiRequest(`/categories/${id}`, { method: "DELETE" });
  },
};

// PUBLIC_INTERFACE
export const RemindersAPI = {
  /** List reminders for a task or all */
  async list(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, v);
    });
    const q = query.toString();
    return apiRequest(`/reminders${q ? `?${q}` : ""}`, { method: "GET" });
  },
  /** Create reminder: { task_id, reminder_at, note? } */
  async create(payload) {
    return apiRequest(`/reminders`, { method: "POST", body: JSON.stringify(payload) });
  },
  /** Update reminder */
  async update(id, payload) {
    return apiRequest(`/reminders/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  /** Delete reminder */
  async remove(id) {
    return apiRequest(`/reminders/${id}`, { method: "DELETE" });
  },
};
