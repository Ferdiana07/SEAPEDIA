# BAB 9: Reviews & Delivery

> **Tujuan:** Memahami dan mengimplementasikan sistem Review Produk oleh Buyer serta alur pengiriman lengkap oleh Driver — dari mengambil pesanan, mengantarkan, hingga mengembalikan pesanan yang gagal.

---

## 9.1 Recap: Apa yang Sudah Kita Bangun

Di BAB 8, kita sudah menyelesaikan tiga halaman Dashboard per role:

| Role | Dashboard | Yang Ditampilkan |
|------|-----------|-----------------|
| Buyer | `/buyer/dashboard` | Saldo wallet, pesanan aktif/selesai, quick action |
| Seller | `/seller/dashboard` | Statistik produk, pesanan masuk, cek kepemilikan toko |
| Driver | `/driver/dashboard` | Order tersedia, order aktif, quick action |

**Yang kita bangun di BAB 9** — dua fitur terakhir untuk melengkapi siklus transaksi SEAPEDIA:

```
┌─────────────────────────────────────────────────────────────────┐
│                  DUA FITUR BAB 9                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⭐ SISTEM REVIEW (Buyer → Produk)                              │
│  ─────────────────────────────────────────────────────────────  │
│  • Pembaca review: Guest & User (publik, tanpa login)           │
│  • Pembuat review: User yang login (1 user = 1 review/produk)   │
│  • Update/hapus: Hanya pemilik review                           │
│                                                                  │
│  🚗 ALUR DELIVERY LENGKAP (Driver)                             │
│  ─────────────────────────────────────────────────────────────  │
│  • Pickup: Driver ambil order waiting_shipper → shipping        │
│  • Complete: Driver konfirmasi terkirim → completed             │
│  • Return: Driver kembalikan pesanan gagal → returned           │
│    (stok direstore + wallet buyer direfund otomatis)            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9.2 Sistem Review Produk

### 9.2.1 Konsep: Apa Itu Review?

Review adalah pendapat dan penilaian buyer terhadap produk yang pernah (atau ingin) mereka beli. Review memengaruhi kepercayaan pembeli lain.

```
┌─────────────────────────────────────────────────────────────────┐
│                  KONSEP REVIEW SEAPEDIA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Rating : 1 sampai 5 bintang (wajib)                           │
│  Komentar: Teks bebas (opsional, max 1000 karakter)             │
│                                                                  │
│  ATURAN UTAMA:                                                   │
│  • 1 User × 1 Produk = maksimal 1 Review                       │
│  • Tidak bisa double review produk yang sama                    │
│  • Kalau mau ubah → gunakan UPDATE (bukan buat baru)           │
│  • Siapapun bisa BACA review (guest pun bisa)                   │
│  • Hanya user LOGIN yang bisa BUAT/UBAH/HAPUS review            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2.2 Tabel `reviews` di Database

Tabel ini sudah dibuat di BAB 2. Berikut strukturnya:

```
┌─────────────────────────────────────────────────────────────────┐
│                  TABEL: reviews                                   │
├─────────────┬──────────────┬───────────────────────────────────┤
│  Kolom      │  Tipe        │  Keterangan                       │
├─────────────┼──────────────┼───────────────────────────────────┤
│  id         │  bigint PK   │  ID unik review                   │
│  user_id    │  bigint FK   │  Siapa yang membuat review        │
│  product_id │  bigint FK   │  Produk yang di-review            │
│  rating     │  tinyint     │  Nilai 1-5 bintang                │
│  comment    │  text        │  Komentar (boleh kosong)          │
│  created_at │  timestamp   │  Kapan dibuat                     │
│  updated_at │  timestamp   │  Kapan terakhir diubah            │
└─────────────┴──────────────┴───────────────────────────────────┘

CONSTRAINT UNIK:
  UNIQUE(user_id, product_id) → 1 user hanya bisa review 1 produk 1x
```

