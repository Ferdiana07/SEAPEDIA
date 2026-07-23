import api from './api'

// ============================================================
// AUTH SERVICE
// ============================================================
// Fungsi-fungsi untuk autentikasi

const authService = {
  /**
   * Register user baru
   * @param {Object} data - { name, email, password, password_confirmation }
   * @returns {Promise<Object>} Response dari server
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  
  /**
   * Login user
   * @param {Object} data - { email, password }
   * @returns {Promise<Object>} Response dari server dengan token
   */
  login: async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
  
  /**
   * Logout user
   * @returns {Promise<Object>}
   */
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  
  /**
   * Get data user yang sedang login
   * @returns {Promise<Object>}
   */
  me: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  
  /**
   * Pilih role yang aktif
   * @param {string} role - 'buyer' | 'seller' | 'driver'
   * @returns {Promise<Object>}
   */
  selectRole: async (role) => {
    const response = await api.post('/auth/select-role', { role })
    return response.data
  },
  
  /**
   * Assign role baru ke user
   * @param {string} role - 'buyer' | 'seller' | 'driver'
   * @returns {Promise<Object>}
   */
  assignRole: async (role) => {
    const response = await api.post('/auth/assign-role', { role })
    return response.data
  },

  /**
   * Update profil user (name, phone, bio, birth_date, gender, avatar_url)
   * @param {Object} data - Field yang ingin diupdate
   * @returns {Promise<Object>} { user }
   */
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  /**
   * Ganti password user
   * @param {Object} data - { current_password, password, password_confirmation }
   * @returns {Promise<Object>}
   */
  changePassword: async (data) => {
    const response = await api.put('/auth/password', data)
    return response.data
  },
}

export default authService