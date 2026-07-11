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
│                    ARsitektur Wallet, Cart, & Order                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐                  │
│  │    USERS    │     │   WALLETS   │     │  TRANSACTIONS   │                  │
│  ├─────────────┤     ├─────────────┤     ├─────────────────┤                  │
│  │ id (PK)    │────<│ id (PK)     │     │ id (PK)        │                  │
│  │ name       │  1:1│ user_id (FK)│────<│ wallet_id (FK)  │                  │
│  │ email      │     │ balance     │     │ order_id (FK)   │                  │
│  │ password   │     │ created_at  │     │ type            │                  │
│  └─────────────┘     └─────────────┘     │ amount         │                  │
│         │                                    │ description   │                  │
│         │                                    └─────────────────┘                  │
│         │                                                                           │
│         │ 1:1                                                                          │
│         │                                                                           │
│         ▼                                                                           │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐                  │
│  │   CARTS    │     │ CART_ITEMS │     │   ADDRESSES     │                  │
│  ├─────────────┤     ├─────────────┤     ├─────────────────┤                  │
│  │ id (PK)    │────<│ id (PK)     │     │ id (PK)        │                  │
│  │ user_id(FK)│ 1:N │ cart_id (FK)│     │ user_id (FK)   │                  │
│  │ created_at │     │ product_id  │     │ label          │                  │
│  │ updated_at │     │ quantity   │     │ recipient_name │                  │
│  └─────────────┘     └─────────────┘     │ full_address  │                  │
│                                          └─────────────────┘                  │
│         │                                                                           │
│         │                                                                           │
│         ▼                                                                           │
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
│                         SIKLUS HIDUP WALLET                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  1️⃣  REGISTER → WALLET OTOMATIS TERBUAT                               │     │
│  │  ─────────────────────────────────────────────────────────────────   │     │
│  │                                                                         │     │
│  │  User register                                                          │     │
│  │      │                                                                │     │
│  │      ▼                                                                │     │
│  │  ┌───────────────────────────────────────────────────────────────┐  │     │
│  │  │  OTOMATIS CREATE:                                           │  │     │
│  │  │  INSERT INTO wallets (user_id, balance) VALUES (1, 0)       │  │     │
│  │  │                                                             │  │     │
│  │  │  ✅ Balance awal = 0                                        │  │     │
│  │  └───────────────────────────────────────────────────────────────┘  │     │
│  │                                                                         │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  2️⃣  TOP UP → SALDO BERTAMBAH                                         │     │
│  │  ─────────────────────────────────────────────────────────────────   │     │
│  │                                                                         │     │
│  │  Buyer mau top up                                                     │     │
│  │      │                                                                │     │
│  │      ▼                                                                │     │
│  │  ┌───────────────────────────────────────────────────────────────┐  │     │
│  │  │  TOP UP 100.000:                                             │  │     │
│  │  │                                                             │  │     │
│  │  │  UPDATE wallets SET balance = balance + 100000               │  │     │
│  │  │  WHERE user_id = 1                                          │  │     │
│  │  │                                                             │  │     │
│  │  │  INSERT transactions (wallet_id, type, amount, description)  │  │     │
│  │  │  VALUES (1, 'topup', 100000, 'Top up via transfer')       │  │     │
│  │  │                                                             │  │     │
│  │  │  Balance: 0 → 100.000                                      │  │     │
│  │  └───────────────────────────────────────────────────────────────┘  │     │
│  │                                                                         │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  3️⃣  CHECKOUT → SALDO BERKURANG                                        │     │
│  │  ─────────────────────────────────────────────────────────────────   │     │
│  │                                                                         │     │
│  │  Buyer checkout total 75.000                                            │     │
│  │      │                                                                │     │
│  │      ▼                                                                │     │
│  │  ┌───────────────────────────────────────────────────────────────┐  │     │
│  │  │  CEK: Balance >= Total?                                       │  │     │
│  │  │                                                             │  │     │
│  │  │  Jika YA:                                                   │  │     │
│  │  │    UPDATE wallets SET balance = balance - 75000              │  │     │
│  │  │    WHERE user_id = 1                                       │  │     │
│  │  │                                                             │  │     │
│  │  │    INSERT transactions (wallet_id, type, amount, order_id)   │  │     │
│  │  │    VALUES (1, 'purchase', -75000, 123)                    │  │     │
│  │  │                                                             │  │     │
│  │  │    Balance: 100.000 → 25.000                               │  │     │
│  │  │                                                             │  │     │
│  │  │  Jika TIDAK:                                               │  │     │
│  │  │    ❌ CHECKOUT GAGAL - Saldo tidak cukup!                  │  │     │
│  │  └───────────────────────────────────────────────────────────────┘  │     │
│  │                                                                         │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  4️⃣  REFUND → SALDO BERTAMBAH KEMBALI                                 │     │
│  │  ─────────────────────────────────────────────────────────────────   │     │
│  │                                                                         │     │
│  │  Pesanan dibatalkan / dikembalikan                                      │     │
│  │      │                                                                │     │
│  │      ▼                                                                │     │
│  │  ┌───────────────────────────────────────────────────────────────┐  │     │
│  │  │  UPDATE wallets SET balance = balance + 75000               │  │     │
│  │  │  WHERE user_id = 1                                          │  │     │
│  │  │                                                             │  │     │
│  │  │  INSERT transactions (wallet_id, type, amount, order_id)      │  │     │
│  │  │  VALUES (1, 'refund', 75000, 123)                         │  │     │
│  │  │                                                             │  │     │
│  │  │  Balance: 25.000 → 100.000                                 │  │     │
│  │  └───────────────────────────────────────────────────────────────┘  │     │
│  │                                                                         │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2.3 Aturan Single-Store Cart

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         SINGLE-STORE CART RULE                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ⚠️  PERATURAN KRUSIAL:                                                       │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  Cart hanya boleh berisi produk dari 1 TOKO yang SAMA!                           │
│                                                                                  │
│  KENAPA ADA ATURAN INI?                                                         │
│  ─────────────────────────────────────────────────────────────────────────────   │
│  Karena dalam implementasi sederhana SEAPEDIA:                                     │
│  • 1 Order = 1 Toko                                                            │
│  • 1 Driver mengambil dari 1 Toko ke 1 Alamat                                   │
│  • Tidak ada sistem split order/partial delivery                                  │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  ✅ BENAR:                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  Cart:                                                                     │     │
│  │  • Nasi Goreng        → Toko: Dapur Budi      → Rp 25.000           │     │
│  │  • Ayam Geprek        → Toko: Dapur Budi      → Rp 22.000           │     │
│  │  • Mie Ayam           → Toko: Dapur Budi      → Rp 20.000           │     │
│  │                                                                         │     │
│  │  Total: Rp 67.000                                                         │     │
│  │  Toko: Dapur Budi                                                        │     │
│  │  Status: ✅ BOLEH CHECKOUT                                               │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  ❌ SALAH:                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  Cart:                                                                     │     │
│  │  • Nasi Goreng        → Toko: Dapur Budi      → Rp 25.000           │     │
│  │  • Rendang           → Toko: Warung Siti     → Rp 35.000           │     │
│  │                                                                         │     │
│  │  Total: Rp 60.000                                                         │     │
│  │  Toko: CAMPURAN!                                                         │     │
│  │  Status: ❌ TIDAK BOLEH CHECKOUT                                          │     │
│  │                                                                         │     │
│  │  Solusi: Checkout yang dari Dapur Budi dulu,                             │     │
│  │          baru tambah dari Warung Siti                                     │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│  KODE PENGECEKAN (Backend):                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │                                                                         │     │
│  │  // Di CartController@addItem                                          │     │
│  │                                                                         │     │
│  │  // Ambil semua item di cart                                           │     │
│  │  $cartItems = CartItem::where('cart_id', $cartId)                      │     │
│  │      ->with('product.store')                                            │     │
│  │      ->get();                                                           │     │
│  │                                                                         │     │
│  │  // Ambil store_id dari item pertama                                    │     │
│  │  $firstStoreId = $cartItems->first()->product->store_id;               │     │
│  │                                                                         │     │
│  │  // Ambil store_id dari produk yang mau ditambahkan                      │     │
│  │  $newStoreId = Product::find($productId)->store_id;                     │     │
│  │                                                                         │     │
│  │  // Cek apakah store sama                                               │     │
│  │  if ($firstStoreId !== $newStoreId) {                                   │     │
│  │      // ❌ Store berbeda!                                              │     │
│  │      return response()->json([                                           │     │
│  │          'success' => false,                                           │     │
│  │          'message' => 'Cart hanya boleh berisi produk dari 1 toko',    │     │
│  │      ], 400);                                                          │     │
│  │  }                                                                     │     │
│  │                                                                         │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.3 Alur Checkout Lengkap

