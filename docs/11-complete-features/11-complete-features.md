# BAB 11: Fitur Lengkap Semua Role & Perbaikan Filter Produk

## 1. Pendahuluan

Bab ini mendokumentasikan penambahan fitur yang kritis untuk kelengkapan aplikasi SEAPEDIA:
- **Filter Produk Fungsional**: Kategori, harga min/maks, dan sorting yang benar-benar terhubung ke API
- **Admin Dashboard**: Halaman manajemen platform lengkap untuk role admin
- **Seller Orders Page**: Seller bisa melihat dan memproses pesanan masuk
- **Driver Orders Fix**: Driver menggunakan endpoint spesifik (`/driver/orders`) bukan endpoint buyer

---

## 2. Perbaikan Filter Produk (`ProductsPage.jsx`)

### 2.1 Masalah Sebelumnya
Filter kategori (checkbox) dan input harga di sidebar tidak terhubung ke state management maupun API call. Filter hanya bersifat visual.

### 2.2 Solusi
Menghubungkan semua filter ke `productService.getAll()` dengan parameter yang sesuai:

```javascript
// State filter
const [selectedCategory, setSelectedCategory] = useState('all')
const [minPrice, setMinPrice] = useState('')
const [maxPrice, setMaxPrice] = useState('')
const [sortBy, setSortBy] = useState('created_at:desc')

// Build API params
const buildParams = (page = 1) => {
  const params = { page, per_page: 12, sort_by, sort_order }
  if (minPrice) params.min_price = parseInt(minPrice)
  if (maxPrice) params.max_price = parseInt(maxPrice)
  if (search || category.keyword) params.search = ...
  return params
}
```

### 2.3 Fitur Kategori
Karena database tidak memiliki kolom `category`, filter kategori memanfaatkan fitur `search` backend untuk mencari produk berdasarkan keyword nama (misalnya "makanan", "elektronik").

### 2.4 Active Filter Badges
Ditambahkan tampilan **badge aktif** di atas grid produk yang menunjukkan filter apa yang sedang diterapkan, disertai tombol `×` untuk hapus filter individual.

---

## 3. Admin Dashboard

