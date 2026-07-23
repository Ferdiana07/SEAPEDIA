import api from './api'

const adminService = {
  /**
   * GET /api/admin/stats
   * Statistik seluruh platform
   */
  getStats: async () => {
    const response = await api.get('/admin/stats')
    return response.data
  },

  /**
   * GET /api/admin/users
   * Daftar semua user + roles
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },
}

export default adminService
