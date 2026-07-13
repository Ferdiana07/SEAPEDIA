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

## 7.2 Apa itu Wallet, Cart, dan Order?

### 7.2.1 Penjelasan Sederhana

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 ANALOGI BELANJA DI PASAR                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  💰 DOMPET (Wallet)                                                    │
│  ─────────────────────────────────────────────────────────────────────  │
│  Bayangkan dompet sungguhan di saku:                                     │
│  • Isi uang untuk belanja                                             │
│  • Cek saldo sebelum belanja                                           │
│  • Top up = tambah uang                                               │
│  • Checkout = ambil uang untuk bayar                                   │
│  • Refund = uang dikembalikan                                          │
│                                                                         │
│  🛒 KERANJANG (Cart)                                                │
│  ─────────────────────────────────────────────────────────────────────  │
│  Keranjang belanja di supermarket:                                       │
│  • Masukkan barang yang mau dibeli                                     │
│  • Lihat total belanjaan                                               │
│  • Hapus barang kalau berubah pikiran                                   │
│  • Cart hanya bisa dari 1 toko!                                        │
│                                                                         │
│  📋 NOTA (Order)                                                    │
│  ─────────────────────────────────────────────────────────────────────  │
│  Struk/nota belanja:                                                   │
│  • Nomor pesanan = ID nota                                             │
│  • Daftar barang = order items                                          │
│  • Total = jumlah yang harus dibayar                                     │
│  • Status = proses pesanan (dikemas, dikirim, selesai)                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2.2 Siklus Hidup Wallet

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SIKLUS HIDUP WALLET                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣  REGISTER → Wallet Otomatis Terbuat                               │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     User register                                                       │
│           │                                                             │
│           ▼                                                             │
│     ┌───────────────────────────────────────────────────────┐           │
│     │ OTOMATIS: Wallet dibuat dengan balance = 0           │           │
│     │                                                       │           │
│     │ INSERT INTO wallets (user_id, balance) VALUES (1, 0)   │           │
│     └───────────────────────────────────────────────────────┘           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  2️⃣  TOP UP → Saldo Bertambah                                      │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     Buyer mau top up 100.000                                            │
│           │                                                             │
│           ▼                                                             │
│     ┌───────────────────────────────────────────────────────┐           │
│     │ UPDATE wallets SET balance = balance + 100000         │           │
│     │ WHERE user_id = 1                                     │           │
│     │                                                       │           │
│     │ INSERT transactions (type, amount, description)       │           │
│     │ VALUES ('topup', 100000, 'Top up via transfer')     │           │
│     │                                                       │           │
│     │ Balance: 0 → 100.000                                 │           │
│     └───────────────────────────────────────────────────────┘           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  3️⃣  CHECKOUT → Saldo Berkurang                                      │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     Buyer checkout total 75.000                                          │
│           │                                                             │
│           ▼                                                             │
│     ┌───────────────────────────────────────────────────────┐           │
│     │ CEK: balance >= total?                               │           │
│     │                                                       │           │
│     │ Jika YA:                                              │           │
│     │   UPDATE wallets SET balance = balance - 75000        │           │
│     │   INSERT transactions ('purchase', -75000, order_id)  │           │
│     │   Balance: 100.000 → 25.000                          │           │
│     │                                                       │           │
│     │ Jika TIDAK:                                           │           │
│     │   ❌ CHECKOUT GAGAL - Saldo tidak cukup!             │           │
│     └───────────────────────────────────────────────────────┘           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  4️⃣  REFUND → Saldo Bertambah Kembali                                 │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     Pesanan dibatalkan                                                   │
│           │                                                             │
│           ▼                                                             │
│     ┌───────────────────────────────────────────────────────┐           │
│     │ UPDATE wallets SET balance = balance + 75000         │           │
│     │ INSERT transactions ('refund', 75000, order_id)      │           │
│     │ Balance: 25.000 → 100.000                            │           │
│     └───────────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7.3 Aturan Single-Store Cart

