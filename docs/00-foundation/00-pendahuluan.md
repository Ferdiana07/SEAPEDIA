# BAB 0: Fondasi & Perencanaan

> **Tujuan:** Memahami konsep fundamental dan mempelajari SEAPEDIA secara menyeluruh sebelum mulai coding

---

## 0.1 Apa itu SEAPEDIA?

### Gambaran Umum

```
┌─────────────────────────────────────────────────────────────────┐
│                        APAKAH SEAPEDIA?                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SEAPEDIA = Platform E-Commerce Multi-Role                      │
│                                                                  │
│  E-Commerce? = Marketplace online seperti Tokopedia, Shopee,     │
│                atau Grab Food - tempat orang beli dan jual      │
│                barang/jasa secara online.                        │
│                                                                  │
│  Multi-Role? = Dalam 1 platform, ada BANYAK jenis pengguna:   │
│                Admin, Seller, Buyer, Driver                     │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  COMPFEST SEAPEDIA = Tantangan teknis (technical challenge)    │
│  yang diadakan oleh COMPFEST (Competitive Programming Festival) │
│  dari BEM FASILKOM UI (Badan Eksekutif Mahasiswa                │
│  Fakultas Ilmu Komputer Universitas Indonesia)                  │
│                                                                  │
│  Tantangan ini terdiri dari 7 Level dengan total 100 poin      │
│  (+ bonus poin untuk UI dan Deployment)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### SEAPEDIA Dalam Kehidupan Sehari-hari

```
┌─────────────────────────────────────────────────────────────────┐
│                   ANALOGI: PASAR TRADISIONAL                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Di dunia nyata (Pasar Traditional):                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  👤 PEMBELI (Buyer)                                           │
│     → Orang yang mau beli barang                                 │
│     → Pergi ke pasar, pilih barang, bayar, bawa pulang         │
│                                                                  │
│  🏪 PENJUAL (Seller)                                           │
│  → Orang yang punya toko/ warung di pasar                      │
│  → Jualan barang, dapat uang                                   │
│                                                                  │
│  🚗 PENGANTAR (Driver)                                         │
│  → Orang yang antar barang ke rumah pembeli                    │
│  → Dapat ongkos antar                                         │
│                                                                  │
│  👔 PANITIA PASAR (Admin)                                     │
│  → Orang yang ngatur pasar                                     │
│  → Atur siapa boleh jualan, atur aturan, dll                  │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Di SEAPEDIA (Online):                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  👤 PEMBELI (Buyer)                                           │
│  → Buka app/website, pilih produk, checkout, bayar, barang     │
│    diantar                                                   │
│                                                                  │
│  🏪 PENJUAL (Seller)                                          │
│  → Buka dashboard seller, tambah produk, cek pesanan, kirim    │
│                                                                  │
│  🚗 PENGANTAR (Driver)                                        │
│  → Buka app driver, lihat pesanan yang mau diantar, antar      │
│                                                                  │
│  👔 ADMIN (Admin)                                              │
│  → Buka dashboard admin, manage semua user, semua pesanan        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.2 Peran-Peran dalam SEAPEDIA

### 4 Peran Utama

```
┌─────────────────────────────────────────────────────────────────┐
│                    4 PERAN DALAM SEAPEDIA                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    👤 BUYER                            │   │
│  │                                                          │   │
│  │  • Orang yang MEMBELI produk di marketplace              │   │
│  │  • Punya: Wallet (saldo), Cart, Alamat, Pesanan        │   │
│  │  • Aksi: Browse produk, tambah cart, checkout, review   │   │
│  │                                                          │   │
│  │  🔑 WAJIB punya role "buyer" untuk bisa belanja        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   🏪 SELLER                            │   │
│  │                                                          │   │
│  │  • Orang yang JUAL produk di marketplace                │   │
│  │  • Punya: Toko, Produk, Pesanan Masuk                  │   │
│  │  • Aksi: Buat toko, tambah produk, konfirmasi pesanan   │   │
│  │                                                          │   │
│  │  🔑 1 Seller = 1 Toko (nama toko harus UNIK)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   🚗 DRIVER                            │   │
│  │                                                          │   │
│  │  • Orang yang ANTAR pesanan ke pembeli                  │   │
│  │  • Punya: Daftar pesanan yang harus diantar             │   │
│  │  • Aksi: Lihat pesanan, ambil pesanan, konfirmasi antar│   │
│  │                                                          │   │
│  │  🔑 Driver = Kurir/ojol yang antar barang              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    👔 ADMIN                            │   │
│  │                                                          │   │
│  │  • Orang yang NGATUR sistem SEAPEDIA                    │   │
│  │  • Punya: Akses ke semua data                         │   │
│  │  • Aksi: Manage user, verifikasi seller, lihat semua      │   │
│  │          pesanan, dll                                   │   │
│  │                                                          │   │
│  │  🔑 Admin TIDAK bisa punya role lain (khusus admin)    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Aturan Penting Multi-Role

```
┌─────────────────────────────────────────────────────────────────┐
│                    ATURAN MULTI-ROLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  SATU USER BISA PUNYA BANYAK ROLE                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Budi bisa jadi Seller DAN Buyer sekaligus!                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ USER: Budi                                          │      │
│  │ ├── Role: Buyer    → Bisa belanja                   │      │
│  │ └── Role: Seller   → Bisa punya toko               │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  2️⃣  HANYA 1 ROLE YANG AKTIF SETIAP SAAT                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Budi login sebagai Buyer, dia HANYA bisa belanja.              │
│  Mau jualan? Switch role ke Seller dulu!                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ SESSION SEKARANG:                                    │      │
│  │ Active Role: Buyer    ← ← ← ← ← ← ← ← ← ← ← ← ←   │      │
│  │                                                        │      │
│  │ ⚡ Aksi yang tersedia:                               │      │
│  │    ✓ Browse produk                                   │      │
│  │    ✓ Checkout                                        │      │
│  │    ✗ Tambah produk (butuh role Seller)              │      │
│  │    ✗ Ambil pesanan (butuh role Driver)              │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  3️⃣  ADMIN BERBEDA                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Admin TIDAK bisa punya role lain.                             │
│  Admin murni, hanya untuk ngatur sistem.                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.3 Alur Bisnis Lengkap SEAPEDIA

### Gambaran Besar Alur

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     ALUR BISNIS UTAMA SEAPEDIA                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │   BUYER                                                                        │   │
│  │   1. Register/Login                                           │   │
│  │   2. Pilih role "Buyer"                                      │   │
│  │   3. Top-up wallet                                           │   │
│  │   4. Tambah alamat pengiriman                                │   │
│  │   5. Browse produk                                           │   │
│  │   6. Masukkan ke cart                                        │   │
│  │   7. Checkout                                                │   │
│  │   8. Bayar (wallet di-debit)                                 │   │
│  │   9. Pesanan dibuat → Status: "Sedang Dikemas"               │   │
│  │   10. Tunggu pesanan diantar                                 │   │
│  │   11. Pesanan datang                                         │   │
│  │   12. (Opsional) Beri review                                  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │   SELLER                                                                     │   │
│  │   1. Register/Login                                           │   │
│  │   2. Pilih role "Seller"                                      │   │
│  │   3. Buat toko (nama harus UNIK)                             │   │
│  │   4. Tambah produk ke toko                                    │   │
│  │   5. Dapat notifikasi pesanan masuk                           │   │
│  │   6. Konfirmasi & kemas pesanan                               │   │
│  │   7. Ganti status → "Menunggu Pengantar"                     │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │   DRIVER                                                                     │   │
│  │   1. Register/Login                                           │   │
│  │   2. Pilih role "Driver"                                      │   │
│  │   3. Lihat daftar pesanan yang perlu diantar                 │   │
│  │   4. Ambil pesanan                                            │   │
│  │   5. Ganti status → "Sedang Dikirim"                         │   │
│  │   6. Antar ke alamat pembeli                                  │   │
│  │   7. Ganti status → "Pesanan Selesai"                        │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Alur Detail: Buyer Membeli Produk

