import api from './api'

// ============================================================
// CART SERVICE
// ============================================================
// Fungsi-fungsi untuk operasi keranjang belanja dengan backend

const cartService = {
  /**
   * Ambil data keranjang dari backend
   * Backend: GET /api/cart
   * @returns {Promise<Object>}
   */
  getCart: async () => {
    const response = await api.get('/cart')
    return response.data
  },

  /**
   * Tambah item ke keranjang
   * Backend: POST /api/cart/items
   * @param {Object} data - { product_id, quantity }
   * @returns {Promise<Object>}
   */
  addItem: async (data) => {
    const response = await api.post('/cart/items', data)
    return response.data
  },

  /**
   * Update quantity item di keranjang
   * Backend: PUT /api/cart/items/{id}
   * @param {number} productId - ID Produk yang diupdate
   * @param {number} quantity - Jumlah baru
   * @returns {Promise<Object>}
   */
  updateItem: async (productId, quantity) => {
    const response = await api.put(`/cart/items/${productId}`, { quantity })
    return response.data
  },

  /**
   * Hapus item dari keranjang
   * Backend: DELETE /api/cart/items/{id}
   * @param {number} productId - ID Produk yang dihapus
   * @returns {Promise<Object>}
   */
  removeItem: async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`)
    return response.data
  },

  /**
   * Kosongkan keranjang
   * Backend: DELETE /api/cart
   * @returns {Promise<Object>}
   */
  clearCart: async () => {
    const response = await api.delete('/cart')
    return response.data
  },
}

export default cartService
