# BAB 4: Frontend - UI Foundations

> **Tujuan:** Membangun fondasi UI untuk aplikasi SEAPEDIA dengan React - memahami component, routing, state management, dan membuat komponen UI yang reusable

---

## 4.1 Recap: Apa yang Sudah Kita Pelajari

Di BAB 0-3, kita sudah:
- Memahami arsitektur client-server
- Mendesain database schema 12 tabel
- Membuat migration, model, dan relasi
- Mengimplementasikan autentikasi dengan Laravel Sanctum
- Membuat API endpoints untuk auth

**Sekarang:** Kita akan membangun Frontend dengan React - membuat komponen UI, routing, dan state management!

---

## 4.2 Arsitektur Frontend React

### Apa itu React?

```
┌─────────────────────────────────────────────────────────────────┐
│                        APA ITU REACT?                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  React = Library JavaScript untuk MEMBANGUN TAMPILAN (UI)       │
│           berbasis KOMPONEN yang bisa DIPAKAI BERKALI-KALI      │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ANALOGI: LEGO                                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │   LEGO Piece    =    React Component                    │   │
│  │   ├── Kotak 2x4  =    Button Component                  │   │
│  │   ├── Kotak 2x2  =    Card Component                    │   │
│  │   └── Plate 4x4  =    Layout Component                  │   │
│  │                                                          │   │
│  │   Dengan LEGO, kamu bisa bikin rumah, mobil, apapun!     │   │
│  │   Dengan React, kamu bisa bikin button, card, form!      │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  KEUNGGULAN REACT:                                             │
│  ─────────────────────────────────────────────────────────────  │
│  1. Component-Based  → Bikin sekali, pakai berkali-kali        │
│  2. Reusable        → Button, Card bisa dipakai di mana saja   │
│  3. Declarative     → "Tampilkan ini" vs imperatif "cek dulu,  │
│                        lalu jika ada, tampilkan"               │
│  4. State Management → Data berubah → UI otomatis update        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Arsitektur SEAPEDIA Frontend

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARsitektur Frontend SEAPEDIA                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      BROWSER                                      │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │                  React Application                       │ │   │
│  │  │                                                          │ │   │
│  │  │   ┌─────────────────────────────────────────────────┐  │ │   │
│  │  │   │                 App.jsx                           │  │ │   │
│  │  │   │   ├── BrowserRouter                             │  │ │   │
│  │  │   │   ├── Zustand Store                             │  │ │   │
│  │  │   │   └── Routes                                   │  │ │   │
│  │  │   └─────────────────────────────────────────────────┘  │ │   │
│  │  │                                                          │ │   │
│  │  │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │   │
│  │  │   │  Pages   │  │Components│  │ Services │            │ │   │
│  │  │   │  /pages  │  │/components│  │ /services│            │ │   │
│  │  │   └──────────┘  └──────────┘  └──────────┘            │ │   │
│  │  │                                                          │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                        │
│                                  │ HTTP Request (JSON)                   │
│                                  │ e.g., POST /api/auth/login            │
│                                  ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   Laravel Backend (localhost:8000)                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4.3 Struktur Folder React

### Struktur Folder SEAPEDIA Frontend

```
seapedia-frontend/
│
├── src/
│   ├── components/              ← Komponen UI reusable
│   │   ├── ui/                  ← Komponen primitif
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Badge.jsx
│   │   │
│   │   ├── layout/              ← Komponen layout
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── forms/               ← Komponen form
│   │       ├── LoginForm.jsx
│   │       └── RegisterForm.jsx
│   │
│   ├── pages/                   ← Halaman lengkap
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   │
│   │   └── dashboard/           ← Dashboard pages
│   │       ├── buyer/
│   │       │   ├── CartPage.jsx
│   │       │   ├── OrdersPage.jsx
│   │       │   └── WalletPage.jsx
│   │       ├── seller/
│   │       │   ├── DashboardPage.jsx
│   │       │   └── ProductsPage.jsx
│   │       └── driver/
│   │           └── OrdersPage.jsx
│   │
│   ├── stores/                  ← Zustand state management
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── uiStore.js
│   │
│   ├── services/                ← API calls
│   │   ├── api.js              ← Axios instance
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── cartService.js
│   │
│   ├── hooks/                   ← Custom hooks
│   │   ├── useAuth.js
│   │   └── useCart.js
│   │
│   ├── utils/                   ← Utility functions
│   │   ├── formatCurrency.js
│   │   └── validation.js
│   │
│   ├── App.jsx                  ← Main app component
│   ├── main.jsx                 ← Entry point
│   └── index.css                ← Global styles + Tailwind
│
├── public/                      ← Static assets
├── package.json                 ← Dependencies
├── vite.config.js              ← Vite configuration
└── tailwind.config.js          ← Tailwind configuration
```

### Penjelasan Masing-Masing Folder

```
┌─────────────────────────────────────────────────────────────────┐
│                    PENJELASAN FOLDER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📁 src/components/ui/                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Komponen primitif/atomik yang sangat reusable:                │
│  • Button → Tombol dengan variant (primary, secondary, danger)  │
│  • Input → Input field dengan label dan error state           │
│  • Card → Container dengan border, shadow, padding             │
│  • Badge → Label kecil untuk status, category, dll            │
│  • Modal → Popup/dialog overlay                               │
│                                                                  │
│  📁 src/components/layout/                                     │
│  ─────────────────────────────────────────────────────────────  │
│  Komponen yang STRUKTUR halaman:                                │
│  • Navbar → Navigasi atas dengan logo, menu, auth buttons      │
│  • Footer → Footer halaman                                     │
│  • Sidebar → Menu samping untuk dashboard                      │
│                                                                  │
│  📁 src/pages/                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Halaman LENGKAP yang terdiri dari:                            │
│  • Komponen UI (dari components/)                              │
│  • Data fetching (dari services/)                              │
│  • Business logic                                              │
│                                                                  │
│  📁 src/stores/                                                │
│  ─────────────────────────────────────────────────────────────  │
│  Zustand stores untuk state management:                         │
│  • authStore → Data user login, role aktif                    │
│  • cartStore → Items di keranjang                             │
│  • uiStore → Loading state, modal, toast                      │
│                                                                  │
│  📁 src/services/                                              │
│  ─────────────────────────────────────────────────────────────  │
│  Fungsi-fungsi untuk panggil API:                               │
│  • api.js → Axios instance dengan config                       │
│  • authService.js → Login, register, logout                   │
│  • productService.js → CRUD produk                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4.4 Setup Project React

