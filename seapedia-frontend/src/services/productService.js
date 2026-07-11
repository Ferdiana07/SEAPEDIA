// File: src/services/productService.js
// Penjelasan: Service untuk operasi Product di frontend

import api from './api'

const productService = {
  // =================================================================
  // PUBLIC: Ambil semua produk aktif
  // =================================================================
  /**
   * @param {Object} params - { search, store_id, min_price, max_price, sort_by, sort_order, page, per_page }
   * @returns {Promise<Object>}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },
  
  // =================================================================
  // PUBLIC: Ambil detail satu produk
  // =================================================================
  /**
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  // =================================================================
  // SELLER: Ambil produk sendiri
  // =================================================================
  /**
   * @returns {Promise<Object>}
   */
  getMyProducts: async () => {
    const response = await api.get('/seller/products')
    return response.data
  },
  
  // =================================================================
  // SELLER: Statistik produk
  // =================================================================
  /**
   * @returns {Promise<Object>} { total_products, active_products, out_of_stock }
   */
  getMyStats: async () => {
    const response = await api.get('/seller/products/stats')
    return response.data
  },
  
  // =================================================================
  // SELLER: Tambah produk baru
  // =================================================================
  /**
   * @param {Object} data - { name, description, price, stock, image_url }
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/seller/products', data)
    return response.data
  },
  
  // =================================================================
  // SELLER: Update produk
  // =================================================================
  /**
   * @param {number} id - Product ID
   * @param {Object} data - Field yang diupdate
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.put(`/seller/products/${id}`, data)
    return response.data
  },
  
  // =================================================================
  // SELLER: Hapus produk
  // =================================================================
  /**
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/seller/products/${id}`)
    return response.data
  },
}

export default productService