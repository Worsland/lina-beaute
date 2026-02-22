import axios from 'axios';

// URL de base de l'API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Créer une instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token dans les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// ==================== ESTABLISHMENTS ====================

export const establishmentAPI = {
  getAll: (params) => api.get('/establishments', { params }),
  getById: (id) => api.get(`/establishments/${id}`),
  create: (data) => api.post('/establishments', data),
  update: (id, data) => api.put(`/establishments/${id}`, data),
  delete: (id) => api.delete(`/establishments/${id}`),
  getMy: () => api.get('/establishments/me/establishment'),
  searchNearby: (data) => api.post('/establishments/search-nearby', data),
  getWithinRadius: (params) => api.get('/establishments/within-radius', { params }),
};

// ==================== SERVICES ====================

export const serviceAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  getMy: () => api.get('/services/my/services'),
};

// ==================== BOOKINGS ====================

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: (params) => api.get('/bookings/my', { params }),
  getEstablishment: (params) => api.get('/bookings/establishment', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id, reason) => api.delete(`/bookings/${id}`, { data: { reason } }),
  checkAvailability: (data) => api.post('/bookings/check-availability', data),
  complete: (id) => api.put(`/bookings/${id}/complete`),
};

// ==================== REVIEWS ====================

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getEstablishment: (id, params) => api.get(`/reviews/establishment/${id}`, { params }),
  getMy: () => api.get('/reviews/my'),
  respond: (id, data) => api.post(`/reviews/${id}/respond`, data),
  suggestResponse: (id) => api.post(`/reviews/${id}/suggest-response`),
  report: (id, reason) => api.post(`/reviews/${id}/report`, { reason }),
  helpful: (id) => api.post(`/reviews/${id}/helpful`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ==================== AI ====================

export const aiAPI = {
  search: (query, context) => api.post('/ai/search', { query, context }),
  chat: (message, context) => api.post('/ai/chat', { message, context }),
  getRecommendations: () => api.get('/ai/recommendations'),
  suggestSlots: (data) => api.post('/ai/suggest-slots', data),
  enhanceDescription: (serviceId) => api.post('/ai/enhance-description', { serviceId }),
};

export default api;