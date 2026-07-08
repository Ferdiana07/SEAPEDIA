import { create } from 'zustand'

// ============================================================
// UI STORE
// ============================================================
// Bertugas menyimpan state UI
// - Loading states
// - Toast notifications
// - Modal states
// - Sidebar states

const useUIStore = create((set, get) => ({
  // ======================================================
  // STATE
  // ======================================================
  
  /** @type {boolean} Global loading */
  isLoading: false,
  
  /** @type {Array} Toast notifications */
  toasts: [],
  
  /** @type {boolean} Sidebar terbuka (mobile) */
  sidebarOpen: false,
  
  /** @type {Object|null} Modal yang terbuka */
  modal: null,
  
  // ======================================================
  // TOAST ACTIONS
  // ======================================================
  
  /**
   * Tambah toast notification
   * @param {string} message - Pesan toast
   * @param {string} type - Tipe: success, error, warning, info
   * @param {number} duration - Durasi tampil (ms)
   */
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    
    // Auto remove setelah duration
    setTimeout(() => {
      get().removeToast(id)
    }, duration)
  },
  
  /**
   * Hapus toast
   * @param {number} id - ID toast
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }))
  },
  
  /**
   * Convenience methods untuk toast
   */
  success: (message, duration) => get().addToast(message, 'success', duration),
  error: (message, duration) => get().addToast(message, 'error', duration),
  warning: (message, duration) => get().addToast(message, 'warning', duration),
  info: (message, duration) => get().addToast(message, 'info', duration),
  
  // ======================================================
  // MODAL ACTIONS
  // ======================================================
  
  /**
   * Buka modal
   * @param {Object} modalData - Data modal
   */
  openModal: (modalData) => {
    set({ modal: modalData })
  },
  
  /**
   * Tutup modal
   */
  closeModal: () => {
    set({ modal: null })
  },
  
  // ======================================================
  // SIDEBAR ACTIONS
  // ======================================================
  
  /**
   * Toggle sidebar
   */
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },
  
  /**
   * Buka sidebar
   */
  openSidebar: () => {
    set({ sidebarOpen: true })
  },
  
  /**
   * Tutup sidebar
   */
  closeSidebar: () => {
    set({ sidebarOpen: false })
  },
  
  // ======================================================
  // LOADING ACTIONS
  // ======================================================
  
  /**
   * Set loading global
   * @param {boolean} loading
   */
  setLoading: (loading) => {
    set({ isLoading: loading })
  },
}))

export default useUIStore