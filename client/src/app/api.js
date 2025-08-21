// client/src/app/api.js
import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// generic helper
async function http(path, { method="GET", params, body } = {}) {
  const url = new URL(BASE + path);

  // handle array params (like types, levels)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (Array.isArray(v)) {
        v.forEach((val) => url.searchParams.append(k, val));
      } else if (v != null && v !== "") {
        url.searchParams.set(k, v);
      }
    }
  }

  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ---- Restaurants ----
export const Restaurants = {
  list:   (p) => http("/restaurants", { params: p }),
  listAll:()  => http("/restaurants/admin/all"),
  get:    (id) => http(`/restaurants/${id}`),
  create: (d)  => http("/restaurants", { method: "POST", body: d }),
  update: (id,d)=> http(`/restaurants/${id}`, { method: "PUT", body: d }),
  remove: (id)=> http(`/restaurants/${id}`, { method: "DELETE" }),
};

// ---- Auth ----
export const Auth = {
  async login(email, password) {
    await http("/auth/login", { method:"POST", body: { email, password } });
    return http("/auth/me");
  },
  async signup(name, email, password) {
    return http("/auth/signup", { method:"POST", body:{ name, email, password } });
  },
  async me() {
    return http("/auth/me");
  },
  async logout() {
    return http("/auth/logout", { method:"POST" });
  },
};

// ---- Rabanim / Hechsheirim / Articles ----
export const Rabanim = {
  list:(p)=>http("/rabanim",{params:p}), get:(id)=>http(`/rabanim/${id}`),
  create:(d)=>http("/rabanim",{method:"POST",body:d}),
  update:(id,d)=>http(`/rabanim/${id}`,{method:"PUT",body:d}),
  remove:(id)=>http(`/rabanim/${id}`,{method:"DELETE"}),
};

export const Hechsheirim  = {
  list:(p)=>http("/hechsheirim",{params:p}), get:(id)=>http(`/hechsheirim/${id}`),
  create:(d)=>http("/hechsheirim",{method:"POST",body:d}),
  update:(id,d)=>http(`/hechsheirim/${id}`,{method:"PUT",body:d}),
  remove:(id)=>http(`/hechsheirim/${id}`,{method:"DELETE"}),
};

export const Articles = {
  list:(p)=>http("/articles",{params:p}), get:(id)=>http(`/articles/${id}`),
  create:(d)=>http("/articles",{method:"POST",body:d}),
  update:(id,d)=>http(`/articles/${id}`,{method:"PUT",body:d}),
  remove:(id)=>http(`/articles/${id}`,{method:"DELETE"}),
};
