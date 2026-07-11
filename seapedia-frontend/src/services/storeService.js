// File: src/services/storeService.js
// Penjelasan: Service untuk operasi Store di frontend

import api from './api'

const storeService = {
  // =================================================================
  // PUBLIC: Ambil semua toko aktif
  // =================================================================
  /**
   * @returns {Promise<Object>} List toko aktif
   */
  getAll: async (params = {}) => {
    const response = await api.get('/stores', { params })
    return response.data
  },
  
  // =================================================================
  // PUBLIC: Ambil detail satu toko
  // =================================================================
  /**
   * @param {number} id - Store ID
   * @returns {Promise<Object>} Detail toko + produk
   */
  getById: async (id) => {
    const response = await api.get(`/stores/${id}`)
    return response.data
  },
  
  // =================================================================
  // SELLER: Ambil toko sendiri
  // =================================================================
  /**
   * @returns {Promise<Object>} Data toko sendiri
   */
  getMyStore: async () => {
    const response = await api.get('/stores/my')
    return response.data
  },
  
  // =================================================================
  // SELLER: Buat toko baru
  // =================================================================
  /**
   * @param {Object} data - { name, description, address, phone, logo_url }
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/stores', data)
    return response.data
  },
  
  // =================================================================
  // SELLER: Update toko sendiri
  // =================================================================
  /**
   * @param {Object} data - Field yang diupdate
   * @returns {Promise<Object>}
   */
  update: async (data) => {
    const response = await api.put('/stores/my', data)
    return response.data
  },
}

export default storeService