### 7.3.1 Step-by-Step Checkout Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ALUR CHECKOUT LENGKAP                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1️⃣  USER DI HALAMAN CART                                                     │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│      CartPage.jsx                                                               │
│          │                                                                      │
│          ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  CART:                                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ [✓] Nasi Goreng         x2      Rp 50.000         [Hapus]       │  │  │
│  │  │ [✓] Ayam Geprek         x1      Rp 22.000         [Hapus]       │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                           │  │
│  │  Toko: Dapur Budi                                                        │  │
│  │  Total Items: 2                                                          │  │
│  │  Total Harga: Rp 72.000                                                 │  │
│  │                                                                           │  │
│  │  Alamat Pengiriman:                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ > Jl. Mawar No.5 (Rumah)                        [Ubah]        │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                           │  │
│  │  [ CHECKOUT Rp 72.000 ]                                                 │  │
│  │                                                                           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  2️⃣  FRONTEND VALIDASI SEBELUM KIRIM                                          │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│      ┌─────────────────────────────────────────────────────────────────┐       │
│      │  CEK 1: Cart kosong?                                              │       │
│      │  if (items.length === 0) → Error: "Cart kosong!"                  │       │
│      │                                                                        │       │
│      │  CEK 2: Alamat dipilih?                                           │       │
│      │  if (!selectedAddress) → Error: "Pilih alamat pengiriman!"        │       │
│      │                                                                        │       │
│      │  CEK 3: Saldo cukup?                                              │       │
│      │  if (balance < total) → Error: "Saldo tidak cukup!"              │       │
│      │                                                                        │       │
│      │  CEK 4: Semua produk masih tersedia?                               │       │
│      │  for each item → check stock >= quantity                            │       │
│      │                                                                        │       │
│      │  ✅ Semua cek pass → Kirim request ke backend                       │       │
│      └─────────────────────────────────────────────────────────────────┘       │
│                                                                                  │
│  3️⃣  KIRIM REQUEST CHECKOUT                                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│      Frontend (React)              Backend (Laravel)                             │
│           │                              │                                       │
│           │  POST /api/orders                                                      │
│           │  Authorization: Bearer xxx                                            │
│           │  Content-Type: application/json                                       │
│           │─────────────────────────────>                                          │
│           │  {                                                                     │
│           │    address_id: 5,                                                     │
│           │    items: [                                                           │
│           │      { product_id: 1, quantity: 2 },                                │
│           │      { product_id: 2, quantity: 1 }                                 │
│           │    ]                                                                 │
│           │  }                                                                   │
│           │                              │                                       │
│           │                              ▼                                       │
│                                                                                  │
│  4️⃣  BACKEND PROSES CHECKOUT                                                  │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│      OrderController@store                                                       │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  VALIDASI 1: CEK WALLET & SALDO                                         │  │
│  │  ───────────────────────────────────────────────────────────────────    │  │
│  │                                                                           │  │
│  │  $wallet = Wallet::where('user_id', auth()->id())->first();            │  │
│  │                                                                           │  │
│  │  $total = 0;                                                            │  │
│  │  foreach ($items as $item) {                                             │  │
│  │      $product = Product::find($item['product_id']);                     │  │
│  │      $total += $product->price * $item['quantity'];                     │  │
│  │  }                                                                       │  │
│  │                                                                           │  │
│  │  if ($wallet->balance < $total) {                                       │  │
│  │      ❌ 400: "Saldo tidak cukup"                                        │  │
│  │  }                                                                       │  │
│  │                                                                           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  VALIDASI 2: CEK STOCK                                                  │  │
│  │  ───────────────────────────────────────────────────────────────────    │  │
│  │                                                                           │  │
│  │  foreach ($items as $item) {                                             │  │
│  │      $product = Product::find($item['product_id']);                      │  │
│  │      if ($product->stock < $item['quantity']) {                          │  │
│  │          ❌ 400: "Stok {$product->name} tidak cukup"                      │  │
│  │      }                                                                   │  │
│  │  }                                                                       │  │
│  │                                                                           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│           │                                                                      │
│           ▼                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  DATABASE TRANSACTION: ATOMIC OPERATION                                 │  │
│  │  ───────────────────────────────────────────────────────────────────    │  │
│  │                                                                           │  │
│  │  DB::transaction(function () use ($userId, $storeId, $items, $total) {│  │
│  │      │                                                                     │  │
│  │      │  // 1. KURANGI STOCK PRODUK                                      │  │
│  │      │  foreach ($items as $item) {                                       │  │
│  │      │      Product::where('id', $item['product_id'])                     │  │
│  │      │          ->decrement('stock', $item['quantity']);                  │  │
│  │      │  }                                                                │  │
│  │      │                                                                     │  │
│  │      │  // 2. DEBIT WALLET                                              │  │
│  │      │  Wallet::where('user_id', $userId)                               │  │
│  │      │      ->decrement('balance', $total);                             │  │
│  │      │                                                                     │  │
│  │      │  // 3. INSERT TRANSACTION                                         │  │
│  │      │  Transaction::create([                                           │  │
│  │      │      'wallet_id' => $walletId,                                   │  │
│  │      │      'type' => 'purchase',                                       │  │
│  │      │      'amount' => $total,                                         │  │
│  │      │      'description' => 'Pembelian order #' . $orderNumber,        │  │
│  │      │  ]);                                                              │  │
│  │      │                                                                     │  │
│  │      │  // 4. INSERT ORDER                                               │  │
│  │      │  $order = Order::create([                                         │  │
│  │      │      'order_number' => $orderNumber,                             │  │
│  │      │      'user_id' => $userId,                                       │  │
│  │      │      'store_id' => $storeId,                                     │  │
│  │      │      'status' => 'packaging',                                    │  │
│  │      │      'total_amount' => $total,                                   │  │
│  │      │      'shipping_address' => $address,                              │  │
│  │      │  ]);                                                              │  │
│  │      │                                                                     │  │
│  │      │  // 5. INSERT ORDER ITEMS                                         │  │
│  │      │  foreach ($items as $item) {                                     │  │
│  │      │      $product = Product::find($item['product_id']);               │  │
│  │      │      OrderItem::create([                                         │  │
│  │      │          'order_id' => $order->id,                                │  │
│  │      │          'product_id' => $item['product_id'],                    │  │
│  │      │          'quantity' => $item['quantity'],                       │  │
│  │      │          'price_at_purchase' => $product->price,                 │  │
│  │      │      ]);                                                         │  │
│  │      │  }                                                                │  │
│  │      │                                                                     │  │
│  │      │  // 6. HAPUS CART ITEMS                                          │  │
│  │      │  CartItem::where('cart_id', $cartId)->delete();                  │  │
│  │      │                                                                     │  │
│  │  });  // ← COMMIT (otomatis jika tidak ada error)                         │  │
│  │                                                                           │  │
│  │  ❌ Jika ada error di dalam transaction → ROLLBACK, tidak ada yang berubah│  │
│  │                                                                           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  5️⃣  RESPONSE                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│      <═══════════════════════════════════════════════════════════════════         │
│                                                                                  │
│      {                                                                          │
│        "success": true,                                                         │
│        "message": "Pesanan berhasil dibuat!",                                   │
│        "data": {                                                               │
│          "id": 1,                                                               │
│          "order_number": "ORD-20260711-001",                                   │
│          "status": "packaging",                                                 │
│          "total_amount": 72000,                                                │
│          "items": [                                                            │
│            { "name": "Nasi Goreng", "quantity": 2, "price_at_purchase": 25000 },│
│            { "name": "Ayam Geprek", "quantity": 1, "price_at_purchase": 22000 }│
│          ],                                                                    │
│          "shipping_address": "Jl. Mawar No.5, Jakarta"                          │
│        }                                                                        │
│      }                                                                          │
│                                                                                  │
│  6️⃣  FRONTEND UPDATE UI                                                       │
│  ─────────────────────────────────────────────────────────────────────────────   │
│                                                                                  │
│      ┌─────────────────────────────────────────────────────────────────┐       │
│      │  1. Kosongkan cart (local)                                     │       │
│      │     clearCart()                                                 │       │
│      │                                                                     │       │
│      │  2. Update wallet balance                                      │       │
│      │     setBalance(response.data.new_balance)                         │       │
│      │                                                                     │       │
│      │  3. Tampilkan success toast                                   │       │
│      │     success('Pesanan berhasil dibuat!')                          │       │
│      │                                                                     │       │
│      │  4. Redirect ke halaman orders                                  │       │
│      │     navigate('/buyer/orders')                                    │       │
│      │                                                                     │       │
│      │  5. (Optional) Play sound effect                                │       │
│      │     new Audio('/success.mp3').play()                              │       │
│      └─────────────────────────────────────────────────────────────────┘       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7.4 Step-by-Step Implementation

