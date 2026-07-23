# BAB 8: Frontend - Dashboards

> **Tujuan:** Membangun halaman dashboard untuk setiap role (Buyer, Seller, Driver) yang terhubung ke API backend dan menampilkan statistik real-time.

---

## 8.1 Recap: Apa yang Sudah Kita Bangun

Memasuki BAB 8, fondasi aplikasi kita sudah lengkap:

| Layer | Yang sudah ada | File rujukan |
|-------|----------------|--------------|
| State | authStore, cartStore, walletStore, orderStore, addressStore, uiStore, productStore | `src/stores/*.js` |
| Service | authService, walletService, orderService, addressService, productService, sellerProductService, storeService | `src/services/*.js` |
| UI | Card, Button, Badge, Modal, Input, Loader, Toast | `src/components/ui/*.jsx` |
| Layout | Navbar, Footer | `src/components/layout/*.jsx` |
| Halaman | HomePage, ProductsPage, ProductDetailPage, Login, Register, Cart, Orders, Wallet, Address | `src/pages/*.jsx`, `src/pages/dashboard/buyer/*.jsx` |
| Backend API | User/Auth, Store, Product, Wallet, Cart, Order | `seapedia-backend/app/Http/Controllers/Api/*` |

**Yang kita bangun di BAB 8:** tiga halaman dashboard (Buyer, Seller, Driver) yang menyatukan semua data di atas menjadi tampilan ringkas per role.

---

## 8.2 Gambaran Umum Dashboard

### Apa Itu Dashboard?

Dashboard adalah **landing page setelah login** untuk masing-masing role. Ia bukan halaman CRUD, melainkan **ringkasan kondisi** user: statistik angka, list item terbaru, dan pintasan ke fitur lain.

### Tiga Dashboard, Tiga Kepedulian

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIGA DASHBOARD SEAPEDIA                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👤 BUYER (/buyer/dashboard)                                    │
│  Kepedulian: "Saya punya berapa uang & pesanan apa yang jalan?" │
│  • Saldo wallet                                                 │
│  • Pesanan aktif (dikemas / dikirim)                            │
│  • Pesanan selesai (riwayat sukses)                             │
│  • Pintasan belanja, keranjang, top up, alamat                  │
│                                                                  │
│  🏪 SELLER (/seller/dashboard)                                  │
│  Kepedulian: "Toko saya laku apa, stok habis apa?"              │
│  • Statistik produk (total, aktif, habis)                       │
│  • Pesanan masuk (status packaging)                             │
│  • Pintasan tambah produk, kelola pesanan, pengaturan toko      │
│  • Placeholder khusus bila seller belum punya toko              │
│                                                                  │
│  🚗 DRIVER (/driver/dashboard)                                  │
│  Kepedulian: "Mana order yang bisa saya ambil?"                 │
│  • Pesanan tersedia (waiting_shipper)                           │
│  • Pesanan aktif (shipping)                                     │
│  • Pesanan selesai (riwayat)                                    │
│  • Pintasan ambil/antar pesanan                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mengapa Perlu Role-Based Dashboard?

Tanpa dashboard:
- Buyer harus buka `/cart`, `/orders`, `/wallet` satu-satu untuk tahu posisinya.
- Seller harus hitung manual "berapa produk saya yang masih aktif".
- Driver tidak tahu pesanan mana yang tersedia tanpa cek berkala.

Dashboard menjawab tiga pertanyaan itu **dalam satu layar**.

---

## 8.3 Struktur File Dashboard

Semua halaman dashboard disimpan di `src/pages/dashboard/{role}/`. Konsistensi penamaan file mengikuti pola `{Fitur}Page.jsx` (selalu diakhiri `Page`).

