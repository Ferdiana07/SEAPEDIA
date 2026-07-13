# BAB 7: Backend - Wallet, Cart, dan Orders

> **Tujuan:** Memahami dan mengimplementasikan sistem Wallet (dompet digital), Cart (keranjang belanja), dan Order (pesanan) termasuk checkout flow, validasi, dan authorization berbasis role

---

## 7.1 Recap: Apa yang Sudah Kita Pelajari

Di BAB 0-6, kita sudah:
- Mendesain database schema dengan 12 tabel
- Membuat autentikasi dengan Laravel Sanctum
- Membuat role management (Admin, Seller, Buyer, Driver)
- Membuat Store Management untuk Seller
- Membuat Product Management (CRUD)
- Memahami alur bisnis SEAPEDIA

**Sekarang:** Kita akan membuat fitur inti untuk Buyer:
- **Wallet System** - Dompet digital dengan saldo dan transaksi
- **Cart System** - Keranjang belanja dengan single-store rule
- **Order System** - Checkout dan pembuatan pesanan

---

## 7.2 Overview: Arsitektur Wallet, Cart, dan Order

### 7.2.1 Diagram Relasi

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    Arsitektur Wallet, Cart, & Order                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐                  │
│  │    USERS    │     │   WALLETS   │     │  TRANSACTIONS   │                  │
│  ├─────────────┤     ├─────────────┤     ├─────────────────┤                  │
│  │ id (PK)    │────<│ id (PK)     │     │ id (PK)        │                  │
│  │ name       │  1:1│ user_id (FK)│────<│ wallet_id (FK)  │                  │
│  │ email      │     │ balance     │     │ order_id (FK)   │                  │
│  │ password   │     └─────────────┘     │ type            │                  │
│  └─────────────┘            │            │ amount         │                  │
│         │                    │            │ description   │                  │
│         │ 1:1                │            └─────────────────┘                  │
│         ▼                    │                                                   │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐                  │
│  │   CARTS    │     │ CART_ITEMS │     │   ADDRESSES     │                  │
│  ├─────────────┤     ├─────────────┤     ├─────────────────┤                  │
│  │ id (PK)    │────<│ id (PK)     │     │ id (PK)        │                  │
│  │ user_id(FK)│ 1:N │ cart_id (FK)│     │ user_id (FK)   │                  │
│  └─────────────┘     │ product_id  │     │ label          │                  │
│         │             │ quantity   │     │ recipient_name │                  │
│         │             └─────────────┘     │ full_address  │                  │
│         │                    ▲           └─────────────────┘                  │
│         │                    │                                                 │
│         ▼                    │                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐                  │
│  │   ORDERS   │     │ ORDER_ITEMS │     │    PRODUCTS     │                  │
│  ├─────────────┤     ├─────────────┤     ├─────────────────┤                  │
│  │ id (PK)    │────<│ id (PK)     │     │ id (PK)        │                  │
│  │ order_number│ 1:N │ order_id(FK)│     │ store_id (FK)  │                  │
│  │ user_id(FK)│     │ product_id │     │ name           │                  │
│  │ store_id   │     │ quantity   │     │ price         │                  │
│  │ driver_id  │     │ price_at_ │     │ stock         │                  │
│  │ status     │     │ purchase  │     └─────────────────┘                  │
│  │ total_amount│     └─────────────┘                                         │
│  │ shipping_  │                                                                    │
│  │ address    │                                                                    │
│  └─────────────┘                                                                    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2.2 Siklus Hidup Wallet

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Siklus Hidup Wallet                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  1️⃣  REGISTER → Wallet Otomatis Terbuat                               │     │
│  │  ─────────────────────────────────────────────────────────────────   │     │
│  │  Saat user register, wallet otomatis dibuat dengan balance = 0          │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  2️⃣  TOP UP → Saldo Bertambah                                         │     │
│  │  ─────────────────────────────────────────────────────────────────   │     │
│  │  Buyer top up → balance + amount → Transaction record dibuat          │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  3️⃣  CHECKOUT → Saldo Berkurang                                        │     │
│  │  ─────────────────────────────────────────────────────────────────   │     │
│  │  Buyer checkout → CEK saldo cukup? → Ya: balance - total               │     │
│  │  Jika tidak cukup → Checkout GAGAL                                    │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  4️⃣  REFUND → Saldo Bertambah Kembali                                 │     │
│  │  ─────────────────────────────────────────────────────────────────   │     │
│  │  Pesanan dibatalkan → balance + total_amount → Transaction record       │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2.3 Aturan Single-Store Cart

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Single-Store Cart Rule                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ⚠️  PERATURAN KRUSIAL:                                                       │
│  Cart hanya boleh berisi produk dari 1 TOKO yang SAMA!                           │
│                                                                                  │
│  KENAPA ADA ATURAN INI?                                                         │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  Karena dalam implementasi sederhana SEAPEDIA:                                     │
│  • 1 Order = 1 Toko                                                            │
│  • 1 Driver mengambil dari 1 Toko ke 1 Alamat                                   │
│  • Tidak ada sistem split order/partial delivery                                  │
│                                                                                  │
│  ✅ BENAR:                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  Cart:                                                                     │     │
│  │  • Nasi Goreng        → Toko: Dapur Budi      → Rp 25.000           │     │
│  │  • Ayam Geprek        → Toko: Dapur Budi      → Rp 22.000           │     │
│  │  Total: Rp 47.000                                                         │     │
│  │  Status: ✅ BOLEH CHECKOUT                                               │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ❌ SALAH:                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  Cart:                                                                     │     │
│  │  • Nasi Goreng        → Toko: Dapur Budi      → Rp 25.000           │     │
│  │  • Rendang           → Toko: Warung Siti     → Rp 35.000           │     │
│  │  Status: ❌ TIDAK BOLEH CHECKOUT (Toko berbeda!)                     │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.3 Alur Checkout Lengkap

