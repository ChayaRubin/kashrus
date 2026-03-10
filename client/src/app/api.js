// // client/src/app/api.js
// import axios from "axios";
// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
//   withCredentials: true,
// });

// const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// // generic helper
// async function http(path, { method="GET", params, body } = {}) {
//   const url = new URL(BASE + path);

//   // handle array params (like types, levels)
//   if (params) {
//     for (const [k, v] of Object.entries(params)) {
//       if (Array.isArray(v)) {
//         v.forEach((val) => url.searchParams.append(k, val));
//       } else if (v != null && v !== "") {
//         url.searchParams.set(k, v);
//       }
//     }
//   }

//   const res = await fetch(url, {
//     method,
//     headers: body ? { "Content-Type": "application/json" } : undefined,
//     body: body ? JSON.stringify(body) : undefined,
//     credentials: "include",
//   });

//   if (!res.ok) throw new Error(await res.text());
//   return res.json();
// }

// // ---- Restaurants ----
// export const Restaurants = {
//   list:   (p) => http("/restaurants", { params: p }),
//   listAll:()  => http("/restaurants/admin/all"),
//   get:    (id) => http(`/restaurants/${id}`),
//   create: (d)  => http("/restaurants", { method: "POST", body: d }),
//   update: (id,d)=> http(`/restaurants/${id}`, { method: "PUT", body: d }),
//   remove: (id)=> http(`/restaurants/${id}`, { method: "DELETE" }),
// };

// // ---- Auth ----
// export const Auth = {
//   async login(email, password) {
//     await http("/auth/login", { method:"POST", body: { email, password } });
//     return http("/auth/me");
//   },
//   async signup(name, email, password) {
//     return http("/auth/signup", { method:"POST", body:{ name, email, password } });
//   },
//   async me() {
//     return http("/auth/me");
//   },
//   async logout() {
//     return http("/auth/logout", { method:"POST" });
//   },
// };

// // ---- Rabanim / Hechsheirim / Articles ----
// export const Rabanim = {
//   list:(p)=>http("/rabanim",{params:p}), get:(id)=>http(`/rabanim/${id}`),
//   create:(d)=>http("/rabanim",{method:"POST",body:d}),
//   update:(id,d)=>http(`/rabanim/${id}`,{method:"PUT",body:d}),
//   remove:(id)=>http(`/rabanim/${id}`,{method:"DELETE"}),
// };

// export const Hechsheirim  = {
//   list:(p)=>http("/hechsheirim",{params:p}), get:(id)=>http(`/hechsheirim/${id}`),
//   create:(d)=>http("/hechsheirim",{method:"POST",body:d}),
//   update:(id,d)=>http(`/hechsheirim/${id}`,{method:"PUT",body:d}),
//   remove:(id)=>http(`/hechsheirim/${id}`,{method:"DELETE"}),
// };

// export const Articles = {
//   list:(p)=>http("/articles",{params:p}), get:(id)=>http(`/articles/${id}`),
//   create:(d)=>http("/articles",{method:"POST",body:d}),
//   update:(id,d)=>http(`/articles/${id}`,{method:"PUT",body:d}),
//   remove:(id)=>http(`/articles/${id}`,{method:"DELETE"}),
// };

// // export const SlideshowAPI = {
// //   list: async () => {
// //     const res = await fetch("/slideshow");
// //     return res.json();
// //   }
// // };


// export const SlideshowAPI = {
//   list: async () => {
//     const res = await fetch(`${API_BASE}/slideshow`, {
//       credentials: "include"
//     });
//     if (!res.ok) throw new Error("Failed to load slideshow");
//     return res.json();
//   },
//   // list: (p) => http("/slideshow", { params: p }),
//   get: (id) => http(`/slideshow/${id}`),
//   create: (d) => http("/slideshow", { method: "POST", body: d }),
//   update: (id, d) => http(`/slideshow/${id}`, { method: "PUT", body: d }),
//   remove: async (id) => {
//     const res = await fetch(`${API_BASE}/slideshow/${id}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) throw new Error("Failed to delete slide");
//   },
// };

// // ---- Ratings ----
// // ---- Ratings ----
// export const Ratings = {
//   get: (restaurantId) => http(`/ratings/${restaurantId}/rating`),
//   add: (restaurantId, rating) =>
//     http(`/ratings/${restaurantId}/rate`, { method: "POST", body: { rating } }),
//   remove: (restaurantId) =>
//     http(`/ratings/${restaurantId}/rating`, { method: "DELETE" }),
//   listMine: () => http("/ratings/mine"), // 👈 new endpoint
// };

