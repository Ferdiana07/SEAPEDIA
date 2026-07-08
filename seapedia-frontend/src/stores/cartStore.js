import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================
// CART STORE
// ============================================================
// Bertugas menyimpan data keranjang belanja
// - Items di cart
// - Store yang items-nya
// - Total harga

const useCartStore = create(
  persist(
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
       * @returns {number}
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 
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
       * Set items dari API
       * @param {Array} items - Items dari backend
       * @param {Object} storeInfo - Info toko
       */
      setCart: (items, storeInfo) => {
        set({ 
          items, 
          store: storeInfo,
          isLoading: false 
        })
      },
      
      /**
       * Tambah item ke cart
       * @param {Object} product - Produk yang ditambahkan
       * @param {number} quantity - Jumlah
       */
      addItem: (product, quantity = 1) => {
        const { items, store } = get()
        
        // Cek apakah item sudah ada di cart
        const existingIndex = items.findIndex(
          item => item.product_id === product.id
        )
        
        // Jika store berbeda, kosongkan cart dulu
        // (Single-store rule)
        if (store && store.id !== product.store_id) {
          set({
            items: [{
              product_id: product.id,
              name: product.name,
              price: parseFloat(product.price),
              image_url: product.image_url,
              store_id: product.store_id,
              store_name: product.store?.name,
              quantity,
            }],
            store: {
              id: product.store_id,
              name: product.store?.name,
            },
          })
          return
        }
        
        if (existingIndex >= 0) {
          // Item sudah ada, update quantity
          const newItems = [...items]
          newItems[existingIndex].quantity += quantity
          set({ items: newItems })
        } else {
          // Item baru, tambah ke array
          set({
            items: [...items, {
              product_id: product.id,
              name: product.name,
              price: parseFloat(product.price),
              image_url: product.image_url,
              store_id: product.store_id,
              store_name: product.store?.name,
              quantity,
            }],
            store: {
              id: product.store_id,
              name: product.store?.name,
            },
          })
        }
      },
      
      /**
       * Update quantity item
       * @param {number} productId - ID produk
       * @param {number} quantity - Jumlah baru
       */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          // Jika quantity 0 atau kurang, hapus item
          get().removeItem(productId)
          return
        }
        
        const newItems = get().items.map(item =>
          item.product_id === productId
            ? { ...item, quantity }
            : item
        )
        set({ items: newItems })
      },
      
      /**
       * Hapus item dari cart
       * @param {number} productId - ID produk
       */
      removeItem: (productId) => {
        const newItems = get().items.filter(
          item => item.product_id !== productId
        )
        
        // Jika cart kosong, reset store juga
        if (newItems.length === 0) {
          set({ items: [], store: null })
        } else {
          set({ items: newItems })
        }
      },
      
      /**
       * Kosongkan cart
       */
      clearCart: () => {
        set({ items: [], store: null })
      },
      
      /**
       * Set loading state
       * @param {boolean} loading
       */
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'seapedia-cart',
      partialize: (state) => ({
        items: state.items,
        store: state.store,
      }),
    }
  )
)

export default useCartStore