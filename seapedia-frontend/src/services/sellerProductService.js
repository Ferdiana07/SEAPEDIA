// File: src/services/sellerProductService.js
import api from './api'

// ============================================================
// SELLER PRODUCT SERVICE
// ============================================================
// Fungsi-fungsi CRUD untuk produk milik seller

const sellerProductService = {
  /**
   * Ambil semua produk seller
   * @returns {Promise<Object>}
   */
  getMyProducts: async () => {
    const response = await api.get('/seller/products')
    return response.data
  },
  
  /**
   * Ambil statistik produk
   * @returns {Promise<Object>}
   */
  getStats: async () => {
    const response = await api.get('/seller/products/stats')
    return response.data
  },
  
  /**
   * Buat produk baru
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/seller/products', data)
    return response.data
  },
  
  /**
   * Update produk
   * @param {number} id - Product ID
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.put(`/seller/products/${id}`, data)
    return response.data
  },
  
  /**
   * Hapus produk
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/seller/products/${id}`)
    return response.data
  },
}

export default sellerProductService