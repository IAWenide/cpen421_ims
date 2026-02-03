import axios from 'axios';

// Base URL for the backend API - update this when backend is ready
const API_BASE_URL = "https://backend-production-3b0e.up.railway.app/api";

// DEMO MODE - Set to true to use mock data without backend
const DEMO_MODE = false;

// Mock data for demo
let mockItems = [
  {
    _id: '1',
    name: 'Laptop',
    description: 'Dell XPS 15',
    quantity: 5,
    price: 1299.99,
    category: 'Electronics',
  },
  {
    _id: '2',
    name: 'Office Chair',
    description: 'Ergonomic office chair',
    quantity: 8,
    price: 299.99,
    category: 'Furniture',
  },
  {
    _id: '3',
    name: 'Wireless Mouse',
    description: 'Logitech MX Master',
    quantity: 15,
    price: 99.99,
    category: 'Electronics',
  },
  {
    _id: '4',
    name: 'Notebook',
    description: 'A4 lined notebook',
    quantity: 50,
    price: 4.99,
    category: 'Stationery',
  },
  {
    _id: '5',
    name: 'Monitor',
    description: '27-inch 4K monitor',
    quantity: 3,
    price: 499.99,
    category: 'Electronics',
  },
];

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
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

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    if (DEMO_MODE) {
      // Mock login - accepts any email/password
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return {
        token: 'mock-jwt-token-12345',
        user: {
          name: 'Demo User',
          email: credentials.email,
        },
      };
    }
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (userData) => {
    if (DEMO_MODE) {
      // Mock signup
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In demo mode, just simulate success
      return {
        message: 'Account created successfully',
      };
    }
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    if (DEMO_MODE) {
      // Mock forgot password
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        message: 'Password reset email sent',
      };
    }
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Inventory API calls
export const inventoryAPI = {
  // Get all inventory items
  getAllItems: async () => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockItems;
    }
    const response = await api.get('/inventory');
    return response.data;
  },

  // Get single item by ID
  getItemById: async (id) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const item = mockItems.find((item) => item._id === id);
      if (!item) throw new Error('Item not found');
      return item;
    }
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  // Create new item
  createItem: async (itemData) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newItem = {
        _id: Date.now().toString(),
        ...itemData,
      };
      mockItems.push(newItem);
      return newItem;
    }
    const response = await api.post('/inventory', itemData);
    return response.data;
  },

  // Update existing item
  updateItem: async (id, itemData) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockItems.findIndex((item) => item._id === id);
      if (index === -1) throw new Error('Item not found');
      mockItems[index] = { ...mockItems[index], ...itemData };
      return mockItems[index];
    }
    const response = await api.put(`/inventory/${id}`, itemData);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      mockItems = mockItems.filter((item) => item._id !== id);
      return { message: 'Item deleted successfully' };
    }
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};

export default api;