```
┌─────────────────────────────────────────────────────────────────┐
│               ALUR DETAIL: BUYER MEMBELI PRODUK                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 1: Persiapan (Sekali saja)                               │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  BUYER                    SEAPEDIA                        │   │
│  │     │                        │                            │   │
│  │     │  1. Register          │                            │   │
│  │     │───────────────────────>│ User dibuat               │   │
│  │     │                        │ Wallet dibuat otomatis     │   │
│  │     │                        │                            │   │
│  │     │  2. Pilih Role Buyer   │                            │   │
│  │     │───────────────────────>│ Aktifkan role buyer       │   │
│  │     │                        │                            │   │
│  │     │  3. Top-up Wallet      │                            │   │
│  │     │───────────────────────>│ Saldo bertambah           │   │
│  │     │<──────────────────────│                            │   │
│  │     │                        │                            │   │
│  │     │  4. Tambah Alamat      │                            │   │
│  │     │───────────────────────>│ Alamat disimpan           │   │
│  │     │                        │                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  STEP 2: Belanja (Berkali-kali)                               │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  BUYER                    TOKO SELLER                    │   │
│  │     │                        │                            │   │
│  │     │  5. Browse Produk       │                            │   │
│  │     │────────────────────────>│                            │   │
│  │     │<────────────────────────│ Daftar produk             │   │
│  │     │                        │                            │   │
│  │     │  6. Lihat Detail       │                            │   │
│  │     │────────────────────────>│                            │   │
│  │     │<────────────────────────│ Info produk + toko       │   │
│  │     │                        │                            │   │
│  │     │  7. Tambah ke Cart     │                            │   │
│  │     │────────────────────────>│ Cart item dibuat          │   │
│  │     │<────────────────────────│                            │   │
│  │     │                        │                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ⚠️  PERATURAN PENTING:                                        │
│  ─────────────────────────────────────────────────────────────  │
│  Cart hanya boleh berisi produk dari 1 TOKO yang SAMA!          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ❌ SALAH:                                               │   │
│  │     Cart punya:                                         │   │
│  │     • Produk dari Toko A (Nasi Goreng)                  │   │
│  │     • Produk dari Toko B (Ayam Geprek)                  │   │
│  │     → TIDAK BOLEH checkout! Harus 1 toko saja.       │   │
│  │                                                         │   │
│  │  ✅ BENAR:                                              │   │
│  │     Cart punya:                                         │   │
│  │     • Produk dari Toko A (Nasi Goreng)                  │   │
│  │     • Produk dari Toko A (Mie Ayam)                     │   │
│  │     → BOLEH checkout! Satu toko.                        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  STEP 3: Checkout                                             │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  BUYER                    SEAPEDIA                      │   │
│  │     │                        │                            │   │
│  │     │  8. Checkout            │                            │   │
│  │     │────────────────────────>│ 1. Cek saldo cukup?      │   │
│  │     │                        │                            │   │
│  │     │                        │ 2. Jika Ya:              │   │
│  │     │                        │    - Debit wallet         │   │
│  │     │                        │    - Kurangi stok produk  │   │
│  │     │                        │    - Buat order           │   │
│  │     │                        │    - Status: Packaging     │   │
│  │     │                        │                            │   │
│  │     │<────────────────────────│ Order berhasil!           │   │
│  │     │  Order ID: #12345     │                            │   │
│  │     │                        │                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  STEP 4: Tunggu Pesanan                                         │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  BUYER                    DRIVER                        │   │
│  │     │                        │                            │   │
│  │     │  Status: Packaging      │                            │   │
│  │     │  ┌───────────────┐    │                            │   │
│  │     │  │ Dikemas seller│    │                            │   │
│  │     │  └───────┬───────┘    │                            │   │
│  │     │          ▼            │                            │   │
│  │     │  Status: Waiting      │  9. Ambil pesanan          │   │
│  │     │  ┌───────────────┐    │<──────────────────────────│   │
│  │     │  │Menunggu driver│    │                            │   │
│  │     │  └───────┬───────┘    │                            │   │
│  │     │          ▼            │                            │   │
│  │     │  Status: Shipping     │  10. Antar barang         │   │
│  │     │  ┌───────────────┐    │─────────────────────────>│   │
│  │     │  │Sedang diantar │    │                            │   │
│  │     │  └───────┬───────┘    │                            │   │
│  │     │          ▼            │                            │   │
│  │     │  Status: Completed   │  11. Tiba di tujuan       │   │
│  │     │  ┌───────────────┐    │<──────────────────────────│   │
│  │     │  │Pesanan selesai│    │                            │   │
│  │     │  └───────────────┘    │                            │   │
│  │     │                        │                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Siklus Hidup Pesanan

```
┌─────────────────────────────────────────────────────────────────┐
│                    SIKLUS HIDUP PESANAN                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STATUS PESANAN DALAM BAHASA INDONESIA:                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ┌─────────────┐                                                │
│  │   PENDING   │ ← Initial state (bila ada)                     │
│  └──────┬──────┘                                                │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                            │
│  │ SEDANG DIKEMAS  │  ← Seller收到 pesanan, lagi kemas        │
│  │  (Packaging)   │      barang                                │
│  └────────┬────────┘                                            │
│           │                                                      │
│           │ Seller konfirmasi "Sudah dikemas"                    │
│           ▼                                                      │
│  ┌──────────────────────┐                                        │
│  │ MENUNGGU PENGANTAR   │  ← Menunggu driver ambil pesanan    │
│  │ (Waiting for Shipper)│                                        │
│  └────────┬─────────────┘                                        │
│           │                                                      │
│           │ Driver ambil pesanan                                  │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  SEDANG DIKIRIM │  ← Driver sedang antar ke alamat         │
│  │   (Shipping)    │      pembeli                               │
│  └────────┬────────┘                                            │
│           │                                                      │
│           │ Driver konfirmasi "Sudah sampai"                     │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ PESANAN SELESAI │  ← Transaksi selesai!                     │
│  │  (Completed)    │      Buyer bisa kasih review               │
│  └─────────────────┘                                            │
│           │                                                      │
│           │ Opsional: Jika ada masalah                          │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │  DIKEMBALIKAN   │  ← Barang dikembalikan                   │
│  │   (Returned)    │      (refund ke wallet)                   │
│  └─────────────────┘                                            │
│                                                                  │
│  STATUS FLOW:                                                   │
│  ────────────────                                               │
│                                                                  │
│  Packaging ──► Waiting ──► Shipping ──► Completed             │
│    Shipper       Shipper                         │              │
│                                                  ▼              │
│                                             Returned           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.4 Fitur-Fitur Utama SEAPEDIA

### Fitur Berdasarkan Role

```
┌─────────────────────────────────────────────────────────────────┐
│               FITUR BERDASARKAN ROLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👤 GUEST (Belum Login)                                        │
│  ─────────────────────────────────────────────────────────────  │
│  • Lihat Landing Page                                          │
│  • Lihat Daftar Produk (marketplace)                           │
│  • Lihat Detail Produk                                         │
│  • Baca Review Produk                                          │
│  • Tulis Review (tanpa harus login)                           │
│  • Register/Login                                               │
│                                                                  │
│  ✗ TIDAK BISA: Checkout, lihat dashboard, dll                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👤 BUYER                                                       │
│  ─────────────────────────────────────────────────────────────  │
│  • Semua yang Guest bisa                                       │
│  • Manage Profile                                              │
│  • Top-up Wallet                                               │
│  • Lihat Saldo Wallet                                          │
│  • Lihat Riwayat Transaksi                                     │
│  • Tambah/Edit/Hapus Alamat Pengiriman                         │
│  • Tambah/Hapus/Update Item di Cart                           │
│  • Checkout (1 toko saja per checkout)                         │
│  • Lihat Daftar Pesanan                                        │
│  • Track Status Pesanan                                         │
│  • Beri Review Produk                                          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏪 SELLER                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  • Semua yang Guest bisa (browse sebagai user biasa)          │
│  • Buat/Update Profil Toko                                      │
│  • Tambah/Edit/Hapus Produk                                    │
│  • Lihat Daftar Produk                                         │
│  • Lihat Pesanan Masuk                                         │
│  • Konfirmasi Pesanan (Packaging)                              │
│  • Update Status Pesanan (kirim ke driver)                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🚗 DRIVER                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  • Semua yang Guest bisa                                       │
│  • Lihat Daftar Pesanan "Menunggu Pengantar"                  │
│  • Ambil Pesanan (pickup)                                      │
│  • Lihat Detail Pesanan (alamat tujuan)                        │
│  • Update Status Pesanan (sedang diantar)                      │
│  • Konfirmasi Pesanan Selesai (delivered)                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👔 ADMIN                                                       │
│  ─────────────────────────────────────────────────────────────  │
│  • Akses ke semua data                                         │
│  • Manage Semua User                                           │
│  • Verifikasi/Persetujuan Seller baru                          │
│  • Lihat Semua Pesanan                                         │
│  • Lihat Semua Transaksi                                      │
│  • Dashboard Analytics (jika ada)                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Fitur Utama dalam Detail

```
┌─────────────────────────────────────────────────────────────────┐
│                   FITUR UTAMA (CRUD Operations)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📝 AUTHENTICATION (Login/Register)                            │
│  ─────────────────────────────────────────────────────────────  │
│  • Register dengan email & password                             │
│  • Login dengan email & password                                │
│  • Logout                                                       │
│  • Session dengan role aktif                                    │
│  • Password di-hash (tidak disimpan plain text)               │
│                                                                  │
│  🔐 ROLE MANAGEMENT                                            │
│  ─────────────────────────────────────────────────────────────  │
│  • User bisa punya multiple role (buyer, seller, driver)       │
│  • Hanya 1 role yang aktif setiap saat                         │
│  • Switch role saat session                                    │
│  • Admin punya role khusus (tidak bisa punya role lain)        │
│                                                                  │
│  💰 WALLET SYSTEM                                              │
│  ─────────────────────────────────────────────────────────────  │
│  • Setiap user punya 1 wallet                                  │
│  • Saldo awal: 0                                               │
│  • Top-up (dummy/manual)                                      │
│  • Debit saat checkout                                         │
│  • Refund saat pesanan dikembalikan                           │
│  • Riwayat transaksi                                          │
│                                                                  │
│  🛒 CART SYSTEM                                                │
│  ─────────────────────────────────────────────────────────────  │
│  • Setiap buyer punya 1 cart                                   │
│  • Tambah produk ke cart                                      │
│  • Update jumlah                                               │
│  • Hapus item                                                  │
│  ⚠️ Single-store rule: Cart hanya dari 1 toko!              │
│                                                                  │
│  📦 ORDER SYSTEM                                               │
│  ─────────────────────────────────────────────────────────────  │
│  • Checkout dari cart                                          │
│  • Generate order number unik                                   │
│  • Kurangi stok produk                                         │
│  • Debit wallet                                                │
│  • Order lifecycle management                                   │
│                                                                  │
│  ⭐ REVIEW SYSTEM                                              │
│  ─────────────────────────────────────────────────────────────  │
│  • Guest & logged-in user bisa kasih review                    │
│  • Rating 1-5 bintang                                          │
│  • Komentar opsional                                           │
│  • 1 user = 1 review per produk                              │
│                                                                  │
│  🚚 DELIVERY SYSTEM                                            │
│  ─────────────────────────────────────────────────────────────  │
│  • Driver lihat pesanan yang perlu diantar                     │
│  • Driver ambil pesanan                                         │
│  • Update status pesanan (pickup → shipping → delivered)     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.5 Aturan Bisnis (Business Rules)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ATURAN BISNIS UTAMA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  MULTI-ROLE                                               │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ 1 User bisa punya role: Buyer + Seller + Driver    │   │
│  │  ✓ 1 User bisa punya role: Buyer saja                  │   │
│  │  ✓ 1 User bisa punya role: Seller saja                │   │
│  │  ✗ Admin TIDAK bisa punya role lain                    │   │
│  │  ✓ Setiap user HARUS punya 1 role aktif saat login     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  2️⃣  SELLER & STORE                                           │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ 1 Seller = 1 Toko                                   │   │
│  │  ✓ Nama toko HARUS UNIK (tidak boleh sama)             │   │
│  │  ✓ Seller bisa punya banyak produk                      │   │
│  │  ✓ Seller bisa lihat semua produknya                   │   │
│  │  ✓ Seller bisa lihat pesanan masuk                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  3️⃣  BUYER & WALLET                                           │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ Setiap user otomatis punya 1 wallet saat register  │   │
│  │  ✓ Saldo awal = 0                                      │   │
│  │  ✓ Buyer bisa top-up wallet                            │   │
│  │  ✓ Saldo harus CUKUP saat checkout                     │   │
│  │  ✓ Checkout = debit wallet + buat order                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  4️⃣  CART & CHECKOUT                                         │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ⚠️ ATURAN KRUSIAL:                                    │   │
│  │  Cart hanya boleh berisi produk dari 1 TOKO yang SAMA  │   │
│  │                                                         │   │
│  │  ❌ TIDAK BOLEH:                                       │   │
│  │     Cart A = Produk Toko X + Produk Toko Y            │   │
│  │                                                         │   │
│  │  ✅ BOLEH:                                             │   │
│  │     Cart A = Produk Toko X (3 item)                   │   │
│  │                                                         │   │
│  │  💡 SOLUSI:                                            │   │
│  │     Jika mau beli dari toko lain, checkout dulu       │   │
│  │     cart yang ada, baru tambah dari toko baru.        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  5️⃣  PESANAN (ORDER)                                           │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ 1 Order = 1 Toko (single-store checkout)           │   │
│  │  ✓ Order punya status lifecycle                         │   │
│  │  ✓ Stok produk dikurangi saat checkout                 │   │
│  │  ✓ Driver_id nullable sampai ada yang ambil            │   │
│  │  ✓ 1 Order punya banyak OrderItem                      │   │
│  │  ✓ price_at_purchase = harga SAAT checkout (bukan saat  │   │
│  │                      ini) karena harga bisa berubah      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  6️⃣  REVIEW                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ Guest BOLEH kasih review                             │   │
│  │  ✓ Logged-in user BOLEH kasih review                   │   │
│  │  ✓ Rating: 1-5 bintang                                 │   │
│  │  ✓ Komentar: opsional                                  │   │
│  │  ✓ 1 User = maks 1 review per produk                 │   │
│  │  ✓ Review muncul di landing page & detail produk       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  7️⃣  GUEST ACCESS                                              │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✓ Guest bisa: Browse produk, lihat detail, baca     │   │
│  │               review, kasih review, login/register      │   │
│  │  ✗ Guest TIDAK bisa: Checkout, lihat dashboard,       │   │
│  │                     manage cart, dll                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.6 Level/Tahap Pengerjaan SEAPEDIA

