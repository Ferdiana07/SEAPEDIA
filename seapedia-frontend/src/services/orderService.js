// File: src/services/orderService.js
import api from './api'

// ============================================================
// ORDER SERVICE
// ============================================================
// Fungsi-fungsi untuk CRUD pesanan

const orderService = {
  /**
   * Ambil semua pesanan user
   * @param {Object} params - { page, per_page, status }
   * @returns {Promise<Object>}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params })
    return response.data
  },
  
  /**
   * Ambil detail pesanan
   * @param {number} id - Order ID
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },
  
  /**
   * Ambil pesanan berdasarkan status
   * @param {string} status - Status pesanan
   * @returns {Promise<Object>}
   */
  getByStatus: async (status) => {
    const response = await api.get('/orders', { params: { status } })
    return response.data
  },
  
  /**
   * Buat pesanan baru (checkout)
   * @param {Object} data - { address_id, shipping_address, notes }
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/orders', data)
    return response.data
  },
  
  /**
   * Update status pesanan
   * @param {number} id - Order ID
   * @param {string} status - Status baru
   * @returns {Promise<Object>}
   */
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  },
  
  /**
   * Buyer cancel pesanan
   * @param {number} id - Order ID
   * @returns {Promise<Object>}
   */
  cancel: async (id) => {
    const response = await api.post(`/orders/${id}/cancel`)
    return response.data
  },
  
  /**
   * Driver pickup pesanan
   * Backend: POST /api/driver/orders/{id}/pickup
   * - Hanya driver yang bisa memanggil
   * - Pesanan harus status waiting_shipper & belum punya driver
   * - Setelah sukses: status -> shipping, driver_id = current user
   * @param {number} id - Order ID
   * @returns {Promise<Object>}
   */
  pickup: async (id) => {
    const response = await api.post(`/driver/orders/${id}/pickup`)
    return response.data
  },

  /**
   * Driver selesaikan pengantaran (barang sampai ke buyer).
   * Backend: POST /api/driver/orders/{id}/complete
   * - Hanya driver yang ditugaskan (driver_id = current user)
   * - Pesanan harus status shipping
   * - Setelah sukses: status -> completed
   * @param {number} id - Order ID
   * @returns {Promise<Object>}
   */
  deliver: async (id) => {
    const response = await api.post(`/driver/orders/${id}/complete`)
    return response.data
  },

  /**
   * Driver mengembalikan pesanan (BARU - BAB 9).
   * Backend: POST /api/driver/orders/{id}/return
   * - Hanya driver yang ditugaskan
   * - Pesanan harus status shipping
   * - Wajib menyertakan `reason` (alasan pengembalian)
   * - Setelah sukses: status -> returned, stok direstore, wallet buyer direfund
   *
   * @param {number} id - Order ID
   * @param {string} reason - Alasan pengembalian (misal: alamat salah, buyer tidak ditemukan)
   * @returns {Promise<Object>}
   */
  returnOrder: async (id, reason) => {
    const response = await api.post(`/driver/orders/${id}/return`, { reason })
    return response.data
  },
}

export default orderService