Constraint `UNIQUE(user_id, product_id)` adalah **jaminan di level database** bahwa tidak akan ada double review, bahkan jika ada bug di kode.

---

## 9.3 API Endpoint Review

Sistem review menggunakan 4 endpoint. Dua di antaranya publik, dua lainnya butuh login.

```
┌─────────────────────────────────────────────────────────────────┐
│                  ENDPOINT REVIEW                                  │
├──────────────────────────────────────┬──────────────┬──────────┤
│  Endpoint                            │  Method      │  Akses   │
├──────────────────────────────────────┼──────────────┼──────────┤
│  /api/products/{id}/reviews          │  GET         │  Publik  │
│  /api/products/{id}/reviews          │  POST        │  Login   │
│  /api/reviews/{id}                   │  PUT         │  Login   │
│  /api/reviews/{id}                   │  DELETE      │  Login   │
└──────────────────────────────────────┴──────────────┴──────────┘
```

### 9.3.1 GET — Baca Review Produk (Publik)

**Request:**
```
GET /api/products/3/reviews
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "product_id": 3,
      "rating": 5,
      "comment": "Produk bagus, pengiriman cepat!",
      "created_at": "2026-07-20T10:00:00Z",
      "user": { "id": 5, "name": "Budi" }
    }
  ],
  "summary": {
    "average_rating": 4.5,
    "total_reviews": 12
  },
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 20,
    "total": 12
  }
}
```

`summary.average_rating` dipakai untuk menampilkan rating rata-rata di halaman produk. `summary.total_reviews` dipakai untuk menampilkan jumlah total ulasan.

### 9.3.2 POST — Buat Review Baru

**Request:**
```
POST /api/products/3/reviews
Authorization: Bearer {token}

{
  "rating": 4,
  "comment": "Kualitasnya oke, hanya pengiriman agak lama."
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Review berhasil dikirim!",
  "data": { "id": 2, "rating": 4, "comment": "...", ... }
}
```

**Response gagal — sudah pernah review (409 Conflict):**
```json
{
  "success": false,
  "message": "Kamu sudah pernah mereview produk ini. Gunakan update untuk mengubah."
}
```

HTTP status 409 (Conflict) dipilih karena ini bukan error server — ini konflik bisnis: dua review untuk produk yang sama oleh user yang sama.

---

## 9.4 Cara Kerja ReviewController (Backend)

### 9.4.1 Alur Lengkap: `store()` — Buat Review

```
┌─────────────────────────────────────────────────────────────────┐
│          ALUR: POST /api/products/{id}/reviews                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User login kirim { rating, comment }                        │
│         │                                                        │
│  2. Validasi Input                                               │
│     ├── rating: wajib, integer, 1-5                             │
│     └── comment: opsional, string, max 1000 karakter            │
│         │                                                        │
│  3. Cek produk ada                                               │
│     └── Product::find($productId)                               │
│         ├── Tidak ada → 404 "Produk tidak ditemukan"            │
│         └── Ada → lanjut                                         │
│         │                                                        │
│  4. Cek double review                                            │
│     └── Review::where('user_id', $userId)                       │
│                  ->where('product_id', $productId)->first()     │
│         ├── Sudah ada → 409 "Sudah pernah review"               │
│         └── Belum ada → lanjut                                   │
│         │                                                        │
│  5. Simpan review baru                                           │
│     └── Review::create([user_id, product_id, rating, comment])  │
│         │                                                        │
│  6. Load relasi user                                             │
│     └── $review->load('user:id,name')                           │
│         (agar response langsung include nama reviewer)           │
│         │                                                        │
│  7. Return 201 + data review                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.4.2 Cek Kepemilikan (update & destroy)

Untuk `update` dan `destroy`, backend selalu memverifikasi bahwa `review.user_id === request.user().id`. Jika tidak cocok, kembalikan **403 Forbidden**.

```
┌─────────────────────────────────────────────────────────────────┐
│          PENGECEKAN KEPEMILIKAN REVIEW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User A (id=5) coba update Review id=1:                         │
│                                                                  │
│  Review::find(1) → { id:1, user_id: 5, rating: 3, ... }        │
│                                                                  │
│  if ($review->user_id !== $user->id) {                          │
│      return 403 "Kamu tidak bisa mengubah review orang lain"    │
│  }                                                               │
│                                                                  │
│  Cek: 5 === 5 → ✅ PASS → lanjut update/delete                  │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  User B (id=9) coba update Review id=1:                         │
│                                                                  │
│  Cek: 5 === 9 → ❌ FAIL → 403 Forbidden                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.4.3 Model Review