### Langkah 1: Buat Folder Structure

```bash
cd e:\PROJEKAN GABUT\SEAPEDIA\seapedia-frontend

# Buat folder-folder
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/forms
mkdir -p src/pages
mkdir -p src/pages/dashboard/buyer
mkdir -p src/pages/dashboard/seller
mkdir -p src/pages/dashboard/driver
mkdir -p src/pages/dashboard/admin
mkdir -p src/stores
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/utils
```

### Langkah 2: Install Dependencies

```bash
# Install dependencies utama
npm install react-router-dom axios zustand

# Install dependencies untuk styling
npm install -D tailwindcss postcss autoprefixer

# Init Tailwind
npx tailwindcss init -p
```

### Langkah 3: Konfigurasi Vite Proxy

Buka `vite.config.js` dan update:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

**Penjelasan:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    APA ITU PROXY?                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tanpa Proxy:                                                   │
│  Frontend minta: http://localhost:5173/api/products             │
│  Browser kirim langsung ke: http://localhost:5173/api/products  │
│  ❌ Error! Karena backend ada di port 8000                     │
│                                                                  │
│  Dengan Proxy (di vite.config.js):                             │
│  Frontend minta: http://localhost:5173/api/products            │
│  Vite intercept → redirect ke: http://localhost:8000/api/...  │
│  ✅ Berhasil!                                                  │
│                                                                  │
│  Kenapa pakai proxy?                                            │
│  ─────────────────────────────────────────────────────────────  │
│  • Menghindari CORS error                                       │
│  • URL lebih clean (tidak perlu lengkap)                       │
│  • Development lebih mudah                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4.5 Tailwind CSS Configuration

### Konfigurasi tailwind.config.js

Buka `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Color palette untuk SEAPEDIA
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Primary color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        success: {
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      
      // Font family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Spacing tambahan
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      
      // Border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      
      // Shadow
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
```

### Update Global CSS

Buka `src/index.css` dan GANTI dengan:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}

/* Component styles */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
  }
  
  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400;
  }
  
  .btn-danger {
    @apply bg-danger-500 text-white hover:bg-danger-600 active:bg-red-700;
  }
  
  .btn-outline {
    @apply border-2 border-primary-500 text-primary-500 hover:bg-primary-50;
  }
  
  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
           focus:ring-primary-500 focus:border-primary-500 transition-all;
  }
  
  .input-error {
    @apply border-danger-500 focus:ring-danger-500 focus:border-danger-500;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-card p-6;
  }
  
  .card-hover {
    @apply hover:shadow-card-hover transition-shadow duration-200;
  }
}