### 7 Level Tantangan

```
┌─────────────────────────────────────────────────────────────────┐
│                   7 LEVEL SEAPEDIA                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 RINGKASAN POIN:                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Level 1:  20 poin  │ Public Marketplace + Auth + Reviews     │
│  Level 2:  15 poin  │ Seller Experience                       │
│  Level 3:  20 poin  │ Buyer Wallet + Cart + Checkout          │
│  Level 4:  15 poin  │ Advanced Features                        │
│  Level 5:  10 poin  │ Delivery System                         │
│  Level 6:  10 poin  │ Additional Features                      │
│  Level 7:  10 poin  │ Security Hardening                       │
│  ─────────────────────────────────────────────────────────────  │
│  TOTAL:  100 poin + Bonus (UI + Deployment)                    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LEVEL 1: Welcome to SEAPEDIA! (20 poin)                      │
│  ─────────────────────────────────────────────────────────────  │
│  • Landing Page                                                │
│  • Product Listing Page                                        │
│  • Product Detail Page (read-only)                             │
│  • Login/Register Pages                                        │
│  • Authentication + Role Management                            │
│  • Public Reviews                                              │
│  • UI Foundations (Button, Input, Card, Navbar, Footer)      │
│  • Dashboard Shells                                           │
│                                                                  │
│  LEVEL 2: Seller Experience (15 poin)                        │
│  ─────────────────────────────────────────────────────────────  │
│  • Store Management (Create/Update Store)                      │
│  • Product Management (CRUD Products)                          │
│  • Seller Dashboard                                           │
│  • Public Catalog Connection                                   │
│                                                                  │
│  LEVEL 3: Buyer Wallet, Cart, Checkout (20 poin)             │
│  ─────────────────────────────────────────────────────────────  │
│  • Wallet & Balance Management                                 │
│  • Address Management                                          │
│  • Cart Management (Single-store enforcement)                 │
│  • Checkout & Order Creation                                   │
│  • Basic Order Flow                                           │
│                                                                  │
│  LEVEL 4: Advanced Features (15 poin)                         │
│  ─────────────────────────────────────────────────────────────  │
│  • Advanced Store Features                                     │
│  • Advanced Product Features                                  │
│  • Advanced Cart/Checkout Features                            │
│  • Advanced Review System                                     │
│                                                                  │
│  LEVEL 5: Delivery System (10 poin)                           │
│  ─────────────────────────────────────────────────────────────  │
│  • Driver Registration                                        │
│  • Order Assignment                                           │
│  • Delivery Flow                                              │
│                                                                  │
│  LEVEL 6: Additional Features (10 poin)                       │
│  ─────────────────────────────────────────────────────────────  │
│  • Advanced Filtering/Sorting                                  │
│  • Notifications                                             │
│  • Reporting & Analytics                                      │
│                                                                  │
│  LEVEL 7: Security Hardening (10 poin)                        │
│  ─────────────────────────────────────────────────────────────  │
│  • Input Validation & Sanitization                            │
│  • Security Best Practices                                    │
│  • Performance Optimization                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.7 Contoh Scenario Nyata

### Scenario 1: Budi Mau Jual Makanan

```
┌─────────────────────────────────────────────────────────────────┐
│         SCENARIO 1: BUDI MAU JUAL MAKANAN                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DAY 1: Budi Register dan Setup                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Budi: "Aku mau buka toko makanan!"                             │
│                                                                  │
│  1. Register di SEAPEDIA                                        │
│     → Dapat email: budi@email.com                               │
│     → Dapat password (hashed)                                  │
│     → Otomatis punya wallet (saldo: 0)                          │
│                                                                  │
│  2. Pilih Role "Seller"                                         │
│     → Role buyer juga ditambahkan (karena 1 user bisa multi)   │
│                                                                  │
│  3. Aktifkan Role "Seller"                                      │
│                                                                  │
│  4. Buat Toko                                                   │
│     → Nama: "Dapur Budi" (harus UNIK!)                         │
│     → Deskripsi: "Makanan rumahan enak"                         │
│     → Alamat: "Jl. Merdeka No. 10"                             │
│                                                                  │
│  DAY 2: Budi Tambah Produk                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Budi membuka dashboard Seller:                                  │
│                                                                  │
│  5. Tambah Produk 1                                             │
│     → Nama: "Nasi Goreng Spesial"                              │
│     → Harga: Rp 25.000                                         │
│     → Stok: 50                                                 │
│                                                                  │
│  6. Tambah Produk 2                                             │
│     → Nama: "Ayam Geprek"                                       │
│     → Harga: Rp 22.000                                         │
│     → Stok: 30                                                 │
│                                                                  │
│  DAY 3: Pesanan Masuk!                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Budi buka dashboard:                                           │
│                                                                  │
│  7. Lihat Pesanan Masuk                                         │
│     → Pesanan #001 dari "Ani"                                  │
│     → Items: Nasi Goreng (2x), Ayam Geprek (1x)               │
│     → Total: Rp 72.000                                         │
│                                                                  │
│  8. Budi kemas pesanan                                          │
│     → Update status: "Sedang Dikemas" → "Menunggu Pengantar"   │
│                                                                  │
│  9. Driver ambil pesanan                                        │
│     → Driver "Caca" ambil pesanan                              │
│     → Update status: "Sedang Dikirim"                          │
│                                                                  │
│  10. Pesanan selesai!                                            │
│      → Status: "Pesanan Selesai"                               │
│      → Saldo wallet Budi...?                                    │
│      → Wait, seller dapat uang dari mana?                      │
│      → 💡 Untuk simplicity, SEAPEDIA ini CUMA wallet buyer    │
│        Seller dianggap sudah dapat bayaran di luar sistem       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Scenario 2: Ani Mau Belanja

