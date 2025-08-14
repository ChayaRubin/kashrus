export async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options
  });
  if (!res.ok) {
    let msg = '';
    try { msg = await res.text(); } catch {}
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

// typed helpers used in admin pages
export const Restaurants = {
  list: (level) => api(`/api/restaurants${level ? `?level=${level}` : ''}`),
  get: (id) => api(`/api/restaurants/${id}`),
  create: (data) => api('/api/restaurants', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => api(`/api/restaurants/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id) => api(`/api/restaurants/${id}`, { method: 'DELETE' }),
};