/* Utility overrides */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 4.6 Zustand State Management

### Apa itu Zustand?

```
┌─────────────────────────────────────────────────────────────────┐
│                     APA ITU ZUSTAND?                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Zustand = State management library yang SIMPEL untuk React       │
│             (Seperti Redux tapi lebih mudah)                     │
│                                                                  │
│  ANALOGI: KULKAS DI SETIAP RUANGAN                              │
│                                                                  │
│  Tanpa Zustand:                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  Kitchen  ────📦───>  Living Room  ────📦───>  Bedroom │   │
│  │  (Kulkas)      Bawa manual          Bawa manual         │   │
│  │                                                          │   │
│  │  ❌ Ribet! Harus bawa-bawa terus                        │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Dengan Zustand:                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │     📦 Zustand Store (Kulkas Sentral)                    │   │
│  │     ├── user data                                       │   │
│  │     ├── cart items                                      │   │
│  │     └── app state                                       │   │
│  │           │              │              │                │   │
│  │           ▼              ▼              ▼                │   │
│  │  Kitchen        Living Room        Bedroom               │   │
│  │  Ambil sendiri  Ambil sendiri      Ambil sendiri         │   │
│  │                                                          │   │
│  │  ✅ Gampang! Tinggal ambil di mana aja                   │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Auth Store

Buat file `src/stores/authStore.js`:

```javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================
// AUTH STORE
// ============================================================
// Bertugas menyimpan data autentikasi user
// - User yang login
// - Token autentikasi
// - Role yang aktif
// - Fungsi login, logout, dll

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ======================================================
      // STATE (Data yang disimpan)
      // ======================================================
      
      /** @type {Object|null} User yang sedang login */
      user: null,
      
      /** @type {string|null} Token autentikasi */
      token: null,
      
      /** @type {string|null} Role yang sedang aktif */
      activeRole: null,
      
      /** @type {boolean} Apakah sedang loading */
      isLoading: false,
      
      // ======================================================
      // GETTERS (Fungsi untuk ambil data)
      // ======================================================
      
      /**
       * Cek apakah user sudah login
       * @returns {boolean}
       */
      isAuthenticated: () => !!get().token,
      
      /**
       * Cek apakah user punya role tertentu
       * @param {string} role - Role yang dicek
       * @returns {boolean}
       */
      hasRole: (role) => {
        const { user } = get()
        if (!user || !user.roles) return false
        return user.roles.some(r => r.role === role)
      },
      
      /**
       * Cek apakah role tertentu sedang aktif
       * @param {string} role - Role yang dicek
       * @returns {boolean}
       */
      isRoleActive: (role) => get().activeRole === role,
      
      // ======================================================
      // ACTIONS (Fungsi untuk mengubah state)
      // ======================================================
      
      /**
       * Set data user setelah login
       * @param {Object} userData - Data user dari API
       * @param {string} token - Token autentikasi
       */
      setAuth: (userData, authToken) => {
        set({
          user: userData,
          token: authToken,
          activeRole: userData.active_role,
          isLoading: false,
        })
      },
      
      /**
       * Update data user
       * @param {Object} userData - Data user baru
       */
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }))
      },
      
      /**
       * Set role yang aktif
       * @param {string} role - Role yang akan diaktifkan
       */
      setActiveRole: (role) => {
        set({ activeRole: role })
      },
      
      /**
       * Set loading state
       * @param {boolean} loading - Status loading
       */
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      /**
       * Logout - hapus semua data auth
       */
      logout: () => {
        set({
          user: null,
          token: null,
          activeRole: null,
          isLoading: false,
        })
      },
    }),
    {
      // Konfigurasi persist (simpan ke localStorage)
      name: 'seapedia-auth', // Nama key di localStorage
      partialize: (state) => ({
        // Hanya simpan field ini ke localStorage
        user: state.user,
        token: state.token,
        activeRole: state.activeRole,
      }),
    }
  )
)

export default useAuthStore
```

### Cart Store

Buat file `src/stores/cartStore.js`:

```javascript
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
```

### UI Store

Buat file `src/stores/uiStore.js`:

```javascript
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
```

---

## 4.7 API Service

### Axios Instance

Buat file `src/services/api.js`:

```javascript
import axios from 'axios'

// ============================================================
// AXIOS INSTANCE
// ============================================================
// Instance axios dengan konfigurasi default
// Semua API call menggunakan instance ini