```
seapedia-frontend/src/pages/dashboard/
│
├── buyer/                       ← Halaman khusus buyer
│   ├── DashboardPage.jsx        ← BARU: ringkasan buyer
│   ├── OrdersPage.jsx           ← daftar pesanan + filter
│   ├── CartPage.jsx             ← keranjang
│   ├── WalletPage.jsx           ← dompet digital
│   ├── AddressListPage.jsx      ← daftar alamat
│   └── AddressFormPage.jsx      ← form tambah/edit alamat
│
├── seller/                      ← Halaman khusus seller
│   ├── DashboardPage.jsx        ← ringkasan seller
│   ├── ProductsPage.jsx         ← kelola produk
│   └── StorePage.jsx            ← pengaturan toko
│
└── driver/                      ← Halaman khusus driver
    ├── DashboardPage.jsx        ← ringkasan driver
    └── OrdersPage.jsx           ← list & detail pesanan delivery
```

### Kegunaan Tiap File Dashboard

| File | Peran |
|------|-------|
| [DashboardPage.jsx](src/pages/dashboard/buyer/DashboardPage.jsx) | Ringkasan: statistik + 5 pesanan terakhir + 4 quick action |
| [OrdersPage.jsx](src/pages/dashboard/buyer/OrdersPage.jsx) | Daftar lengkap pesanan dengan filter status & pagination |
| [CartPage.jsx](src/pages/dashboard/buyer/CartPage.jsx) | Keranjang belanja sebelum checkout |
| [WalletPage.jsx](src/pages/dashboard/buyer/WalletPage.jsx) | Dompet digital: lihat saldo, top up, mutasi |
| [AddressListPage.jsx](src/pages/dashboard/buyer/AddressListPage.jsx) | CRUD alamat pengiriman |
| [DashboardPage.jsx](src/pages/dashboard/seller/DashboardPage.jsx) | Ringkasan seller + cek kepemilikan toko |
| [DashboardPage.jsx](src/pages/dashboard/driver/DashboardPage.jsx) | Ringkasan driver + daftar order tersedia |

---

## 8.4 Cara Kerja Tiga Dashboard

### Pola Umum (Berlaku untuk Ketiganya)

Semua dashboard mengikuti **pola 5 langkah** yang sama:

```
┌─────────────────────────────────────────────────────────────────┐
│                  POLA KERJA DASHBOARD (UMUM)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LANGKAH 1: Mount komponen                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Komponen di-render. State lokal (loading, stats, recent)       │
│  diinisialisasi dengan nilai default.                            │
│                                                                  │
│  LANGKAH 2: useEffect fetch data paralel                        │
│  ─────────────────────────────────────────────────────────────  │
│  Pakai Promise.all([...]) agar beberapa API call                │
│  berjalan bersamaan, bukan berurutan.                            │
│                                                                  │
│  LANGKAH 3: Simpan ke state                                     │
│  ─────────────────────────────────────────────────────────────  │
│  Setiap response dicek .success. Jika ya, setStats/setOrders.    │
│  Pakai setStats(prev => ...) untuk update sebagian field.        │
│                                                                  │
│  LANGKAH 4: Render kondisional                                  │
│  ─────────────────────────────────────────────────────────────  │
│  loading === true  → spinner                                    │
│  data kosong       → empty state (ikon + ajakan)                 │
│  data ada          → stats cards + list                          │
│                                                                  │
│  LANGKAH 5: User interaction                                    │
│  ─────────────────────────────────────────────────────────────  │
│  Klik quick action → navigasi via <Link to="...">               │
│  Klik "Lihat Semua" → navigasi ke halaman list lengkap           │
│  Error → toast via useUIStore().error()                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Buyer Dashboard — Cara Kerja

[DashboardPage.jsx](src/pages/dashboard/buyer/DashboardPage.jsx) menjawab: "Uang saya berapa, pesanan saya sedang di mana?"

**Komunikasi data (3 panggilan paralel):**

```
BuyerDashboardPage.useEffect()
   │
   ├── walletService.getWallet()
   │      └─→ GET /api/wallet
   │             └─→ response.data.balance
   │
   ├── orderService.getAll({ status: 'packaging,waiting_shipper,shipping' })
   │      └─→ GET /api/orders?status=packaging,waiting_shipper,shipping
   │             └─→ response.data (array) → dipotong .slice(0, 5)
   │
   └── orderService.getAll({ status: 'completed' })
          └─→ GET /api/orders?status=completed
                 └─→ response.data.length (hanya dihitung)