```
┌─────────────────────────────────────────────────────────────────┐
│         SCENARIO 2: ANI MAU BELANJA MAKANAN                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DAY 1: Ani Register                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Ani: "Aku mau beli makanan di SEAPEDIA!"                       │
│                                                                  │
│  1. Register di SEAPEDIA                                        │
│     → Email: ani@email.com                                      │
│     → Dapat wallet otomatis (saldo: 0)                          │
│                                                                  │
│  2. Pilih Role "Buyer"                                         │
│                                                                  │
│  3. Top-up Wallet                                               │
│     → Ani transfer ke rekening admin                           │
│     → Admin confirm                                             │
│     → Saldo Ani: Rp 500.000                                    │
│                                                                  │
│  4. Tambah Alamat                                              │
│     → Label: "Rumah"                                            │
│     → Penerima: "Ani"                                          │
│     → HP: "081234567890"                                       │
│     → Alamat: "Jl. Mawar No. 5"                               │
│                                                                  │
│  DAY 2: Ani Belanja                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Ani browse marketplace:                                        │
│                                                                  │
│  5. Lihat Produk                                                │
│     → Ketemu "Nasi Goreng Spesial" dari "Dapur Budi"         │
│     → Harga: Rp 25.000                                         │
│     → Stok: 50 (tersedia)                                      │
│                                                                  │
│  6. Ani tambah ke cart                                         │
│     → Item: Nasi Goreng (2x) = Rp 50.000                      │
│                                                                  │
│  7. Lihat cart lagi                                            │
│     → Mau tambah "Mie Ayam" dari toko berbeda?                │
│     → ⚠️ ERROR! Cart hanya boleh dari 1 toko!                 │
│                                                                  │
│  8. Ani checkout                                               │
│     → Pilih alamat: "Rumah"                                    │
│     → Total: Rp 50.000                                         │
│     → Konfirmasi Bayar                                         │
│                                                                  │
│  9. Wallet Ani di-debit                                        │
│     → Saldo sebelum: Rp 500.000                               │
│     → Saldo setelah: Rp 450.000                                │
│                                                                  │
│  10. Pesanan dibuat!                                            │
│      → Order #001                                              │
│      → Status: "Sedang Dikemas"                               │
│                                                                  │
│  DAY 3: Pesanan Tiba                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  11. Ani track pesanan                                          │
│      → Status: Packaging → Waiting Shipper → Shipping         │
│                                                                  │
│  12. Pesanan tiba!                                              │
│      → Driver "Caca" antar ke alamat Ani                       │
│      → Status: "Pesanan Selesai"                              │
│                                                                  │
│  13. Ani kasih review                                           │
│      → Rating: ⭐⭐⭐⭐⭐ (5)                               │
│      → Komentar: "Enak banget! Pengiriman cepat!"            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.8 Perbandingan: Guest vs User vs Role

```
┌─────────────────────────────────────────────────────────────────┐
│             AKSES BERDASARKAN STATUS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    │ GUEST  │ LOGGED IN │ BUYER │ SELLER │DRIV│
│  ──────────────────┼────────┼───────────┼───────┼────────┼────┤
│  Lihat Landing     │   ✓    │     ✓     │   ✓   │   ✓    │  ✓ │
│  Browse Produk      │   ✓    │     ✓     │   ✓   │   ✓    │  ✓ │
│  Lihat Detail       │   ✓    │     ✓     │   ✓   │   ✓    │  ✓ │
│  Baca Review        │   ✓    │     ✓     │   ✓   │   ✓    │  ✓ │
│  Tulis Review       │   ✓    │     ✓     │   ✓   │   ✓    │  ✓ │
│  ──────────────────┼────────┼───────────┼───────┼────────┼────┤
│  Login/Register     │   ✓    │     -     │   -   │   -    │  - │
│  Lihat Profile      │   ✗    │     ✓     │   ✓   │   ✓    │  ✓ │
│  ──────────────────┼────────┼───────────┼───────┼────────┼────┤
│  Top-up Wallet     │   ✗    │     ✗     │   ✓   │   ✗    │  ✗ │
│  Lihat Saldo       │   ✗    │     ✗     │   ✓   │   ✗    │  ✗ │
│  ──────────────────┼────────┼───────────┼───────┼────────┼────┤
│  Tambah Cart       │   ✗    │     ✗     │   ✓   │   ✗    │  ✗ │
│  Checkout           │   ✗    │     ✗     │   ✓   │   ✗    │  ✗ │
│  Lihat Pesanan     │   ✗    │     ✗     │   ✓   │   ✓    │  ✓ │
│  ──────────────────┼────────┼───────────┼───────┼────────┼────┤
│  Buat Toko         │   ✗    │     ✗     │   ✗   │   ✓    │  ✗ │
│  Tambah Produk     │   ✗    │     ✗     │   ✗   │   ✓    │  ✗ │
│  Lihat Pesanan Ms  │   ✗    │     ✗     │   ✗   │   ✓    │  ✗ │
│  Konfirmasi Pesanan│   ✗    │     ✗     │   ✗   │   ✓    │  ✗ │
│  ──────────────────┼────────┼───────────┼───────┼────────┼────┤
│  Ambil Pesanan     │   ✗    │     ✗     │   ✗   │   ✗    │  ✓ │
│  Update Delivery   │   ✗    │     ✗     │   ✗   │   ✗    │  ✓ │
│  ──────────────────┼────────┼───────────┼───────┼────────┼────┤
│  Manage All Users  │   ✗    │     ✗     │   ✗   │   ✗    │  ✗ │
│  View All Orders   │   ✗    │     ✗     │   ✗   │   ✗    │  ✗ │
│  Admin Dashboard   │   ✗    │     ✗     │   ✗   │   ✗    │  ✗ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.9 Ringkasan: SEAPEDIA

```
┌─────────────────────────────────────────────────────────────────┐
│                    RINGKASAN SEAPEDIA                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏪 APA ITU SEAPEDIA?                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Platform E-Commerce Multi-Role untuk kompetisi COMPFEST        │
│  dengan 4 jenis pengguna: Admin, Seller, Buyer, Driver         │
│                                                                  │
│  👥 SIAPA YANG TERLIBAT?                                        │
│  ─────────────────────────────────────────────────────────────  │
│  • Admin      → Mengatur sistem                                 │
│  • Seller     → Menjual produk (1 seller = 1 toko)            │
│  • Buyer      → Membeli produk (punya wallet, cart, alamat)    │
│  • Driver     → Mengantar pesanan                              │
│  • Guest      → Bisa lihat produk & kasih review               │
│                                                                  │
│  🔑 ATURAN UTAMA                                               │
│  ─────────────────────────────────────────────────────────────  │
│  • 1 User = banyak role (kecuali admin)                        │
│  • 1 Role aktif setiap saat                                    │
│  • 1 Seller = 1 Toko (nama UNIK)                              │
│  • Cart = 1 Toko saja (single-store checkout)                  │
│  • Wallet = untuk buyer saja                                   │
│                                                                  │
│  📊 SIKLUS PESANAN                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Packaging → Waiting Shipper → Shipping → Completed            │
│       (Seller)      (Driver)      (Driver)                      │
│                                                                  │
│  🎯 TARGET                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  7 Level, 100 Poin (+ Bonus UI & Deployment)                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.10 Apa itu Full-Stack Development?

> **Catatan:** Bagian ini melanjutkan dengan konsep teknis yang sudah ada sebelumnya.

### Definisi Singkat

**Full-Stack Development** = Kemampuan membangun aplikasi secara lengkap, dari tampilan depan (Frontend) hingga logika di belakang layar (Backend), termasuk database.

### Analogi Sederhana: Restaurant

```
┌────────────────────────────────────────────────────────────────┐
│                         RESTORAN                                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👤 CUSTOMER (User)                                            │
│     │                                                           │
│     │ "Mau pesan nasi goreng"                                  │
│     ▼                                                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  PELAYAN (Frontend - React)                             │   │
│  │  - Menampilkan menu (UI)                                 │   │
│  │  - Menerima pesanan dari customer                        │   │
│  │  - Menyajikan makanan ke customer                        │   │
│  │  - Menerima pembayaran                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│     │                                                           │
│     │ "1 nasi goreng, meja 5"                                 │
│     ▼                                                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  DAPUR (Backend - Laravel)                               │   │
│  │  - Menerima pesanan dari pelayan                         │   │
│  │  - Memasak makanan (business logic)                      │   │
│  │  - Mengecek stok bahan                                   │   │
│  │  - Menyiapkan tagihan                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│     │                                                           │
│     │ Ambil bahan dari...                                     │
│     ▼                                                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  GUDANG (Database - MySQL)                               │   │
│  │  - Menyimpan stok bahan makanan                         │   │
│  │  - Menyimpan resep                                      │   │
│  │  - Menyimpan daftar harga                               │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Teknologi yang Digunakan

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| **Frontend** | React + Tailwind CSS | Tampilan & interaksi user |
| **Backend** | Laravel (PHP) | Logika aplikasi, API |
| **Database** | MySQL | Penyimpanan data |
| **Server** | PHP built-in / Apache / Nginx | Menjalankan Laravel |

---

## 0.2 Arsitektur Client-Server