### 7.3.1 Penjelasan Single-Store Rule

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SINGLE-STORE CART RULE                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ⚠️  PERATURAN KRUSIAL:                                                  │
│  Cart hanya boleh berisi produk dari 1 TOKO yang SAMA!                       │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  KENAPA ADA ATURAN INI?                                                 │
│  ─────────────────────────────────────────────────────────────────────  │
│  Dalam implementasi sederhana SEAPEDIA:                                     │
│  • 1 Order = 1 Toko                                                    │
│  • 1 Driver mengambil dari 1 Toko ke 1 Alamat                           │
│  • Tidak ada sistem split order / partial delivery                        │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ✅ BENAR:                                                             │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  Cart:                                                 │           │
│  │  • Nasi Goreng        → Toko: Dapur Budi      → 25.000 │           │
│  │  • Ayam Geprek        → Toko: Dapur Budi      → 22.000 │           │
│  │  • Mie Ayam           → Toko: Dapur Budi      → 20.000 │           │
│  │                                                         │           │
│  │  Total: 67.000                                          │           │
│  │  Toko: Dapur Budi ✅                                    │           │
│  │  Status: ✅ BOLEH CHECKOUT                               │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ❌ SALAH:                                                             │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  Cart:                                                 │           │
│  │  • Nasi Goreng        → Toko: Dapur Budi      → 25.000 │           │
│  │  • Rendang           → Toko: Warung Siti     → 35.000 │           │
│  │                                                         │           │
│  │  Total: 60.000                                          │           │
│  │  Toko: CAMPURAN ❌ (2 toko berbeda!)                   │           │
│  │  Status: ❌ TIDAK BOLEH CHECKOUT                       │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  SOLUSI:                                                               │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │  1. Checkout yang dari Dapur Budi dulu                     │           │
│  │  2. Cart sekarang kosong                                  │           │
│  │  3. Tambah produk dari Warung Siti                        │           │
│  │  4. Checkout lagi                                        │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.3.2 Cara Cek Single-Store di Kode

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    KODE PENGECEKAN SINGLE-STORE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SAAT MENAMBAH PRODUK KE CART:                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  $cart = Cart::where('user_id', auth()->id())->first();                 │
│  $product = Product::find($productId);                                   │
│                                                                         │
│  // Jika cart kosong, boleh tambahkan produk apapun                       │
│  if ($cart->items->isEmpty()) {                                        │
│      // ✅ Lanjut tambahkan                                             │
│  }                                                                       │
│                                                                         │
│  // Jika cart tidak kosong, cek apakah toko sama                        │
│  $firstStoreId = $cart->items->first()->product->store_id;              │
│                                                                         │
│  if ($firstStoreId !== $product->store_id) {                            │
│      // ❌ Toko berbeda!                                               │
│      return "Cart hanya boleh dari 1 toko";                              │
│  }                                                                       │
│                                                                         │
│  // ✅ Toko sama, lanjut tambahkan                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7.4 Alur Checkout Lengkap