```

**Yang ditampilkan:**
- 3 Stat Cards: Saldo Wallet, Pesanan Aktif, Pesanan Selesai.
- Card kiri: 5 pesanan aktif terbaru dengan badge status.
- Card kanan: 4 quick action (Belanja, Keranjang, Top Up, Kelola Alamat).

**Kenapa tidak perlu placeholder "belum punya toko"?**
Karena buyer tidak punya syarat seperti seller. Setiap user yang register sebagai buyer langsung bisa mengakses dashboard ini.

---

### Seller Dashboard — Cara Kerja

[DashboardPage.jsx](src/pages/dashboard/seller/DashboardPage.jsx) menjawab: "Toko saya performanya bagaimana?"

**Komunikasi data (2 panggilan paralel + 1 cek awal):**

```
SellerDashboardPage
   │
   ├── useEffect #1 (cek user.store)
   │     └─→ if (!user?.store) setHasStore(false)
   │
   └── useEffect #2 (fetch data, hanya jika hasStore)
         ├── productService.getMyStats()
         │      └─→ GET /api/seller/products/stats
         │             ├─ total_products
         │             ├─ active_products
         │             └─ out_of_stock
         │
         └── orderService.getAll({ status: 'packaging' })
                └─→ GET /api/orders?status=packaging
                       └─→ response.data.slice(0, 5)
```

**Yang ditampilkan:**
- Placeholder khusus `!hasStore`: ajakan buat toko dengan tombol ke `/seller/store/new`.
- 4 Stat Cards: Total Produk, Produk Aktif, Stok Habis, Pesanan Baru.
- Card kiri: 5 pesanan masuk dengan badge status (`packaging`, `waiting_shipper`, `shipping`, `completed`, `returned`).
- Card kanan: 3 quick action (Kelola Produk, Kelola Pesanan, Pengaturan Toko).
- Header: tombol "Tambah Produk" yang mengarah ke `/seller/products/new`.

**Perbedaan penting dari buyer:** Seller **wajib** punya toko sebelum berjualan. Maka `hasStore` state diinisialisasi `true`, lalu di-set `false` bila `user.store` kosong. Render condisional: `!hasStore` tampilkan placeholder, kalau `true` baru fetch data.

---

### Driver Dashboard — Cara Kerja

[DashboardPage.jsx](src/pages/dashboard/driver/DashboardPage.jsx) menjawab: "Order mana yang bisa saya ambil sekarang?"

**Komunikasi data (2 panggilan paralel):**

```
DriverDashboardPage.useEffect()
   │
   ├── orderService.getAll({ status: 'waiting_shipper' })
   │      └─→ GET /api/orders?status=waiting_shipper
   │             ├─ length → stats.available
   │             └─ slice(0, 5) → availableOrders
   │
   └── orderService.getAll({ status: 'shipping' })
          └─→ GET /api/orders?status=shipping
                 └─ length → stats.active