### Arsitektur SEAPEDIA

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SEAPEDIA ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│     ┌─────────────────────────────────────────────────────────────┐     │
│     │                      USER'S BROWSER                          │     │
│     │  ┌─────────────────────────────────────────────────────────┐│     │
│     │  │                  REACT APPLICATION                      ││     │
│     │  │                                                          ││     │
│     │  │   ┌──────────┐  ┌──────────┐  ┌──────────┐            ││     │
│     │  │   │ Landing  │  │ Products │  │   Cart   │            ││     │
│     │  │   │  Page    │  │  Page    │  │   Page   │            ││     │
│     │  │   └──────────┘  └──────────┘  └──────────┘            ││     │
│     │  │                                                          ││     │
│     │  │   ┌──────────┐  ┌──────────┐  ┌──────────┐            ││     │
│     │  │   │ Seller   │  │  Buyer   │  │ Driver   │            ││     │
│     │  │   │Dashboard │  │Dashboard │  │Dashboard │            ││     │
│     │  │   └──────────┘  └──────────┘  └──────────┘            ││     │
│     │  │                                                          ││     │
│     │  └─────────────────────────────────────────────────────────┘│     │
│     └────────────────────────────┬────────────────────────────────┘     │
│                                  │                                        │
│                                  │ HTTP Request (JSON)                   │
│                                  │ e.g., GET /api/products               │
│                                  ▼                                        │
│     ┌─────────────────────────────────────────────────────────────┐     │
│     │                    LARAVEL BACKEND                           │     │
│     │  ┌─────────────────────────────────────────────────────────┐│     │
│     │  │                    API ROUTES                           ││     │
│     │  │   Route::get('/products', [ProductController::class,    ││     │
│     │  │                          'index']);                     ││     │
│     │  └─────────────────────────────────────────────────────────┘│     │
│     │  ┌─────────────────────────────────────────────────────────┐│     │
│     │  │                 CONTROLLERS                             ││     │
│     │  │   ProductController                                     ││     │
│     │  │   - index()    → daftar produk                         ││     │
│     │  │   - store()    → buat produk baru                      ││     │
│     │  │   - show()     → detail produk                        ││     │
│     │  │   - update()   → update produk                        ││     │
│     │  │   - destroy()  → hapus produk                         ││     │
│     │  └─────────────────────────────────────────────────────────┘│     │
│     │  ┌─────────────────────────────────────────────────────────┐│     │
│     │  │                   MODELS                                ││     │
│     │  │   Product (connects to products table)                 ││     │
│     │  │   Store, User, Order, etc.                            ││     │
│     │  └─────────────────────────────────────────────────────────┘│     │
│     │  ┌─────────────────────────────────────────────────────────┐│     │
│     │  │               BUSINESS LOGIC                            ││     │
│     │  │   - Validasi input                                      ││     │
│     │  │   - Hitung total checkout                               ││     │
│     │  │   - Kurangi stok                                        ││     │
│     │  │   - Generate order                                      ││     │
│     │  └─────────────────────────────────────────────────────────┘│     │
│     └────────────────────────────┬────────────────────────────────┘     │
│                                  │                                        │
│                                  │ SQL Query                              │
│                                  ▼                                        │
│     ┌─────────────────────────────────────────────────────────────┐     │
│     │                        MySQL DATABASE                        │     │
│     │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │     │
│     │  │  users   │  │ products │  │  stores  │  │  orders  │  │     │
│     │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │     │
│     │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │     │
│     │  │  carts   │  │  orders  │  │ wallets  │  │ reviews  │  │     │
│     │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │     │
│     └─────────────────────────────────────────────────────────────┘     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Alur Request-Response

```
1. User klik tombol "Lihat Produk"
        │
        ▼
2. React kirim HTTP GET ke /api/products
        │
        ▼
3. Laravel terima request
        │
        ▼
4. Laravel cek: "Ada route yang match?"
   Route: GET /products → ProductController@index
        │
        ▼
5. ProductController.index() dijalankan
        │
        ▼
6. Model Product ambil data dari database
   SELECT * FROM products;
        │
        ▼
7. Data dikembalikan ke controller
        │
        ▼
8. Controller return JSON response
   return response()->json(['data' => $products]);
        │
        ▼
9. React terima JSON
        │
        ▼
10. React update state & render daftar produk
```

---

## 0.3 Database: Konsep & Desain

### 0.3.1 Apa itu Database?

**Database** = Kumpulan data yang terorganisir dan disimpan secara sistematis.

### Analoginya dengan Excel

```
┌─────────────────────────────────────────────────────────────────┐
│                        EXCEL vs DATABASE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EXCEL:                        DATABASE:                        │
│  ┌──────────────────┐          ┌──────────────────────┐        │
│  │ A        │ B     │          │    users table       │        │
│  ├──────────┼───────┤          ├──────────────────────┤        │
│  │ Nama     │ Usia  │          │ id │ name │ email   │        │
│  ├──────────┼───────┤          ├──────────────────────┤        │
│  │ Budi     │ 25    │          │ 1  │ Budi │ budi@.. │        │
│  │ Anita    │ 30    │          │ 2  │ Anita| anita@.│        │
│  │ Chandra  │ 28    │          │ 3  │Chandr│ chand@.│        │
│  └──────────────────┘          └──────────────────────┘        │
│                                                                  │
│  Workbook = Database                                            │
│  Sheet    = Table                                                │
│  Row      = Record                                               │
│  Column   = Field/Column                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.3.2 Tipe Data Umum di Database

```sql
-- INTEGER / INT
-- Untuk bilangan bulat: 1, 2, 100, 999
stock INT

-- DECIMAL / NUMERIC
-- Untuk bilangan desimal (uang): 99.99, 1500.00
price DECIMAL(10,2)   -- 10 digit total, 2 di belakang koma

-- VARCHAR / STRING
-- Untuk teks pendek: nama, email, telepon
name VARCHAR(255)

-- TEXT
-- Untuk teks panjang: deskripsi produk, komentar
description TEXT

-- BOOLEAN
-- Untuk ya/tidak: true/false, 1/0
is_active BOOLEAN

-- DATE / DATETIME / TIMESTAMP
-- Untuk tanggal dan waktu
created_at DATETIME
birth_date DATE

-- JSON
-- Untuk data terstruktur dalam teks
metadata JSON
```

### 0.3.3 Primary Key (PK) & Foreign Key (FK)

```sql
┌─────────────────────────────────────────────────────────────────┐
│                        PRIMARY KEY (PK)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Primary Key = Kolom yang UNIK mengidentifikasi setiap baris    │
│                                                                  │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ id (PK) │ name     │ email                            │      │
│  ├─────────┼──────────┼──────────────────────────────────┤      │
│  │ 1       │ Budi     │ budi@email.com     ← PK=1        │      │
│  │ 2       │ Anita    │ anita@email.com    ← PK=2        │      │
│  │ 3       │ Chandra  │ chandra@email.com  ← PK=3       │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                  │
│  ✓ Setiap baris punya ID unik                                   │
│  ✓ Tidak boleh ada ID yang sama                                  │
│  ✓ Tidak boleh NULL                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       FOREIGN KEY (FK)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Foreign Key = Kolom yang mereferensi Primary Key di tabel lain │
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────────────┐      │
│  │    stores        │         │       products          │      │
│  ├──────────────────┤         ├──────────────────────────┤      │
│  │ id (PK) ←────────│─────────│ store_id (FK)           │      │
│  │ name             │         │ id (PK)                 │      │
│  │ owner            │         │ name                    │      │
│  └──────────────────┘         │ price                    │      │
│                               └──────────────────────────┘      │
│                                                                  │
│  "Produk ini milik toko yang mana?" → cek store_id              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.3.4 Tipe Relasi

```sql
┌─────────────────────────────────────────────────────────────────┐
│                         TIPE RELASI                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  ONE-TO-ONE (1:1)                                           │
│  ─────────────────────────────────────────────────────────────  │
│  Setiap user punya 1 wallet                                     │
│                                                                  │
│      ┌──────────┐            ┌──────────┐                      │
│      │  users  │─────────────│ wallets  │                      │
│      └──────────┘    1:1     └──────────┘                      │
│                                                                  │
│      user_id di wallets = id di users                          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  ONE-TO-MANY (1:N)                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Satu toko punya banyak produk                                  │
│                                                                  │
│      ┌──────────┐            ┌──────────┐                       │
│      │  stores  │───────────<│ products │                       │
│      └──────────┘    1:N    └──────────┘                       │
│                                    ▲                            │
│                                    │                            │
│                              ┌──────────┐                       │
│                              │ products │                       │
│                              └──────────┘                       │
│                                                                  │
│      store_id di products = id di stores                       │
│      (1 store, banyak products)                                 │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  MANY-TO-MANY (N:N)                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Satu order punya banyak produk                                 │
│  Satu produk bisa ada di banyak order                          │
│  BUTUH TABEL PENGHUBUNG (pivot table)                           │
│                                                                  │
│      ┌──────────┐     ┌──────────────┐     ┌──────────┐        │
│      │ orders   │─────│ order_items  │─────│ products │        │
│      └──────────┘     └──────────────┘     └──────────┘        │
│       (N)                 (pivot)              (N)               │
│                                                                  │
│      order_id + product_id = Foreign Key di order_items        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.4 API & RESTful Design

### 0.4.1 Apa itu API?

```
┌─────────────────────────────────────────────────────────────────┐
│                           APA ITU API?                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API = Application Programming Interface                        │
│                                                                  │
│  Sederhananya: Cara dua aplikasi BERBICARA satu sama lain       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   APLIKASI A                     APLIKASI B            │   │
│  │   ┌─────────────┐               ┌─────────────┐        │   │
│  │   │             │◄──── API ────►│             │        │   │
│  │   │   React     │               │   Laravel   │        │   │
│  │   │  (Frontend) │               │  (Backend)  │        │   │
│  │   └─────────────┘               └─────────────┘        │   │
│  │                                                         │   │
│  │   "Kirim data ini"              "Oke, saya proses"    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.4.2 HTTP Methods (Verbs)