```
┌─────────────────────────────────────────────────────────────────┐
│                  MODEL: Review.php                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  RELASI:                                                         │
│  • belongsTo(User)    → siapa yang menulis                      │
│  • belongsTo(Product) → produk apa yang di-review               │
│                                                                  │
│  SCOPE QUERY (shortcut filter):                                  │
│  • scopeRating($rating)     → filter by bintang                 │
│  • scopeForProduct($id)     → filter by product_id              │
│  • scopeNewest()            → urut dari terbaru                 │
│                                                                  │
│  KONSTANTA:                                                      │
│  • MIN_RATING = 1                                               │
│  • MAX_RATING = 5                                               │
│                                                                  │
│  ACCESSOR:                                                       │
│  • getStarsAttribute() → ubah angka jadi emoji bintang          │
│    Contoh: rating=4 → "⭐⭐⭐⭐"                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9.5 Review di Frontend: ProductDetailPage

Fitur review terintegrasi langsung di halaman detail produk (`/products/:id`), bukan di halaman terpisah. Ini membuat UX lebih natural — user melihat produk dan reviewnya sekaligus.

### 9.5.1 Alur Data Review di Frontend

```
ProductDetailPage.jsx
    │
    ├── useEffect #1 (mount) → fetchById(id)
    │       └─→ GET /api/products/{id} (data produk)
    │
    ├── useEffect #2 (mount) → reviewService.getForProduct(id)
    │       └─→ GET /api/products/{id}/reviews
    │               ├─ setReviews(res.data)
    │               └─ setReviewSummary(res.summary)
    │
    ├── Render: tampilkan rata-rata bintang + daftar review
    │
    └── handleSubmitReview() ← tombol "Beri Review" diklik
            │
            └─→ reviewService.create(id, { rating, comment })
                    └─→ POST /api/products/{id}/reviews
                            ├── Sukses → refresh daftar review
                            └── Gagal (409) → toast error
