import axios from 'axios';

// URL du backend en production
export const API_URL = 'https://dmembre-toi-backend-api.onrender.com/api/v1';

// Pour le développement local, décommente la ligne ci-dessous et commente celle du dessus
// export const API_URL = 'http://localhost:8001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const orderApi = {
  getAll: (userId) => api.get('/orders', { params: { user_id: userId } }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (order) => api.post('/orders', order),
  updateStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, null, { params: { status } }),
};