```sql
┌─────────────────────────────────────────────────────────────────┐
│                        HTTP METHODS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GET    → AMBIL data (READ)                                    │
│           GET /api/products     → Dapat semua produk            │
│           GET /api/products/1   → Dapat produk ID 1            │
│                                                                  │
│  POST   → BUAT data baru (CREATE)                              │
│           POST /api/products    → Buat produk baru              │
│                                                                  │
│  PUT    → UPDATE seluruh data (UPDATE)                         │
│           PUT /api/products/1   → Update produk ID 1           │
│                                                                  │
│  PATCH  → UPDATE sebagian data (PARTIAL UPDATE)                │
│           PATCH /api/products/1 → Update sebagian produk ID 1  │
│                                                                  │
│  DELETE → HAPUS data (DELETE)                                 │
│           DELETE /api/products/1 → Hapus produk ID 1           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.4.3 HTTP Status Codes

```sql
┌─────────────────────────────────────────────────────────────────┐
│                      HTTP STATUS CODES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ 200 OK              → Request berhasil, data ditemukan      │
│  ✅ 201 Created         → Data baru berhasil dibuat             │
│  ✅ 204 No Content      → Berhasil, tapi tidak ada data返回    │
│                                                                  │
│  ⚠️ 400 Bad Request     → Input dari client tidak valid         │
│  ⚠️ 401 Unauthorized    → Belum login / credentials salah       │
│  ⚠️ 403 Forbidden       → Tidak punya akses ke resource ini    │
│  ⚠️ 404 Not Found       → Data yang diminta tidak ditemukan    │
│  ⚠️ 422 Unprocessable   → Validasi gagal (email sudah ada,    │
│         Entity              dll)                                │
│                                                                  │
│  ❌ 500 Internal Server  → Error di server (bug)                 │
│       Error                                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.4.4 RESTful Endpoints untuk SEAPEDIA

```
┌─────────────────────────────────────────────────────────────────┐
│                   SEAPEDIA API ENDPOINTS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📋 AUTHENTICATION                                              │
│  ─────────────────────────────────────────────────────────────  │
│  POST   /api/auth/register    → Daftar user baru                │
│  POST   /api/auth/login       → Login user                       │
│  POST   /api/auth/logout      → Logout user                      │
│  GET    /api/auth/me          → Dapat data user sendiri          │
│  PUT    /api/auth/me          → Update profil sendiri            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📦 PRODUCTS                                                     │
│  ─────────────────────────────────────────────────────────────  │
│  GET    /api/products         → Daftar semua produk              │
│  GET    /api/products/{id}    → Detail satu produk              │
│  POST   /api/products         → Buat produk baru (Seller)       │
│  PUT    /api/products/{id}    → Update produk (Seller)          │
│  DELETE /api/products/{id}    → Hapus produk (Seller)           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏪 STORES                                                       │
│  ─────────────────────────────────────────────────────────────  │
│  GET    /api/stores           → Daftar semua toko               │
│  GET    /api/stores/{id}      → Detail satu toko                │
│  POST   /api/stores           → Buat toko baru (Seller)         │
│  PUT    /api/stores/{id}      → Update toko (Seller)            │
│  DELETE /api/stores/{id}      → Hapus toko (Seller)             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🛒 CART                                                         │
│  ─────────────────────────────────────────────────────────────  │
│  GET    /api/cart             → Dapat isi cart user            │
│  POST   /api/cart/items       → Tambah item ke cart            │
│  PUT    /api/cart/items/{id}  → Update jumlah item di cart     │
│  DELETE /api/cart/items/{id}  → Hapus item dari cart           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📝 ORDERS                                                       │
│  ─────────────────────────────────────────────────────────────  │
│  GET    /api/orders           → Daftar pesanan user             │
│  GET    /api/orders/{id}      → Detail satu pesanan             │
│  POST   /api/orders           → Buat pesanan baru (Checkout)   │
│  PUT    /api/orders/{id}/status → Update status pesanan         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👤 WALLETS                                                     │
│  ─────────────────────────────────────────────────────────────  │
│  GET    /api/wallet           → Dapat saldo & history          │
│  POST   /api/wallet/topup     → Top up saldo                   │
│  GET    /api/transactions     → Daftar transaksi               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📍 ADDRESSES                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  GET    /api/addresses        → Daftar alamat user             │
│  POST   /api/addresses        → Tambah alamat baru             │
│  PUT    /api/addresses/{id}   → Update alamat                  │
│  DELETE /api/addresses/{id}   → Hapus alamat                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⭐ REVIEWS                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  GET    /api/reviews           → Daftar semua review            │
│  GET    /api/products/{id}/reviews → Review untuk produk tertentu│
│  POST   /api/reviews           → Buat review baru               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🚗 DRIVERS                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  GET    /api/driver/orders    → Daftar pesanan untuk driver    │
│  PUT    /api/orders/{id}/pickup → Driver ambil pesanan         │
│  PUT    /api/orders/{id}/deliver → Driver tandai selesai       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.4.5 Contoh Request & Response

```json
// GET /api/products
// Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nasi Goreng Spesial",
      "description": "Nasi goreng dengan telur, ayam, dan sayuran",
      "price": 25000,
      "stock": 50,
      "image_url": "https://example.com/nasgor.jpg",
      "store": {
        "id": 1,
        "name": "Warung Budi"
      }
    },
    {
      "id": 2,
      "name": "Ayam Geprek",
      "description": "Ayam crispy dengan sambal",
      "price": 22000,
      "stock": 30,
      "image_url": "https://example.com/geprek.jpg",
      "store": {
        "id": 1,
        "name": "Warung Budi"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100
  }
}
```

```json
// POST /api/products (dengan token)
// Request:
{
  "name": "Mie Ayam",
  "description": "Mie ayam dengan pangsit",
  "price": 20000,
  "stock": 40,
  "image_url": "https://example.com/mieayam.jpg"
}