### 7.4.1 Step 1: Database Migration

#### Migration: wallets

```php
<?php
// File: database/migrations/xxxx_create_wallets_table.php
// Penjelasan: Membuat tabel wallets untuk menyimpan saldo dompet digital user

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Penjelasan:
     * Tabel wallets menyimpan saldo dompet digital untuk setiap user.
     * 
     * Aturan:
     * - 1 User = 1 Wallet (relasi 1:1)
     * - Balance tidak boleh negatif
     * - Balance awal = 0 saat register
     */
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            // Primary Key
            $table->id();
            
            // Foreign Key ke users
            // unique() → 1 user hanya punya 1 wallet
            // onDelete('cascade') → jika user dihapus, wallet ikut terhapus
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Saldo dompet
            // decimal(15,2) → max: 9.999.999.999.999,99
            // default(0) → saldo awal 0
            $table->decimal('balance', 15, 2)->default(0);
            
            // Timestamps
            $table->timestamps();
            
            // Index untuk query
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
```

#### Migration: transactions

```php
<?php
// File: database/migrations/xxxx_create_transactions_table.php
// Penjelasan: Membuat tabel transactions untuk menyimpan riwayat transaksi wallet

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            // Primary Key
            $table->id();
            
            // Foreign Key ke wallets
            $table->foreignId('wallet_id')
                  ->constrained('wallets')
                  ->onDelete('cascade');
            
            // Foreign Key ke orders (nullable, tidak semua transaksi terkait order)
            $table->foreignId('order_id')
                  ->nullable()
                  ->constrained('orders')
                  ->onDelete('set null');
            
            // Tipe transaksi
            // topup → user top up saldo
            // purchase → user checkout (debit)
            // refund → uang dikembalikan
            $table->enum('type', ['topup', 'purchase', 'refund']);
            
            // Jumlah transaksi
            // Untuk purchase: nilai positif (Rp 50.000)
            // Bisa juga disimpan negatif untuk debit, tapi lebih jelas dengan enum type
            $table->decimal('amount', 15, 2);
            
            // Deskripsi transaksi
            $table->string('description', 255)->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            $table->index('wallet_id');
            $table->index('type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
```

#### Migration: addresses

```php
<?php
// File: database/migrations/xxxx_create_addresses_table.php
// Penjelasan: Membuat tabel addresses untuk menyimpan alamat pengiriman buyer

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key ke users
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Label alamat (Rumah, Kantor, dll)
            $table->string('label', 50);
            
            // Nama penerima
            $table->string('recipient_name', 255);
            
            // Nomor HP penerima
            $table->string('phone', 20);
            
            // Alamat lengkap
            $table->text('full_address');
            
            // Apakah alamat default
            $table->boolean('is_default')->default(false);
            
            $table->timestamps();
            
            // Index
            $table->index('user_id');
            $table->index('is_default');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
```