```

### 9.5.2 Komponen UI Review

Di halaman detail produk, ada dua bagian yang berhubungan dengan review:

```
┌─────────────────────────────────────────────────────────────────┐
│  AREA 1: RINGKASAN RATING (bagian atas section review)           │
├─────────────────────────────────────────────────────────────────┤
│  ⭐⭐⭐⭐☆  4.5  (12 ulasan)                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AREA 2: DAFTAR REVIEW                                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [B] Budi            ⭐⭐⭐⭐⭐                          │  │
│  │       Produknya bagus, ongkir cepat!                     │  │
│  │       20 Juli 2026                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [A] Ayu             ⭐⭐⭐⭐☆                          │  │
│  │       Sedikit lecet tapi oke                              │  │
│  │       18 Juli 2026                                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AREA 3: MODAL FORM REVIEW (muncul saat klik "Beri Review")      │
├─────────────────────────────────────────────────────────────────┤
│  Rating:  ★ ★ ★ ★ ★  (5 bintang, klik untuk pilih)             │
│  Komentar: [textarea - opsional]                                 │
│                              [ Batal ] [ Kirim Review ]          │
└─────────────────────────────────────────────────────────────────┘
```

### 9.5.3 Mengapa Review Bisa Dibaca Tanpa Login?

Ini keputusan desain yang disengaja. Review berfungsi sebagai **social proof** — semakin banyak orang (termasuk yang belum daftar) membaca review positif, semakin besar kemungkinan mereka menjadi buyer.

Oleh karena itu:
- `GET /api/products/{id}/reviews` → **tidak** ada middleware `auth:sanctum`
- `POST /api/products/{id}/reviews` → **ada** middleware `auth:sanctum`

Di frontend, cek `isAuthenticated()` dilakukan di tombol "Beri Review" — jika belum login, tampilkan warning toast dan arahkan ke login.

---

## 9.6 reviewService (Frontend)

Service layer di frontend memisahkan logika HTTP dari komponen UI. Seluruh panggilan API review diurus oleh `reviewService.js`.

```
┌─────────────────────────────────────────────────────────────────┐
│              reviewService — 4 Fungsi                            │
├────────────────────────┬────────────────────────────────────────┤
│  Fungsi                │  Endpoint yang Dipanggil               │
├────────────────────────┼────────────────────────────────────────┤
│  getForProduct(id)     │  GET /api/products/{id}/reviews        │
│  create(id, data)      │  POST /api/products/{id}/reviews       │
│  update(reviewId, d)   │  PUT /api/reviews/{reviewId}           │
│  remove(reviewId)      │  DELETE /api/reviews/{reviewId}        │
└────────────────────────┴────────────────────────────────────────┘
```

Semua fungsi mengembalikan `response.data` dari Axios — sehingga pemanggil langsung mendapat objek `{ success, data, message }` dari backend tanpa perlu bongkar `.data.data`.

---

## 9.7 Alur Delivery Driver

### 9.7.1 Siklus Hidup Order: Status-Perubahan

Order di SEAPEDIA melewati sejumlah status yang berurutan. Setiap status ada pemiliknya — siapa yang boleh mengubah, dan ke status apa.

```
┌─────────────────────────────────────────────────────────────────┐
│              SIKLUS STATUS PESANAN                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [ packaging ]                                                   │
│       │  Buyer checkout → order dibuat dengan status ini        │
│       │  Seller proses order dan kemas barang                   │
│       ▼                                                          │
│  [ waiting_shipper ]                                             │
│       │  Seller konfirmasi → order siap diambil driver          │
│       │  Order muncul di daftar "Tersedia" driver               │
│       ▼                                                          │
│  [ shipping ]          ← Driver ambil order (pickup)            │
│       │                                                          │
│       ├──── Driver konfirmasi terkirim ──────────────────────►  │
│       │                                           [ completed ] │
│       │                                                          │
│       └──── Driver kembalikan (gagal antar) ──────────────────► │
│                                                   [ returned ]   │
│                                                                  │
│  CATATAN:                                                        │
│  • Buyer juga bisa cancel selama status packaging/waiting       │
│  • Cancel oleh buyer → status langsung ke returned + refund     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.7.2 Tiga Aksi Driver (BAB 9)

**Aksi 1 — Pickup (Ambil Pesanan)**

```
Driver klik "Ambil Pesanan"
    │
    ├─→ POST /api/driver/orders/{id}/pickup
    │        │
    │        ├── Cek: user punya role 'driver'?
    │        ├── Cek: order status === 'waiting_shipper'?
    │        └── Cek: order.driver_id IS NULL?
    │                 (belum diambil driver lain)
    │
    │   Jika semua lulus:
    │        ├── order.driver_id = driver.id
    │        └── order.status   = 'shipping'
    │
    └─→ Response: { success: true, data: { status: 'shipping', ... } }
```

**Aksi 2 — Complete (Konfirmasi Terkirim)**

