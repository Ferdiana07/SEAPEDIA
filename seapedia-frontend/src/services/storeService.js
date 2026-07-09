// File: src/services/storeService.js
import api from './api'

// ============================================================
// STORE SERVICE
// ============================================================

const storeService = {
  /**
   * Ambil data toko sendiri (seller)
   * @returns {Promise<Object>}
   */
  getMyStore: async () => {
    const response = await api.get('/stores/my')
    return response.data
  },
  
  /**
   * Update data toko
   * @param {Object} data - Store data
   * @returns {Promise<Object>}
   */
  update: async (data) => {
    const response = await api.put('/stores/my', data)
    return response.data
  },
}

export default storeService