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
  getPriceHistory: async (productName, months = 12) => {
    try {
      const response = await api.get(`/price-history/${encodeURIComponent(productName)}`, {
        params: { months }
      })
      return response.data
    } catch (error) {
      // Better error handling
      if (error.response?.status === 404) {
        // Product has no historical data
        throw new Error('Este producto no tiene datos históricos registrados en la base de datos')
      } else if (error.response) {
        // Other server errors
        const detail = error.response.data?.detail || error.response.statusText
        throw new Error(`${detail}`)
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No se pudo conectar al servidor')
      } else {
        // Something else happened
        throw new Error(`Error al obtener el historial: ${error.message}`)
      }
    }
  },

  // Get latest price for a specific product and market
  getLatestPrice: async (productName, marketName) => {
    try {
      const response = await api.get('/prices/latest/', {
        params: {
          product_name: productName,
          market_name: marketName
        }
      })
      return response.data
    } catch (error) {
      throw new Error(`Error getting latest price: ${error.message}`)
    }
  },

  // Get all available options (products and markets)
  getOptions: async () => {
    try {
      const response = await api.get('/prices/options/')
      return response.data
    } catch (error) {
      throw new Error(`Error getting options: ${error.message}`)
    }
  },

  // Get active plazas only (for filtering)
  getActivePlazas: async () => {
    try {
      const response = await api.get('/product-prices/plazas')
      return response.data
    } catch (error) {
      throw new Error(`Error getting active plazas: ${error.message}`)
    }
  },

  // Get price predictions using Prophet model
  getPricePredictions: async (productName, monthsAhead = 6) => {
    try {
      const response = await api.get('/predictions/', {
        params: {
          product_name: productName,
          months_ahead: monthsAhead
        }
      })
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('No hay suficientes datos históricos para generar predicciones de este producto')
      }
      throw new Error(`Error al obtener predicciones: ${error.response?.data?.message || error.message}`)
    }
  },

  // Search products with suggestions (F-11)
  searchProducts: async (query) => {
    try {
      const response = await api.get('/prices/search/', {
        params: { query: query.trim() }
      })
      return response.data
    } catch (error) {
      // Return error with details for better handling
      if (error.response?.status === 404) {
        return {
          error: true,
          status: 404,
          detail: error.response.data?.detail || 'Producto no encontrado',
          suggestions: error.response.data?.sugerencias || []
        }
      }
      throw error
    }
  },

  // Get all products list
  getAllProducts: async () => {
    try {
      const response = await api.get('/prices/products/')
      return response.data
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`)
    }
  }
}

export const plazaService = {
  // Get all plazas
  getAllPlazas: async () => {
    try {
      const response = await api.get('/plazas/')
      return response.data
    } catch (error) {
      throw new Error(`Error getting plazas: ${error.message}`)
    }
  },

  // Get plaza by name
  getPlazaByName: async (plazaName) => {
    try {
      const response = await api.get(`/plazas/nombre/${encodeURIComponent(plazaName)}`)
      return response.data
    } catch (error) {
      throw new Error(`Error getting plaza details: ${error.message}`)
    }
  },

  // Get active plazas only (for filtering)
  getActivePlazas: async () => {
    try {
      const response = await api.get('/product-prices/plazas')
      return response.data
    } catch (error) {
      throw new Error(`Error getting active plazas: ${error.message}`)
    }
  },

  // Admin: Create plaza
  createPlaza: async (plazaData) => {
    try {
      const response = await api.post('/plazas/', plazaData)
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Error al crear plaza'
      throw new Error(message)
    }
  },

  // Admin: Update plaza
  updatePlaza: async (plazaId, plazaData) => {
    try {
      const response = await api.put(`/plazas/${plazaId}`, plazaData)
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Error al actualizar plaza'
      throw new Error(message)
    }
  },

  // Admin: Delete plaza
  deletePlaza: async (plazaId) => {
    try {
      const response = await api.delete(`/plazas/${plazaId}`)
      return response.data
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Error al eliminar plaza'
      throw new Error(message)
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
