// client/src/app/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

export const Restaurants = {
  async list(filters = {}) {
    const params = {};
    if (filters.q) params.q = String(filters.q);
    if (filters.category) params.category = String(filters.category);

    if (filters.types) {
      const arr = Array.isArray(filters.types)
        ? filters.types
        : String(filters.types).split(",").map(s => s.trim()).filter(Boolean);
      if (arr.length) params.types = arr.join(",");
    }

    if (filters.levels) {
      const arr = Array.isArray(filters.levels)
        ? filters.levels
        : String(filters.levels).split(",").map(s => s.trim()).filter(Boolean);
      if (arr.length) params.levels = arr.join(",");
    }

    const { data } = await api.get("/restaurants", { params });
    return data;
  },

  async get(id) {
    const { data } = await api.get(`/restaurants/${id}`);
    return data;
  },
};

// ---- Auth service ----
export const Auth = {
  async login(email, password) {
    await api.post("/auth/login", { email, password });
    const { data } = await api.get("/auth/me");
    return data;
  },
  async signup(name, email, password) {
    const { data } = await api.post("/auth/signup", { name, email, password });
    return data.user;
  },
  async me() {
    const { data } = await api.get("/auth/me");
    return data;
  },
  async logout() {
    await api.post("/auth/logout", {});
  },
};

export { api };