### 7.4.1 Step-by-Step Checkout Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ALUR CHECKOUT LENGKAP                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣  USER DI HALAMAN CART                                             │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     User melihat:                                                        │
│     ┌─────────────────────────────────────────────────────────┐         │
│     │ 🛒 CART                                                  │         │
│     │                                                          │         │
│     │ [✓] Nasi Goreng      x2    Rp 50.000      [Hapus]     │         │
│     │ [✓] Ayam Geprek      x1    Rp 22.000      [Hapus]     │         │
│     │                                                          │         │
│     │ Toko: Dapur Budi                                       │         │
│     │ Total Items: 2                                          │         │
│     │ Total Harga: Rp 72.000                                 │         │
│     │                                                          │         │
│     │ Alamat Pengiriman:                                       │         │
│     │ ┌─────────────────────────────────────────────┐        │         │
│     │ │ > Jl. Mawar No.5 (Rumah)        [Ubah]   │        │         │
│     │ └─────────────────────────────────────────────┘        │         │
│     │                                                          │         │
│     │ [ CHECKOUT Rp 72.000 ]                                  │         │
│     └─────────────────────────────────────────────────────────┘         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  2️⃣  FRONTEND VALIDASI SEBELUM KIRIM                                  │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     ┌─────────────────────────────────────────────────────────┐         │
│     │ CEK 1: Cart kosong?                                     │         │
│     │ if (items.length === 0) → Error: "Cart kosong!"        │         │
│     │                                                         │         │
│     │ CEK 2: Alamat dipilih?                                  │         │
│     │ if (!selectedAddress) → Error: "Pilih alamat!"         │         │
│     │                                                         │         │
│     │ CEK 3: Saldo cukup?                                    │         │
│     │ if (balance < total) → Error: "Saldo tidak cukup!"   │         │
│     │                                                         │         │
│     │ CEK 4: Semua produk masih ada stok?                    │         │
│     │ for each item → check stock >= quantity                 │         │
│     │                                                         │         │
│     │ ✅ Semua pass → Kirim ke backend                        │         │
│     └─────────────────────────────────────────────────────────┘         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  3️⃣  KIRIM REQUEST CHECKOUT                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     Frontend                           Backend                            │
│        │                                   │                              │
│        │ POST /api/orders                │                              │
│        │ Authorization: Bearer {token}    │                              │
│        │ { address_id: 5 }               │                              │
│        │─────────────────────────────────────>│                          │
│        │                                   │                              │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  4️⃣  BACKEND PROSES CHECKOUT                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     ┌─────────────────────────────────────────────────────────┐         │
│     │ VALIDASI 1: CEK WALLET & SALDO                        │         │
│     │ ───────────────────────────────────────────────────   │         │
│     │                                                         │         │
│     │ $wallet = Wallet::where('user_id', auth()->id())->first();   │
│     │ $total = hitung dari cart items                       │         │
│     │                                                         │         │
│     │ if ($wallet->balance < $total) {                     │         │
│     │     return 400: "Saldo tidak cukup"                   │         │
│     │ }                                                       │         │
│     └─────────────────────────────────────────────────────────┘         │
│                              │                                        │
│                              ▼                                        │
│     ┌─────────────────────────────────────────────────────────┐         │
│     │ VALIDASI 2: CEK STOCK                                 │         │
│     │ ───────────────────────────────────────────────────   │         │
│     │                                                         │         │
│     │ for each cart item {                                   │         │
│     │     if ($product->stock < $item->quantity) {          │         │
│     │         return 400: "Stok tidak mencukupi"            │         │
│     │     }                                                   │         │
│     │ }                                                       │         │
│     └─────────────────────────────────────────────────────────┘         │
│                              │                                        │
│                              ▼                                        │
│     ┌─────────────────────────────────────────────────────────┐         │
│     │ DATABASE TRANSACTION: SEMUA ATAU TIDAK SAMA SEKALI     │         │
│     │ ───────────────────────────────────────────────────   │         │
│     │                                                         │         │
│     │ DB::transaction(function () use (...) {                │         │
│     │                                                         │         │
│     │     // 1. KURANGI STOK PRODUK                         │         │
│     │     foreach ($items as $item) {                        │         │
│     │         Product::decrement('stock', $item->quantity); │         │
│     │     }                                                  │         │
│     │                                                         │         │
│     │     // 2. DEBIT WALLET                                │         │
│     │     Wallet::decrement('balance', $total);              │         │
│     │                                                         │         │
│     │     // 3. INSERT TRANSACTION                          │         │
│     │     Transaction::create([...])                          │         │
│     │                                                         │         │
│     │     // 4. INSERT ORDER                                │         │
│     │     Order::create([...])                               │         │
│     │                                                         │         │
│     │     // 5. INSERT ORDER ITEMS                          │         │
│     │     foreach ($items as $item) {                        │         │
│     │         OrderItem::create([...])                       │         │
│     │     }                                                  │         │
│     │                                                         │         │
│     │     // 6. HAPUS CART ITEMS                            │         │
│     │     CartItem::where('cart_id', $cartId)->delete();     │         │
│     │                                                         │         │
│     │ });  // ← COMMIT (otomatis jika tidak ada error)         │         │
│     │                                                         │         │
│     │ ❌ Jika ada error → ROLLBACK, semua dibatalkan!        │         │
│     └─────────────────────────────────────────────────────────┘         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  5️⃣  RESPONSE                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│     <═══════════════════════════════════════════════════════════════════   │
│                                                                         │
│     {                                                                    │
│       "success": true,                                                  │
│       "message": "Pesanan berhasil dibuat!",                             │
│       "data": {                                                         │
│         "id": 1,                                                       │
│         "order_number": "ORD-20260711-001",                            │
│         "status": "packaging",                                          │
│         "total_amount": 72000,                                          │
│         "new_balance": 28000                                            │
│       }                                                                 │
│     }                                                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7.5 Struktur Database