```
Driver klik "Konfirmasi Selesai"
    │
    ├─→ POST /api/driver/orders/{id}/complete
    │        │
    │        ├── Cek: user punya role 'driver'?
    │        ├── Cek: order.driver_id === driver.id?
    │        └── Cek: order.status === 'shipping'?
    │
    │   Jika semua lulus:
    │        └── order.status = 'completed'
    │
    └─→ Response: { success: true, data: { status: 'completed', ... } }
```

**Aksi 3 — Return (Kembalikan Pesanan)**

```
Driver klik "Kembalikan" → isi alasan → submit
    │
    ├─→ POST /api/driver/orders/{id}/return
    │        body: { reason: "Alamat tidak ditemukan" }
    │        │
    │        ├── Cek: user punya role 'driver'?
    │        ├── Cek: order.driver_id === driver.id?
    │        ├── Cek: order.status === 'shipping'?
    │        └── Validasi: reason (wajib, max 500 karakter)
    │
    │   Jika semua lulus (dalam DB Transaction):
    │        ├── foreach order.items → product.stock += item.quantity
    │        ├── wallet_buyer.balance += order.total_amount
    │        ├── transaction refund dibuat
    │        ├── order.status = 'returned'
    │        └── order.cancellation_reason = "Dikembalikan driver: {reason}"
    │
    └─→ Response: {
            success: true,
            message: "Pesanan dikembalikan. Stok direstore & saldo buyer direfund."
        }
```

### 9.7.3 Mengapa Return Butuh DB Transaction?

Aksi **return** melibatkan tiga operasi yang harus sukses **semua atau tidak sama sekali**:

```
┌─────────────────────────────────────────────────────────────────┐
│        DB TRANSACTION pada returnOrder                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DB::beginTransaction()                                          │
│         │                                                        │
│         ├── 1. Restore stok produk                              │
│         │       for each item: product.stock += item.quantity   │
│         │                                                        │
│         ├── 2. Refund saldo buyer                               │
│         │       wallet.balance += order.total_amount            │
│         │       + insert transaction record (type: refund)      │
│         │                                                        │
│         ├── 3. Update status order                              │
│         │       order.status = 'returned'                       │
│         │       order.cancellation_reason = "..."               │
│         │                                                        │
│  DB::commit()  ← Semua berhasil → simpan ke database           │
│                                                                  │
│  catch (Exception):                                              │
│  DB::rollBack() ← Ada yang gagal → batalkan semua              │
│                                                                  │
│  TANPA DB Transaction:                                           │
│  Bayangkan stok berhasil di-restore tapi refund gagal.          │
│  Buyer tidak dapat uangnya kembali! Bug fatal.                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9.8 Struktur File BAB 9

### Backend (Laravel)

```
seapedia-backend/
│
├── app/Http/Controllers/
│   ├── ReviewController.php    ← BARU: index, store, update, destroy
│   └── OrderController.php     ← DIPERBARUI: + pickupOrder, completeOrder, returnOrder
│
├── app/Models/
│   └── Review.php              ← BARU: Model review dengan relasi & scope
│
└── routes/api.php              ← DIPERBARUI: route review & driver delivery
```

### Frontend (React)

```
seapedia-frontend/src/
│
├── pages/
│   ├── ProductDetailPage.jsx          ← DIPERBARUI: + section review + modal form
│   └── dashboard/driver/
│       └── OrdersPage.jsx             ← BARU: Tab available/active + pickup/complete/return
│
├── services/
│   ├── reviewService.js               ← BARU: getForProduct, create, update, remove
│   └── orderService.js                ← DIPERBARUI: + pickup, deliver, returnOrder
│
└── stores/
    └── orderStore.js                  ← DIPERBARUI: + pickupOrder, deliverOrder, returnOrder