const api = axios.create({
  // Base URL - semua request akan menambahkan ini
  baseURL: '/api',  // Proxy akan redirect ke localhost:8000/api
  
  // Timeout - request akan gagal jika lebih dari 30 detik
  timeout: 30000,
  
  // Headers default
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================
// Kode ini berjalan SEBELUM request dikirim

api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const authData = JSON.parse(localStorage.getItem('seapedia-auth') || '{}')
    const token = authData.state?.token
    
    // Jika ada token, tambahkan ke header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    // Handle error sebelum request dikirim
    return Promise.reject(error)
  }
)

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
// Kode ini berjalan SETELAH response diterima

api.interceptors.response.use(
  (response) => {
    // Return response jika sukses
    return response
  },
  (error) => {
    // Handle error response
    
    if (error.response) {
      // Server merespon dengan error
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - token invalid/expired
          // Hapus auth data dari localStorage
          localStorage.removeItem('seapedia-auth')
          
          // Redirect ke login (jika di browser)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          break
          
        case 403:
          // Forbidden - tidak punya akses
          console.error('Access forbidden:', data.message)
          break
          
        case 404:
          // Not Found
          console.error('Resource not found:', data.message)
          break
          
        case 422:
          // Validation Error
          console.error('Validation error:', data.errors)
          break
          
        case 500:
          // Server Error
          console.error('Server error:', data.message)
          break
          
        default:
          console.error('API Error:', data)
      }
    } else if (error.request) {
      // Request dikirim tapi tidak ada response
      console.error('No response received:', error.request)
    } else {
      // Error lainnya
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api
```

### Auth Service

Buat file `src/services/authService.js`:

```javascript
import api from './api'

// ============================================================
// AUTH SERVICE
// ============================================================
// Fungsi-fungsi untuk autentikasi

const authService = {
  /**
   * Register user baru
   * @param {Object} data - { name, email, password, password_confirmation }
   * @returns {Promise<Object>} Response dari server
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  
  /**
   * Login user
   * @param {Object} data - { email, password }
   * @returns {Promise<Object>} Response dari server dengan token
   */
  login: async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
  
  /**
   * Logout user
   * @returns {Promise<Object>}
   */
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  
  /**
   * Get data user yang sedang login
   * @returns {Promise<Object>}
   */
  me: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  
  /**
   * Pilih role yang aktif
   * @param {string} role - 'buyer' | 'seller' | 'driver'
   * @returns {Promise<Object>}
   */
  selectRole: async (role) => {
    const response = await api.post('/auth/select-role', { role })
    return response.data
  },
  
  /**
   * Assign role baru ke user
   * @param {string} role - 'buyer' | 'seller' | 'driver'
   * @returns {Promise<Object>}
   */
  assignRole: async (role) => {
    const response = await api.post('/auth/assign-role', { role })
    return response.data
  },
}

export default authService
```

### Product Service

Buat file `src/services/productService.js`:

```javascript
import api from './api'

// ============================================================
// PRODUCT SERVICE
// ============================================================
// Fungsi-fungsi untuk CRUD produk

const productService = {
  /**
   * Ambil semua produk
   * @param {Object} params - { page, per_page, search, category }
   * @returns {Promise<Object>}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },
  
  /**
   * Ambil satu produk
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  /**
   * Ambil produk dari toko tertentu
   * @param {number} storeId - Store ID
   * @returns {Promise<Object>}
   */
  getByStore: async (storeId) => {
    const response = await api.get(`/stores/${storeId}/products`)
    return response.data
  },
  
  /**
   * Buat produk baru (Seller)
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/products', data)
    return response.data
  },
  
  /**
   * Update produk (Seller)
   * @param {number} id - Product ID
   * @param {Object} data - Product data
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  },
  
  /**
   * Hapus produk (Seller)
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}

export default productService
```

---

## 4.8 UI Components

### Button Component

Buat file `src/components/ui/Button.jsx`:

```jsx
import PropTypes from 'prop-types'

// ============================================================
// BUTTON COMPONENT
// ============================================================
// Komponen tombol yang reusable dengan berbagai variant

/**
 * @typedef {'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'} ButtonVariant
 * @typedef {'sm' | 'md' | 'lg'} ButtonSize
 */

/**
 * Button component dengan variant dan size
 * @param {Object} props
 * @param {string} props.children - Isi tombol
 * @param {ButtonVariant} [props.variant='primary'] - Variant tombol
 * @param {ButtonSize} [props.size='md'] - Ukuran tombol
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className] - Additional classes
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Button type
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} [props.leftIcon] - Icon di kiri
 * @param {React.ReactNode} [props.rightIcon] - Icon di kanan
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  }
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  // Disabled & Loading styles
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none'
  const loadingStyles = 'relative text-transparent'
  
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${(disabled || isLoading) ? disabledStyles : ''}
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg 
          className="absolute animate-spin h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Icons & Content */}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
}

export default Button
```

### Input Component

Buat file `src/components/ui/Input.jsx`:

```jsx
import { forwardRef } from 'react'
import PropTypes from 'prop-types'

// ============================================================
// INPUT COMPONENT
// ============================================================
// Komponen input field dengan label dan error handling

/**
 * Input component dengan berbagai fitur
 */
const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  containerClassName = '',
  required = false,
  disabled = false,
  helperText,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            border rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }
            ${className}
          `}
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
}

export default Input
```