#### Migration: carts

```php
<?php
// File: database/migrations/xxxx_create_carts_table.php
// Penjelasan: Membuat tabel carts untuk menyimpan keranjang belanja

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key ke users
            // unique() → 1 user hanya punya 1 cart
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
```

#### Migration: cart_items

```php
<?php
// File: database/migrations/xxxx_create_cart_items_table.php
// Penjelasan: Membuat tabel cart_items untuk menyimpan item di keranjang

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key ke carts
            $table->foreignId('cart_id')
                  ->constrained('carts')
                  ->onDelete('cascade');
            
            // Foreign Key ke products
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade');
            
            // Jumlah item
            $table->unsignedInteger('quantity')->default(1);
            
            $table->timestamps();
            
            // Constraint: 1 produk hanya boleh ada 1x di cart
            // unique(['cart_id', 'product_id'])
            $table->unique(['cart_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
```

#### Migration: orders

```php
<?php
// File: database/migrations/xxxx_create_orders_table.php
// Penjelasan: Membuat tabel orders untuk menyimpan pesanan

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            
            // Order number unik (untuk display)
            $table->string('order_number', 50)->unique();
            
            // Foreign Key ke users (buyer)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Foreign Key ke stores
            $table->foreignId('store_id')
                  ->constrained('stores')
                  ->onDelete('cascade');
            
            // Foreign Key ke users (driver) - nullable
            // Nullable karena driver belum tentu ada saat order dibuat
            $table->foreignId('driver_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
            
            // Status pesanan
            // packaging → seller sedang kemas
            // waiting_shipper → menunggu driver ambil
            // shipping → sedang diantar
            // completed → selesai
            // returned → dikembalikan
            $table->enum('status', [
                'packaging',
                'waiting_shipper',
                'shipping',
                'completed',
                'returned'
            ])->default('packaging');
            
            // Total jumlah pesanan
            $table->decimal('total_amount', 15, 2);
            
            // Alamat pengiriman (di-copy dari addresses karena alamat bisa dihapus)
            $table->text('shipping_address');
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('store_id');
            $table->index('driver_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
```

#### Migration: order_items

```php
<?php
// File: database/migrations/xxxx_create_order_items_table.php
// Penjelasan: Membuat tabel order_items untuk menyimpan item dalam pesanan

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key ke orders
            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->onDelete('cascade');
            
            // Foreign Key ke products
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade');
            
            // Jumlah yang dipesan
            $table->unsignedInteger('quantity');
            
            // Harga SAAT checkout
            // PENTING: Harga disimpan di sini karena harga produk bisa berubah
            // Jika tidak disimpan, order lama akan，显示 harga baru
            $table->decimal('price_at_purchase', 12, 2);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
```

---

### 7.4.2 Step 2: Models

#### Model: Wallet

```php
<?php
// File: app/Models/Wallet.php
// Penjelasan: Model Wallet untuk interaksi dengan tabel wallets

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'balance',
    ];
    
    protected $casts = [
        'balance' => 'decimal:2',
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    /**
     * Wallet dimiliki oleh satu User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Wallet memiliki banyak Transactions
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Cek apakah saldo cukup untuk amount tertentu
     * 
     * @param float $amount
     * @return bool
     */
    public function hasEnoughBalance(float $amount): bool
    {
        return $this->balance >= $amount;
    }
    
    /**
     * Top up saldo
     * 
     * @param float $amount
     * @param string|null $description
     * @return Transaction
     */
    public function topUp(float $amount, ?string $description = null): Transaction
    {
        // Update balance
        $this->increment('balance', $amount);
        
        // Create transaction record
        return $this->transactions()->create([
            'type' => 'topup',
            'amount' => $amount,
            'description' => $description ?? 'Top up saldo',
        ]);
    }
    
    /**
     * Debit saldo (pengurangan)
     * 
     * @param float $amount
     * @param string|null $description
     * @param Order|null $order
     * @return Transaction|null
     */
    public function debit(float $amount, ?string $description = null, ?Order $order = null): Transaction
    {
        if (!$this->hasEnoughBalance($amount)) {
            return null;
        }
        
        $this->decrement('balance', $amount);
        
        return $this->transactions()->create([
            'type' => 'purchase',
            'amount' => $amount,
            'description' => $description,
            'order_id' => $order?->id,
        ]);
    }
    
    /**
     * Refund saldo (pengembalian)
     * 
     * @param float $amount
     * @param string|null $description
     * @param Order|null $order
     * @return Transaction
     */
    public function refund(float $amount, ?string $description = null, ?Order $order = null): Transaction
    {
        $this->increment('balance', $amount);
        
        return $this->transactions()->create([
            'type' => 'refund',
            'amount' => $amount,
            'description' => $description ?? 'Refund pesanan',
            'order_id' => $order?->id,
        ]);
    }
}
```

#### Model: Transaction

```php
<?php
// File: app/Models/Transaction.php
// Penjelasan: Model Transaction untuk interaksi dengan tabel transactions

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'order_id',
        'type',
        'amount',
        'description',
    ];
    
    protected $casts = [
        'amount' => 'decimal:2',
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }
    
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
    
    // =================================================================
    // SCOPES
    // =================================================================
    
    /**
     * Scope: Filter berdasarkan tipe
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
    
    /**
     * Scope: Top up transactions
     */
    public function scopeTopUps($query)
    {
        return $query->where('type', 'topup');
    }
    
    /**
     * Scope: Purchase transactions
     */
    public function scopePurchases($query)
    {
        return $query->where('type', 'purchase');
    }
    
    /**
     * Scope: Refund transactions
     */
    public function scopeRefunds($query)
    {
        return $query->where('type', 'refund');
    }
}
```

#### Model: Address

```php
<?php
// File: app/Models/Address.php
// Penjelasan: Model Address untuk interaksi dengan tabel addresses

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'recipient_name',
        'phone',
        'full_address',
        'is_default',
    ];
    
    protected $casts = [
        'is_default' => 'boolean',
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Format alamat lengkap untuk display
     */
    public function getFormattedAddressAttribute(): string
    {
        return "{$this->recipient_name}\n{$this->full_address}\n{$this->phone}";
    }
    
    /**
     * Set sebagai alamat default
     */
    public function setAsDefault(): void
    {
        // Reset semua alamat lain jadi bukan default
        $this->user->addresses()->update(['is_default' => false]);
        
        // Set ini jadi default
        $this->update(['is_default' => true]);
    }
}
```

#### Model: Cart