### 7.5.1 Tabel-Tabel yang Dibuat

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    7 TABEL BARU UNTUK BAB 7                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣  wallets          → Simpan saldo dompet digital                  │
│  2️⃣  transactions     → Riwayat transaksi wallet                      │
│  3️⃣  addresses        → Alamat pengiriman buyer                       │
│  4️⃣  carts            → Keranjang belanja (1 user = 1 cart)           │
│  5️⃣  cart_items       → Item-item di dalam cart                       │
│  6️⃣  orders           → Pesanan yang dibuat buyer                     │
│  7️⃣  order_items      → Item-item di dalam order                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.5.2 Penjelasan Tiap Tabel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PENJELASAN TIAP TABEL                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  💰 WALLETS                                                            │
│  ────────────────────────────────────────────────────────────────────   │
│  Fungsi: Menyimpan saldo dompet digital setiap user                      │
│  Relasi: 1 User = 1 Wallet (1:1)                                      │
│                                                                         │
│  Field penting:                                                         │
│  • user_id → Siapa pemilik dompet (UNIQUE!)                            │
│  • balance → Berapa saldo (decimal, default 0)                         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  💳 TRANSACTIONS                                                       │
│  ────────────────────────────────────────────────────────────────────   │
│  Fungsi: Menyimpan history semua transaksi wallet                       │
│  Relasi: N Transactions = 1 Wallet                                    │
│                                                                         │
│  Field penting:                                                         │
│  • wallet_id → Dompet mana                                             │
│  • order_id → Pesanan mana (nullable, tidak semua transaksi)            │
│  • type → topup | purchase | refund                                   │
│  • amount → Berapa jumlah                                              │
│  • description → Keterangan                                            │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📍 ADDRESSES                                                          │
│  ────────────────────────────────────────────────────────────────────   │
│  Fungsi: Menyimpan alamat pengiriman buyer                              │
│  Relasi: 1 User = N Addresses                                         │
│                                                                         │
│  Field penting:                                                         │
│  • user_id → Milik siapa                                               │
│  • label → "Rumah", "Kantor", "Kos"                                   │
│  • recipient_name → Nama penerima                                        │
│  • phone → No HP penerima                                              │
│  • full_address → Alamat lengkap                                       │
│  • is_default → Apakah alamat utama                                     │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  🛒 CARTS                                                              │
│  ────────────────────────────────────────────────────────────────────   │
│  Fungsi: Menyimpan keranjang belanja buyer                             │
│  Relasi: 1 User = 1 Cart (1:1)                                       │
│                                                                         │
│  Field penting:                                                         │
│  • user_id → Milik siapa (UNIQUE!)                                    │
│  • Cart kosong = tidak ada row di cart_items                           │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📦 CART_ITEMS                                                         │
│  ────────────────────────────────────────────────────────────────────   │
│  Fungsi: Item-item yang ada di dalam cart                             │
│  Relasi: 1 Cart = N CartItems, 1 Product = N CartItems               │
│                                                                         │
│  Field penting:                                                         │
│  • cart_id → Cart mana                                                 │
│  • product_id → Produk mana                                             │
│  • quantity → Berapa banyak                                             │
│  • UNIQUE(cart_id, product_id) → 1 produk hanya 1x di cart         │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📋 ORDERS                                                             │
│  ────────────────────────────────────────────────────────────────────   │
│  Fungsi: Menyimpan pesanan yang sudah checkout                        │
│  Relasi: N Orders = 1 User, N Orders = 1 Store, N Orders = 1 Driver │
│                                                                         │
│  Field penting:                                                         │
│  • order_number → Nomor unik pesanan (UNIQUE!)                         │
│  • user_id → Siapa yang pesan                                          │
│  • store_id → Dari toko mana                                           │
│  • driver_id → Siapa antar (nullable)                                   │
│  • status → packaging | waiting_shipper | shipping | completed | returned │
│  • total_amount → Total harga                                          │
│  • shipping_address → Alamat pengiriman (di-copy dari addresses)       │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📝 ORDER_ITEMS                                                         │
│  ────────────────────────────────────────────────────────────────────   │
│  Fungsi: Item-item yang ada di dalam order                             │
│  Relasi: 1 Order = N OrderItems                                       │
│                                                                         │
│  Field penting:                                                         │
│  • order_id → Order mana                                               │
│  • product_id → Produk mana                                             │
│  • quantity → Berapa banyak                                             │
│  • price_at_purchase → Harga SAAT checkout (bukan harga sekarang!)     │
│                                                                         │
│  ⚠️  PENTING: price_at_purchase                                       │
│  ────────────────────────────────────────────────────────────────────   │
│  Harga produk BISA BERUBAH setelah order dibuat.                        │
│  Misalnya:                                                             │
│  • Order #001 dibuat dengan harga Rp 25.000                            │
│  • Seller ubah harga jadi Rp 30.000                                    │
│  • Di order #001, tetap显示 Rp 25.000 karena disimpan saat checkout   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7.6 Model-Model - Penjelasan Detail

### 7.6.1 Relasi di User Model

```php
<?php
// app/Models/User.php

// Tambahkan relasi ini di class User

/**
 * Wallet: Setiap user punya 1 wallet
 * Usage: $user->wallet->balance
 */
public function wallet()
{
    return $this->hasOne(Wallet::class);
}

/**
 * Addresses: Setiap user bisa punya banyak alamat
 * Usage: $user->addresses
 */
public function addresses()
{
    return $this->hasMany(Address::class);
}

/**
 * Cart: Setiap user punya 1 cart
 * Usage: $user->cart->items
 */
public function cart()
{
    return $this->hasOne(Cart::class);
}

/**
 * Orders: Setiap user bisa punya banyak pesanan (sebagai buyer)
 * Usage: $user->orders
 */
public function orders()
{
    return $this->hasMany(Order::class, 'user_id');
}

/**
 * DriverOrders: Pesanan yang ditugaskan ke driver
 * Usage: $user->driverOrders
 */
public function driverOrders()
{
    return $this->hasMany(Order::class, 'driver_id');
}
```