### Card Component

Buat file `src/components/ui/Card.jsx`:

```jsx
import PropTypes from 'prop-types'

// ============================================================
// CARD COMPONENT
// ============================================================
// Komponen container/card yang reusable

/**
 * Card component untuk container berbagai konten
 */
const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'sm',
  border = true,
  onClick,
  ...props
}) => {
  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  }
  
  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  }
  
  // Hover effect
  const hoverStyles = hover
    ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200'
    : ''
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl
        ${border ? 'border border-gray-200' : ''}
        ${paddingStyles[padding]}
        ${shadowStyles[shadow]}
        ${hoverStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  border: PropTypes.bool,
  onClick: PropTypes.func,
}

// ============================================================
// CARD HEADER
// ============================================================
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
)

// ============================================================
// CARD BODY
// ============================================================
Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

// ============================================================
// CARD FOOTER
// ============================================================
Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
)

export default Card
```

### Badge Component

Buat file `src/components/ui/Badge.jsx`:

```jsx
import PropTypes from 'prop-types'

// ============================================================
// BADGE COMPONENT
// ============================================================
// Komponen label/status badge

/**
 * Badge untuk menampilkan status atau label
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }
  
  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }
  
  // Dot color based on variant
  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-primary-500',
    secondary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  }
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {/* Dot indicator */}
      {dot && (
        <span className={`w-2 h-2 rounded-full ${dotColors[variant]}`} />
      )}
      
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default', 'primary', 'secondary', 'success', 
    'warning', 'danger', 'info'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  dot: PropTypes.bool,
}

export default Badge
```

### Modal Component

Buat file `src/components/ui/Modal.jsx`:

```jsx
import { useEffect } from 'react'
import PropTypes from 'prop-types'

// ============================================================
// MODAL COMPONENT
// ============================================================
// Popup dialog overlay

/**
 * Modal component untuk dialog/popup
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className = '',
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4',
  }
  
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  // Don't render if not open
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div
          className={`
            relative w-full bg-white rounded-xl shadow-xl
            ${sizeStyles[size]}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  closeOnOverlay: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
}

export default Modal
```

---

## 4.9 Layout Components

### Navbar Component

Buat file `src/components/layout/Navbar.jsx`:

```jsx
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import useCartStore from '../../stores/cartStore'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

// ============================================================
// NAVBAR COMPONENT
// ============================================================
// Navigasi utama di atas halaman

const Navbar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, activeRole } = useAuthStore()
  const { getTotalItems } = useCartStore()
  
  const cartItemCount = getTotalItems()
  
  // Handle logout
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900">SEAPEDIA</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-500 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-600 hover:text-primary-500 transition-colors"
            >
              Products
            </Link>
          </div>
          
          {/* Right Side - Auth & Cart */}
          <div className="flex items-center gap-4">
            {/* Cart (hanya untuk buyer) */}
            {isAuthenticated() && activeRole === 'buyer' && (
              <Link 
                to="/cart" 
                className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                
                {/* Cart Badge */}
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Auth Buttons */}
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    
                    {/* Name */}
                    <span className="hidden md:block text-gray-700">{user?.name}</span>
                    
                    {/* Role Badge */}
                    {activeRole && (
                      <Badge variant="primary" size="sm">
                        {activeRole}
                      </Badge>
                    )}
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      
                      {/* Role-specific links */}
                      {activeRole === 'buyer' && (
                        <Link 
                          to="/buyer/orders" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                      )}
                      
                      {activeRole === 'seller' && (
                        <Link 
                          to="/seller/dashboard" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Seller Dashboard
                        </Link>
                      )}
                      
                      {activeRole === 'driver' && (
                        <Link 
                          to="/driver/orders" 
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Driver Dashboard
                        </Link>
                      )}
                      
                      <hr className="my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
```

### Footer Component

Buat file `src/components/layout/Footer.jsx`:

```jsx
import { Link } from 'react-router-dom'

// ============================================================
// FOOTER COMPONENT
// ============================================================
// Footer untuk setiap halaman

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-bold text-xl text-white">SEAPEDIA</span>
            </div>
            <p className="text-gray-400 mb-4">
              Platform e-commerce multi-role untuk kompetisi COMPFEST.
              Belajar membangun aplikasi full-stack dengan Laravel dan React.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Roles */}
          <div>
            <h3 className="font-semibold text-white mb-4">Roles</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">👤 Buyer</li>
              <li className="text-gray-400">🏪 Seller</li>
              <li className="text-gray-400">🚗 Driver</li>
              <li className="text-gray-400">👔 Admin</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} SEAPEDIA. 
            Dibuat untuk COMPFEST Competition.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