```php
<?php
// File: app/Models/Cart.php
// Penjelasan: Model Cart untuk interaksi dengan tabel carts

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Hitung total harga cart
     */
    public function getTotalAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
    }
    
    /**
     * Hitung jumlah item
     */
    public function getTotalItemsAttribute(): int
    {
        return $this->items->sum('quantity');
    }
    
    /**
     * Cek apakah cart kosong
     */
    public function isEmpty(): bool
    {
        return $this->items->isEmpty();
    }
    
    /**
     * Ambil store_id dari items pertama
     * Digunakan untuk validasi single-store
     */
    public function getFirstStoreIdAttribute(): ?int
    {
        $firstItem = $this->items->first();
        return $firstItem?->product?->store_id;
    }
    
    /**
     * Kosongkan cart
     */
    public function clear(): void
    {
        $this->items()->delete();
    }
}
```

#### Model: CartItem

```php
<?php
// File: app/Models/CartItem.php
// Penjelasan: Model CartItem untuk interaksi dengan tabel cart_items

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
    ];
    
    protected $casts = [
        'quantity' => 'integer',
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }
    
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Hitung subtotal untuk item ini
     */
    public function getSubtotalAttribute(): float
    {
        return $this->product->price * $this->quantity;
    }
}
```

#### Model: Order

```php
<?php
// File: app/Models/Order.php
// Penjelasan: Model Order untuk interaksi dengan tabel orders

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'store_id',
        'driver_id',
        'status',
        'total_amount',
        'shipping_address',
    ];
    
    protected $casts = [
        'total_amount' => 'decimal:2',
    ];
    
    // Status constants
    const STATUS_PACKAGING = 'packaging';
    const STATUS_WAITING_SHIPPER = 'waiting_shipper';
    const STATUS_SHIPPING = 'shipping';
    const STATUS_COMPLETED = 'completed';
    const STATUS_RETURNED = 'returned';
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
    
    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
    
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function transaction(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
    
    // =================================================================
    // SCOPES
    // =================================================================
    
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }
    
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
    
    public function scopeByStore($query, int $storeId)
    {
        return $query->where('store_id', $storeId);
    }
    
    public function scopeWaitingForDriver($query)
    {
        return $query->where('status', self::STATUS_WAITING_SHIPPER);
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Generate order number unik
     */
    public static function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $random = str_pad(random_int(1, 999), 3, '0', STR_PAD_LEFT);
        return "ORD-{$date}-{$random}";
    }
    
    /**
     * Cek apakah bisa dibatalkan
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [
            self::STATUS_PACKAGING,
            self::STATUS_WAITING_SHIPPER,
        ]);
    }
    
    /**
     * Update status pesanan
     */
    public function updateStatus(string $status): bool
    {
        $validStatuses = [
            self::STATUS_PACKAGING,
            self::STATUS_WAITING_SHIPPER,
            self::STATUS_SHIPPING,
            self::STATUS_COMPLETED,
            self::STATUS_RETURNED,
        ];
        
        if (!in_array($status, $validStatuses)) {
            return false;
        }
        
        $this->update(['status' => $status]);
        return true;
    }
    
    /**
     * Assign driver ke pesanan
     */
    public function assignDriver(User $driver): bool
    {
        if ($this->status !== self::STATUS_WAITING_SHIPPER) {
            return false;
        }
        
        $this->update([
            'driver_id' => $driver->id,
            'status' => self::STATUS_SHIPPING,
        ]);
        
        return true;
    }
}
```

#### Model: OrderItem

```php
<?php
// File: app/Models/OrderItem.php
// Penjelasan: Model OrderItem untuk interaksi dengan tabel order_items

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price_at_purchase',
    ];
    
    protected $casts = [
        'quantity' => 'integer',
        'price_at_purchase' => 'decimal:2',
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
    
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Hitung subtotal untuk item ini
     */
    public function getSubtotalAttribute(): float
    {
        return $this->price_at_purchase * $this->quantity;
    }
}
```

---

### 7.4.3 Step 3: Request Validation Classes

#### CreateAddressRequest

```php
<?php
// File: app/Http/Requests/CreateAddressRequest.php
// Penjelasan: Validasi untuk request pembuatan alamat baru

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Hanya user yang login yang boleh
        return auth()->check();
    }
    
    public function rules(): array
    {
        return [
            'label' => [
                'required',
                'string',
                'max:50',
            ],
            'recipient_name' => [
                'required',
                'string',
                'max:255',
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
            ],
            'full_address' => [
                'required',
                'string',
                'max:500',
            ],
            'is_default' => [
                'sometimes',
                'boolean',
            ],
        ];
    }
    
    public function messages(): array
    {
        return [
            'label.required' => 'Label alamat wajib diisi',
            'recipient_name.required' => 'Nama penerima wajib diisi',
            'phone.required' => 'Nomor HP wajib diisi',
            'full_address.required' => 'Alamat lengkap wajib diisi',
        ];
    }
}
```

#### CheckoutRequest

```php
<?php
// File: app/Http/Requests/CheckoutRequest.php
// Penjelasan: Validasi untuk request checkout

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasRole('buyer');
    }
    
    public function rules(): array
    {
        return [
            'address_id' => [
                'required',
                'integer',
                'exists:addresses,id',
            ],
            'items' => [
                'required',
                'array',
                'min:1',
            ],
            'items.*.product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ];
    }
    
    public function messages(): array
    {
        return [
            'address_id.required' => 'Alamat pengiriman wajib dipilih',
            'address_id.exists' => 'Alamat tidak ditemukan',
            'items.required' => 'Item pesanan wajib ada',
            'items.min' => 'Minimal harus ada 1 item',
            'items.*.product_id.required' => 'ID produk wajib diisi',
            'items.*.product_id.exists' => 'Produk tidak ditemukan',
            'items.*.quantity.required' => 'Jumlah produk wajib diisi',
            'items.*.quantity.min' => 'Jumlah minimal 1',
        ];
    }
}
```

---

### 7.4.4 Step 4: Controllers

#### WalletController

```php
<?php
// File: app/Http/Controllers/WalletController.php
// Penjelasan: Controller untuk operasi Wallet

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WalletController extends Controller
{
    /**
     * ============================================================
     * GET WALLET
     * ============================================================
     * Ambil data wallet user yang sedang login
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Ambil atau buat wallet
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'formatted_balance' => 'Rp ' . number_format($wallet->balance, 0, ',', '.'),
            ],
        ]);
    }
    
    /**
     * ============================================================
     * GET TRANSACTIONS
     * ============================================================
     * Ambil riwayat transaksi wallet
     */
    public function transactions(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $wallet = Wallet::where('user_id', $user->id)->first();
        
        if (!$wallet) {
            return response()->json([
                'success' => true,
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 0,
                ],
            ]);
        }
        
        $transactions = Transaction::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
                'last_page' => $transactions->lastPage(),
            ],
        ]);
    }
    
    /**
     * ============================================================
     * TOP UP
     * ============================================================
     * Top up saldo wallet
     */
    public function topUp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000', 'max:100000000'],
        ]);
        
        $user = $request->user();
        
        // Cek apakah user punya role buyer
        if (!$user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa top up wallet',
            ], 403);
        }
        
        // Ambil atau buat wallet
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );
        
        // Top up
        $transaction = $wallet->topUp(
            $validated['amount'],
            'Top up saldo'
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Top up berhasil!',
            'data' => [
                'balance' => $wallet->fresh()->balance,
                'transaction' => [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at,
                ],
            ],
        ]);
    }
}
```

