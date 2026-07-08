import api from './api'

// ============================================================
// PRODUCT SERVICE
// ============================================================
// Fungsi-fungsi untuk CRUD produk

const productService = {
  /**
   * Ambil semua produk
   * @param {Object} params - { page, per_page, search, category }
   * @returns {Promise<Object>}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },
  
  /**
   * Ambil satu produk
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  /**
   * Ambil produk dari toko tertentu
   * @param {number} storeId - Store ID
   * @returns {Promise<Object>}
   */
  getByStore: async (storeId) => {
    const response = await api.get(`/stores/${storeId}/products`)
    return response.data
  },
  
  /**
   * Buat produk baru (Seller)
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/products', data)
    return response.data
  },
  
  /**
   * Update produk (Seller)
   * @param {number} id - Product ID
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  },
  
  /**
   * Hapus produk (Seller)
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}

export default productService