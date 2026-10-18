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
  getMonitoring: async () => (await api.get('/admin/monitoring')).data,
  getDiscounts: async (params = {}) => (await api.get('/admin/discounts', { params })).data,
  createDiscount: async (data) => (await api.post('/admin/discounts', data)).data,
  updateDiscount: async (id, data) => (await api.put(`/admin/discounts/${id}`, data)).data,
  simulateTime: async (hours) => (await api.post('/admin/simulate-time', { hours })).data,
}

export default adminService