### 3.1 Backend: `AdminController.php`
Controller baru dengan dua endpoint:

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/admin/stats` | Statistik platform (total users, produk, pesanan, revenue) |
| GET | `/api/admin/users` | Daftar semua user + roles mereka |

```php
// Contoh: stats()
$stats = [
    'total_users'    => User::count(),
    'total_products' => Product::where('is_active', true)->count(),
    'total_orders'   => Order::count(),
    'total_revenue'  => Order::where('status', 'completed')->sum('total_amount'),
    'pending_orders' => Order::where('status', 'packaging')->count(),
];
```

### 3.2 Frontend: Admin Pages
Dua halaman baru di `src/pages/dashboard/admin/`:

- **`DashboardPage.jsx`**: 6 kartu statistik + tabel pengguna terbaru + menu aksi cepat
- **`UsersPage.jsx`**: Tabel semua pengguna dengan search, pagination, dan tampilan badge per role

### 3.3 Route & Akses
```jsx
// App.jsx
<Route path="/admin/dashboard" element={<RoleRoute role="admin"><AdminDashboardPage /></RoleRoute>} />
<Route path="/admin/users" element={<RoleRoute role="admin"><AdminUsersPage /></RoleRoute>} />
```

Akun admin default: `admin@seapedia.com`

---

## 4. Seller Orders Page

### 4.1 Masalah Sebelumnya
Route `/seller/orders` didefinisikan di Navbar, namun halaman-nya belum dibuat. Mengakibatkan error saat diakses.

### 4.2 Solusi
Membuat `src/pages/dashboard/seller/OrdersPage.jsx` dengan fitur:
- **Filter tab** berdasarkan status: Semua, Perlu Dikemas, Menunggu Driver, dll.
- **Daftar pesanan** lengkap dengan info pembeli, item, dan total
- **Tombol aksi**: "Tandai Sudah Dikemas" untuk mengubah status `packaging` → `waiting_shipper`

```javascript
// orderService.js — method baru
getSellerOrders: async (params = {}) => {
    const response = await api.get('/seller/orders', { params })
    return response.data
},
updateSellerOrderStatus: async (id, status) => {
    const response = await api.put(`/seller/orders/${id}/status`, { status })
    return response.data
},
```

---

## 5. Perbaikan Driver Orders

### 5.1 Masalah Sebelumnya
`DriverOrdersPage.jsx` menggunakan `useOrderStore().fetchOrders()` yang memanggil endpoint `/api/orders` (endpoint BUYER), bukan `/api/driver/orders`.

### 5.2 Solusi
Menghapus ketergantungan pada `orderStore` dan menggunakan `orderService` langsung:

```javascript
// Menggunakan endpoint yang benar
const res = await orderService.getDriverOrders({ status: 'waiting_shipper' })
```

Method baru di `orderService.js`:
- `getDriverOrders(params)` → GET `/api/driver/orders`
- `pickupOrder(id)` → POST `/api/driver/orders/{id}/pickup`
- `completeOrder(id)` → POST `/api/driver/orders/{id}/complete`

---

## 6. Update Navbar

Dropdown profil pengguna diperluas dengan menu spesifik per role:

| Role | Menu Tambahan |
|------|--------------|
| Buyer | Dashboard Pembeli, Daftar Transaksi |
| Seller | Dashboard Toko, Kelola Produk, **Pesanan Masuk** (baru) |
| Driver | Dashboard Driver, **Ambil Pesanan** (baru) |
| Admin | 🛡️ Admin Dashboard (baru), 👥 Kelola Pengguna (baru) |

---

## 7. Ringkasan File yang Dibuat/Dimodifikasi

| File | Status | Keterangan |
|------|--------|-----------|
| `src/pages/ProductsPage.jsx` | MODIFIED | Filter fungsional |
| `src/pages/dashboard/admin/DashboardPage.jsx` | NEW | Admin stats + users |
| `src/pages/dashboard/admin/UsersPage.jsx` | NEW | Manajemen user |
| `src/pages/dashboard/seller/OrdersPage.jsx` | NEW | Pesanan masuk seller |
| `src/pages/dashboard/driver/OrdersPage.jsx` | MODIFIED | Pakai driver endpoint |
| `src/services/adminService.js` | NEW | API calls admin |
| `src/services/orderService.js` | MODIFIED | +getSellerOrders, +getDriverOrders, dll |
| `src/services/productService.js` | MODIFIED | getMyProducts terima params |
| `src/App.jsx` | MODIFIED | Routes admin & seller orders |
| `src/components/layout/Navbar.jsx` | MODIFIED | Links per role |
| `app/Http/Controllers/AdminController.php` | NEW | Admin backend |
| `routes/api.php` | MODIFIED | Admin routes |
| `database/seeders/UserRoleSeeder.php` | MODIFIED | Idempotent (firstOrCreate) |

---

## 8. Checklist BAB 11

- [x] Filter produk (kategori, harga, sorting) fungsional terhubung ke API
- [x] Active filter badges di atas grid produk
- [x] `AdminController.php` dengan endpoint stats & users
- [x] Admin routes di `routes/api.php`
- [x] `adminService.js` frontend
- [x] `DashboardPage.jsx` admin (6 stat cards + tabel users)
- [x] `UsersPage.jsx` admin (tabel semua user + badge role)
- [x] Route admin di `App.jsx` dengan `RoleRoute role="admin"`
- [x] `OrdersPage.jsx` seller (filter tab + tombol aksi)
- [x] Method `getSellerOrders` & `updateSellerOrderStatus` di `orderService.js`
- [x] `DriverOrdersPage.jsx` diperbaiki pakai endpoint `/driver/orders`
- [x] Method `getDriverOrders`, `pickupOrder`, `completeOrder` di `orderService.js`
- [x] Navbar dropdown diperluas dengan menu per role

---

## 9. Ringkasan BAB 11

```
┌─────────────────────────────────────────────────────────────────┐
│                      YANG SUDAH DIPELAJARI                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Filter Produk fungsional (kategori, harga, sorting)          │
│     • Terhubung ke API via productService.getAll()              │
│     • Active badges menampilkan filter aktif                    │
│                                                                  │
│  ✅ Admin Dashboard lengkap                                      │
│     • Backend: AdminController dengan stats & users             │
│     • Frontend: DashboardPage + UsersPage admin                 │
│     • Protected route dengan RoleRoute                          │
│                                                                  │
│  ✅ Seller Orders Page                                           │
│     • Filter tab per status                                     │
│     • Tombol "Tandai Dikemas" mengubah status pesanan           │
│                                                                  │
│  ✅ Driver Orders diperbaiki                                     │
│     • Pakai endpoint /driver/orders yang benar                  │
│     • Tidak lagi pakai endpoint /orders milik buyer             │
│                                                                  │
│  ✅ Navbar dropdown lengkap per role                             │
│                                                                  │
│  NEXT: BAB 12 — Pengaturan Akun Terpusat                        │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan membuat:                                              │
│  1. Halaman /settings dengan 5 tab terintegrasi                 │
│  2. Profil, Alamat, Keamanan, Role, Dompet dalam satu UI        │
│  3. API baru: updateProfile & changePassword                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 12?** [Pengaturan Akun Terpusat](../12-settings-page/12-settings-page.md)

---

*Update terakhir: 2026-07-24*
