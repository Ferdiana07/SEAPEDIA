// File: src/services/walletService.js
import api from './api'

// ============================================================
// WALLET SERVICE
// ============================================================

const walletService = {
  /**
   * Ambil data wallet
   * @returns {Promise<Object>}
   */
  getWallet: async () => {
    const response = await api.get('/wallet')
    return response.data
  },
  
  /**
   * Ambil riwayat transaksi
   * @param {Object} params - { page, per_page }
   * @returns {Promise<Object>}
   */
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params })
    return response.data
  },
  
  /**
   * Top up wallet
   * @param {Object} data - { amount }
   * @returns {Promise<Object>}
   */
  topUp: async (data) => {
    const response = await api.post('/wallet/topup', data)
    return response.data
  },
}

export default walletService