### 7.3.1 Step-by-Step Checkout Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Alur Checkout Lengkap                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1️⃣  USER DI HALAMAN CART                                                     │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  User melihat item di cart, total harga, dan memilih alamat pengiriman            │
│                                                                                  │
│  2️⃣  FRONTEND VALIDASI SEBELUM KIRIM                                          │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  CEK 1: Cart kosong?              → Error: "Cart kosong!"              │     │
│  │  CEK 2: Alamat dipilih?           → Error: "Pilih alamat pengiriman!"    │     │
│  │  CEK 3: Saldo cukup?              → Error: "Saldo tidak cukup!"          │     │
│  │  CEK 4: Semua produk tersedia?    → Error: "Stok tidak mencukupi"       │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  3️⃣  KIRIM REQUEST CHECKOUT                                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  Frontend kirim POST /api/orders dengan address_id                                │
│                                                                                  │
│  4️⃣  BACKEND PROSES CHECKOUT                                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  VALIDASI 1: CEK WALLET & SALDO                                         │     │
│  │  ───────────────────────────────────────────────────────────────────    │     │
│  │  Jika balance < total → ❌ 400: "Saldo tidak cukup"                        │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                    │
│                              ▼                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  VALIDASI 2: CEK STOCK                                                  │     │
│  │  ───────────────────────────────────────────────────────────────────    │     │
│  │  Jika stok < quantity → ❌ 400: "Stok tidak mencukupi"                   │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                              │                                                    │
│                              ▼                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  DATABASE TRANSACTION: ATOMIC OPERATION                                 │     │
│  │  ───────────────────────────────────────────────────────────────────    │     │
│  │  1. KURANGI STOCK PRODUK (masing-masing item)                            │     │
│  │  2. DEBIT WALLET (balance - total)                                      │     │
│  │  3. INSERT TRANSACTION (record riwayat)                                 │     │
│  │  4. INSERT ORDER (buat pesanan baru)                                     │     │
│  │  5. INSERT ORDER ITEMS (item-item pesanan)                               │     │
│  │  6. HAPUS CART ITEMS (kosongkan cart)                                   │     │
│  │                                                                              │     │
│  │  ⚡ JIKA ADA ERROR → ROLLBACK (semua dibatalkan, tidak ada yang berubah)  │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  5️⃣  RESPONSE                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  { success: true, message: "Pesanan berhasil dibuat!", data: { order_number, total_amount, new_balance } }
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.4 Step-by-Step Implementation

### 7.4.1 Step 1: Database Migration

#### Tabel-Tabel yang Dibuat