### 7.6.2 Model Wallet

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ISI FILE WALLET.PHP                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  class Wallet extends Model                                             │
│  ├── $fillable = [balance, user_id]   → Field yang boleh di-set     │
│  ├── $casts = [balance => float]       → Konversi tipe data            │
│  ├── public function user()            → Relasi ke User              │
│  ├── public function transactions()     → Relasi ke Transaction       │
│  ├── hasSufficientBalance()            → Cek saldo cukup              │
│  ├── credit()                         → Top up                       │
│  ├── debit()                           → Bayar (kurangi saldo)       │
│  ├── refund()                         → Refund (tambah saldo)       │
│  └── getFormattedBalanceAttribute      → Format: "Rp 500.000"        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.6.3 Contoh Kode Wallet Model

```php
<?php
// app/Models/Wallet.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    // Field yang boleh di-set massal
    protected $fillable = [
        'user_id',
        'balance',
    ];

    // Konversi tipe data
    protected $casts = [
        'balance' => 'float',
    ];

    // ============================================
    // RELASI
    // ============================================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    /**
     * Cek apakah saldo cukup untuk jumlah tertentu
     * Usage: if ($wallet->hasSufficientBalance(50000)) { ... }
     */
    public function hasSufficientBalance(float $amount): bool
    {
        return $this->balance >= $amount;
    }

    /**
     * Top up saldo
     * Usage: $wallet->credit(100000, 'Top up via transfer')
     */
    public function credit(float $amount, ?string $description = null): Transaction
    {
        $this->increment('balance', $amount);

        return $this->transactions()->create([
            'type' => Transaction::TYPE_TOPUP,
            'amount' => $amount,
            'description' => $description ?? 'Top up saldo',
        ]);
    }

    /**
     * Bayar (kurangi saldo)
     * Usage: $wallet->debit(50000, $orderId, 'Pembelian order #001')
     */
    public function debit(float $amount, ?int $orderId = null, ?string $description = null): bool
    {
        if (!$this->hasSufficientBalance($amount)) {
            return false;
        }

        $this->decrement('balance', $amount);

        $this->transactions()->create([
            'type' => Transaction::TYPE_PURCHASE,
            'amount' => -$amount,  // Negatif untuk menunjukkan pengurangan
            'order_id' => $orderId,
            'description' => $description ?? 'Purchase',
        ]);

        return true;
    }

    /**
     * Refund (kembalikan saldo)
     * Usage: $wallet->refund(50000, $orderId, 'Refund order #001')
     */
    public function refund(float $amount, ?int $orderId = null, ?string $description = null): Transaction
    {
        $this->increment('balance', $amount);

        return $this->transactions()->create([
            'type' => Transaction::TYPE_REFUND,
            'amount' => $amount,
            'order_id' => $orderId,
            'description' => $description ?? 'Refund',
        ]);
    }

    /**
     * Accessor: Format saldo untuk display
     * Usage: $wallet->formatted_balance → "Rp 500.000"
     */
    public function getFormattedBalanceAttribute(): string
    {
        $balance = (float) $this->balance;
        return 'Rp ' . number_format($balance, 0, ',', '.');
    }
}
```

---

## 7.7 Controller - Penjelasan Detail

### 7.7.1 Daftar Controller

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DAFTAR CONTROLLER BAB 7                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  💰 WalletController.php                                                │
│  ├── show()          → GET /api/wallet - Lihat wallet                 │
│  ├── transactions()   → GET /api/transactions - Riwayat transaksi       │
│  └── topUp()         → POST /api/wallet/topup - Top up saldo          │
│                                                                         │
│  📍 AddressController.php                                              │
│  ├── index()         → GET /api/addresses - List semua alamat          │
│  ├── store()         → POST /api/addresses - Tambah alamat             │
│  ├── show()          → GET /api/addresses/{id} - Detail alamat        │
│  ├── update()        → PUT /api/addresses/{id} - Update alamat        │
│  ├── destroy()       → DELETE /api/addresses/{id} - Hapus alamat      │
│  └── setDefault()    → POST /api/addresses/{id}/set-default           │
│                                                                         │
│  🛒 CartController.php                                                 │
│  ├── index()         → GET /api/cart - Lihat isi cart                │
│  ├── addItem()       → POST /api/cart/items - Tambah item              │
│  ├── updateItem()    → PUT /api/cart/items/{id} - Update quantity     │
│  ├── removeItem()    → DELETE /api/cart/items/{id} - Hapus item       │
│  └── clear()         → DELETE /api/cart - Kosongkan cart              │
│                                                                         │
│  📋 OrderController.php                                                │
│  ├── index()         → GET /api/orders - List pesanan buyer          │
│  ├── show()          → GET /api/orders/{id} - Detail pesanan         │
│  ├── store()         → POST /api/orders - Checkout (buat pesanan)      │
│  ├── cancel()        → POST /api/orders/{id}/cancel - Batalkan        │
│  ├── sellerOrders()   → GET /api/seller/orders - Pesanan masuk seller │
│  ├── updateStatus()  → PUT /api/seller/orders/{id}/status            │
│  ├── driverOrders()  → GET /api/driver/orders - Pesanan untuk driver  │
│  ├── pickupOrder()   → POST /api/driver/orders/{id}/pickup           │
│  └── completeOrder() → POST /api/driver/orders/{id}/complete          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.7.2 Contoh Kode WalletController