```

**Yang ditampilkan:**
- 3 Stat Cards: Pesanan Tersedia (waiting_shipper), Pesanan Aktif (shipping), Pesanan Selesai (saat ini masih TODO: 0).
- Card kiri: 5 pesanan tersedia dengan info toko, total amount, dan tombol "Ambil" yang mengarah ke `/driver/orders/{id}`.
- Card kanan: 2 quick action (Lihat Pesanan, Kembali ke Beranda).

**Kenapa tidak ada placeholder seperti seller?**
Driver tidak perlu setup awal — mereka bisa langsung menerima order. Yang penting adalah **feed order tersedia** yang real-time, dan feed order aktif yang sedang mereka tanggung.

---

## 8.5 Service yang Dipakai Dashboard

Dashboard **tidak pernah** fetch data langsung. Ia selalu melalui service layer. Pemisahan ini menjaga konsistensi error handling, header auth, dan format response.

| Dashboard | Service yang Dipanggil | Method |
|-----------|------------------------|--------|
| Buyer | `walletService.getWallet()` | GET saldo |
| Buyer | `orderService.getAll({status})` | GET list pesanan (2× dengan status berbeda) |
| Seller | `productService.getMyStats()` | GET statistik produk seller |
| Seller | `orderService.getAll({status:'packaging'})` | GET pesanan masuk |
| Driver | `orderService.getAll({status:'waiting_shipper'})` | GET order tersedia |
| Driver | `orderService.getAll({status:'shipping'})` | GET order aktif |

Semua service mengembalikan objek `{ success, data, message }`. Pola penggunaan di dashboard selalu:
```js
if (response.success) { /* pakai response.data */ }
```
Tanpa memeriksa `success`, kita bisa saja render error sebagai data — bug yang umum.

---

## 8.6 Route Configuration & Role Protection

File [App.jsx](src/App.jsx) mengatur semua rute. Setiap dashboard dilindungi oleh `RoleRoute` wrapper.

### Cara Kerja RoleRoute

`RoleRoute` adalah Higher-Order Component (HOC) — komponen yang menerima komponen lain sebagai anak dan memutuskan apakah anak itu boleh di-render.

```
User klik link /buyer/dashboard
        │
        ▼
<RoleRoute role="buyer"> membaca useAuthStore()
        │
        ├─ isAuthenticated() === false  → <Navigate to="/login" />
        ├─ activeRole !== 'buyer'       → <Navigate to="/" />
        └─ semua cek lulus              → render <BuyerDashboardPage />
```

**Komunikasi antar file:**

```
App.jsx ──import──► useAuthStore (cek isAuthenticated, activeRole)
   │
   └─包裹────► RoleRoute ──包裹────► BuyerDashboardPage / SellerDashboardPage / DriverDashboardPage
```

Artinya, tanpa token valid & role yang sesuai, user **tidak akan pernah sampai** ke komponen dashboard. Dashboard bisa percaya bahwa `user` di `useAuthStore` sudah ada.

### Pemetaan Route Dashboard

| Path | Komponen | Role yang Diizinkan |
|------|----------|---------------------|
| `/buyer/dashboard` | BuyerDashboardPage | buyer |
| `/seller/dashboard` | SellerDashboardPage | seller |
| `/driver/dashboard` | DriverDashboardPage | driver |

---

## 8.7 Contoh Kode: Satu Pola Dashboard

Per aturan dokumentasi ini, hanya satu contoh kode lengkap disertakan. Yang ditampilkan adalah **BuyerDashboardPage** karena ini file **baru** yang sebelumnya belum ada — sekaligus mewakili pola universal yang juga dipakai Seller & Driver DashboardPage.

```jsx
// File: src/pages/dashboard/buyer/DashboardPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import useAuthStore from '../../../stores/authStore'
import useUIStore from '../../../stores/uiStore'
import walletService from '../../../services/walletService'
import orderService from '../../../services/orderService'

