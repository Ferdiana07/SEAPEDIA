# BAB 5: Frontend - Pages & State Management (Lanjutan)

> **Tujuan:** Melanjutkan pembuatan pages frontend dengan integrasi API, state management yang lebih kompleks, dan role-based pages untuk Buyer, Seller, dan Driver

---

## 5.1 Recap: Apa yang Sudah Kita Pelajari

Di BAB 4, kita sudah membuat:
- **Stores** - Zustand untuk auth, cart, dan UI state
- **Services** - Axios instance dan auth/product services
- **UI Components** - Button, Input, Card, Badge, Modal
- **Layout Components** - Navbar, Footer
- **Basic Pages** - Login, Register, Home, Products

**Sekarang:** Kita akan membuat:
- **ProductDetailPage** - Halaman detail produk dengan review
- **CartPage** - Keranjang belanja dengan checkout
- **Buyer Pages** - Orders, Wallet, Addresses
- **Seller Pages** - Dashboard, Products Management
- **Driver Pages** - Order delivery
- **Integrasi API** - Menghubungkan semua dengan backend

---

## 5.2 Konsep State Management Lanjutan

### Apa yang Sudah Kita Punya?

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXISTING STORES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📁 authStore.js                                              │
│  ───────────────────────────────────────────────────────────  │
│  • user: { id, name, email, roles, active_role }              │
│  • token: "1|abc..."                                         │
│  • activeRole: "buyer"                                        │
│  • Fungsi: setAuth(), logout(), setActiveRole()              │
│                                                                  │
│  📁 cartStore.js                                              │
│  ───────────────────────────────────────────────────────────  │
│  • items: [{ product_id, name, price, quantity }]            │
│  • store: { id, name }                                       │
│  • Fungsi: addItem(), updateQuantity(), removeItem()         │
│                                                                  │
│  📁 uiStore.js                                               │
│  ───────────────────────────────────────────────────────────  │
│  • toasts: [{ id, message, type }]                           │
│  • isLoading: false                                           │
│  • modal: null                                               │
│  • Fungsi: success(), error(), openModal()                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Store Baru yang Dibutuhkan

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEW STORES (akan dibuat)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📁 orderStore.js (BARU)                                     │
│  ───────────────────────────────────────────────────────────  │
│  • orders: [{ id, order_number, status, total, items }]       │
│  • currentOrder: null                                         │
│  • Fungsi: fetchOrders(), cancelOrder(), trackOrder()        │
│                                                                  │
│  📁 walletStore.js (BARU)                                    │
│  ───────────────────────────────────────────────────────────  │
│  • balance: 0                                                │
│  • transactions: []                                           │
│  • Fungsi: fetchBalance(), topUp(), withdraw()               │
│                                                                  │
│  📁 addressStore.js (BARU)                                    │
│  ───────────────────────────────────────────────────────────  │
│  • addresses: [{ id, label, recipient_name, full_address }]  │
│  • defaultAddress: null                                       │
│  • Fungsi: fetchAddresses(), addAddress(), setDefault()      │
│                                                                  │
│  📁 productStore.js (BARU)                                   │
│  ───────────────────────────────────────────────────────────  │
│  • products: []                                               │
│  • currentProduct: null                                       │
│  • Fungsi: fetchProducts(), fetchById(), create(), update() │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5.3 Store Baru: Product Store

### productStore.js

```javascript
// File: src/stores/productStore.js
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
```

---

## 5.4 Store Baru: Order Store.

### orderStore.js

```javascript
// File: src/stores/orderStore.js
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
   * Clear current order
   */
  clearCurrentOrder: () => {
    set({ currentOrder: null })
  },
}))

export default useOrderStore
```

---

## 5.5 Store Baru: Wallet Store

### walletStore.js

```javascript
// File: src/stores/walletStore.js
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
```

---

## 5.6 Store Baru: Address Store

### addressStore.js

