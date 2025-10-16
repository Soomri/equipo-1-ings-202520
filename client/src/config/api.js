import axios from 'axios'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_email')
      localStorage.removeItem('user_name')
      localStorage.removeItem('user_role')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

// API Services
export const productService = {
  // Query current prices (F-01)
  getCurrentPrices: async (product, city, plaza = '') => {
    try {
      const params = {
        product: product.trim(),
        city: city || 'Medellín',
        ...(plaza && { plaza })
      }
      
      const response = await api.get('/prices/current', { params })
      return response.data
    } catch (error) {
      throw new Error(`Error querying prices: ${error.message}`)
    }
  },

  // Get price history (F-02)
  getPriceHistory: async (product, city, plaza = '', months = 12) => {
    try {
      const params = {
        product: product.trim(),
        city: city || 'Medellín',
        months,
        ...(plaza && { plaza })
      }
      
      const response = await api.get('/prices/history', { params })
      return response.data
    } catch (error) {
      throw new Error(`Error getting history: ${error.message}`)
    }
  },

  // Get price predictions (F-03)
  getPricePredictions: async (product, city, plaza = '', months = 3) => {
    try {
      const params = {
        product: product.trim(),
        city: city || 'Medellín',
        months,
        ...(plaza && { plaza })
      }
      
      const response = await api.get('/prices/predictions', { params })
      return response.data
    } catch (error) {
      throw new Error(`Error getting predictions: ${error.message}`)
    }
  },

  // Search products (F-11)
  searchProducts: async (query) => {
    try {
      const response = await api.get('/products/search', {
        params: { q: query.trim() }
      })
      return response.data
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`)
    }
  },

  // Get search suggestions (F-12)
  getSearchSuggestions: async (query) => {
    try {
      const response = await api.get('/products/suggestions', {
        params: { q: query.trim() }
      })
      return response.data
    } catch (error) {
      throw new Error(`Error getting suggestions: ${error.message}`)
    }
  }
}

export const plazaService = {
  // Get market plazas (F-23)
  getPlazas: async (city = 'Medellín') => {
    try {
      const response = await api.get('/plazas', {
        params: { city }
      })
      return response.data
    } catch (error) {
      throw new Error(`Error getting plazas: ${error.message}`)
    }
  },

  // Get detailed plaza information (F-23)
  getPlazaDetails: async (plazaId) => {
    try {
      const response = await api.get(`/plazas/${plazaId}`)
      return response.data
    } catch (error) {
      throw new Error(`Error getting plaza details: ${error.message}`)
    }
  }
}

export const statsService = {
  // Get quick statistics (F-14)
  getQuickStats: async () => {
    try {
      const response = await api.get('/stats/quick')
      return response.data
    } catch (error) {
      throw new Error(`Error getting statistics: ${error.message}`)
    }
  },

  // Get price variations (F-14)
  getPriceVariations: async (period = 'week') => {
    try {
      const response = await api.get('/stats/variations', {
        params: { period }
      })
      return response.data
    } catch (error) {
      throw new Error(`Error getting variations: ${error.message}`)
    }
  }
}

// Authentication Services
export const authService = {
  // User Registration
  register: async (userData) => {
    try {
      const response = await api.post('/registro/', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      })
      return response.data
    } catch (error) {
      // Extract error message from backend
      const message = error.response?.data?.detail || error.message || 'Error al registrar usuario'
      throw new Error(message)
    }
  },

  // User Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })
      
      // Store token and user info in localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('user_email', response.data.usuario)
        localStorage.setItem('user_name', response.data.nombre)
        localStorage.setItem('user_role', response.data.rol)
      }
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Error al iniciar sesión'
      throw new Error(message)
    }
  },

  // User Logout
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_email')
      localStorage.removeItem('user_name')
      localStorage.removeItem('user_role')
    }
  },

  // Password Recovery
  recoverPassword: async (email) => {
    try {
      const response = await api.post(`/password/recover/${email}`)
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Error al recuperar contraseña'
      throw new Error(message)
    }
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(`/password/reset/${token}`, {
        new_password: newPassword
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Error al restablecer contraseña'
      throw new Error(message)
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  },

  // Get current user info
  getCurrentUser: () => {
    return {
      email: localStorage.getItem('user_email'),
      name: localStorage.getItem('user_name'),
      role: localStorage.getItem('user_role'),
      isAuthenticated: !!localStorage.getItem('access_token')
    }
  }
}

export default api