// ============================================================
// BUYER DASHBOARD PAGE
// ============================================================
const BuyerDashboardPage = () => {
  const { user } = useAuthStore()
  const { error: showError } = useUIStore()

  // State untuk data
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    balance: 0,
    activeOrders: 0,
    completedOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch wallet dan orders secara parallel
        const [walletRes, activeOrdersRes, completedOrdersRes] = await Promise.all([
          walletService.getWallet(),
          orderService.getAll({ status: 'packaging,waiting_shipper,shipping' }),
          orderService.getAll({ status: 'completed' })
        ])

        // Update wallet stats
        if (walletRes.success) {
          setStats(prev => ({
            ...prev,
            balance: walletRes.data.balance || 0,
          }))
        }

        // Update order stats
        if (activeOrdersRes.success) {
          setStats(prev => ({
            ...prev,
            activeOrders: activeOrdersRes.data.length || 0,
          }))
        }

        if (completedOrdersRes.success) {
          setStats(prev => ({
            ...prev,
            completedOrders: completedOrdersRes.data.length || 0,
          }))
        }

        // Set recent orders (dari active orders)
        if (activeOrdersRes.success) {
          setRecentOrders(activeOrdersRes.data.slice(0, 5))
        }
      } catch (err) {
        console.error('Gagal memuat dashboard:', err)
        showError('Gagal memuat data dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo Wallet</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatPrice(stats.balance)}
                </p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Aktif</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">
                  {stats.activeOrders}
                </p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pesanan Selesai</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {stats.completedOrders}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Pesanan Aktif</h2>
              <Link to="/buyer/orders" className="text-primary-500 hover:underline text-sm">
                Lihat Semua
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Tidak ada pesanan aktif
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h2>

            <div className="space-y-3">
              <Link
                to="/products"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">🛒</span>
                <div>
                  <p className="font-medium text-gray-900">Belanja Sekarang</p>
                  <p className="text-sm text-gray-500">Jelajahi produk marketplace</p>
                </div>
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">🛒</span>
                <div>
                  <p className="font-medium text-gray-900">Lihat Keranjang</p>
                  <p className="text-sm text-gray-500">Checkout dan lanjutkan belanja</p>
                </div>
              </Link>

              <Link
                to="/buyer/wallet"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium text-gray-900">Top Up Wallet</p>
                  <p className="text-sm text-gray-500">Tambah saldo untuk belanja</p>
                </div>
              </Link>

              <Link
                to="/buyer/addresses"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium text-gray-900">Kelola Alamat</p>
                  <p className="text-sm text-gray-500">Tambah atau edit alamat pengiriman</p>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboardPage
```

> **Catatan:** SellerDashboardPage dan DriverDashboardPage mengikuti **pola yang sama** persis. Perbedaannya hanya pada:
> 1. Service yang dipanggil (productService vs walletService).
> 2. Parameter status yang dikirim ke orderService.
> 3. Bentuk stat cards (3 atau 4 kolom).
> 4. Seller punya render awal `!hasStore` sebagai placeholder buat toko.

---

## 8.8 Pendukung Dashboard: Navbar & OrdersPage Buyer

### Navbar ([Navbar.jsx](src/components/layout/Navbar.jsx))

Navbar adalah komponen global yang tampil di **setiap halaman** (via [App.jsx](src/App.jsx) di luar `<Routes>`). Tugasnya:

1. **Logo & brand** — Link ke `/`.
2. **Menu publik** — Home, Products.
3. **Cart icon** — Hanya muncul bila `activeRole === 'buyer'`, badge angka dari `useCartStore.getTotalItems()`.
4. **User menu** (dropdown) — Berubah sesuai role:
   - Buyer → Profile, Dashboard, Pesanan Saya.
   - Seller → Profile, Seller Dashboard.
   - Driver → Profile, Driver Dashboard.
5. **Logout** — Memanggil `useAuthStore.logout()` lalu `navigate('/')`.

**Komunikasi:**
```
Navbar
  ├── useAuthStore  → user, isAuthenticated, logout, activeRole
  └── useCartStore  → getTotalItems (untuk badge cart)
```

Konsumer Navbar adalah role detection: buyer melihat menu Pesanan Saya, seller tidak. Ini mencegah user "salah kamar".

### OrdersPage Buyer ([OrdersPage.jsx](src/pages/dashboard/buyer/OrdersPage.jsx))

Halaman ini **bukan dashboard** tapi halaman list lengkap pesanan. Berbeda dengan dashboard yang hanya menampilkan 5 pesanan aktif, halaman ini:

1. **Filter status** — Tombol pill Semua / Dikemas / Menunggu Driver / Dikirim / Selesai / Dikembalikan.
2. **Pagination** — Prev/Next button bila `pagination.last_page > 1`.
3. **Per order:** Order ID, badge status, 3 thumbnail produk pertama (sisanya jadi `+N`), tanggal, total, tombol Detail & Beli Lagi (khusus status `completed`).
4. **Empty state** — Emoji 📦 + ajakan "Mulai Belanja" → `/products`.

**Komunikasi:**
```
OrdersPage
  └── useOrderStore.fetchOrders({ status, page })
        └─→ GET /api/orders?status=...&page=...
              └─→ simpan ke orders[] & pagination
```

Bedanya dengan dashboard: OrdersPage **satu sumber kebenaran dari `useOrderStore`**, bukan state lokal. Ini karena OrdersPage bisa di-revisit, dan Zustand akan cache hasilnya. Dashboard, sebaliknya, selalu fetch ulang saat mount karena data harus selalu segar.

---

## 8.9 Checklist BAB 8

- [x] Buyer Dashboard Page (BARU — fetch wallet + 2x orders paralel)
- [x] Seller Dashboard Page (stat produk + pesanan masuk + cek kepemilikan toko)
- [x] Driver Dashboard Page (order tersedia + order aktif)
- [x] Route configuration dengan RoleRoute di App.jsx
- [x] Service API calls untuk dashboard (walletService, productService, orderService)
- [x] Error handling via useUIStore
- [x] Loading states (spinner)
- [x] Empty states ("Belum ada pesanan", "Tidak ada pesanan aktif", "Tidak ada pesanan tersedia")
- [x] Navbar dengan menu sesuai role
- [x] OrdersPage buyer dengan filter & pagination

---

## 8.10 Ringkasan BAB 8

```
┌─────────────────────────────────────────────────────────────────┐
│                    YANG SUDAH DIPELAJARI                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Buyer Dashboard dengan statistik wallet & pesanan             │
│     • 3 stat cards (saldo, aktif, selesai)                       │
│     • 5 pesanan aktif terbaru                                    │
│     • 4 quick action                                             │
│                                                                  │
│  ✅ Seller Dashboard dengan statistik toko & produk               │
│     • Placeholder "Belum Punya Toko" untuk seller baru           │
│     • 4 stat cards (total, aktif, habis, masuk)                  │
│     • 5 pesanan masuk                                            │
│     • 3 quick action                                             │
│                                                                  │
│  ✅ Driver Dashboard dengan statistik delivery                   │
│     • 3 stat cards (tersedia, aktif, selesai)                    │
│     • 5 order tersedia dengan tombol "Ambil"                      │
│     • 2 quick action                                             │
│                                                                  │
│  ✅ Role-based route protection via RoleRoute wrapper            │
│  ✅ Navbar adaptif per role                                      │
│  ✅ OrdersPage buyer dengan filter status & pagination           │
│  ✅ Pola paralel fetch dengan Promise.all                        │
│  ✅ Empty & loading state handling                               │
│  ✅ Error toast via useUIStore                                   │
│                                                                  │
│  POLA UNIVERSAL:                                                 │
│  1. useState untuk loading, stats, recent                        │
│  2. useEffect + Promise.all untuk fetch paralel                  │
│  3. Cek .success sebelum setState                                │
│  4. Render bersyarat: loading → spinner, data → stats + list     │
│  5. <Link to="..."> untuk navigasi ke halaman lain               │
│                                                                  │
│  NEXT: BAB 9 - Reviews & Delivery                                │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan membuat:                                              │
│  1. Sistem review produk (buyer → produk)                         │
│  2. Alur delivery lengkap (driver: pickup → deliver → complete)   │
│  3. Notifikasi status pesanan                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 9?** [Reviews & Delivery](../09-reviews-delivery/09-reviews-delivery.md)

---

*Dokumentasi ini ditulis ulang dengan fokus cara kerja, kegunaan file, dan komunikasi data.*
*Update terakhir: 2026-07-20*
*Mengikuti aturan: satu contoh kode per topik (Buyer DashboardPage sebagai perwakilan).*