```javascript
// File: src/stores/addressStore.js
import { create } from 'zustand'
import addressService from '../services/addressService'

// ============================================================
// ADDRESS STORE
// ============================================================
// Bertugas menyimpan data alamat pengiriman

const useAddressStore = create((set, get) => ({
  // ======================================================
  // STATE
  // ======================================================
  
  /** @type {Array} Daftar alamat */
  addresses: [],
  
  /** @type {Object|null} Alamat default */
  defaultAddress: null,
  
  /** @type {boolean} Loading state */
  isLoading: false,
  
  /** @type {string|null} Error message */
  error: null,
  
  // ======================================================
  // GETTERS
  // ======================================================
  
  /**
   * Get alamat berdasarkan ID
   * @param {number} id - Address ID
   * @returns {Object|undefined}
   */
  getById: (id) => {
    return get().addresses.find(addr => addr.id === id)
  },
  
  /**
   * Cek apakah ada alamat
   * @returns {boolean}
   */
  hasAddresses: () => get().addresses.length > 0,
  
  // ======================================================
  // ACTIONS
  // ======================================================
  
  /**
   * Ambil semua alamat
   */
  fetchAddresses: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await addressService.getAll()
      
      if (response.success) {
        const addresses = response.data
        
        // Cari alamat default
        const defaultAddr = addresses.find(addr => addr.is_default) || null
        
        set({ 
          addresses,
          defaultAddress: defaultAddr 
        })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal mengambil alamat' })
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Tambah alamat baru
   * @param {Object} data - Data alamat
   */
  addAddress: async (data) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await addressService.create(data)
      
      if (response.success) {
        // Tambah ke list
        const newAddress = response.data
        const addresses = [...get().addresses, newAddress]
        
        // Update default jika ini alamat pertama atau default
        const defaultAddr = newAddress.is_default 
          ? newAddress 
          : get().defaultAddress
        
        set({ addresses, defaultAddress: defaultAddr })
        
        return response
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal menambah alamat' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Update alamat
   * @param {number} id - Address ID
   * @param {Object} data - Data update
   */
  updateAddress: async (id, data) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await addressService.update(id, data)
      
      if (response.success) {
        // Update di list
        const addresses = get().addresses.map(addr =>
          addr.id === id ? response.data : addr
        )
        
        // Update default jika perlu
        let defaultAddr = get().defaultAddress
        if (response.data.is_default) {
          defaultAddr = response.data
          // Update is_default di yang lain
          addresses.map(addr => addr.id !== id ? { ...addr, is_default: false } : addr)
        }
        
        set({ addresses, defaultAddress: defaultAddr })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal update alamat' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Hapus alamat
   * @param {number} id - Address ID
   */
  deleteAddress: async (id) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await addressService.delete(id)
      
      if (response.success) {
        // Hapus dari list
        const addresses = get().addresses.filter(addr => addr.id !== id)
        
        // Update default jika yang dihapus adalah default
        let defaultAddr = get().defaultAddress
        if (defaultAddr?.id === id) {
          defaultAddr = addresses[0] || null
        }
        
        set({ addresses, defaultAddress: defaultAddr })
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal hapus alamat' })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },
  
  /**
   * Set alamat default
   * @param {number} id - Address ID
   */
  setDefault: async (id) => {
    try {
      await get().updateAddress(id, { is_default: true })
    } catch (err) {
      throw err
    }
  },
}))

export default useAddressStore
```

---

## 5.7 Service Baru: Order Service

### orderService.js

```javascript
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
   * @param {number} id - Order ID
   * @returns {Promise<Object>}
   */
  pickup: async (id) => {
    const response = await api.post(`/orders/${id}/pickup`)
    return response.data
  },
  
  /**
   * Driver deliver pesanan
   * @param {number} id - Order ID
   * @returns {Promise<Object>}
   */
  deliver: async (id) => {
    const response = await api.post(`/orders/${id}/deliver`)
    return response.data
  },
}

export default orderService
```

---

## 5.8 Service Baru: Wallet & Address Services

### walletService.js

```javascript
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
```

### addressService.js