| No | Tabel | Fungsi | Relasi |
|----|-------|--------|--------|
| 1 | wallets | Simpan saldo dompet digital user | 1:1 dengan users |
| 2 | transactions | Riwayat transaksi wallet | N:1 dengan wallets, orders |
| 3 | addresses | Alamat pengiriman buyer | 1:N dengan users |
| 4 | carts | Keranjang belanja buyer | 1:1 dengan users |
| 5 | cart_items | Item-item di keranjang | N:1 dengan carts, products |
| 6 | orders | Pesanan | N:1 dengan users, stores |
| 7 | order_items | Item-item dalam pesanan | N:1 dengan orders, products |

**Catatan:** 
- File migration sudah ada di folder `database/migrations/`
- Tidak perlu membuat ulang karena sudah sesuai dengan ERD

---

### 7.4.2 Step 2: Models

#### Model-Model yang Dibuat

| Model | File | Fungsi |
|-------|------|--------|
| Wallet | `app/Models/Wallet.php` |操作 wallet (topUp, debit, refund) |
| Transaction | `app/Models/Transaction.php` |操作 transaksi wallet |
| Address | `app/Models/Address.php` |操作 alamat pengiriman |
| Cart | `app/Models/Cart.php` |操作 keranjang belanja |
| CartItem | `app/Models/CartItem.php` |操作 item di cart |
| Order | `app/Models/Order.php` |操作 pesanan |
| OrderItem | `app/Models/OrderItem.php` |操作 item dalam pesanan |

**Relasi di User Model:**

```php
// app/Models/User.php

// Relasi untuk Wallet
public function wallet()
{
    return $this->hasOne(Wallet::class);
}

// Relasi untuk Addresses
public function addresses()
{
    return $this->hasMany(Address::class);
}

// Relasi untuk Cart
public function cart()
{
    return $this->hasOne(Cart::class);
}

// Relasi untuk Orders (sebagai Buyer)
public function orders()
{
    return $this->hasMany(Order::class, 'user_id');
}

// Relasi untuk Orders (sebagai Driver)
public function driverOrders()
{
    return $this->hasMany(Order::class, 'driver_id');
}
```

---

### 7.4.3 Step 3: Controllers

#### Controller-Method yang Dibuat

| Controller | Method | Endpoint | Fungsi |
|------------|--------|----------|--------|
| WalletController | show | GET /api/wallet | Ambil data wallet user |
| WalletController | transactions | GET /api/transactions | Ambil riwayat transaksi |
| WalletController | topUp | POST /api/wallet/topup | Top up saldo |
| AddressController | index | GET /api/addresses | Ambil semua alamat |
| AddressController | store | POST /api/addresses | Tambah alamat baru |
| AddressController | show | GET /api/addresses/{id} | Detail alamat |
| AddressController | update | PUT /api/addresses/{id} | Update alamat |
| AddressController | destroy | DELETE /api/addresses/{id} | Hapus alamat |
| AddressController | setDefault | POST /api/addresses/{id}/set-default | Set default |
| CartController | index | GET /api/cart | Ambil isi cart |
| CartController | addItem | POST /api/cart/items | Tambah item |
| CartController | updateItem | PUT /api/cart/items/{id} | Update quantity |
| CartController | removeItem | DELETE /api/cart/items/{id} | Hapus item |
| CartController | clear | DELETE /api/cart | Kosongkan cart |
| OrderController | index | GET /api/orders | Daftar pesanan buyer |
| OrderController | show | GET /api/orders/{id} | Detail pesanan |
| OrderController | store | POST /api/orders | Checkout |
| OrderController | cancel | POST /api/orders/{id}/cancel | Batalkan pesanan |
| OrderController | sellerOrders | GET /api/seller/orders | Pesanan masuk seller |
| OrderController | updateStatus | PUT /api/seller/orders/{id}/status | Update status seller |
| OrderController | driverOrders | GET /api/driver/orders | Pesanan untuk driver |
| OrderController | pickupOrder | POST /api/driver/orders/{id}/pickup | Driver ambil pesanan |
| OrderController | completeOrder | POST /api/driver/orders/{id}/complete | Driver selesai antar |

---

### 7.4.4 Step 4: API Routes

**Struktur Routes:**