```php
<?php
// app/Http/Controllers/WalletController.php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WalletController extends Controller
{
    /**
     * GET /api/wallet
     * Lihat wallet user yang sedang login
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ambil atau buat wallet jika belum ada
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'formatted_balance' => $wallet->formatted_balance,
            ],
        ]);
    }

    /**
     * GET /api/transactions
     * Lihat riwayat transaksi
     */
    public function transactions(Request $request): JsonResponse
    {
        $user = $request->user();
        $wallet = Wallet::where('user_id', $user->id)->first();

        if (!$wallet) {
            return response()->json([
                'success' => true,
                'data' => [],
                'meta' => ['current_page' => 1, 'total' => 0],
            ]);
        }

        // Ambil transaksi dengan pagination (20 per halaman)
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
     * POST /api/wallet/topup
     * Top up saldo
     */
    public function topUp(Request $request): JsonResponse
    {
        // Validasi input
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1000|max:100000000',
        ]);

        $user = $request->user();

        // Pastikan user punya role buyer
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

        // Top up menggunakan method di Wallet model
        $transaction = $wallet->credit(
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
                ],
            ],
        ]);
    }
}
```

### 7.7.3 Contoh Kode CartController

```php
<?php
// app/Http/Controllers/CartController.php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    /**
     * GET /api/cart
     * Lihat isi keranjang
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ambil atau buat cart
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Ambil items dengan relasi product dan store
        $items = CartItem::where('cart_id', $cart->id)
            ->with(['product.store'])
            ->get();

        // Hitung total
        $total = $items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        // Ambil info store dari item pertama
        $store = $items->first()?->product->store;

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $items,
                'store' => $store ? ['id' => $store->id, 'name' => $store->name] : null,
                'total' => $total,
                'total_items' => $items->sum('quantity'),
            ],
        ]);
    }

    /**
     * POST /api/cart/items
     * Tambah item ke cart
     */
    public function addItem(Request $request): JsonResponse
    {
        // Validasi input
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'sometimes|integer|min:1',
        ]);

        $user = $request->user();
        $quantity = $validated['quantity'] ?? 1;

        // Pastikan user punya role buyer
        if (!$user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa menambahkan ke cart',
            ], 403);
        }

        // Ambil atau buat cart
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Load items untuk cek store
        $cart->load('items.product.store');

        // Ambil produk
        $product = Product::with('store')->findOrFail($validated['product_id']);

        // ==========================================
        // CEK SINGLE-STORE RULE
        // ==========================================
        if ($cart->items->isNotEmpty()) {
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
            // Update quantity jika sudah ada
            $newQuantity = $existingItem->quantity + $quantity;

            if ($product->stock < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi',
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
     * DELETE /api/cart
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

### 7.7.4 Contoh Kode OrderController (Checkout)

```php
<?php
// app/Http/Controllers/OrderController.php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Wallet;
use App\Models\Address;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * POST /api/orders
     * Checkout - buat pesanan baru
     */
    public function store(Request $request): JsonResponse
    {
        // Validasi input
        $validated = $request->validate([
            'address_id' => 'required|integer|exists:addresses,id',
        ]);

        $user = $request->user();

        // Pastikan user punya role buyer
        if (!$user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa checkout',
            ], 403);
        }

        // ==========================================
        // AMBIL DATA YANG DIBUTUHKAN
        // ==========================================

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

        // Ambil cart
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart kosong',
            ], 400);
        }

        // Load items dengan relasi
        $cart->load('items.product.store');

        // ==========================================
        // VALIDASI SINGLE-STORE
        // ==========================================
        $storeId = $cart->items->first()->product->store_id;
        foreach ($cart->items as $item) {
            if ($item->product->store_id !== $storeId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Checkout hanya boleh untuk produk dari 1 toko',
                ], 400);
            }
        }

        // ==========================================
        // HITUNG TOTAL & CEK STOK
        // ==========================================
        $total = 0;
        $products = [];
        foreach ($cart->items as $item) {
            $product = $item->product;

            // Cek stok
            if ($product->stock < $item->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Stok {$product->name} tidak mencukupi",
                ], 400);
            }

            $total += $product->price * $item->quantity;
            $products[] = ['item' => $item, 'product' => $product];
        }

        // ==========================================
        // CEK SALDO
        // ==========================================
        $wallet = Wallet::where('user_id', $user->id)->first();

        if (!$wallet) {
            return response()->json([
                'success' => false,
                'message' => 'Wallet tidak ditemukan',
            ], 400);
        }

        if ($wallet->balance < $total) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo wallet tidak mencukupi',
                'errors' => ['balance' => ['Saldo Anda: Rp ' . number_format($wallet->balance, 0, ',', '.')]],
            ], 400);
        }

        // ==========================================
        // DATABASE TRANSACTION
        // Semua atau tidak sama sekali!
        // ==========================================
        try {
            DB::beginTransaction();

            // 1. Debit wallet
            $wallet->decrement('balance', $total);

            // 2. Create transaction
            $orderNumber = Order::generateOrderNumber();
            Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => Transaction::TYPE_PURCHASE,
                'amount' => -$total,
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
            foreach ($products as $data) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $data['product']->id,
                    'quantity' => $data['item']->quantity,
                    'price_at_purchase' => $data['product']->price,
                ]);

                $data['product']->decrement('stock', $data['item']->quantity);
            }

            // 5. Hapus cart items
            $cart->items()->delete();

            // 6. Update transaction dengan order_id
            Transaction::where('wallet_id', $wallet->id)
                ->whereNull('order_id')
                ->where('description', 'LIKE', "%{$orderNumber}%")
                ->update(['order_id' => $order->id]);

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
}
```

---

## 7.8 Routes API

### 7.8.1 Routes Lengkap

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SEMUA ENDPOINT API BAB 7                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  💰 WALLET (Buyer)                                                     │
│  GET    /api/wallet           → Lihat wallet & saldo                   │
│  POST   /api/wallet/topup    → Top up saldo                           │
│  GET    /api/transactions    → Riwayat transaksi                      │
│                                                                         │
│  📍 ADDRESSES (Buyer)                                                  │
│  GET    /api/addresses           → List alamat                         │
│  POST   /api/addresses           → Tambah alamat                       │
│  GET    /api/addresses/{id}     → Detail alamat                      │
│  PUT    /api/addresses/{id}      → Update alamat                       │
│  DELETE /api/addresses/{id}      → Hapus alamat                       │
│  POST   /api/addresses/{id}/set-default → Set alamat default            │
│                                                                         │
│  🛒 CART (Buyer)                                                       │
│  GET    /api/cart                 → Lihat cart                        │
│  POST   /api/cart/items           → Tambah item                        │
│  PUT    /api/cart/items/{id}      → Update quantity                   │
│  DELETE /api/cart/items/{id}      → Hapus item                       │
│  DELETE /api/cart                 → Kosongkan cart                    │
│                                                                         │
│  📋 ORDERS (Buyer)                                                     │
│  GET    /api/orders               → List pesanan                      │
│  POST   /api/orders               → Checkout (buat pesanan)            │
│  GET    /api/orders/{id}          → Detail pesanan                   │
│  POST   /api/orders/{id}/cancel   → Batalkan pesanan                 │
│                                                                         │
│  📋 ORDERS (Seller)                                                    │
│  GET    /api/seller/orders       → Pesanan masuk                     │
│  PUT    /api/seller/orders/{id}/status → Update status                │
│                                                                         │
│  📋 ORDERS (Driver)                                                    │
│  GET    /api/driver/orders       → Pesanan untuk driver              │
│  POST   /api/driver/orders/{id}/pickup  → Ambil pesanan             │
│  POST   /api/driver/orders/{id}/complete → Selesaikan pesanan          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.8.2 Contoh Kode Routes

```php
<?php
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {

    // ==========================================
    // 💰 WALLET
    // ==========================================
    Route::prefix('wallet')->group(function () {
        Route::get('/', [WalletController::class, 'show']);
        Route::post('/topup', [WalletController::class, 'topUp']);
    });

    Route::get('/transactions', [WalletController::class, 'transactions']);

    // ==========================================
    // 📍 ADDRESSES
    // ==========================================
    Route::prefix('addresses')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::post('/', [AddressController::class, 'store']);
        Route::get('/{id}', [AddressController::class, 'show'])->where('id', '[0-9]+');
        Route::put('/{id}', [AddressController::class, 'update'])->where('id', '[0-9]+');
        Route::delete('/{id}', [AddressController::class, 'destroy'])->where('id', '[0-9]+');
        Route::post('/{id}/set-default', [AddressController::class, 'setDefault'])->where('id', '[0-9]+');
    });

    // ==========================================
    // 🛒 CART
    // ==========================================
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/items', [CartController::class, 'addItem']);
        Route::put('/items/{id}', [CartController::class, 'updateItem'])->where('id', '[0-9]+');
        Route::delete('/items/{id}', [CartController::class, 'removeItem'])->where('id', '[0-9]+');
        Route::delete('/', [CartController::class, 'clear']);
    });

    // ==========================================
    // 📋 ORDERS (Buyer)
    // ==========================================
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show'])->where('id', '[0-9]+');
        Route::post('/{id}/cancel', [OrderController::class, 'cancel'])->where('id', '[0-9]+');
    });

    // ==========================================
    // 📋 ORDERS (Seller)
    // ==========================================
    Route::prefix('seller/orders')->group(function () {
        Route::get('/', [OrderController::class, 'sellerOrders']);
        Route::put('/{id}/status', [OrderController::class, 'updateStatus'])->where('id', '[0-9]+');
    });

    // ==========================================
    // 📋 ORDERS (Driver)
    // ==========================================
    Route::prefix('driver/orders')->group(function () {
        Route::get('/', [OrderController::class, 'driverOrders']);
        Route::post('/{id}/pickup', [OrderController::class, 'pickupOrder'])->where('id', '[0-9]+');
        Route::post('/{id}/complete', [OrderController::class, 'completeOrder'])->where('id', '[0-9]+');
    });
});
```

---

## 7.9 Error Handling

### 7.9.1 Contoh Error Responses

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONTOH ERROR RESPONSES                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  400 - Bad Request                                                      │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ {                                                                │       │
│  │   "success": false,                                            │       │
│  │   "message": "Cart kosong"                                      │       │
│  │ }                                                                │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  400 - Saldo tidak cukup                                               │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ {                                                                │       │
│  │   "success": false,                                            │       │
│  │   "message": "Saldo wallet tidak mencukupi",                  │       │
│  │   "errors": {                                                  │       │
│  │     "balance": ["Saldo Anda: Rp 50.000"]                     │       │
│  │   }                                                            │       │
│  │ }                                                                │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  400 - Single-store violation                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ {                                                                │       │
│  │   "success": false,                                            │       │
│  │   "message": "Cart hanya boleh dari 1 toko"                   │       │
│  │ }                                                                │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  400 - Stok tidak cukup                                               │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ {                                                                │       │
│  │   "success": false,                                            │       │
│  │   "message": "Stok Nasi Goreng tidak mencukupi"               │       │
│  │ }                                                                │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
│  403 - Tidak punya role                                                │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ {                                                                │       │
│  │   "success": false,                                            │       │
│  │   "message": "Hanya buyer yang bisa checkout"                  │       │
│  │ }                                                                │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7.10 Ringkasan BAB 7

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RINGKASAN BAB 7                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📦 YANG SUDAH DIBUAT:                                                  │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                         │
│  DATABASE:                                                              │
│  ├── wallets          → Tabel wallet                                   │
│  ├── transactions     → Tabel transaksi                                │
│  ├── addresses        → Tabel alamat                                   │
│  ├── carts            → Tabel keranjang                               │
│  ├── cart_items       → Tabel item keranjang                            │
│  ├── orders           → Tabel pesanan                                  │
│  └── order_items      → Tabel item pesanan                             │
│                                                                         │
│  MODELS:                                                               │
│  ├── Wallet            → credit(), debit(), refund()                    │
│  ├── Transaction      → Type constants, scopes                        │
│  ├── Address          → CRUD, setAsDefault()                           │
│  ├── Cart             → Items, total                                  │
│  ├── CartItem         → Subtotal                                      │
│  ├── Order            → Status, generateOrderNumber()                 │
│  └── OrderItem        → Price at purchase                             │
│                                                                         │
│  CONTROLLERS:                                                          │
│  ├── WalletController  → show, transactions, topUp                    │
│  ├── AddressController → CRUD lengkap                                 │
│  ├── CartController   → CRUD + single-store check                     │
│  └── OrderController  → Checkout + lifecycle + seller/driver            │
│                                                                         │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                         │
│  💡 KONSEP PENTING:                                                    │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                         │
│  1. Single-Store Cart Rule                                             │
│     Cart hanya boleh dari 1 toko!                                        │
│                                                                         │
│  2. Price at Purchase                                                  │
│     Harga di-order-item = harga SAAT checkout                            │
│                                                                         │
│  3. Database Transaction                                              │
│     Checkout = semua berhasil atau semua gagal                            │
│                                                                         │
│  4. Order Status Lifecycle                                            │
│     packaging → waiting_shipper → shipping → completed                    │
│                                                                         │
│  5. Soft Delete Addresses                                             │
│     Alamat tidak dihapus, tapi perlu handle default                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7.11 Checklist BAB 7

- [ ] Migration: wallets, transactions, addresses, carts, cart_items, orders, order_items
- [ ] Model: Wallet, Transaction, Address, Cart, CartItem, Order, OrderItem
- [ ] Relasi di User Model
- [ ] Controller: WalletController
- [ ] Controller: AddressController
- [ ] Controller: CartController
- [ ] Controller: OrderController
- [ ] Routes: Semua endpoint
- [ ] Testing: Wallet (top up, cek saldo)
- [ ] Testing: Cart (tambah, update, hapus, single-store)
- [ ] Testing: Checkout flow
- [ ] Testing: Order cancellation dengan refund

---

**Lanjut ke BAB 8?** [Frontend - Dashboards](../08-frontend-dashboards/08-dashboards.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-13*