#### AddressController

```php
<?php
// File: app/Http/Controllers/AddressController.php
// Penjelasan: Controller untuk operasi Address (CRUD)

namespace App\Http\Controllers;

use App\Models\Address;
use App\Http\Requests\CreateAddressRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AddressController extends Controller
{
    /**
     * ============================================================
     * INDEX
     * ============================================================
     * Ambil semua alamat user
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $addresses = Address::where('user_id', $user->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $addresses,
        ]);
    }
    
    /**
     * ============================================================
     * STORE
     * ============================================================
     * Buat alamat baru
     */
    public function store(CreateAddressRequest $request): JsonResponse
    {
        $user = $request->user();
        
        $validated = $request->validated();
        $validated['user_id'] = $user->id;
        
        // Jika ini alamat default, reset yang lain
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', $user->id)
                ->update(['is_default' => false]);
        }
        
        $address = Address::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil ditambahkan',
            'data' => $address,
        ], 201);
    }
    
    /**
     * ============================================================
     * SHOW
     * ============================================================
     * Ambil detail satu alamat
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        $address = Address::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $address,
        ]);
    }
    
    /**
     * ============================================================
     * UPDATE
     * ============================================================
     * Update alamat
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'label' => ['sometimes', 'string', 'max:50'],
            'recipient_name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'full_address' => ['sometimes', 'string', 'max:500'],
            'is_default' => ['sometimes', 'boolean'],
        ]);
        
        $user = $request->user();
        
        $address = Address::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }
        
        // Jika ini alamat default, reset yang lain
        if ($validated['is_default'] ?? false) {
            Address::where('user_id', $user->id)
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }
        
        $address->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil diupdate',
            'data' => $address->fresh(),
        ]);
    }
    
    /**
     * ============================================================
     * DESTROY
     * ============================================================
     * Hapus alamat
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        $address = Address::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }
        
        $address->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil dihapus',
        ]);
    }
    
    /**
     * ============================================================
     * SET DEFAULT
     * ============================================================
     * Set alamat sebagai default
     */
    public function setDefault(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        $address = Address::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }
        
        $address->setAsDefault();
        
        return response()->json([
            'success' => true,
            'message' => 'Alamat default berhasil diubah',
            'data' => $address->fresh(),
        ]);
    }
}
```

#### CartController

```php
<?php
// File: app/Http/Controllers/CartController.php
// Penjelasan: Controller untuk operasi Cart

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * ============================================================
     * INDEX
     * ============================================================
     * Ambil isi cart user
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id]
        );
        
        $items = CartItem::where('cart_id', $cart->id)
            ->with(['product.store'])
            ->get();
        
        $total = $items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
        
        $store = $items->first()?->product->store;
        
        return response()->json([
            'success' => true,
            'data' => [
                'items' => $items,
                'store' => $store ? [
                    'id' => $store->id,
                    'name' => $store->name,
                ] : null,
                'total' => $total,
                'total_items' => $items->sum('quantity'),
            ],
        ]);
    }
    
    /**
     * ============================================================
     * ADD ITEM
     * ============================================================
     * Tambah item ke cart
     */
    public function addItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
        ]);
        
        $user = $request->user();
        $quantity = $validated['quantity'] ?? 1;
        
        // Cek apakah user punya role buyer
        if (!$user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa menambahkan ke cart',
            ], 403);
        }
        
        // Ambil atau buat cart
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        
        // Ambil produk
        $product = Product::with('store')->findOrFail($validated['product_id']);
        
        // CEK SINGLE-STORE RULE
        if ($cart->items()->exists()) {
            $firstStoreId = $cart->items->first()->product->store_id;
            
            if ($firstStoreId !== $product->store_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart hanya boleh berisi produk dari 1 toko yang sama. Selesaikan checkout atau kosongkan cart terlebih dahulu.',
                ], 400);
            }
        }
        
        // Cek stok
        if ($product->stock < $quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
            ], 400);
        }
        
        // Cek apakah sudah ada di cart
        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();
        
        if ($existingItem) {
            // Update quantity
            $newQuantity = $existingItem->quantity + $quantity;
            
            if ($product->stock < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi untuk jumlah yang diminta',
                ], 400);
            }
            
            $existingItem->update(['quantity' => $newQuantity]);
            
            return response()->json([
                'success' => true,
                'message' => 'Jumlah item di cart berhasil diupdate',
                'data' => $existingItem->fresh()->load('product'),
            ]);
        }
        
        // Tambah item baru
        $item = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Item berhasil ditambahkan ke cart',
            'data' => $item->load('product'),
        ], 201);
    }
    
    /**
     * ============================================================
     * UPDATE ITEM
     * ============================================================
     * Update jumlah item di cart
     */
    public function updateItem(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);
        
        $user = $request->user();
        
        $item = CartItem::whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);
        
        // Jika quantity 0, hapus item
        if ($validated['quantity'] === 0) {
            $item->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Item dihapus dari cart',
            ]);
        }
        
        // Cek stok
        if ($item->product->stock < $validated['quantity']) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
            ], 400);
        }
        
        $item->update(['quantity' => $validated['quantity']]);
        
        return response()->json([
            'success' => true,
            'message' => 'Jumlah item berhasil diupdate',
            'data' => $item->fresh()->load('product'),
        ]);
    }
    
    /**
     * ============================================================
     * REMOVE ITEM
     * ============================================================
     * Hapus item dari cart
     */
    public function removeItem(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        $item = CartItem::whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);
        
        $item->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Item berhasil dihapus dari cart',
        ]);
    }
    
    /**
     * ============================================================
     * CLEAR CART
     * ============================================================
     * Kosongkan cart
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $cart = Cart::where('user_id', $user->id)->first();
        
        if ($cart) {
            $cart->items()->delete();
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Cart berhasil dikosongkan',
        ]);
    }
}
```

#### OrderController