```

### Route yang Terdaftar (api.php)

```
┌─────────────────────────────────────────────────────────────────┐
│              ROUTE BAB 9 DI api.php                              │
├──────────────────────────────────────────┬───────┬─────────────┤
│  Path                                    │ Method│ Controller  │
├──────────────────────────────────────────┼───────┼─────────────┤
│  /api/products/{id}/reviews              │  GET  │ Review@index│
│  /api/products/{id}/reviews              │  POST │ Review@store│
│  /api/reviews/{id}                       │  PUT  │ Review@update│
│  /api/reviews/{id}                       │  DELETE│ Review@destroy│
│  /api/driver/orders/{id}/pickup          │  POST │ Order@pickup│
│  /api/driver/orders/{id}/complete        │  POST │ Order@complete│
│  /api/driver/orders/{id}/return          │  POST │ Order@return│
└──────────────────────────────────────────┴───────┴─────────────┘
```

---

## 9.9 DriverOrdersPage: Cara Kerja

Halaman `src/pages/dashboard/driver/OrdersPage.jsx` adalah halaman driver untuk mengelola pesanan. Berbeda dari dashboard (yang hanya menampilkan ringkasan), halaman ini memiliki interaksi penuh.

### 9.9.1 State dan Data

```
DriverOrdersPage
    │
    ├── State Lokal:
    │   ├── activeTab: 'available' | 'active'
    │   ├── returnTarget: order yang akan di-return (atau null)
    │   ├── returnReason: string alasan (untuk modal return)
    │   └── submittingReturn: boolean loading saat submit return
    │
    └── Store:
        └── useOrderStore → { orders, isLoading, fetchOrders,
                               pickupOrder, deliverOrder, returnOrder }
```

### 9.9.2 Tab Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│  Tab: 📦 Pesanan Tersedia   |  🚗 Pesanan Aktif               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  "Tersedia" (activeTab='available'):                            │
│      fetchOrders({ status: 'waiting_shipper' })                 │
│      → tampilkan order yang belum diambil driver manapun        │
│      → tiap order ada tombol [Ambil Pesanan]                   │
│                                                                  │
│  "Aktif" (activeTab='active'):                                  │
│      fetchOrders({ status: 'shipping' })                        │
│      → tampilkan order yang SEDANG ditanggung driver ini        │
│      → tiap order ada tombol [Konfirmasi Selesai] + [Kembalikan]│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Setiap kali `activeTab` berubah, `useEffect` akan memanggil ulang `fetchOrders` dengan status yang sesuai. Ini menjamin data selalu segar saat user pindah tab.

### 9.9.3 Modal Return Order

Tombol "Kembalikan" tidak langsung memanggil API. Ia membuka modal konfirmasi yang meminta driver mengisi alasan:

```
┌──────────────────────────────────────────────────────┐
│  Kembalikan Pesanan ORD-20260720-003                 │
├──────────────────────────────────────────────────────┤
│  Pesanan akan ditandai dikembalikan. Stok produk      │
│  akan di-restore dan saldo buyer akan di-refund.      │
│                                                      │
│  Alasan Pengembalian *                               │
│  ┌──────────────────────────────────────────────┐   │
│  │ Contoh: Alamat tidak ditemukan...            │   │
│  └──────────────────────────────────────────────┘   │
│                         0/500 karakter               │
│                                                      │
│                      [Batal] [Kembalikan Pesanan]    │
└──────────────────────────────────────────────────────┘
```

Tombol "Kembalikan Pesanan" hanya aktif jika `returnReason.trim()` tidak kosong. Ini mencegah submission tanpa alasan.

---

## 9.10 orderStore — Aksi Driver Baru

`orderStore.js` diperluas dengan tiga action baru khusus driver. Semua mengikuti pola yang sama: set loading → call service → update state → clear loading.

```
┌─────────────────────────────────────────────────────────────────┐
│              TIGA ACTION BARU DI orderStore                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  pickupOrder(id)                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  • Panggil orderService.pickup(id)                              │
│  • Jika sukses: update order di state → status: 'shipping'      │
│  • Jika gagal: set error + throw (agar komponen bisa catch)     │
│                                                                  │
│  deliverOrder(id)                                                │
│  ─────────────────────────────────────────────────────────────  │
│  • Panggil orderService.deliver(id)                             │
│  • Jika sukses: update order di state → status: 'completed'     │
│  • Jika gagal: set error + throw                                 │
│                                                                  │
│  returnOrder(id, reason)                                         │
│  ─────────────────────────────────────────────────────────────  │
│  • Panggil orderService.returnOrder(id, reason)                 │
│  • Jika sukses: update order di state → status: 'returned'      │
│               + cancellation_reason diisi                       │
│  • Jika gagal: set error + throw                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Mengapa update state lokal setelah API sukses?**

