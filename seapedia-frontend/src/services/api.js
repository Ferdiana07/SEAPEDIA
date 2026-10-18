import axios from 'axios'

// ============================================================
// AXIOS INSTANCE
// ============================================================
// Instance axios dengan konfigurasi default
// Semua API call menggunakan instance ini

const api = axios.create({
  // Base URL - semua request akan menambahkan ini
  baseURL: '/api',  // Proxy akan redirect ke localhost:8000/api
  
  // Timeout - request akan gagal jika lebih dari 30 detik
  timeout: 30000,
  
  // Headers default
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================
// Kode ini berjalan SEBELUM request dikirim

api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    let authData = {}
    try {
      authData = JSON.parse(localStorage.getItem('seapedia-auth') || '{}')
    } catch {
      localStorage.removeItem('seapedia-auth')
    }
    const token = authData.state?.token
    
    // Jika ada token, tambahkan ke header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Browser harus menentukan multipart boundary secara otomatis.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => {
    // Handle error sebelum request dikirim
    return Promise.reject(error)
  }
)

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
// Kode ini berjalan SETELAH response diterima

api.interceptors.response.use(
  (response) => {
    // Return response jika sukses
    return response
  },
  (error) => {
    // Handle error response
    
    if (error.response) {
      const { status } = error.response
      const isLoginRequest = error.config?.url?.includes('/auth/login')

      if (status === 401 && !isLoginRequest) {
        localStorage.removeItem('seapedia-auth')
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.assign('/login')
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