```javascript
// File: src/services/addressService.js
import api from './api'

// ============================================================
// ADDRESS SERVICE
// ============================================================

const addressService = {
  /**
   * Ambil semua alamat
   * @returns {Promise<Object>}
   */
  getAll: async () => {
    const response = await api.get('/addresses')
    return response.data
  },
  
  /**
   * Ambil satu alamat
   * @param {number} id - Address ID
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/addresses/${id}`)
    return response.data
  },
  
  /**
   * Tambah alamat baru
   * @param {Object} data - Address data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/addresses', data)
    return response.data
  },
  
  /**
   * Update alamat
   * @param {number} id - Address ID
   * @param {Object} data - Address data
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.put(`/addresses/${id}`, data)
    return response.data
  },
  
  /**
   * Hapus alamat
   * @param {number} id - Address ID
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/addresses/${id}`)
    return response.data
  },
}

export default addressService
```

---

## 5.9 ProductDetailPage

### Halaman Detail Produk

```jsx
// File: src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import useProductStore from '../stores/productStore'
import useCartStore from '../stores/cartStore'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================
const ProductDetailPage = () => {
  const { id } = useParams()
  
  // Stores
  const { currentProduct, fetchById, isLoading, error } = useProductStore()
  const { addItem, items, store } = useCartStore()
  const { isAuthenticated, activeRole } = useAuthStore()
  const { success, warning, error: showError } = useUIStore()
  
  // Local state
  const [quantity, setQuantity] = useState(1)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  
  // Fetch product
  useEffect(() => {
    fetchById(parseInt(id))
    
    return () => {
      // Cleanup
    }
  }, [id])
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      warning('Silakan login terlebih dahulu')
      return
    }
    
    if (activeRole !== 'buyer') {
      warning('Hanya buyer yang bisa menambahkan ke cart')
      return
    }
    
    // Cek single-store rule
    if (store && store.id !== currentProduct.store_id) {
      warning('Cart dari toko lain akan dihapus. Checkout cart dulu atau kosongkan cart.')
    }
    
    addItem(currentProduct, quantity)
    success(`${currentProduct.name} ditambahkan ke cart!`)
  }
  
  // Submit review
  const handleSubmitReview = async () => {
    try {
      // TODO: Call review API
      success('Review berhasil dikirim!')
      setShowReviewModal(false)
      setReviewData({ rating: 5, comment: '' })
    } catch (err) {
      showError('Gagal mengirim review')
    }
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat produk...</p>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Produk tidak ditemukan
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'Produk yang kamu cari tidak tersedia'}
          </p>
          <Link to="/products">
            <Button variant="outline">Kembali ke Produk</Button>
          </Link>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{currentProduct.name}</li>
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-xl overflow-hidden">
            <div className="aspect-square">
              {currentProduct.image_url ? (
                <img
                  src={currentProduct.image_url}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-6xl text-gray-300">📦</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <Card>
              {/* Store */}
              {currentProduct.store && (
                <Link 
                  to={`/stores/${currentProduct.store_id}`}
                  className="inline-block mb-4"
                >
                  <Badge variant="secondary" size="md">
                    🏪 {currentProduct.store.name}
                  </Badge>
                </Link>
              )}
              
              {/* Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentProduct.name}
              </h1>
              
              {/* Price */}
              <p className="text-3xl font-bold text-primary-600 mb-4">
                {formatPrice(currentProduct.price)}
              </p>
              
              {/* Stock */}
              <div className="flex items-center gap-4 mb-6">
                <Badge variant={currentProduct.stock > 0 ? 'success' : 'danger'} dot>
                  {currentProduct.stock > 0 ? 'Tersedia' : 'Stok Habis'}
                </Badge>
                <span className="text-gray-600">
                  Stok: {currentProduct.stock}
                </span>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {currentProduct.description || 'Tidak ada deskripsi'}
                </p>
              </div>
              
              {/* Quantity & Add to Cart */}
              {currentProduct.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-700">Jumlah:</label>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(currentProduct.stock, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-none focus:ring-0"
                        min="1"
                        max={currentProduct.stock}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1"
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      }
                    >
                      Tambah ke Cart
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowReviewModal(true)}
                    >
                      📝 Beri Review
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Share */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500">
                  Bagikan: 
                  <button className="text-primary-500 hover:underline ml-2">Facebook</button>
                  <button className="text-primary-500 hover:underline ml-2">Twitter</button>
                  <button className="text-primary-500 hover:underline ml-2">WhatsApp</button>
                </p>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ulasan Produk</h2>
          
          {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
            <div className="grid gap-4">
              {currentProduct.reviews.map((review) => (
                <Card key={review.id}>
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {review.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-yellow-400">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(review.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-gray-500">Belum ada ulasan untuk produk ini</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowReviewModal(true)}
              >
                Jadilah yang pertama memberikan review
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Beri Review"
      >
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className={`text-2xl ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-2">Komentar</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Tulis pengalamanmu dengan produk ini..."
            />
          </div>
          
          <div className="flex gap-4 justify-end">
            <Button variant="ghost" onClick={() => setShowReviewModal(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitReview}>
              Kirim Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetailPage
```

---

## 5.10 CartPage

### Halaman Keranjang Belanja

```jsx
// File: src/pages/dashboard/buyer/CartPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useCartStore from '../../../stores/cartStore'
import useAddressStore from '../../../stores/addressStore'
import useOrderStore from '../../../stores/orderStore'
import useWalletStore from '../../../stores/walletStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// CART PAGE
// ============================================================
const CartPage = () => {
  const navigate = useNavigate()
  
  // Stores
  const { items, store, getTotalPrice, getTotalItems, updateQuantity, removeItem, clearCart } = useCartStore()
  const { addresses, defaultAddress, fetchAddresses } = useAddressStore()
  const { createOrder } = useOrderStore()
  const { balance, fetchWallet } = useWalletStore()
  const { success, error: showError, warning } = useUIStore()
  
  // Local state
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  // Fetch data on mount
  useState(() => {
    fetchAddresses()
    fetchWallet()
  })
  
  // Set initial selected address
  const selectedAddress = selectedAddressId 
    ? addresses.find(a => a.id === selectedAddressId)
    : defaultAddress
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  // Handle checkout
  const handleCheckout = async () => {
    if (items.length === 0) {
      warning('Cart kosong!')
      return
    }
    
    if (!selectedAddress) {
      warning('Pilih alamat pengiriman terlebih dahulu')
      return
    }
    
    const total = getTotalPrice()
    if (balance < total) {
      warning(`Saldo tidak cukup. Butuh ${formatPrice(total - balance)} lagi.`)
      return
    }
    
    setIsCheckingOut(true)
    
    try {
      // Create order
      const response = await createOrder({
        address_id: selectedAddress.id,
        shipping_address: selectedAddress.full_address,
      })
      
      if (response.success) {
        // Clear cart
        clearCart()
        
        // Show success
        success('Pesanan berhasil dibuat!')
        
        // Navigate to orders
        navigate('/buyer/orders')
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Checkout gagal')
    } finally {
      setIsCheckingOut(false)
    }
  }
  
  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-12">
            <span className="text-6xl">🛒</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Cart Kosong
            </h2>
            <p className="text-gray-600 mb-6">
              Sepertinya kamu belum menambahkan apapun ke cart.
            </p>
            <Link to="/products">
              <Button>Belanja Sekarang</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Store Info */}
            {store && (
              <Card>
                <Badge variant="secondary">
                  🏪 {store.name}
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  Semua item dari toko yang sama
                </p>
              </Card>
            )}
            
            {/* Items */}
            {items.map((item) => (
              <Card key={item.product_id} className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      📦
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-lg font-bold text-primary-600 mt-1">
                    {formatPrice(item.price)}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Subtotal */}
                    <span className="font-medium">
                      Subtotal: {formatPrice(item.price * item.quantity)}
                    </span>
                    
                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-red-500 hover:text-red-700 ml-auto"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Clear Cart */}
            <button
              onClick={() => {
                if (confirm('Kosongkan cart?')) {
                  clearCart()
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Kosongkan Cart
            </button>
          </div>
          
          {/* Summary */}
          <div className="space-y-4">
            {/* Order Summary */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Item</span>
                  <span className="font-medium">{getTotalItems()} items</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
            </Card>
            
            {/* Address Selection */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Alamat Pengiriman</h3>
              
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`
                        flex items-start gap-3 p-3 border rounded-lg cursor-pointer
                        ${selectedAddressId === addr.id || (!selectedAddressId && addr.is_default)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id || (!selectedAddressId && addr.is_default)}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{addr.label}</p>
                        <p className="text-sm text-gray-600">{addr.recipient_name}</p>
                        <p className="text-sm text-gray-500">{addr.full_address}</p>
                        <p className="text-sm text-gray-500">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                  
                  <Link 
                    to="/buyer/addresses/new"
                    className="block text-center text-primary-500 hover:underline text-sm"
                  >
                    + Tambah Alamat Baru
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">Belum ada alamat</p>
                  <Link to="/buyer/addresses/new">
                    <Button size="sm">Tambah Alamat</Button>
                  </Link>
                </div>
              )}
            </Card>
            
            {/* Wallet Balance */}
            <Card>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Saldo Wallet</span>
                <Link to="/buyer/wallet" className="text-primary-500 text-sm hover:underline">
                  Top Up
                </Link>
              </div>
              <p className={`text-xl font-bold ${balance >= getTotalPrice() ? 'text-green-600' : 'text-red-600'}`}>
                {formatPrice(balance)}
              </p>
              {balance < getTotalPrice() && (
                <p className="text-sm text-red-500 mt-1">
                  Saldo tidak cukup
                </p>
              )}
            </Card>
            
            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              isLoading={isCheckingOut}
              disabled={!selectedAddress || balance < getTotalPrice()}
              className="w-full"
              size="lg"
            >
              Checkout ({formatPrice(getTotalPrice())})
            </Button>
            
            {selectedAddress && balance < getTotalPrice() && (
              <p className="text-sm text-gray-500 text-center">
                💡 Top up wallet terlebih dahulu untuk checkout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
```

---

## 5.11 Buyer Dashboard Pages

### OrdersPage

```jsx
// File: src/pages/dashboard/buyer/OrdersPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useOrderStore from '../../../stores/orderStore'

// ============================================================
// ORDERS PAGE (BUYER)
// ============================================================
const OrdersPage = () => {
  // Stores
  const { orders, pagination, isLoading, fetchOrders, updateStatus } = useOrderStore()
  
  // Local state
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Fetch orders on mount
  useEffect(() => {
    fetchOrders({ status: filterStatus !== 'all' ? filterStatus : undefined })
  }, [filterStatus])
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'packaging', label: 'Dikemas' },
    { value: 'waiting_shipper', label: 'Menunggu Driver' },
    { value: 'shipping', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
    { value: 'returned', label: 'Dikembalikan' },
  ]
  
  // Get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      packaging: 'warning',
      waiting_shipper: 'info',
      shipping: 'primary',
      completed: 'success',
      returned: 'danger',
    }
    return variants[status] || 'default'
  }
  
  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      packaging: 'Sedang Dikemas',
      waiting_shipper: 'Menunggu Driver',
      shipping: 'Sedang Dikirim',
      completed: 'Selesai',
      returned: 'Dikembalikan',
    }
    return labels[status] || status
  }
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${filterStatus === option.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl">📦</span>
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Tidak ada pesanan
            </h2>
            <p className="text-gray-600 mb-6">
              Kamu belum memiliki pesanan.
            </p>
            <Link to="/products">
              <Button>Mulai Belanja</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">{order.order_number}</p>
                  </div>
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                
                {/* Items Preview */}
                <div className="flex gap-4 mb-4">
                  {order.items?.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          📦
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">+{order.items.length - 3}</span>
                    </div>
                  )}
                </div>
                
                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="font-bold text-lg text-primary-600">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/buyer/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </Link>
                    
                    {order.status === 'completed' && (
                      <Link to={`/products/${order.items?.[0]?.product_id}`}>
                        <Button variant="ghost" size="sm">
                          Beli Lagi
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === 1}
              onClick={() => fetchOrders({ page: pagination.current_page - 1 })}
            >
              Prev
            </Button>
            <span className="px-4 py-2">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchOrders({ page: pagination.current_page + 1 })}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
```

### WalletPage

```jsx
// File: src/pages/dashboard/buyer/WalletPage.jsx
import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'
import Badge from '../../../components/ui/Badge'
import useWalletStore from '../../../stores/walletStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// WALLET PAGE (BUYER)
// ============================================================
const WalletPage = () => {
  // Stores
  const { balance, transactions, pagination, isLoading, fetchWallet, fetchTransactions, topUp } = useWalletStore()
  const { success, error: showError } = useUIStore()
  
  // Local state
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [isTopUpLoading, setIsTopUpLoading] = useState(false)
  
  // Fetch on mount
  useEffect(() => {
    fetchWallet()
    fetchTransactions()
  }, [])
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  
  // Handle top up
  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) {
      showError('Masukkan jumlah yang valid')
      return
    }
    
    setIsTopUpLoading(true)
    
    try {
      await topUp(amount)
      success(`Top up ${formatPrice(amount)} berhasil!`)
      setShowTopUpModal(false)
      setTopUpAmount('')
      fetchTransactions() // Refresh transactions
    } catch (err) {
      showError('Top up gagal')
    } finally {
      setIsTopUpLoading(false)
    }
  }
  
  // Get transaction type badge
  const getTypeBadge = (type) => {
    const variants = {
      topup: { variant: 'success', label: 'Top Up', icon: '💰' },
      purchase: { variant: 'danger', label: 'Pembelian', icon: '🛒' },
      refund: { variant: 'info', label: 'Refund', icon: '↩️' },
      withdrawal: { variant: 'warning', label: 'Penarikan', icon: '💸' },
    }
    return variants[type] || { variant: 'default', label: type, icon: '💳' }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wallet</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <p className="text-primary-100 mb-2">Saldo Available</p>
              <p className="text-4xl font-bold mb-6">{formatPrice(balance)}</p>
              
              <Button
                variant="secondary"
                className="w-full bg-white/20 border-0 hover:bg-white/30"
                onClick={() => setShowTopUpModal(true)}
              >
                💰 Top Up
              </Button>
            </Card>
            
            {/* Quick Actions */}
            <Card className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3">
                  <span>📋</span>
                  <span>Riwayat Transaksi</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center gap-3">
                  <span>📧</span>
                  <span>Export Statement</span>
                </button>
              </div>
            </Card>
          </div>
          
          {/* Transactions */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Riwayat Transaksi</h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Belum ada transaksi
                </p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => {
                    const typeInfo = getTypeBadge(tx.type)
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between py-3 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{typeInfo.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {typeInfo.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(tx.created_at)}
                            </p>
                            {tx.description && (
                              <p className="text-sm text-gray-400">
                                {tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className={`font-bold ${
                          tx.type === 'topup' || tx.type === 'refund'
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}>
                          {tx.type === 'topup' || tx.type === 'refund' ? '+' : '-'}
                          {formatPrice(tx.amount)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === 1}
                    onClick={() => fetchTransactions({ page: pagination.current_page - 1 })}
                  >
                    Prev
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    {pagination.current_page} / {pagination.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() => fetchTransactions({ page: pagination.current_page + 1 })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* Top Up Modal */}
      <Modal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        title="Top Up Wallet"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Masukkan jumlah yang ingin kamu top up ke wallet.
          </p>
          
          {/* Quick amounts */}
          <div className="flex gap-2 flex-wrap">
            {[10000, 25000, 50000, 100000, 250000, 500000].map((amount) => (
              <button
                key={amount}
                onClick={() => setTopUpAmount(amount.toString())}
                className={`
                  px-4 py-2 border rounded-lg text-sm font-medium
                  ${topUpAmount === amount.toString()
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-gray-200 hover:bg-gray-50'}
                `}
              >
                {formatPrice(amount)}
              </button>
            ))}
          </div>
          
          <Input
            label="Atau masukkan jumlah manual"
            type="number"
            placeholder="0"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowTopUpModal(false)}>
              Batal
            </Button>
            <Button
              onClick={handleTopUp}
              isLoading={isTopUpLoading}
              disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
            >
              Top Up {topUpAmount && formatPrice(parseFloat(topUpAmount))}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default WalletPage
```

---

## 5.12 Seller Dashboard Pages

### SellerDashboardPage

```jsx
// File: src/pages/dashboard/seller/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'

// ============================================================
// SELLER DASHBOARD PAGE
// ============================================================
const SellerDashboardPage = () => {
  // Sample stats - akan fetch dari API nanti
  const [stats] = useState({
    totalProducts: 12,
    pendingOrders: 5,
    completedOrders: 47,
    totalRevenue: 2450000,
  })
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-1">Selamat datang di dashboard seller!</p>
          </div>
          <Link to="/seller/products/new">
            <Button leftIcon={<span>➕</span>}>
              Tambah Produk
            </Button>
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Produk</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalProducts}
                </p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Baru</p>
                <p className="text-3xl font-bold text-warning-600 mt-1">
                  {stats.pendingOrders}
                </p>
              </div>
              <span className="text-4xl">📋</span>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Selesai</p>
                <p className="text-3xl font-bold text-success-600 mt-1">
                  {stats.completedOrders}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Penjualan</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Pesanan Terbaru</h2>
              <Link to="/seller/orders" className="text-primary-500 hover:underline text-sm">
                Lihat Semua
              </Link>
            </div>
            
            <div className="space-y-4">
              {/* Sample order */}
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">#ORD-001</p>
                  <p className="text-sm text-gray-500">Ani - 2 items</p>
                </div>
                <Badge variant="warning">Menunggu</Badge>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">#ORD-002</p>
                  <p className="text-sm text-gray-500">Budi - 1 item</p>
                </div>
                <Badge variant="info">Dikirim</Badge>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">#ORD-003</p>
                  <p className="text-sm text-gray-500">Caca - 3 items</p>
                </div>
                <Badge variant="success">Selesai</Badge>
              </div>
            </div>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
            
            <div className="space-y-3">
              <Link
                to="/seller/products"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-medium text-gray-900">Kelola Produk</p>
                  <p className="text-sm text-gray-500">Tambah, edit, atau hapus produk</p>
                </div>
              </Link>
              
              <Link
                to="/seller/orders"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-medium text-gray-900">Kelola Pesanan</p>
                  <p className="text-sm text-gray-500">Proses pesanan masuk</p>
                </div>
              </Link>
              
              <Link
                to="/seller/store"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">🏪</span>
                <div>
                  <p className="font-medium text-gray-900">Pengaturan Toko</p>
                  <p className="text-sm text-gray-500">Edit info toko</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboardPage
```

---

## 5.13 Driver Dashboard Pages

### DriverOrdersPage

```jsx
// File: src/pages/dashboard/driver/OrdersPage.jsx
import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useOrderStore from '../../../stores/orderStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// DRIVER ORDERS PAGE
// ============================================================
const DriverOrdersPage = () => {
  // Stores
  const { orders, isLoading, fetchOrders, updateStatus } = useOrderStore()
  const { success, error: showError } = useUIStore()
  
  // Fetch available orders on mount
  useEffect(() => {
    // Fetch orders yang waiting_shipper
    fetchOrders({ status: 'waiting_shipper' })
  }, [])
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  // Handle pickup
  const handlePickup = async (orderId) => {
    try {
      await updateStatus(orderId, 'shipping')
      success('Pesanan berhasil diambil!')
      // Refresh list
      fetchOrders({ status: 'waiting_shipper' })
    } catch (err) {
      showError('Gagal mengambil pesanan')
    }
  }
  
  // Handle deliver
  const handleDeliver = async (orderId) => {
    try {
      await updateStatus(orderId, 'completed')
      success('Pesanan berhasil diantar!')
      // Refresh list
      fetchOrders({ status: 'shipping' })
    } catch (err) {
      showError('Gagal mengkonfirmasi pengantaran')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pesanan Tersedia</h1>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl">🚗</span>
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Tidak Ada Pesanan
            </h2>
            <p className="text-gray-600">
              Saat ini belum ada pesanan yang perlu diantar.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{order.order_number}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                  <Badge variant={order.status === 'waiting_shipper' ? 'warning' : 'primary'}>
                    {order.status === 'waiting_shipper' ? 'Menunggu' : 'Dikirim'}
                  </Badge>
                </div>
                
                {/* Items */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-2">Items:</p>
                  <ul className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product?.name || 'Produk'}</span>
                        <span className="font-medium">
                          {formatPrice(item.price_at_purchase * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
                
                {/* Address */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Alamat Tujuan:</p>
                  <p className="text-gray-900">{order.shipping_address}</p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  {order.status === 'waiting_shipper' && (
                    <Button
                      onClick={() => handlePickup(order.id)}
                      className="flex-1"
                      leftIcon={<span>🚗</span>}
                    >
                      Ambil Pesanan
                    </Button>
                  )}
                  
                  {order.status === 'shipping' && (
                    <Button
                      onClick={() => handleDeliver(order.id)}
                      className="flex-1"
                      variant="success"
                      leftIcon={<span>✅</span>}
                    >
                      Konfirmasi Selesai
                    </Button>
                  )}
                  
                  <Button variant="outline" className="flex-1">
                    Detail
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DriverOrdersPage
```

---

## 5.14 Address Management

### AddressListPage

```jsx
// File: src/pages/dashboard/buyer/AddressListPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useAddressStore from '../../../stores/addressStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// ADDRESS LIST PAGE
// ============================================================
const AddressListPage = () => {
  const navigate = useNavigate()
  
  // Stores
  const { addresses, defaultAddress, isLoading, fetchAddresses, deleteAddress, setDefault } = useAddressStore()
  const { success, error: showError, warning } = useUIStore()
  
  // Fetch on mount
  useEffect(() => {
    fetchAddresses()
  }, [])
  
  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus alamat ini?')) return
    
    try {
      await deleteAddress(id)
      success('Alamat berhasil dihapus')
    } catch (err) {
      showError('Gagal menghapus alamat')
    }
  }
  
  // Handle set default
  const handleSetDefault = async (id) => {
    try {
      await setDefault(id)
      success('Alamat default berhasil diubah')
    } catch (err) {
      showError('Gagal mengubah alamat default')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Alamat Pengiriman</h1>
          <Link to="/buyer/addresses/new">
            <Button leftIcon={<span>➕</span>}>
              Tambah Alamat
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : addresses.length === 0 ? (
          <Card className="text-center py-12">
            <span className="text-6xl">📍</span>
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Belum Ada Alamat
            </h2>
            <p className="text-gray-600 mb-6">
              Tambahkan alamat untuk checkout pesanan.
            </p>
            <Link to="/buyer/addresses/new">
              <Button>Tambah Alamat</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id} className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{address.label}</span>
                    {address.is_default && (
                      <Badge variant="primary" size="sm">Default</Badge>
                    )}
                  </div>
                  <p className="text-gray-900">{address.recipient_name}</p>
                  <p className="text-gray-600">{address.phone}</p>
                  <p className="text-gray-500 mt-2">{address.full_address}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-primary-500 hover:underline text-sm"
                    >
                      Jadikan Default
                    </button>
                  )}
                  <Link 
                    to={`/buyer/addresses/${address.id}/edit`}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressListPage
```

### AddressFormPage

```jsx
// File: src/pages/dashboard/buyer/AddressFormPage.jsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import useAddressStore from '../../../stores/addressStore'
import useUIStore from '../../../stores/uiStore'

// ============================================================
// ADDRESS FORM PAGE
// ============================================================
const AddressFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  
  // Stores
  const { addAddress, updateAddress } = useAddressStore()
  const { success, error: showError } = useUIStore()
  
  // Form state
  const [formData, setFormData] = useState({
    label: '',
    recipient_name: '',
    phone: '',
    full_address: '',
    is_default: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }
  
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    try {
      if (isEdit) {
        await updateAddress(parseInt(id), formData)
        success('Alamat berhasil diupdate!')
      } else {
        await addAddress(formData)
        success('Alamat berhasil ditambahkan!')
      }
      navigate('/buyer/addresses')
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        showError('Gagal menyimpan alamat')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEdit ? 'Edit Alamat' : 'Tambah Alamat Baru'}
        </h1>
        
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Label Alamat"
              name="label"
              placeholder="Rumah, Kantor, dll"
              value={formData.label}
              onChange={handleChange}
              error={errors.label?.[0]}
              required
            />
            
            <Input
              label="Nama Penerima"
              name="recipient_name"
              placeholder="Nama lengkap penerima"
              value={formData.recipient_name}
              onChange={handleChange}
              error={errors.recipient_name?.[0]}
              required
            />
            
            <Input
              label="Nomor Telepon"
              name="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone?.[0]}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="full_address"
                rows={4}
                placeholder="Jl. nama jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                value={formData.full_address}
                onChange={handleChange}
                className={`
                  w-full px-4 py-2 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${errors.full_address ? 'border-red-500' : 'border-gray-300'}
                `}
              />
              {errors.full_address?.[0] && (
                <p className="mt-1 text-sm text-red-500">{errors.full_address[0]}</p>
              )}
            </div>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-gray-700">Jadikan alamat default</span>
            </label>
            
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/buyer/addresses')}
              >
                Batal
              </Button>
              <Button type="submit" isLoading={isLoading} className="flex-1">
                {isEdit ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default AddressFormPage
```

---

## 5.15 Integrasi API Services (Lanjutan)

### serviceStore.js

```javascript
// File: src/services/storeService.js
import api from './api'

// ============================================================
// STORE SERVICE
// ============================================================

const storeService = {
  /**
   * Ambil data toko sendiri (seller)
   * @returns {Promise<Object>}
   */
  getMyStore: async () => {
    const response = await api.get('/stores/my')
    return response.data
  },
  
  /**
   * Update data toko
   * @param {Object} data - Store data
   * @returns {Promise<Object>}
   */
  update: async (data) => {
    const response = await api.put('/stores/my', data)
    return response.data
  },
}

export default storeService
```

### sellerProductService.js

```javascript
// File: src/services/sellerProductService.js
import api from './api'

// ============================================================
// SELLER PRODUCT SERVICE
// ============================================================
// Fungsi-fungsi CRUD untuk produk milik seller

const sellerProductService = {
  /**
   * Ambil semua produk seller
   * @returns {Promise<Object>}
   */
  getMyProducts: async () => {
    const response = await api.get('/seller/products')
    return response.data
  },
  
  /**
   * Ambil statistik produk
   * @returns {Promise<Object>}
   */
  getStats: async () => {
    const response = await api.get('/seller/products/stats')
    return response.data
  },
  
  /**
   * Buat produk baru
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/seller/products', data)
    return response.data
  },
  
  /**
   * Update produk
   * @param {number} id - Product ID
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.put(`/seller/products/${id}`, data)
    return response.data
  },
  
  /**
   * Hapus produk
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/seller/products/${id}`)
    return response.data
  },
}

export default sellerProductService
```

---

## 5.16 Checklist BAB 5

- [ ] Buat productStore.js
- [ ] Buat orderStore.js
- [ ] Buat walletStore.js
- [ ] Buat addressStore.js
- [ ] Buat orderService.js
- [ ] Buat walletService.js
- [ ] Buat addressService.js
- [ ] Buat ProductDetailPage.jsx
- [ ] Buat CartPage.jsx
- [ ] Buat OrdersPage.jsx (Buyer)
- [ ] Buat WalletPage.jsx
- [ ] Buat AddressListPage.jsx
- [ ] Buat AddressFormPage.jsx
- [ ] Buat SellerDashboardPage.jsx
- [ ] Buat DriverOrdersPage.jsx
- [ ] Update App.jsx dengan route baru

---

## 5.17 Ringkasan BAB 5

```
┌─────────────────────────────────────────────────────────────────┐
│                    YANG SUDAH DIPELAJARI                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Stores baru (product, order, wallet, address)              │
│  ✅ Services baru (order, wallet, address, store, sellerProduct) │
│  ✅ ProductDetailPage dengan review functionality              │
│  ✅ CartPage dengan checkout flow                             │
│  ✅ Buyer Pages (Orders, Wallet, Addresses)                   │
│  ✅ Seller Dashboard dengan stats                             │
│  ✅ Driver Dashboard untuk delivery                         │
│  ✅ Form handling dengan error states                        │
│  ✅ Loading states di setiap page                           │
│                                                                  │
│  NEXT: BAB 6 - Backend: Store & Products                    │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan:                                                      │
│  1. Backend Store Management API                              │
│  2. Backend Product Management API                            │
│  3. Cart & Checkout API                                       │
│  4. Order API untuk semua role                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 6?** [Backend: Store & Products](../06-backend-store-product/06-store-product.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-08*