```php
<?php
// File: app/Http/Controllers/OrderController.php
// Penjelasan: Controller untuk operasi Order

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Wallet;
use App\Models\Address;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * ============================================================
     * INDEX - BUYER
     * ============================================================
     * Ambil semua pesanan buyer
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $orders = Order::where('user_id', $user->id)
            ->with(['store', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage(),
            ],
        ]);
    }
    
    /**
     * ============================================================
     * SHOW
     * ============================================================
     * Ambil detail satu pesanan
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['store', 'driver', 'items.product'])
            ->first();
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }
    
    /**
     * ============================================================
     * STORE - CHECKOUT
     * ============================================================
     * Buat pesanan baru (checkout)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address_id' => ['required', 'integer', 'exists:addresses,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);
        
        $user = $request->user();
        
        // Cek apakah user punya role buyer
        if (!$user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa checkout',
            ], 403);
        }
        
        // Ambil alamat
        $address = Address::where('id', $validated['address_id'])
            ->where('user_id', $user->id)
            ->first();
        
        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }
        
        // Ambil wallet
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );
        
        // Hitung total dan validasi
        $total = 0;
        $storeId = null;
        $products = [];
        
        foreach ($validated['items'] as $itemData) {
            $product = Product::find($itemData['product_id']);
            
            // Pastikan store sama (single-store)
            if ($storeId === null) {
                $storeId = $product->store_id;
            } elseif ($storeId !== $product->store_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Checkout hanya boleh untuk produk dari 1 toko',
                ], 400);
            }
            
            // Cek stok
            if ($product->stock < $itemData['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => "Stok {$product->name} tidak mencukupi",
                ], 400);
            }
            
            $total += $product->price * $itemData['quantity'];
            $products[] = [
                'product' => $product,
                'quantity' => $itemData['quantity'],
            ];
        }
        
        // Cek saldo
        if ($wallet->balance < $total) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo wallet tidak mencukupi',
                'errors' => [
                    'balance' => ['Saldo Anda: Rp ' . number_format($wallet->balance, 0, ',', '.')],
                ],
            ], 400);
        }
        
        // Generate order number
        $orderNumber = Order::generateOrderNumber();
        
        // DATABASE TRANSACTION
        try {
            DB::beginTransaction();
            
            // 1. Debit wallet
            $wallet->decrement('balance', $total);
            
            // 2. Create transaction
            Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'purchase',
                'amount' => $total,
                'description' => "Pembelian order #{$orderNumber}",
            ]);
            
            // 3. Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'store_id' => $storeId,
                'status' => Order::STATUS_PACKAGING,
                'total_amount' => $total,
                'shipping_address' => "{$address->recipient_name}\n{$address->full_address}\n{$address->phone}",
            ]);
            
            // 4. Create order items & reduce stock
            foreach ($products as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'price_at_purchase' => $item['product']->price,
                ]);
                
                // Reduce stock
                $item['product']->decrement('stock', $item['quantity']);
            }
            
            // 5. Clear cart (hapus item berdasarkan product_id dari cart user)
            $cart = Cart::where('user_id', $user->id)->first();
            if ($cart) {
                $productIds = array_column($validated['items'], 'product_id');
                CartItem::where('cart_id', $cart->id)
                    ->whereIn('product_id', $productIds)
                    ->delete();
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat!',
                'data' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'shipping_address' => $order->shipping_address,
                    'new_balance' => $wallet->fresh()->balance,
                ],
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat pesanan',
            ], 500);
        }
    }
    
    /**
     * ============================================================
     * CANCEL - BUYER
     * ============================================================
     * Buyer membatalkan pesanan
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }
        
        if (!$order->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak dapat dibatalkan',
            ], 400);
        }
        
        // Refund
        $wallet = Wallet::where('user_id', $user->id)->first();
        
        if ($wallet) {
            $wallet->refund(
                $order->total_amount,
                "Refund pembatalan order #{$order->order_number}",
                $order
            );
        }
        
        // Restore stock
        foreach ($order->items as $item) {
            $item->product->increment('stock', $item->quantity);
        }
        
        // Update status
        $order->update(['status' => Order::STATUS_RETURNED]);
        
        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibatalkan. Saldo akan dikembalikan.',
            'data' => [
                'status' => $order->status,
                'refunded_amount' => $order->total_amount,
                'new_balance' => $wallet?->fresh()->balance,
            ],
        ]);
    }
    
    /**
     * ============================================================
     * SELLER: ORDER LIST
     * ============================================================
     * Ambil pesanan masuk untuk seller
     */
    public function sellerOrders(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Cek apakah user punya store
        $store = $user->store;
        
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 400);
        }
        
        $orders = Order::where('store_id', $store->id)
            ->with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }
    
    /**
     * ============================================================
     * SELLER: UPDATE STATUS
     * ============================================================
     * Seller mengupdate status pesanan
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:packaging,waiting_shipper'],
        ]);
        
        $user = $request->user();
        
        $order = Order::where('id', $id)
            ->whereHas('store', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->first();
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }
        
        // Validasi status transition
        if ($order->status !== Order::STATUS_PACKAGING && $validated['status'] === 'waiting_shipper') {
            // Seller mengkonfirmasi sudah dikemas
            $order->update(['status' => Order::STATUS_WAITING_SHIPPER]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Status tidak valid untuk transition ini',
            ], 400);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diupdate',
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
            ],
        ]);
    }
    
    /**
     * ============================================================
     * DRIVER: ORDER LIST
     * ============================================================
     * Ambil pesanan yang bisa diambil driver
     */
    public function driverOrders(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Ambil pesanan waiting_shipper yang belum punya driver
        $orders = Order::where('status', Order::STATUS_WAITING_SHIPPER)
            ->whereNull('driver_id')
            ->with(['user', 'store', 'items.product'])
            ->orderBy('created_at', 'asc') // FIFO
            ->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }
    
    /**
     * ============================================================
     * DRIVER: PICKUP ORDER
     * ============================================================
     * Driver mengambil pesanan
     */
    public function pickupOrder(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        if (!$user->hasRole('driver')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya driver yang bisa mengambil pesanan',
            ], 403);
        }
        
        $order = Order::where('id', $id)
            ->where('status', Order::STATUS_WAITING_SHIPPER)
            ->whereNull('driver_id')
            ->first();
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan atau sudah diambil',
            ], 404);
        }
        
        $order->update([
            'driver_id' => $user->id,
            'status' => Order::STATUS_SHIPPING,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil diambil!',
            'data' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'shipping_address' => $order->shipping_address,
            ],
        ]);
    }
    
    /**
     * ============================================================
     * DRIVER: COMPLETE ORDER
     * ============================================================
     * Driver menyelesaikan pesanan (sampai ke buyer)
     */
    public function completeOrder(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        
        $order = Order::where('id', $id)
            ->where('driver_id', $user->id)
            ->where('status', Order::STATUS_SHIPPING)
            ->first();
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }
        
        $order->update(['status' => Order::STATUS_COMPLETED]);
        
        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil diselesaikan!',
            'data' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
            ],
        ]);
    }
}
```

---

### 7.4.5 Step 5: API Routes

Buka `routes/api.php` dan tambahkan routes berikut:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

