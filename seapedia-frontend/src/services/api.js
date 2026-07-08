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
    const authData = JSON.parse(localStorage.getItem('seapedia-auth') || '{}')
    const token = authData.state?.token
    
    // Jika ada token, tambahkan ke header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
      // Server merespon dengan error
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - token invalid/expired
          // Hapus auth data dari localStorage
          localStorage.removeItem('seapedia-auth')
          
          // Redirect ke login (jika di browser)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          break
          
        case 403:
          // Forbidden - tidak punya akses
          console.error('Access forbidden:', data.message)
          break
          
        case 404:
          // Not Found
          console.error('Resource not found:', data.message)
          break
          
        case 422:
          // Validation Error
          console.error('Validation error:', data.errors)
          break
          
        case 500:
          // Server Error
          console.error('Server error:', data.message)
          break
          
        default:
          console.error('API Error:', data)
      }
    } else if (error.request) {
      // Request dikirim tapi tidak ada response
      console.error('No response received:', error.request)
    } else {
      // Error lainnya
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api