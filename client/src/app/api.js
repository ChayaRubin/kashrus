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

// API base: env at build time, or runtime fallback when frontend is on Render / Capacitor
function getApiBase() {
  let fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv) {
    console.log("[api] Using VITE_API_URL from env:", fromEnv);
    return fromEnv;
  }

  // Capacitor Android: emulator uses 10.0.2.2 to reach host PC
  if (typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.()) {
    const platform = window.Capacitor.getPlatform?.();
    console.log("[api] Detected Capacitor platform:", platform);
    if (platform === "android") return "http://10.0.2.2:5000";
    if (platform === "ios") return "http://localhost:5000"; // iOS simulator
  }

  if (typeof window !== "undefined" && window.location?.hostname?.includes("onrender.com")) {
    console.log("[api] Detected Render hostname, using hosted API");
    return "https://kashrus-back.onrender.com";
  }

  console.log("[api] Falling back to localhost backend");
  return "http://localhost:5000";
}
const BASE = getApiBase();
export const API_BASE = BASE;

// In-memory auth token for mobile/Capacitor (Authorization header)
let authToken = null;

export const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

// Resolve image URLs that may be stored as relative paths on the backend.
// - data/blob: return as-is.
// - Relative paths: prefix with API_BASE.
// - HTTPS (e.g. Cloudinary): on Android WebView we proxy via our backend so the
//   emulator/device avoids NET::ERR_CERT_AUTHORITY_INVALID when loading images.
export function resolveImageUrl(src) {
  if (!src) return src;
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }
  if (src.startsWith("/")) {
    return `${API_BASE}${src}`;
  }
  if (!src.startsWith("http")) {
    return `${API_BASE}/${src}`;
  }
  // On Android native app, proxy HTTPS images through our backend to avoid cert errors.
  const isAndroidApp =
    typeof window !== "undefined" &&
    window.Capacitor?.isNativePlatform?.() &&
    window.Capacitor.getPlatform?.() === "android";
  if (isAndroidApp && src.startsWith("https://")) {
    return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(src)}`;
  }
  return src;
}
// ---------- Generic helper ----------
async function http(path, { method = "GET", params, body } = {}) {
  const url = new URL(BASE + path);
  console.log("[api] HTTP request", { url: url.toString(), method, params });

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

  const headers = body ? { "Content-Type": "application/json" } : {};
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // keep cookies for web as well
    });
  } catch (networkErr) {
    console.error("[api] Network error while fetching", url.toString(), networkErr);
    throw { status: 0, message: "Network error: " + (networkErr?.message || "Failed to fetch") };
  }

  // Read response text once so we can safely handle empty bodies (e.g. 204 No Content)
  const rawText = await res.text();

  if (!res.ok) {
    console.error("[api] HTTP error", { status: res.status, url: url.toString(), rawText });
    let errorBody = rawText;
    try {
      // Try to parse JSON error if present
      const parsed = rawText ? JSON.parse(rawText) : null;
      errorBody = parsed || rawText;
    } catch {
      // keep rawText
    }

    throw {
      status: res.status,
      message:
        (typeof errorBody === "object" && errorBody?.error) ||
        errorBody ||
        "Request failed",
    };
  }

  // Successful but no content (e.g. 204) → return null
  if (!rawText) {
    return null;
  }

  // Try to parse JSON; if it fails, fall back to plain text
  try {
    return JSON.parse(rawText);
  } catch {
    return rawText;
  }
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
    const data = await http("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (data?.token) {
      authToken = data.token;
    }
    // Prefer the user object returned by the login endpoint; fall back to /auth/me.
    return data?.user || http("/auth/me");
  },
  async signup(name, email, password) {
    const data = await http("/auth/signup", {
      method: "POST",
      body: { name, email, password },
    });
    if (data?.token) {
      authToken = data.token;
    }
    return data?.user || data;
  },
  async me() {
    return http("/auth/me");
  },
  async logout() {
    try {
      await http("/auth/logout", { method: "POST" });
    } finally {
      authToken = null;
    }
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

// ---------- Users (admin) ----------
export const UsersAPI = {
  list: () => http("/users"),
  get: (id) => http(`/users/${id}`),
  create: (d) => http("/users", { method: "POST", body: d }),
  update: (id, d) => http(`/users/${id}`, { method: "PUT", body: d }),
  remove: (id) => http(`/users/${id}`, { method: "DELETE" }),
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


