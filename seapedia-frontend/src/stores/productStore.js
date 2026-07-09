import { create } from 'zustand'
import productService from '../services/productService'

// ============================================================
// PRODUCT STORE
// ============================================================
// Bertugas menyimpan data produk dan fetch dari API

const useProductStore = create((set, get) => ({
  // ======================================================
  // STATE
  // ======================================================
  
  /** @type {Array} Daftar produk */
  products: [],
  
  /** @type {Object|null} Produk yang sedang dilihat */
  currentProduct: null,
  
  /** @type {Object} Info pagination */
  pagination: {
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  },
  
  /** @type {boolean} Loading state */
  isLoading: false,
  
  /** @type {string|null} Error message */
  error: null,
  
  // ======================================================
  // ACTIONS
  // ======================================================
  
  /**
   * Ambil semua produk
   * @param {Object} params - { page, per_page, search, category }
   */
  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await productService.getAll(params)
      
      if (response.success) {
        set({
          products: response.data,
          pagination: {
            current_page: response.meta?.current_page || 1,
            per_page: response.meta?.per_page || 12,
            total: response.meta?.total || 0,
            last_page: response.meta?.last_page || 1,
          },
        })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengambil produk' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Ambil satu produk berdasarkan ID
   * @param {number} id - Product ID
   */
  fetchById: async (id) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await productService.getById(id)
      
      if (response.success) {
        set({ currentProduct: response.data })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Produk tidak ditemukan' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Clear current product
   */
  clearCurrentProduct: () => {
    set({ currentProduct: null })
  },
  
  /**
   * Clear all products
   */
  clearProducts: () => {
    set({ products: [], pagination: { current_page: 1, per_page: 12, total: 0, last_page: 1 } })
  },
}))

export default useProductStore