```
api/
├── auth/                    # Authentication (dari BAB 03)
├── products/               # Public products
├── stores/                 # Public stores
│
├── wallet/                  # Buyer: Wallet
│   └── topup                # Top up saldo
│
├── transactions/           # Riwayat transaksi
│
├── addresses/              # Buyer: Alamat pengiriman
│   ├── /                   # List alamat
│   ├── /                   # Tambah alamat (POST)
│   ├── /{id}              # Detail alamat
│   ├── /{id}              # Update alamat (PUT)
│   ├── /{id}              # Hapus alamat (DELETE)
│   └── /{id}/set-default  # Set default
│
├── cart/                   # Buyer: Keranjang
│   ├── /                   # Lihat cart
│   ├── /items             # Tambah item (POST)
│   ├── /items/{id}        # Update item (PUT)
│   ├── /items/{id}        # Hapus item (DELETE)
│   └── /                  # Kosongkan cart (DELETE)
│
├── orders/                  # Buyer: Pesanan
│   ├── /                   # List pesanan
│   ├── /                   # Checkout (POST)
│   ├── /{id}              # Detail pesanan
│   └── /{id}/cancel       # Batalkan pesanan
│
├── stores/my               # Seller: Toko sendiri
├── seller/
│   ├── products/           # Seller: Produk
│   └── orders/            # Seller: Pesanan masuk
│
└── driver/
    └── orders/             # Driver: Pesanan untuk diantar
```

---

## 7.5 Contoh Request/Response

### 1. Get Wallet

```bash
# Request
GET /api/wallet
Authorization: Bearer {token}

# Response
{
    "success": true,
    "data": {
        "id": 1,
        "balance": 500000,
        "formatted_balance": "Rp 500.000"
    }
}
```

### 2. Top Up Wallet

```bash
# Request
POST /api/wallet/topup
Authorization: Bearer {token}
Content-Type: application/json

{
    "amount": 100000
}

# Response
{
    "success": true,
    "message": "Top up berhasil!",
    "data": {
        "balance": 600000,
        "transaction": {
            "id": 15,
            "type": "topup",
            "amount": 100000,
            "description": "Top up saldo"
        }
    }
}
```

### 3. Add to Cart

```bash
# Request
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
    "product_id": 1,
    "quantity": 2
}

# Response
{
    "success": true,
    "message": "Item berhasil ditambahkan ke cart",
    "data": {
        "id": 5,
        "product_id": 1,
        "quantity": 2,
        "product": {
            "id": 1,
            "name": "Nasi Goreng Spesial",
            "price": 25000
        }
    }
}
```

### 4. Get Cart

```bash
# Request
GET /api/cart
Authorization: Bearer {token}

# Response
{
    "success": true,
    "data": {
        "items": [
            {
                "id": 5,
                "product_id": 1,
                "quantity": 2,
                "product": {
                    "id": 1,
                    "name": "Nasi Goreng Spesial",
                    "price": 25000,
                    "store": { "id": 1, "name": "Dapur Budi" }
                }
            }
        ],
        "store": { "id": 1, "name": "Dapur Budi" },
        "total": 50000,
        "total_items": 2
    }
}
```

### 5. Checkout

```bash
# Request
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
    "address_id": 1
}

# Response
{
    "success": true,
    "message": "Pesanan berhasil dibuat!",
    "data": {
        "id": 1,
        "order_number": "ORD-20260711-001",
        "status": "packaging",
        "total_amount": 50000,
        "shipping_address": "Budi\nJl. Merdeka No.10\n081234567890",
        "new_balance": 450000
    }
}
```

### 6. Cancel Order

```bash
# Request
POST /api/orders/1/cancel
Authorization: Bearer {token}

# Response
{
    "success": true,
    "message": "Pesanan berhasil dibatalkan. Saldo akan dikembalikan.",
    "data": {
        "status": "returned",
        "refunded_amount": 50000,
        "new_balance": 500000
    }
}
```

---

## 7.6 Error Handling

### Format Error Standard

```json
{
    "success": false,
    "message": "Pesan error yang jelas untuk user",
    "errors": {
        "field_name": ["Pesan error untuk field ini"]
    }
}
```

### Contoh Error Responses

