import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  refresh: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
};

export const productsAPI = {
  getAll: (params?: any) => api.get("/products", { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post("/products", data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  search: (params: any) => api.get("/products/search", { params }),
};

export const reviewsAPI = {
  getByProduct: (productId: string) => api.get(`/reviews/product/${productId}`),
  create: (data: any) => api.post("/reviews", data),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

export const favoritesAPI = {
  getAll: () => api.get("/favorites"),
  add: (productId: string) => api.post("/favorites", { product_id: productId }),
  remove: (productId: string) => api.delete(`/favorites/${productId}`),
};

export const analyticsAPI = {
  getProducerStats: () => api.get("/analytics/producer"),
  getAdminStats: () => api.get("/analytics/admin"),
  getHeatmapData: (params?: any) => api.get("/analytics/heatmap", { params }),
};

export const aiAPI = {
  getPredictions: () => api.get("/ai/predictions"),
  getInsights: (data: any) => api.post("/ai/insights", data),
  getRecommendations: (userId: string) =>
    api.get(`/ai/recommendations/${userId}`),
};