// // ---- Feedback ----
// export const Feedback = {
//   submit: (data) =>
//     http("/feedback", { method: "POST", body: data }),
//   list: () =>
//     http("/feedback"), // admin only
//   update: (id, status) =>
//     http(`/feedback/${id}`, { method: "PUT", body: { status } }),
//   delete: (id) =>
//     http(`/feedback/${id}`, { method: "DELETE" }),
// };


// client/src/app/api.js
import axios from "axios";

// You have axios available if you want to migrate later
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ---------- Generic helper ----------
async function http(path, { method = "GET", params, body } = {}) {
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
    credentials: "include", // 👈 ensures cookie (token) is always sent
  });

  if (!res.ok) {
    let errorBody;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text();
    }

    throw {
      status: res.status,
      message: errorBody?.error || errorBody || "Request failed",
    };
  }

  return res.json();
}

// ---------- Restaurants ----------
export const Restaurants = {
  list: (p) => http("/restaurants", { params: p }),
  listAll: () => http("/restaurants/admin/all"),
  get: (id) => http(`/restaurants/${id}`),
  create: (d) => http("/restaurants", { method: "POST", body: d }),
  update: (id, d) => http(`/restaurants/${id}`, { method: "PUT", body: d }),
  remove: (id) => http(`/restaurants/${id}`, { method: "DELETE" }),
};

// ---------- Auth ----------
export const Auth = {
  async login(email, password) {
    await http("/auth/login", { method: "POST", body: { email, password } });
    return http("/auth/me");
  },
  async signup(name, email, password) {
    return http("/auth/signup", { method: "POST", body: { name, email, password } });
  },
  async me() {
    return http("/auth/me");
  },
  async logout() {
    return http("/auth/logout", { method: "POST" });
  },
};

// ---------- Rabanim ----------
export const Rabanim = {
  list: (p) => http("/rabanim", { params: p }),
  get: (id) => http(`/rabanim/${id}`),
  create: (d) => http("/rabanim", { method: "POST", body: d }),
  update: (id, d) => http(`/rabanim/${id}`, { method: "PUT", body: d }),
  remove: (id) => http(`/rabanim/${id}`, { method: "DELETE" }),
};

// ---------- Hechsheirim ----------
export const Hechsheirim = {
  list: (p) => http("/hechsheirim", { params: p }),
  get: (id) => http(`/hechsheirim/${id}`),
  create: (d) => http("/hechsheirim", { method: "POST", body: d }),
  update: (id, d) => http(`/hechsheirim/${id}`, { method: "PUT", body: d }),
  remove: (id) => http(`/hechsheirim/${id}`, { method: "DELETE" }),
};

// ---------- Articles ----------
export const Articles = {
  list: (p) => http("/articles", { params: p }),
  get: (id) => http(`/articles/${id}`),
  create: (d) => http("/articles", { method: "POST", body: d }),
  update: (id, d) => http(`/articles/${id}`, { method: "PUT", body: d }),
  remove: (id) => http(`/articles/${id}`, { method: "DELETE" }),
};

// ---------- Slideshow ----------
export const SlideshowAPI = {
  list: (p) => http("/slideshow", { params: p }),
  get: (id) => http(`/slideshow/${id}`),
  create: (d) => http("/slideshow", { method: "POST", body: d }),
  update: (id, d) => http(`/slideshow/${id}`, { method: "PUT", body: d }),
  remove: (id) => http(`/slideshow/${id}`, { method: "DELETE" }),
};


// ---------- Ratings ----------
export const Ratings = {
  get: (restaurantId) => http(`/ratings/${restaurantId}/rating`),
  add: (restaurantId, rating) =>
    http(`/ratings/${restaurantId}/rate`, { method: "POST", body: { rating } }),
  remove: (restaurantId) =>
    http(`/ratings/${restaurantId}/rating`, { method: "DELETE" }),
  listMine: () => http("/ratings/mine"),
};

// ---------- Feedback ----------
export const Feedback = {
  submit: (data) => http("/feedback", { method: "POST", body: data }),
  list: () => http("/feedback"), // admin only
  update: (id, status) =>
    http(`/feedback/${id}`, { method: "PUT", body: { status } }),
  delete: (id) => http(`/feedback/${id}`, { method: "DELETE" }),
};

// ---------- Contact ----------
export const ContactAPI = {
  send: (data) => http("/contact", { method: "POST", body: data }),
};

// ---------- Home Content ----------
export const HomeAPI = {
  get: () => http("/home"),
  update: (data) => http("/home", { method: "PUT", body: data }),
};