// Response (201 Created):
{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": {
    "id": 3,
    "name": "Mie Ayam",
    "description": "Mie ayam dengan pangsit",
    "price": 20000,
    "stock": 40,
    "image_url": "https://example.com/mieayam.jpg",
    "store_id": 1,
    "created_at": "2026-07-03T10:00:00Z"
  }
}
```

```json
// Error Response (422 Validation Failed):
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Email sudah digunakan"],
    "password": ["Password minimal 8 karakter"]
  }
}
```

---

## 0.5 ERD (Entity Relationship Diagram) SEAPEDIA

### Gambaran Umum

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ERD SEAPEDIA                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Legend:                                                                     │
│  ───────                                                                    │
│  PK = Primary Key (kunci utama, unik)                                       │
│  FK = Foreign Key (kunci tamu ke tabel lain)                                 │
│  1:1 = Satu ke Satu                                                          │
│  1:N = Satu ke Banyak                                                        │
│  N:N = Banyak ke Banyak (butuh pivot table)                                 │
│  UQ = UNIQUE constraint                                                       │
│  NN = NOT NULL constraint                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tabel-Tabel Utama

#### 1. users - Tabel User

```sql
┌──────────────────────────────────────────────────────┐
│                     users                            │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ name            │ VARCHAR(255), NN                    │
│ email           │ VARCHAR(255), NN, UNIQUE            │
│ password        │ VARCHAR(255), NN                    │
│ avatar_url      │ VARCHAR(500), NULLABLE              │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
└──────────────────────────────────────────────────────┘
```

#### 2. user_roles - Multi-Role System

```sql
┌──────────────────────────────────────────────────────┐
│                   user_roles                         │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ user_id         │ BIGINT UNSIGNED, FK → users.id    │
│ role            │ ENUM('admin','seller','buyer',    │
│                 │        'driver'), NN                │
│ is_active       │ BOOLEAN, DEFAULT false             │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - user_id → users.id (Many-to-One)                   │
│ - Satu user bisa punya banyak roles                  │
└──────────────────────────────────────────────────────┘
```

#### 3. stores - Toko Seller

```sql
┌──────────────────────────────────────────────────────┐
│                      stores                          │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ user_id         │ BIGINT UNSIGNED, FK → users.id    │
│ name            │ VARCHAR(255), NN, UNIQUE          │
│ description     │ TEXT, NULLABLE                     │
│ address         │ VARCHAR(500), NULLABLE             │
│ phone           │ VARCHAR(20), NULLABLE              │
│ logo_url        │ VARCHAR(500), NULLABLE             │
│ is_active       │ BOOLEAN, DEFAULT true               │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - user_id → users.id (Many-to-One)                   │
│ - name harus UNIQUE karena satu seller = satu toko   │
└──────────────────────────────────────────────────────┘
```

#### 4. products - Produk

```sql
┌──────────────────────────────────────────────────────┐
│                     products                         │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ store_id        │ BIGINT UNSIGNED, FK → stores.id   │
│ name            │ VARCHAR(255), NN                    │
│ description     │ TEXT, NULLABLE                     │
│ price           │ DECIMAL(12,2), NN                   │
│ stock           │ INT UNSIGNED, DEFAULT 0             │
│ image_url       │ VARCHAR(500), NULLABLE             │
│ is_active       │ BOOLEAN, DEFAULT true               │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - store_id → stores.id (Many-to-One)                │
│ - Satu store punya banyak products (1:N)            │
└──────────────────────────────────────────────────────┘
```

#### 5. wallets - Dompet Buyer

```sql
┌──────────────────────────────────────────────────────┐
│                      wallets                         │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ user_id         │ BIGINT UNSIGNED, FK → users.id,   │
│                 │         UNIQUE (1 wallet per user) │
│ balance         │ DECIMAL(15,2), DEFAULT 0           │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - user_id → users.id (One-to-One)                   │
│ - Setiap user punya tepat 1 wallet                  │
└──────────────────────────────────────────────────────┘
```

#### 6. addresses - Alamat Pengiriman

```sql
┌──────────────────────────────────────────────────────┐
│                     addresses                        │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ user_id         │ BIGINT UNSIGNED, FK → users.id   │
│ label           │ VARCHAR(50), NN (e.g., "Rumah",    │
│                 │         "Kantor")                  │
│ recipient_name  │ VARCHAR(255), NN                    │
│ phone           │ VARCHAR(20), NN                     │
│ full_address    │ TEXT, NN                            │
│ is_default      │ BOOLEAN, DEFAULT false              │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - user_id → users.id (Many-to-One)                   │
│ - Satu user bisa punya banyak alamat (1:N)          │
└──────────────────────────────────────────────────────┘
```

#### 7. carts - Keranjang Belanja

```sql
┌──────────────────────────────────────────────────────┐
│                       carts                           │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ user_id         │ BIGINT UNSIGNED, FK → users.id,   │
│                 │         UNIQUE (1 cart per user)  │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - user_id → users.id (One-to-One)                   │
│ - Cart terhubung ke user_roles (buyer)              │
└──────────────────────────────────────────────────────┘
```

#### 8. cart_items - Item di Keranjang

```sql
┌──────────────────────────────────────────────────────┐
│                    cart_items                        │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ cart_id         │ BIGINT UNSIGNED, FK → carts.id   │
│ product_id      │ BIGINT UNSIGNED, FK → products.id│
│ quantity        │ INT UNSIGNED, NN, MIN(1)           │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - cart_id → carts.id (Many-to-One)                  │
│ - product_id → products.id (Many-to-One)            │
│                                                                  │
│ ⚠️ CONSTRAINT: Semua item dalam cart HARUS dari      │
│    toko yang SAMA (single-store checkout rule)      │
└──────────────────────────────────────────────────────┘
```

#### 9. orders - Pesanan

```sql
┌──────────────────────────────────────────────────────┐
│                      orders                           │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ order_number    │ VARCHAR(50), NN, UNIQUE            │
│ user_id         │ BIGINT UNSIGNED, FK → users.id   │
│ store_id        │ BIGINT UNSIGNED, FK → stores.id  │
│ driver_id       │ BIGINT UNSIGNED, FK → users.id,  │
│                 │         NULLABLE (nullable)       │
│ status          │ ENUM('packaging','waiting_shipper',│
│                 │  'shipping','completed','returned')│
│ total_amount    │ DECIMAL(15,2), NN                   │
│ shipping_address│ TEXT, NN                            │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - user_id → users.id (buyer)                        │
│ - store_id → stores.id                               │
│ - driver_id → users.id (driver, nullable)           │
│ - 1 order punya banyak order_items (1:N)            │
└──────────────────────────────────────────────────────┘
```

#### 10. order_items - Item dalam Pesanan

```sql
┌──────────────────────────────────────────────────────┐
│                    order_items                       │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ order_id        │ BIGINT UNSIGNED, FK → orders.id  │
│ product_id      │ BIGINT UNSIGNED, FK → products.id│
│ quantity        │ INT UNSIGNED, NN                   │
│ price_at_purchase│ DECIMAL(12,2), NN (harga SAAT beli)│
│ created_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - order_id → orders.id (Many-to-One)                │
│ - product_id → products.id (Many-to-One)            │
│                                                                  │
│ 📝 NOTE: price_at_purchase menyimpan harga SAAT       │
│    user melakukan pembelian (bukan harga saat ini)    │
└──────────────────────────────────────────────────────┘
```

#### 11. reviews - Review Produk

```sql
┌──────────────────────────────────────────────────────┐
│                      reviews                          │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ user_id         │ BIGINT UNSIGNED, FK → users.id   │
│ product_id      │ BIGINT UNSIGNED, FK → products.id│
│ rating          │ TINYINT UNSIGNED, NN, MIN(1), MAX(5)│
│ comment         │ TEXT, NULLABLE                     │
│ created_at      │ TIMESTAMP                           │
│ updated_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - user_id → users.id (Many-to-One)                  │
│ - product_id → products.id (Many-to-One)            │
└──────────────────────────────────────────────────────┘
```

#### 12. transactions - Riwayat Transaksi Wallet

```sql
┌──────────────────────────────────────────────────────┐
│                   transactions                       │
├──────────────────────────────────────────────────────┤
│ id              │ BIGINT UNSIGNED, PK, AUTO_INCREMENT│
│ wallet_id       │ BIGINT UNSIGNED, FK → wallets.id │
│ order_id        │ BIGINT UNSIGNED, FK → orders.id, │
│                 │         NULLABLE                   │
│ type            │ ENUM('topup','purchase','refund', │
│                 │  'withdrawal'), NN                 │
│ amount          │ DECIMAL(15,2), NN                   │
│ description     │ VARCHAR(255), NULLABLE             │
│ created_at      │ TIMESTAMP                           │
├──────────────────────────────────────────────────────┤
│ RELASI:                                                │
│ - wallet_id → wallets.id (Many-to-One)              │
│ - order_id → orders.id (Many-to-One, nullable)     │
└──────────────────────────────────────────────────────┘
```

### Diagram Relasi Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ERD VISUAL - SEAPEDIA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                            ┌──────────────┐                                  │
│                            │    users     │                                  │
│                            └──────┬───────┘                                  │
│                                   │                                          │
│           ┌───────────────────────┼───────────────────────┐                  │
│           │                       │                       │                  │
│           ▼                       ▼                       ▼                  │
│    ┌──────────────┐       ┌──────────────┐        ┌──────────────┐          │
│    │  user_roles  │       │    stores    │        │   wallets    │          │
│    │  (multi-role)│       └──────┬───────┘        └──────────────┘          │
│    └──────────────┘              │                                          │
│                                  │                                          │
│                                  ▼                                          │
│                           ┌──────────────┐                                   │
│                           │  products    │                                   │
│                           └──────┬───────┘                                   │
│                                  │                                          │
│                                  │                                          │
│    ┌──────────────┐              │              ┌──────────────┐            │
│    │    orders     │◄─────────────┼─────────────│    reviews   │            │
│    └──────┬───────┘              │              └──────────────┘            │
│           │                      │                                          │
│           │                      ▼                                          │
│           │               ┌──────────────┐                                   │
│           │               │  cart_items  │                                   │
│           │               └──────┬───────┘                                   │
│           │                      │                                          │
│           ▼                      ▼                                          │
│    ┌──────────────┐       ┌──────────────┐                                   │
│    │ order_items  │       │    carts     │                                   │
│    └──────────────┘       └──────────────┘                                   │
│                                                                              │
│    ┌──────────────┐       ┌──────────────┐                                   │
│    │  addresses   │       │ transactions │                                   │
│    └──────────────┘       └──────────────┘                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 0.6 Alur Bisnis SEAPEDIA

### 0.6.1 User Registration & Role Selection

```
┌─────────────────────────────────────────────────────────────────┐
│              REGISTRASI & ROLE SELECTION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: User daftar                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  POST /api/auth/register                                 │   │
│  │  {                                                     │   │
│  │    "name": "Budi",                                      │   │
│  │    "email": "budi@email.com",                           │   │
│  │    "password": "password123"                            │   │
│  │  }                                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                         │
│                        ▼                                         │
│  Step 2: User punya 1 record di `users` + 1 wallet otomatis     │
│                        │                                         │
│                        ▼                                         │
│  Step 3: User pilih role (seller/buyer/driver)                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  POST /api/roles                                        │   │
│  │  { "role": "buyer" }                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                         │
│                        ▼                                         │
│  Step 4: User aktifkan role                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PUT /api/roles/buyer/activate                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  💡 1 User = BISA punya SEMUA role sekaligus                   │
│     Tapi HANYA 1 role yang ACTIVE setiap saat                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.6.2 Seller Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SELLER FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Seller membuat toko                                         │
│     POST /api/stores                                            │
│     { "name": "Toko Sehat", "description": "Makanan sehat" }    │
│                        │                                         │
│                        ▼                                         │
│  2. Seller tambah produk                                         │
│     POST /api/products                                           │
│     {                                                          │
│       "name": "Salad Buah",                                     │
│       "description": "Segar dan sehat",                        │
│       "price": 35000,                                           │
│       "stock": 20                                               │
│     }                                                           │
│                        │                                         │
│                        ▼                                         │
│  3. Produk muncul di marketplace                                 │
│     GET /api/products                                           │
│                        │                                         │
│                        ▼                                         │
│  4. Seller dapat pesanan                                         │
│     GET /api/seller/orders (halaman seller)                     │
│                        │                                         │
│                        ▼                                         │
│  5. Seller konfirmasi & kirim                                    │
│     PUT /api/orders/{id}/status → "waiting_shipper"            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.6.3 Buyer Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       BUYER FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Buyer top-up wallet                                         │
│     POST /api/wallet/topup                                      │
│     { "amount": 500000 }                                        │
│                        │                                         │
│                        ▼                                         │
│  2. Buyer pilih produk → Tambah ke cart                         │
│     POST /api/cart/items                                        │
│     { "product_id": 1, "quantity": 2 }                          │
│                        │                                         │
│                        ▼                                         │
│  3. ⚠️ ATURAN: Cart hanya boleh dari 1 toko                    │
│     Jika tambahkan produk toko lain → ERROR                    │
│                        │                                         │
│                        ▼                                         │
│  4. Buyer checkout                                             │
│     POST /api/orders                                            │
│     { "address_id": 1 }                                        │
│     → Wallet di-debit                                           │
│     → Stok dikurangi                                           │
│     → Order dibuat dengan status "packaging"                    │
│                        │                                         │
│                        ▼                                         │
│  5. Buyer bisa track pesanan                                     │
│     GET /api/orders/{id}                                        │
│     Status: packaging → waiting_shipper → shipping → completed │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.6.4 Order Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORDER LIFECYCLE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────┐     ┌───────────────┐     ┌──────────────┐        │
│   │PACKAGING│────►│WAITING_SHIPPER│────►│  SHIPPING   │        │
│   └─────────┘     └───────────────┘     └──────┬───────┘        │
│        ▲                                          │              │
│        │ Seller                                   │ Driver       │
│        │ pack &                                   │ picked &     │
│        │ confirm                                  │ delivering   │
│                                                   │              │
│                                                   ▼              │
│                                            ┌──────────────┐      │
│                                            │   COMPLETED  │      │
│                                            └──────────────┘      │
│                                                   │              │
│                                                   │ Buyer         │
│                                                   │ confirm       │
│                                                   │ (optional)    │
│                                                   ▼              │
│                                            ┌──────────────┐      │
│                                            │  RETURNED    │      │
│                                            │  (optional)  │      │
│                                            └──────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.7 Security Fundamentals