| Kode | Kondisi | Response |
|------|---------|----------|
| 400 | Saldo tidak cukup | `{ "message": "Saldo wallet tidak mencukupi", "errors": { "balance": ["Saldo Anda: Rp 50.000"] } }` |
| 400 | Stok tidak cukup | `{ "message": "Stok Nasi Goreng Spesial tidak mencukupi" }` |
| 400 | Single-store violation | `{ "message": "Cart hanya boleh berisi produk dari 1 toko yang sama. Selesaikan checkout atau kosongkan cart terlebih dahulu." }` |
| 400 | Order tidak bisa dibatalkan | `{ "message": "Pesanan tidak dapat dibatalkan" }` |
| 403 | Tidak punya role | `{ "message": "Hanya buyer yang bisa checkout" }` |
| 404 | Alamat tidak ditemukan | `{ "message": "Alamat tidak ditemukan" }` |

---

## 7.7 Troubleshooting

```
┌─────────────────────────────────────────────────────────────────┐
│                    Troubleshooting Wallet, Cart, Order                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ❌ "Saldo wallet tidak mencukupi"                             │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                       │
│  1. Top up wallet dulu: POST /api/wallet/topup               │
│  2. Cek balance: GET /api/wallet                             │
│                                                                  │
│  ❌ "Cart hanya boleh berisi produk dari 1 toko"              │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                       │
│  1. Checkout cart yang ada sekarang                           │
│  2. Atau kosongkan cart: DELETE /api/cart                    │
│  3. Baru tambahkan produk dari toko lain                      │
│                                                                  │
│  ❌ "Stok tidak mencukupi"                                     │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                       │
│  1. Kurangi jumlah yang dipesan                               │
│  2. Atau tunggu sampai stok tersedia                            │
│                                                                  │
│  ❌ "Pesanan tidak dapat dibatalkan"                           │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                       │
│  1. Pesanan sudah diambil driver (status = shipping)         │
│  2. Hubungi customer service jika ada masalah                   │
│                                                                  │
│  ❌ Checkout gagal tanpa pesan error                           │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI:                                                       │
│  1. Cek Laravel log: storage/logs/laravel.log               │
│  2. Cek database transaction rollback                          │
│  3. Pastikan wallet ada untuk user                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7.8 Checklist BAB 7

- [x] Migration wallets, transactions, addresses, carts, cart_items, orders, order_items
- [x] Model Wallet, Transaction, Address, Cart, CartItem, Order, OrderItem
- [x] Relasi di User Model (wallet, addresses, cart, orders, driverOrders)
- [x] WalletController (show, transactions, topUp)
- [x] AddressController (index, store, show, update, destroy, setDefault)
- [x] CartController (index, addItem, updateItem, removeItem, clear)
- [x] OrderController (index, show, store/checkout, cancel, sellerOrders, updateStatus, driverOrders, pickupOrder, completeOrder)
- [x] Routes api.php dengan semua endpoint
- [x] Testing endpoint wallet
- [x] Testing endpoint cart
- [x] Testing single-store cart rule
- [x] Testing checkout flow
- [x] Testing order cancellation with refund

---

## 7.9 Ringkasan BAB 7

```
┌─────────────────────────────────────────────────────────────────┐
│                    Yang Sudah Dipelajari                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Konsep Wallet System                                       │
│     • Balance tracking                                         │
│     • Top up, debit, refund                                    │
│     • Transaction history                                      │
│                                                                  │
│  ✅ Konsep Cart System                                        │
│     • Single-store rule enforcement                            │
│     • Add, update, remove items                               │
│     • Clear cart                                              │
│                                                                  │
│  ✅ Konsep Order System                                       │
│     • Checkout flow dengan transaction                         │
│     • Order status lifecycle                                  │
│     • Cancel dengan refund                                     │
│                                                                  │
│  ✅ Seller Order Management                                   │
│     • Lihat pesanan masuk                                     │
│     • Update status (packaging → waiting)                     │
│                                                                  │
│  ✅ Driver Order Management                                   │
│     • Lihat pesanan yang bisa diambil                         │
│     • Pickup order                                            │
│     • Complete order                                          │
│                                                                  │
│  NEXT: BAB 8 - Frontend Dashboards                             │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan:                                                   │
│  1. Buat Buyer Dashboard pages                              │
│  2. Buat Seller Dashboard pages                              │
│  3. Buat Driver Dashboard pages                              │
│  4. Integrasi API dengan frontend                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 8?** [Frontend - Dashboards](../08-frontend-dashboards/08-dashboards.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-13*