Setelah action berhasil, komponen memanggil ulang `fetchOrders` untuk mendapatkan data segar dari backend. Namun, update state lokal di store juga dilakukan **sebagai optimisasi UX** — agar UI langsung berubah sebelum response `fetchOrders` kembali, sehingga tidak ada lag visual.

---

## 9.11 Contoh Kode: ReviewController (Backend)

Ini contoh kode yang mewakili pola backend di BAB 9. `store()` dipilih karena mencakup validasi input, cek duplikat, dan save ke database.

```php
// File: app/Http/Controllers/ReviewController.php
public function store(Request $request, int $productId): JsonResponse
{
    $user = $request->user();

    // 1. Validasi input
    $validated = $request->validate([
        'rating'  => ['required', 'integer', 'between:1,5'],
        'comment' => ['nullable', 'string', 'max:1000'],
    ]);

    // 2. Cek produk ada
    $product = Product::find($productId);
    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Produk tidak ditemukan',
        ], 404);
    }

    // 3. Cegah double review (1 user × 1 produk = 1 review)
    $existing = Review::where('user_id', $user->id)
        ->where('product_id', $productId)
        ->first();

    if ($existing) {
        return response()->json([
            'success' => false,
            'message' => 'Kamu sudah pernah mereview produk ini.',
        ], 409); // 409 Conflict
    }

    // 4. Simpan review
    $review = Review::create([
        'user_id'    => $user->id,
        'product_id' => $productId,
        'rating'     => $validated['rating'],
        'comment'    => $validated['comment'] ?? null,
    ]);

    // 5. Load nama reviewer untuk response
    $review->load('user:id,name');

    return response()->json([
        'success' => true,
        'message' => 'Review berhasil dikirim!',
        'data'    => $review,
    ], 201);
}
```

> **Catatan:** `update()` dan `destroy()` mengikuti pola yang sama — cari review, cek `user_id`, lakukan aksi. `index()` lebih sederhana karena tidak butuh autentikasi dan hanya membaca data.

---

## 9.12 Alur Komunikasi Antar File (Ringkasan)