### 0.7.1 Authentication vs Authorization

```
┌─────────────────────────────────────────────────────────────────┐
│          AUTHENTICATION vs AUTHORIZATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔐 AUTHENTICATION = "Siapa kamu?"                               │
│  ─────────────────────────────────────────────────────────────   │
│  Verifikasi identitas user (login)                              │
│  "Email dan password kamu benar"                                │
│                                                                  │
│  ❓ "Apakah Budi yang login?"                                    │
│  ✅ "Ya, Budi dengan email budi@email.com"                       │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│  🔒 AUTHORIZATION = "Apa yang boleh kamu lakukan?"               │
│  ─────────────────────────────────────────────────────────────   │
│  Cek hak akses user (permission)                               │
│  "Budi punya role Seller, jadi boleh tambah produk"             │
│                                                                  │
│  ❓ "Apakah Budi boleh edit produk?"                             │
│  ✅ "Ya, karena Budi adalah Seller dan punya toko itu"           │
│  ❌ "Tidak, karena produk ini bukan punya toko Budi"            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 0.7.2 Password Hashing

```sql
-- ❌ JANGAN SIMPAN PASSWORD PLAIN TEXT
┌────────────────────┐
│ password           │
├────────────────────┤
│ password123        │ ← BERBAHAYA!
└────────────────────┘

-- ✅ GUNAKAN HASHING (bcrypt/argon2)
┌──────────────────────────────────────┐
│ password                            │
├──────────────────────────────────────┤
│ $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3 │ ← Tidak bisa dibaca
│ Ro9li1XmgzklbDtEaC6Rpu                 langsung
└──────────────────────────────────────┘
```

### 0.7.3 Token-Based Authentication

```
┌─────────────────────────────────────────────────────────────────┐
│                   JWT / SANCTUM TOKEN FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User Login                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  POST /api/auth/login                                    │   │
│  │  { "email": "budi@email.com", "password": "..." }       │   │
│  │                                                          │   │
│  │  Response:                                               │   │
│  │  { "token": "eyJhbGciOiJIUzI1NiIs..." }                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                         │
│                        ▼                                         │
│  2. Client simpan token (localStorage / cookie)                  │
│                        │                                         │
│                        ▼                                         │
│  3. Request berikutnya, kirim token                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  GET /api/cart                                           │   │
│  │  Headers:                                                │   │
│  │    Authorization: Bearer eyJhbGciOiJIUzI1NiIs...         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                        │                                         │
│                        ▼                                         │
│  4. Server validasi token & dapat user_id                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0.8 Latihan & Kuis BAB 0

### Pertanyaan Konsep

**Q1.** Jelaskan dengan kata-katamu sendiri perbedaan antara:
- Frontend dan Backend
- API dan Database
- Authentication dan Authorization

**Q2.** Dari ERD SEAPEDIA:
- Relasi apa yang ada antara `users` dan `stores`?
- Kenapa `orders` punya `store_id` dan `driver_id` sekaligus?
- Apa fungsi tabel `cart_items`?
- Kenapa ada tabel `transactions` terpisah dari `wallets`?

**Q3.** Untuk setiap scenario berikut, tentukan:
   - HTTP Method apa yang digunakan?
   - Endpoint apa yang dipanggil?

| Scenario | Method | Endpoint |
|----------|--------|----------|
| User mau lihat daftar produk | ? | ? |
| Seller mau tambah produk baru | ? | ? |
| Buyer mau checkout | ? | ? |
| User mau login | ? | ? |
| Admin mau hapus user | ? | ? |

**Q4.** Buat urutan langkah ketika seorang buyer bernama "Ani" membeli 2 Salad Buah:
1. ?
2. ?
3. ?
4. ?
5. ?

---

## 0.9 Jawaban Latihan

<details>
<summary>Klik untuk melihat jawaban (coba jawab dulu!)</summary>

**Q1.**
- **Frontend** = Bagian aplikasi yang dilihat langsung oleh user (React, tampilan, button, form)
- **Backend** = Bagian aplikasi yang bekerja di "belakang layar" (Laravel, logika, database)
- **API** = Interface/jembatan komunikasi antara Frontend dan Backend
- **Database** = Tempat penyimpanan data terstruktur
- **Authentication** = Memverifikasi siapa user (login)
- **Authorization** = Memeriksa apa yang boleh dilakukan user (permission)

**Q2.**
- `users` → `stores`: **One-to-Many** (1 user bisa punya banyak toko? TIDAK, di SEAPEDIA 1 seller = 1 toko, jadi sebenarnya 1:1, tapi stored di level FK)
- `orders` punya `store_id` karena pesanan dari toko tertentu, dan `driver_id` karena pesanan diantar oleh driver tertentu (nullable sampai ada driver yang ambil)
- `cart_items` berfungsi menyimpan item-item apa saja yang ada di keranjang (produk + jumlah)
- `transactions` terpisah karena untuk mencatat history/perubahan wallet (topup, purchase, refund)

**Q3.**

| Scenario | Method | Endpoint |
|----------|--------|----------|
| User mau lihat daftar produk | GET | `/api/products` |
| Seller mau tambah produk baru | POST | `/api/products` |
| Buyer mau checkout | POST | `/api/orders` |
| User mau login | POST | `/api/auth/login` |
| Admin mau hapus user | DELETE | `/api/users/{id}` |

**Q4.** Urutan checkout Ani:
1. Ani login → `POST /api/auth/login`
2. Ani pilih produk "Salad Buah" → `POST /api/cart/items`
3. Ani atur jumlah 2 → (jika perlu update) `PUT /api/cart/items/{id}`
4. Ani pilih alamat pengiriman → `POST /api/addresses` (jika belum ada)
5. Ani checkout → `POST /api/orders`
   - Wallet Ani di-debit
   - Stok Salad Buah dikurangi 2
   - Order dibuat dengan status "packaging"

</details>

---

## 0.10 Glossary (Istilah Penting)

```sql
┌─────────────────────────────────────────────────────────────────┐
│                     GLOSSARY ISTILAH PENTING                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API        = Application Programming Interface                  │
│  Backend    = Bagian server-side aplikasi                       │
│  Frontend   = Bagian client-side/aplikasi yang dilihat user     │
│  Database   = Sistem penyimpanan data terstruktur               │
│  ORM        = Object-Relational Mapping (Laravel Eloquent)      │
│  Migration  = Script untuk membuat/mengubah struktur database   │
│  Seeder     = Script untuk mengisi data awal ke database        │
│  Route      = Jalur/endpoints API                               │
│  Controller = Pengendali logika untuk setiap route               │
│  Model      = Representasi tabel database dalam kode            │
│  Middleware = Kode yang dijalankan sebelum/sesudah request      │
│  JWT        = JSON Web Token (untuk autentikasi)                 │
│  PK         = Primary Key (kunci utama tabel)                   │
│  FK         = Foreign Key (kunci tamu ke tabel lain)            │
│  ERD        = Entity Relationship Diagram                       │
│  CRUD       = Create, Read, Update, Delete                      │
│  REST       = REpresentational State Transfer                   │
│  JSON       = JavaScript Object Notation (format data API)      │
│  HTTP       = HyperText Transfer Protocol                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Checklist BAB 0

- [ ] Memahami perbedaan Frontend, Backend, Database
- [ ] Memahami cara kerja Client-Server
- [ ] Memahami tipe data database
- [ ] Memahami Primary Key dan Foreign Key
- [ ] Memahami tipe relasi (1:1, 1:N, N:N)
- [ ] Memahami HTTP Methods
- [ ] Memahami HTTP Status Codes
- [ ] Memahami RESTful API design
- [ ] Mengenal ERD SEAPEDIA
- [ ] Memahami alur bisnis utama SEAPEDIA
- [ ] Memahami konsep Authentication vs Authorization
- [ ] Memahami Password Hashing
- [ ] Memahami Token-based Authentication
- [ ] Menjawab latihan dengan benar

---

**Lanjut ke BAB 1?** [Setup Environment & Project Structure](01-setup.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-03*