---

## 4.10 React Router Setup

### App.jsx - Routing Setup

Buka `src/App.jsx` dan GANTI dengan:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/dashboard/buyer/CartPage'
import OrdersPage from './pages/dashboard/buyer/OrdersPage'
import WalletPage from './pages/dashboard/buyer/WalletPage'
import SellerDashboardPage from './pages/dashboard/seller/DashboardPage'
import SellerProductsPage from './pages/dashboard/seller/ProductsPage'
import DriverOrdersPage from './pages/dashboard/driver/OrdersPage'

// Stores
import useAuthStore from './stores/authStore'
import useUIStore from './stores/uiStore'

// ============================================================
// PROTECTED ROUTE WRAPPER
// ============================================================
/**
 * Wrapper untuk route yang butuh autentikasi
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, activeRole } = useAuthStore()
  
  // Belum login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  
  // Butuh role tertentu
  if (requiredRole && activeRole !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// ============================================================
// ROLE ROUTE WRAPPER
// ============================================================
/**
 * Wrapper untuk route berdasarkan role
 */
const RoleRoute = ({ children, role }) => {
  const { isAuthenticated, activeRole } = useAuthStore()
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  
  if (activeRole !== role) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// ============================================================
// TOAST COMPONENT
// ============================================================
const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore()
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg text-white
            animate-slide-in
            ${toast.type === 'success' ? 'bg-green-500' : ''}
            ${toast.type === 'error' ? 'bg-red-500' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500' : ''}
            ${toast.type === 'info' ? 'bg-blue-500' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <span>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            
            {/* Landing Page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Products */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* ==================== PROTECTED ROUTES ==================== */}
            
            {/* Buyer Routes */}
            <Route
              path="/cart"
              element={
                <RoleRoute role="buyer">
                  <CartPage />
                </RoleRoute>
              }
            />
            <Route
              path="/buyer/orders"
              element={
                <RoleRoute role="buyer">
                  <OrdersPage />
                </RoleRoute>
              }
            />
            <Route
              path="/buyer/wallet"
              element={
                <RoleRoute role="buyer">
                  <WalletPage />
                </RoleRoute>
              }
            />
            
            {/* Seller Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <RoleRoute role="seller">
                  <SellerDashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <RoleRoute role="seller">
                  <SellerProductsPage />
                </RoleRoute>
              }
            />
            
            {/* Driver Routes */}
            <Route
              path="/driver/orders"
              element={
                <RoleRoute role="driver">
                  <DriverOrdersPage />
                </RoleRoute>
              }
            />
            
            {/* ==================== CATCH ALL ==================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  )
}

export default App
```

---

## 4.11 Pages

### Login Page

Buat file `src/pages/LoginPage.jsx`:

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'
import authService from '../services/authService'

// ============================================================
// LOGIN PAGE
// ============================================================
const LoginPage = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { success, error: showError } = useUIStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    try {
      // Call API
      const response = await authService.login(formData)
      
      if (response.success) {
        // Save to store
        setAuth(response.user, response.token)
        
        // Show success
        success('Login berhasil!')
        
        // Redirect based on role
        const role = response.user.active_role || response.user.roles?.[0]?.role
        if (role === 'seller') {
          navigate('/seller/dashboard')
        } else if (role === 'driver') {
          navigate('/driver/orders')
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      // Handle error
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        showError(err.response?.data?.message || 'Login gagal!')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Login ke akun SEAPEDIA kamu</p>
        </div>
        
        {/* Form Card */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email?.[0]}
              required
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
            
            {/* Password */}
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password?.[0]}
              required
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </form>
          
          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                Register di sini
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
```

### Register Page

Buat file `src/pages/RegisterPage.jsx`:

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import useUIStore from '../stores/uiStore'
import authService from '../services/authService'

// ============================================================
// REGISTER PAGE
// ============================================================
const RegisterPage = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useUIStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    try {
      // Call API
      const response = await authService.register(formData)
      
      if (response.success) {
        // Show success
        success('Registrasi berhasil! Silakan login.')
        
        // Redirect to login
        navigate('/login')
      }
    } catch (err) {
      // Handle error
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        showError(err.response?.data?.message || 'Registrasi gagal!')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Daftar untuk mulai menggunakan SEAPEDIA</p>
        </div>
        
        {/* Form Card */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <Input
              label="Nama Lengkap"
              name="name"
              type="text"
              placeholder="Masukkan nama kamu"
              value={formData.name}
              onChange={handleChange}
              error={errors.name?.[0]}
              required
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            
            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email?.[0]}
              required
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
            
            {/* Password */}
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={formData.password}
              onChange={handleChange}
              error={errors.password?.[0]}
              required
              helperText="Minimal 8 karakter"
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            
            {/* Confirm Password */}
            <Input
              label="Konfirmasi Password"
              name="password_confirmation"
              type="password"
              placeholder="Ulangi password"
              value={formData.password_confirmation}
              onChange={handleChange}
              error={errors.password_confirmation?.[0]}
              required
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Register
            </Button>
          </form>
          
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Login di sini
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage
```

### Home Page

Buat file `src/pages/HomePage.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import productService from '../services/productService'

// ============================================================
// HOME PAGE
// ============================================================
const HomePage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll({ per_page: 8 })
        if (response.success) {
          setProducts(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }
  
  return (
    <div className="min-h-screen">
      {/* ==================== HERO SECTION ==================== */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Selamat Datang di SEAPEDIA
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Platform e-commerce multi-role untuk Buyer, Seller, dan Driver.
              Belanja, jualan, dan antar dengan mudah!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  Browse Products
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Kenapa SEAPEDIA?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Belanja Mudah</h3>
              <p className="text-gray-600">
                Pilihkan produk dari berbagai toko dan checkout dengan satu klik.
              </p>
            </Card>
            
            {/* Feature 2 */}
            <Card className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Jualan Praktis</h3>
              <p className="text-gray-600">
                Buka toko dan kelola produk dengan mudah. Terima pesanan langsung.
              </p>
            </Card>
            
            {/* Feature 3 */}
            <Card className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Antar Cepat</h3>
              <p className="text-gray-600">
                Driver antar pesanan dengan cepat ke alamat tujuan.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* ==================== PRODUCTS SECTION ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Produk Terbaru
            </h2>
            <Link to="/products">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} padding="none" className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card padding="none" hover className="h-full">
                    {/* Image */}
                    <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      {/* Store */}
                      {product.store && (
                        <Badge variant="default" size="sm" className="mb-2">
                          {product.store.name}
                        </Badge>
                      )}
                      
                      {/* Name */}
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <p className="text-lg font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </p>
                      
                      {/* Stock */}
                      <p className="text-sm text-gray-500 mt-1">
                        Stok: {product.stock}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Bergabunglah dengan SEAPEDIA hari ini dan mulai pengalaman e-commerce baru!
          </p>
          <Link to="/register">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
```

### Products Page

Buat file `src/pages/ProductsPage.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import productService from '../services/productService'

// ============================================================
// PRODUCTS PAGE
// ============================================================
const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1,
  })
  
  // Fetch products
  const fetchProducts = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await productService.getAll({
        page,
        per_page: pagination.per_page,
        search: search || undefined,
      })
      
      if (response.success) {
        setProducts(response.data)
        setPagination({
          current_page: response.meta?.current_page || 1,
          per_page: response.meta?.per_page || 12,
          total: response.meta?.total || 0,
          last_page: response.meta?.last_page || 1,
        })
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Initial fetch
  useEffect(() => {
    fetchProducts()
  }, [])
  
  // Search handler
  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(1) // Reset to page 1
  }
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Semua Produk
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <Button type="submit">Cari</Button>
          </form>
        </div>
        
        {/* Results Info */}
        <div className="mb-4 text-gray-600">
          Menampilkan {products.length} dari {pagination.total} produk
        </div>
        
        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} padding="none" className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 mb-4">Tidak ada produk ditemukan</p>
            <Button variant="outline" onClick={() => { setSearch(''); fetchProducts(); }}>
              Reset Pencarian
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card padding="none" hover className="h-full">
                  {/* Image */}
                  <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Store */}
                    {product.store && (
                      <Badge variant="default" size="sm" className="mb-2">
                        {product.store.name}
                      </Badge>
                    )}
                    
                    {/* Name */}
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <p className="text-lg font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </p>
                    
                    {/* Stock */}
                    <p className="text-sm text-gray-500 mt-1">
                      Stok: {product.stock}
                    </p>
                  </div>
                </Card>
              </Link>
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
              onClick={() => fetchProducts(pagination.current_page - 1)}
            >
              Previous
            </Button>
            
            <span className="px-4 py-2 text-gray-600">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchProducts(pagination.current_page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
```

---

## 4.12 Utility Functions

### Format Currency

Buat file `src/utils/formatCurrency.js`:

```javascript
// ============================================================
// FORMAT CURRENCY
// ============================================================

/**
 * Format angka menjadi mata uang Indonesia
 * @param {number} amount - Jumlah uang
 * @param {string} [currency='IDR'] - Mata uang
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format angka menjadi format Indonesia
 * @param {number} number - Angka
 * @returns {string}
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}

/**
 * Parse string currency menjadi number
 * @param {string} currencyString - String mata uang
 * @returns {number}
 */
export const parseCurrency = (currencyString) => {
  // Hapus karakter non-angka
  const cleaned = currencyString.replace(/[^0-9,-]/g, '')
  // Konversi ke number
  return parseFloat(cleaned.replace(',', '.'))
}
```

### Validation

Buat file `src/utils/validation.js`:

```javascript
// ============================================================
// VALIDATION UTILITIES
// ============================================================

/**
 * Validasi email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validasi password minimal 8 karakter
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return password.length >= 8
}

/**
 * Validasi nomor telepon Indonesia
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  // Contoh: 081234567890, +6281234567890
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Generate error message untuk form validation
 * @param {string} field - Nama field
 * @param {string} rule - Aturan validasi
 * @returns {string}
 */
export const getValidationMessage = (field, rule) => {
  const messages = {
    required: `${field} wajib diisi`,
    email: `${field} harus berupa email yang valid`,
    min: `${field} minimal 8 karakter`,
    same: `${field} harus sama dengan password`,
    phone: `${field} harus berupa nomor telepon yang valid`,
  }
  
  return messages[rule] || `${field} tidak valid`
}
```

---

## 4.13 Checklist BAB 4

- [ ] Buat folder structure React
- [ ] Install dependencies (react-router-dom, axios, zustand)
- [ ] Konfigurasi Tailwind CSS
- [ ] Konfigurasi Vite proxy
- [ ] Buat Zustand stores (auth, cart, ui)
- [ ] Buat API service (api.js, authService, productService)
- [ ] Buat UI components (Button, Input, Card, Badge, Modal)
- [ ] Buat Layout components (Navbar, Footer)
- [ ] Setup React Router di App.jsx
- [ ] Buat Login Page
- [ ] Buat Register Page
- [ ] Buat Home Page
- [ ] Buat Products Page
- [ ] Buat Utility functions

---

## 4.14 Ringkasan BAB 4

```
┌─────────────────────────────────────────────────────────────────┐
│                    YANG SUDAH DIPELAJARI                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Konsep React Component-based architecture                  │
│  ✅ Zustand state management (auth, cart, ui stores)          │
│  ✅ Axios instance dengan interceptors                         │
│  ✅ API services (auth, products)                              │
│  ✅ UI Components (Button, Input, Card, Badge, Modal)         │
│  ✅ Layout Components (Navbar, Footer)                         │
│  ✅ React Router dengan protected routes                       │
│  ✅ Pages (Login, Register, Home, Products)                   │
│  ✅ Tailwind CSS configuration                                 │
│  ✅ Utility functions (formatCurrency, validation)             │
│                                                                  │
│  NEXT: BAB 5 - Frontend: Pages & State                        │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan:                                                      │
│  1. Lanjutkan membuat pages (Cart, Orders, Dashboard)         │
│  2. Integrate API dengan pages                                 │
│  3. Handle loading & error states                             │
│  4. Role-based navigation                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 5?** [Frontend: Pages & State](../05-frontend-state/05-state-management.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-08*
