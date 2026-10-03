export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const assetUrl = (path) => {
  if (!path || /^https?:\/\//i.test(path)) return path || '';
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem('aps_token');
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || payload.error || 'Request failed');
  return payload;
};

const apiDownload = async (path) => {
  const token = localStorage.getItem('aps_token');
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || payload.error || 'Download failed');
  }
  return response.blob();
};

export const api = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  enquiries: (data) => apiRequest('/enquiries', { method: 'POST', body: JSON.stringify(data) }),
  list: (resource, query = '') => apiRequest(`/${resource}${query}`),
  download: apiDownload,
  get: (resource, id) => apiRequest(`/${resource}/${id}`),
  create: (resource, data) => apiRequest(`/${resource}`, { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
  update: (resource, id, data) => apiRequest(`/${resource}/${id}`, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),
  updateOne: (resource, data) => apiRequest(`/${resource}`, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }),
  remove: (resource, id) => apiRequest(`/${resource}/${id}`, { method: 'DELETE' }),
};

export default api;
