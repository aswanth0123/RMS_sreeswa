import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  // Add other auth endpoints as needed
};

// Shop API endpoints
export const shopAPI = {
  getAllShops: () => api.get('/shops'),
  getShopById: (id) => api.get(`/shops/${id}`),
  createShop: (shopData) => api.post('/shops', shopData),
  updateShop: (id, shopData) => api.put(`/shops/${id}`, shopData),
  deleteShop: (id) => api.delete(`/shops/${id}`),
  getShopsByLocation: (place) => api.get(`/shops/location?place=${place}`),
  getActiveShops: () => api.get('/shops/active'),
};

export default api;
