import { create } from 'zustand'
import orderService from '../services/orderService'

// ============================================================
// ORDER STORE
// ============================================================
// Bertugas menyimpan data pesanan

const useOrderStore = create((set, get) => ({
  // ======================================================
  // STATE
  // ======================================================
  
  /** @type {Array} Daftar pesanan user */
  orders: [],
  
  /** @type {Object|null} Pesanan yang sedang dilihat */
  currentOrder: null,
  
  /** @type {Object} Info pagination */
  pagination: {
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  },
  
  /** @type {boolean} Loading state */
  isLoading: false,
  
  /** @type {string|null} Error message */
  error: null,
  
  /** @type {Object|null} Order stats untuk dashboard */
  stats: null,
  
  // ======================================================
  // ACTIONS
  // ======================================================
  
  /**
   * Ambil semua pesanan user
   */
  fetchOrders: async (params = {}) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await orderService.getAll(params)
      
      if (response.success) {
        set({
          orders: response.data,
          pagination: {
            current_page: response.meta?.current_page || 1,
            per_page: response.meta?.per_page || 10,
            total: response.meta?.total || 0,
            last_page: response.meta?.last_page || 1,
          },
        })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengambil pesanan' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Ambil detail pesanan
   * @param {number} id - Order ID
   */
  fetchById: async (id) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await orderService.getById(id)
      
      if (response.success) {
        set({ currentOrder: response.data })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Pesanan tidak ditemukan' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Ambil pesanan berdasarkan status
   * @param {string} status - Status pesanan
   */
  fetchByStatus: async (status) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await orderService.getByStatus(status)
      
      if (response.success) {
        set({ orders: response.data })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengambil pesanan' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Buat pesanan baru (checkout)
   * @param {Object} data - Data checkout
   */
  createOrder: async (data) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await orderService.create(data)
      
      if (response.success) {
        set({ currentOrder: response.data })
        return response
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Checkout gagal' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Update status pesanan (Seller/Driver)
   * @param {number} id - Order ID
   * @param {string} status - Status baru
   */
  updateStatus: async (id, status) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await orderService.updateStatus(id, status)
      
      if (response.success) {
        // Update order di list
        const orders = get().orders.map(order =>
          order.id === id ? { ...order, status } : order
        )
        set({ orders })
        
        // Update currentOrder jika sama
        if (get().currentOrder?.id === id) {
          set({ currentOrder: { ...get().currentOrder, status } })
        }
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Update status gagal' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Driver: ambil pesanan (status -> shipping).
   * Menggunakan endpoint POST /driver/orders/{id}/pickup.
   */
  pickupOrder: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await orderService.pickup(id)
      if (response.success) {
        // Update order di list & currentOrder (kalau ada)
        const orders = get().orders.map(order =>
          order.id === id ? { ...order, status: 'shipping', driver_id: response.data?.id ? response.data.id : order.driver_id } : order
        )
        set({ orders })
        if (get().currentOrder?.id === id) {
          set({ currentOrder: { ...get().currentOrder, status: 'shipping' } })
        }
        return response
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengambil pesanan' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * Driver: selesaikan pengantaran (status -> completed).
   * Menggunakan endpoint POST /driver/orders/{id}/complete.
   */
  deliverOrder: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await orderService.deliver(id)
      if (response.success) {
        const orders = get().orders.map(order =>
          order.id === id ? { ...order, status: 'completed' } : order
        )
        set({ orders })
        if (get().currentOrder?.id === id) {
          set({ currentOrder: { ...get().currentOrder, status: 'completed' } })
        }
        return response
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal menyelesaikan pesanan' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * Driver: kembalikan pesanan (status -> returned, BAB 9).
   * Backend otomatis me-restore stok & me-refund wallet buyer.
   *
   * @param {number} id - Order ID
   * @param {string} reason - Alasan pengembalian
   */
  returnOrder: async (id, reason) => {
    set({ isLoading: true, error: null })
    try {
      const response = await orderService.returnOrder(id, reason)
      if (response.success) {
        const orders = get().orders.map(order =>
          order.id === id ? { ...order, status: 'returned', cancellation_reason: `Dikembalikan driver: ${reason}` } : order
        )
        set({ orders })
        if (get().currentOrder?.id === id) {
          set({ currentOrder: { ...get().currentOrder, status: 'returned' } })
        }
        return response
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengembalikan pesanan' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * Clear current order
   */
  clearCurrentOrder: () => {
    set({ currentOrder: null })
  },
}))

export default useOrderStore