```
┌─────────────────────────────────────────────────────────────────┐
│              KOMUNIKASI ANTAR FILE — BAB 9                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ALUR REVIEW:                                                    │
│  ProductDetailPage                                               │
│    └── reviewService.getForProduct(id)                          │
│    │       └─→ GET /api/products/{id}/reviews                   │
│    │               └─→ ReviewController@index                   │
│    │                       └─→ Review::with('user')->paginate() │
│    │                                                             │
│    └── reviewService.create(id, data)                           │
│            └─→ POST /api/products/{id}/reviews                  │
│                    └─→ ReviewController@store                   │
│                            ├── Validasi                         │
│                            ├── Cek duplikat                     │
│                            └── Review::create()                 │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ALUR DELIVERY:                                                  │
│  DriverOrdersPage                                                │
│    └── useOrderStore.pickupOrder(id)                            │
│    │       └── orderService.pickup(id)                          │
│    │               └─→ POST /api/driver/orders/{id}/pickup      │
│    │                       └─→ OrderController@pickupOrder      │
│    │                               ├── Cek role driver          │
│    │                               ├── Cek status & driver_id   │
│    │                               └── Update status → shipping │
│    │                                                             │
│    └── useOrderStore.returnOrder(id, reason)                    │
│            └── orderService.returnOrder(id, reason)             │
│                    └─→ POST /api/driver/orders/{id}/return      │
│                            └─→ OrderController@returnOrder      │
│                                    ├── DB Transaction           │
│                                    ├── Restore stok             │
│                                    ├── Refund wallet            │
│                                    └── Update status → returned │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9.13 Checklist BAB 9

- [x] Tabel `reviews` (sudah ada sejak BAB 2, dipakai di BAB 9)
- [x] Model `Review.php` dengan relasi, scope, konstanta rating
- [x] `ReviewController` — `index`, `store`, `update`, `destroy`
- [x] Route publik: GET `/api/products/{id}/reviews`
- [x] Route protected: POST reviews, PUT/DELETE `/api/reviews/{id}`
- [x] `reviewService.js` — 4 fungsi: getForProduct, create, update, remove
- [x] `ProductDetailPage.jsx` — section review + modal beri review
- [x] `OrderController` — `pickupOrder`, `completeOrder`, `returnOrder`
- [x] Route driver: pickup, complete, return
- [x] `orderService.js` — tambah pickup, deliver, returnOrder
- [x] `orderStore.js` — tambah pickupOrder, deliverOrder, returnOrder
- [x] `DriverOrdersPage.jsx` — tab available/active + tiga aksi + modal return

---

## 9.14 Ringkasan BAB 9

```
┌─────────────────────────────────────────────────────────────────┐
│                    YANG SUDAH DIPELAJARI                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⭐ SISTEM REVIEW                                               │
│  ✅ Tabel reviews: user_id + product_id + rating + comment      │
│  ✅ Constraint UNIQUE(user_id, product_id): cegah double review │
│  ✅ 4 endpoint: GET (publik), POST, PUT, DELETE (perlu login)   │
│  ✅ ReviewController: validasi, cek duplikat, cek kepemilikan   │
│  ✅ Review tampil di ProductDetailPage: rating + daftar + form  │
│  ✅ reviewService: layer abstraksi HTTP untuk review            │
│                                                                  │
│  🚗 ALUR DELIVERY                                               │
│  ✅ Siklus status: packaging → waiting_shipper → shipping       │
│             → completed / returned                              │
│  ✅ pickupOrder: ambil order (status → shipping)                │
│  ✅ completeOrder: konfirmasi terkirim (status → completed)     │
│  ✅ returnOrder: kembalikan + restore stok + refund wallet      │
│  ✅ DB Transaction pada returnOrder: semua atau tidak sama sekali│
│  ✅ DriverOrdersPage: 2 tab + 3 aksi + modal return + alasan    │
│                                                                  │
│  POLA UNIVERSAL YANG DIPELAJARI:                                 │
│  1. Public vs protected endpoint → diatur di middleware          │
│  2. Cek kepemilikan resource → bandingkan user_id               │
│  3. DB Transaction → untuk operasi multi-tabel yang saling      │
│     bergantung (return: stok + wallet + status)                 │
│  4. 409 Conflict → HTTP status yang tepat untuk duplikat        │
│  5. Modal konfirmasi → UX pattern untuk aksi destruktif         │
│                                                                  │
│  NEXT: BAB 10 - Deployment & Documentation                       │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan:                                                      │
│  1. Deploy backend ke server (VPS / shared hosting)              │
│  2. Deploy frontend ke layanan hosting statis                   │
│  3. Konfigurasi environment production                           │
│  4. Setup domain dan HTTPS                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 10?** [Deployment & Documentation](../10-deployment/10-deployment.md)

---

*Dokumentasi ini ditulis dengan fokus cara kerja, alur data, dan komunikasi antar file.*
*Update terakhir: 2026-07-23*
*Mengikuti aturan: satu contoh kode per topik (ReviewController@store sebagai perwakilan).*
