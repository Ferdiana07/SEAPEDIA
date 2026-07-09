import { create } from 'zustand'
import walletService from '../services/walletService'

// ============================================================
// WALLET STORE
// ============================================================
// Bertugas menyimpan data wallet dan transaksi

const useWalletStore = create((set, get) => ({
  // ======================================================
  // STATE
  // ======================================================
  
  /** @type {number} Saldo wallet */
  balance: 0,
  
  /** @type {Array} Riwayat transaksi */
  transactions: [],
  
  /** @type {Object} Info pagination transaksi */
  pagination: {
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
  },
  
  /** @type {boolean} Loading state */
  isLoading: false,
  
  /** @type {string|null} Error message */
  error: null,
  
  // ======================================================
  // GETTERS
  // ======================================================
  
  /**
   * Cek apakah saldo cukup
   * @param {number} amount - Jumlah yang dicek
   * @returns {boolean}
   */
  isBalanceEnough: (amount) => get().balance >= amount,
  
  // ======================================================
  // ACTIONS
  // ======================================================
  
  /**
   * Ambil data wallet
   */
  fetchWallet: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await walletService.getWallet()
      
      if (response.success) {
        set({ balance: response.data.balance })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengambil wallet' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Ambil riwayat transaksi
   * @param {Object} params - { page, per_page }
   */
  fetchTransactions: async (params = {}) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await walletService.getTransactions(params)
      
      if (response.success) {
        set({
          transactions: response.data,
          pagination: {
            current_page: response.meta?.current_page || 1,
            per_page: response.meta?.per_page || 20,
            total: response.meta?.total || 0,
            last_page: response.meta?.last_page || 1,
          },
        })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengambil transaksi' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Top up wallet
   * @param {number} amount - Jumlah top up
   */
  topUp: async (amount) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await walletService.topUp({ amount })
      
      if (response.success) {
        // Update balance
        set({ balance: response.data.balance })
        return response
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Top up gagal' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Update balance lokal (setelah checkout/refund)
   * @param {number} newBalance - Balance baru
   */
  setBalance: (newBalance) => {
    set({ balance: newBalance })
  },
  
  /**
   * Kurangi balance (setelah checkout)
   * @param {number} amount - Jumlah yang dikurangi
   */
  deductBalance: (amount) => {
    set({ balance: get().balance - amount })
  },
}))

export default useWalletStore