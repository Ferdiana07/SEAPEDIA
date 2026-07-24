import { create } from 'zustand'
import cartService from '../services/cartService'

// ============================================================
// CART STORE (Backend Synced)
// ============================================================
// Bertugas menyimpan data keranjang belanja
// Tersinkronisasi dengan backend API via cartService

const useCartStore = create(
  (set, get) => ({
      // ======================================================
      // STATE
      // ======================================================
      
      /** @type {Array} Items di keranjang */
      items: [],
      
      /** @type {Object|null} Store tempat items belong */
      store: null,
      
      /** @type {boolean} Loading state */
      isLoading: false,
      
      // ======================================================
      // GETTERS
      // ======================================================
      
      /**
       * Hitung total item di cart
       * @returns {number}
       */
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      /**
       * Hitung total harga
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + ((item.product?.price || 0) * item.quantity), 
          0
        )
      },
      
      /**
       * Cek apakah cart kosong
       * @returns {boolean}
       */
      isEmpty: () => get().items.length === 0,
      
      // ======================================================
      // ACTIONS
      // ======================================================
      
      /**
       * Fetch data cart dari backend
       */
      fetchCart: async () => {
        set({ isLoading: true })
        try {
          const response = await cartService.getCart()
          if (response.success && response.data) {
            set({ 
              items: response.data.items || [], 
              store: response.data.store || null,
              isLoading: false 
            })
          }
        } catch (error) {
          console.error("Gagal memuat keranjang:", error)
          set({ isLoading: false })
        }
      },

      /**
       * Set items dari data raw (digunakan untuk login)
       */
      setCart: (items, storeInfo) => {
        set({ 
          items, 
          store: storeInfo,
          isLoading: false 
        })
      },
      
      /**
       * Tambah item ke cart backend
       * @param {Object} product - Produk yang ditambahkan
       * @param {number} quantity - Jumlah
       */
      addItem: async (product, quantity = 1) => {
        set({ isLoading: true })
        try {
          const response = await cartService.addItem({
            product_id: product.id,
            quantity
          })
          if (response.success) {
            await get().fetchCart()
          }
          return response
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      /**
       * Update quantity item di backend
       * @param {number} productId - ID produk
       * @param {number} quantity - Jumlah baru
       */
      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(productId)
        }
        
        set({ isLoading: true })
        try {
          const response = await cartService.updateItem(productId, quantity)
          if (response.success) {
            await get().fetchCart()
          }
          return response
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      /**
       * Hapus item dari cart backend
       * @param {number} productId - ID produk
       */
      removeItem: async (productId) => {
        set({ isLoading: true })
        try {
          const response = await cartService.removeItem(productId)
          if (response.success) {
            await get().fetchCart()
          }
          return response
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      /**
       * Kosongkan cart di backend
       */
      clearCart: async () => {
        set({ isLoading: true })
        try {
          // If we want to clear backend as well on logout, maybe skip it if we just want to clear frontend state.
          // But clearCart is called when checking out (where backend already clears it) or manually.
          // Since backend OrderController deletes items, we can just clear frontend state on checkout.
          // Wait, if it's called manually, it clears backend.
          const response = await cartService.clearCart()
          if (response.success) {
            set({ items: [], store: null, isLoading: false })
          }
          return response
        } catch (error) {
          // Fallback to clearing frontend state
          set({ items: [], store: null, isLoading: false })
        }
      },

      /**
       * Reset state frontend saja (digunakan saat logout)
       */
      resetLocalCart: () => {
        set({ items: [], store: null, isLoading: false })
      },
      
      /**
       * Set loading state
       * @param {boolean} loading
       */
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
    })
)

export default useCartStore