// ============================================================
// PUBLIC ROUTES (Tanpa autentikasi)
// ============================================================

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Products (public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Stores (public)
Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{id}', [StoreController::class, 'show']);


// ============================================================
// PROTECTED ROUTES (Perlu autentikasi)
// ============================================================
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/select-role', [AuthController::class, 'selectRole']);
        Route::post('/assign-role', [AuthController::class, 'assignRole']);
    });
    
    // ============================================================
    // BUYER ROUTES
    // ============================================================
    
    // Wallet
    Route::prefix('wallet')->group(function () {
        Route::get('/', [WalletController::class, 'show']);
        Route::post('/topup', [WalletController::class, 'topUp']);
    });
    
    // Transactions
    Route::get('/transactions', [WalletController::class, 'transactions']);
    
    // Addresses
    Route::prefix('addresses')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/', [AddressController::class, 'store']);
        Route::get('/{id}', [AddressController::class, 'show']);
        Route::put('/{id}', [AddressController::class, 'update']);
        Route::delete('/{id}', [AddressController::class, 'destroy']);
        Route::post('/{id}/set-default', [AddressController::class, 'setDefault']);
    });
    
    // Cart
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/items', [CartController::class, 'addItem']);
        Route::put('/items/{id}', [CartController::class, 'updateItem']);
        Route::delete('/items/{id}', [CartController::class, 'removeItem']);
        Route::delete('/', [CartController::class, 'clear']);
    });
    
    // Orders (Buyer)
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::post('/{id}/cancel', [OrderController::class, 'cancel']);
    });
    
    // ============================================================
    // SELLER ROUTES
    // ============================================================
    
    // Store Management
    Route::prefix('stores')->group(function () {
        // Public (dengan auth)
        Route::get('/my', [StoreController::class, 'myStore']);
        Route::post('/', [StoreController::class, 'store']);
        Route::put('/my', [StoreController::class, 'update']);
    });
    
    // Seller Products
    Route::prefix('seller/products')->group(function () {
        Route::get('/', [ProductController::class, 'myProducts']);
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
        Route::get('/stats', [ProductController::class, 'myProductsStats']);
    });
    
    // Seller Orders
    Route::prefix('seller/orders')->group(function () {
        Route::get('/', [OrderController::class, 'sellerOrders']);
        Route::put('/{id}/status', [OrderController::class, 'updateStatus']);
    });
    
    // ============================================================
    // DRIVER ROUTES
    // ============================================================
    
    Route::prefix('driver/orders')->group(function () {
        Route::get('/', [OrderController::class, 'driverOrders']);
        Route::post('/{id}/pickup', [OrderController::class, 'pickupOrder']);
        Route::post('/{id}/complete', [OrderController::class, 'completeOrder']);
    });
});
```

---

## 7.5 Contoh Request/Response

### 1. Get Wallet

```bash
# Request
GET http://localhost:8000/api/wallet
Authorization: Bearer 1|abc123xyz...

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
POST http://localhost:8000/api/wallet/topup
Authorization: Bearer 1|abc123xyz...
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
            "description": "Top up saldo",
            "created_at": "2026-07-11T12:00:00Z"
        }
    }
}
```

### 3. Add to Cart

```bash
# Request
POST http://localhost:8000/api/cart/items
Authorization: Bearer 1|abc123xyz...
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
            "price": 25000,
            "image_url": "..."
        }
    }
}
```

### 4. Get Cart

```bash
# Request
GET http://localhost:8000/api/cart
Authorization: Bearer 1|abc123xyz...

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
                    "store": {
                        "id": 1,
                        "name": "Dapur Budi"
                    }
                }
            }
        ],
        "store": {
            "id": 1,
            "name": "Dapur Budi"
        },
        "total": 50000,
        "total_items": 2
    }
}
```

### 5. Checkout

```bash
# Request
POST http://localhost:8000/api/orders
Authorization: Bearer 1|abc123xyz...
Content-Type: application/json

{
    "address_id": 1,
    "items": [
        { "product_id": 1, "quantity": 2 }
    ]
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
        "shipping_address": "Budi Santoso\nJl. Merdeka No.10\n081234567890",
        "new_balance": 450000
    }
}
```

### 6. Cancel Order

```bash
# Request
POST http://localhost:8000/api/orders/1/cancel
Authorization: Bearer 1|abc123xyz...

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

```json
// 400: Saldo tidak cukup
{
    "success": false,
    "message": "Saldo wallet tidak mencukupi",
    "errors": {
        "balance": ["Saldo Anda: Rp 50.000"]
    }
}

// 400: Stok tidak cukup
{
    "success": false,
    "message": "Stok Nasi Goreng Spesial tidak mencukupi"
}

// 400: Single-store rule violation
{
    "success": false,
    "message": "Cart hanya boleh berisi produk dari 1 toko yang sama. Selesaikan checkout atau kosongkan cart terlebih dahulu."
}

// 400: Order tidak bisa dibatalkan
{
    "success": false,
    "message": "Pesanan tidak dapat dibatalkan"
}

// 403: Tidak punya role
{
    "success": false,
    "message": "Hanya buyer yang bisa checkout"
}

// 404: Alamat tidak ditemukan
{
    "success": false,
    "message": "Alamat tidak ditemukan"
}
```

---

## 7.7 Troubleshooting

```
┌─────────────────────────────────────────────────────────────────┐
│                    TROUBLESHOOTING WALLET, CART, ORDER                │
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
│  1. Cek Laravel log: storage/logs/laravel.log                 │
│  2. Cek database transaction rollback                          │
│  3. Pastikan wallet ada untuk user                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7.8 Checklist BAB 7

- [ ] Buat migration untuk wallets, transactions, addresses, carts, cart_items, orders, order_items
- [ ] Buat Model untuk semua tabel baru (Wallet, Transaction, Address, Cart, CartItem, Order, OrderItem)
- [ ] Tambah relasi di User Model (hasOne Wallet, hasMany Addresses, hasOne Cart, hasMany Orders)
- [ ] Buat Request validation classes (CreateAddressRequest, CheckoutRequest)
- [ ] Buat WalletController (show, transactions, topUp)
- [ ] Buat AddressController (CRUD + setDefault)
- [ ] Buat CartController (index, addItem, updateItem, removeItem, clear)
- [ ] Buat OrderController (index, show, store/checkout, cancel, sellerOrders, updateStatus, driverOrders, pickupOrder, completeOrder)
- [ ] Update routes/api.php dengan semua routes baru
- [ ] Testing semua endpoint
- [ ] Testing single-store cart rule
- [ ] Testing checkout flow
- [ ] Testing order cancellation with refund

---

## 7.9 Ringkasan BAB 7

```
┌─────────────────────────────────────────────────────────────────┐
│                    YANG SUDAH DIPELAJARI                        │
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
│  Kita akan:                                                    │
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
*Tanggal: 2026-07-11*
