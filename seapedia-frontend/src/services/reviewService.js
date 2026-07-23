// File: src/services/reviewService.js
// Penjelasan: Service untuk operasi Review di frontend.
// Sesuai BAB 9 (Reviews publik Level 1 COMPFEST):
//   - Guest & user boleh membaca review (publik).
//   - User login boleh membuat review (1 user × 1 produk = 1 review).
//   - User hanya boleh update / delete review milik sendiri.

import api from './api'

const reviewService = {
  // =================================================================
  // PUBLIC: Ambil review untuk satu produk
  // =================================================================
  /**
   * @param {number} productId - Product ID
   * @param {Object} params - { page, per_page }
   * @returns {Promise<Object>} response.data dari backend
   *   Struktur response backend:
   *   {
   *     success: true,
   *     data: [...reviews],
   *     summary: { average_rating, total_reviews },
   *     meta: { current_page, last_page, per_page, total }
   *   }
   */
  getForProduct: async (productId, params = {}) => {
    const response = await api.get(`/products/${productId}/reviews`, { params })
    return response.data
  },

  // =================================================================
  // AUTH: Buat review baru
  // =================================================================
  /**
   * @param {number} productId - Product ID
   * @param {Object} data - { rating: 1-5, comment?: string }
   * @returns {Promise<Object>}
   */
  create: async (productId, data) => {
    const response = await api.post(`/products/${productId}/reviews`, data)
    return response.data
  },

  // =================================================================
  // AUTH: Update review milik sendiri
  // =================================================================
  /**
   * @param {number} reviewId - Review ID
   * @param {Object} data - { rating, comment }
   * @returns {Promise<Object>}
   */
  update: async (reviewId, data) => {
    const response = await api.put(`/reviews/${reviewId}`, data)
    return response.data
  },

  // =================================================================
  // AUTH: Hapus review milik sendiri
  // =================================================================
  /**
   * @param {number} reviewId - Review ID
   * @returns {Promise<Object>}
   */
  remove: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data
  },
}

export default reviewService