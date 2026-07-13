# BAB 6: Backend - Store & Product Management

> **Tujuan:** Membuat fitur backend untuk Seller mengelola Toko dan Produknya, termasuk CRUD operations, validasi, dan authorization berbasis role

---

## 6.1 Recap: Apa yang Sudah Kita Pelajari

Di BAB 3, kita sudah membuat:
- **Database Migration** - Tabel users, roles, user_roles
- **Models** - User, Role
- **Authentication** - Register, Login, Logout dengan Sanctum
- **Middleware** - Role-based access control

**Sekarang:** Kita akan membuat:
- **Store Management** - Seller bisa punya toko
- **Product Management** - CRUD produk untuk Seller
- **Store API** - Endpoint untuk public dan seller
- **Product API** - Endpoint dengan authorization

---

## 6.2 Apa itu Store dan Product?

### 6.2.1 Penjelasan Sederhana

```
┌─────────────────────────────────────────────────────────────────┐
│                     ANALOGI PASAR TRADISIONAL                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏪 TOKO (Store)                                                │
│  ─────────────────────────────────────────────────────────────   │
│  Bayangkan toko di pasar:                                        │
│  • "Warung Bu Siti" di blok A5                                │
│  • Milik 1 orang (Seller)                                       │
│  • Bisa punya banyak barang (Products)                           │
│  • Nama toko harus unik di pasar itu                            │
│                                                                  │
│  📦 PRODUK (Product)                                           │
│  ─────────────────────────────────────────────────────────────   │
│  Barang-barang yang dijual di toko:                             │
│  • "Nasi Goreng" → Rp 25.000                                 │
│  • "Ayam Geprek" → Rp 22.000                                 │
│  • "Es Teh" → Rp 5.000                                        │
│                                                                  │
│  Hubungan:                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1 TOKO punya BANYAK PRODUK                            │   │
│  │                                                          │   │
│  │  ┌──────────┐                                           │   │
│  │  │ TOKO     │                                           │   │
│  │  │ Dapur    │──┬── "Nasi Goreng" → Rp 25.000          │   │
│  │  │ Budi     │  ├── "Ayam Geprek" → Rp 22.000          │   │
│  │  │          │  └── "Mie Ayam" → Rp 20.000              │   │
│  │  └──────────┘                                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2.2 Aturan Penting

```
┌─────────────────────────────────────────────────────────────────┐
│                    ATURAN STORE & PRODUCT                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📌 ATURAN TOKO (Store)                                         │
│  ─────────────────────────────────────────────────────────────   │
│  ✓ 1 Seller = 1 Toko (1 user hanya boleh punya 1 toko)        │
│  ✓ Nama toko harus UNIK (tidak boleh sama dengan toko lain)     │
│  ✓ Toko punya informasi: nama, alamat, telepon, deskripsi        │
│                                                                  │
│  📌 ATURAN PRODUK (Product)                                     │
│  ─────────────────────────────────────────────────────────────   │
│  ✓ Produk selalu milik 1 toko                                   │
│  ✓ Produk punya: nama, harga, stok, deskripsi, gambar          │
│  ✓ Harga disimpan sebagai INTEGER (tanpa koma)                  │
│  ✓ Stok 0 = barang habis                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6.3 Struktur Database Store & Product

### 6.3.1 Diagram Tabel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TABEL STORES                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  FIELD         │  TIPE        │  KETERANGAN                      │     │
│  ├───────────────┼──────────────┼─────────────────────────────────┤     │
│  │  id           │  bigint      │  Primary Key, auto increment     │     │
│  │  user_id      │  bigint     │  Foreign Key ke users (UNIK!)   │     │
│  │  name         │  varchar    │  Nama toko (UNIK!)              │     │
│  │  description  │  text       │  Deskripsi toko (nullable)       │     │
│  │  address      │  varchar    │  Alamat toko                     │     │
│  │  phone        │  varchar    │  Telepon toko                   │     │
│  │  logo_url    │  varchar    │  URL logo toko (nullable)        │     │
│  │  is_active    │  boolean    │  Toko aktif atau tidak           │     │
│  │  created_at  │  timestamp  │  Waktu dibuat                     │     │
│  │  updated_at  │  timestamp  │  Waktu diupdate                  │     │
│  └───────────────┴──────────────┴─────────────────────────────────┘     │
│                                                                         │
│  KEY POINTS:                                                          │
│  • user_id = UNIQUE → 1 user hanya bisa punya 1 toko                 │
│  • name = UNIQUE → Tidak boleh ada 2 toko dengan nama sama           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         TABEL PRODUCTS                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  FIELD         │  TIPE        │  KETERANGAN                      │     │
│  ├───────────────┼──────────────┼─────────────────────────────────┤     │
│  │  id           │  bigint      │  Primary Key                     │     │
│  │  store_id    │  bigint     │  Foreign Key ke stores            │     │
│  │  name         │  varchar    │  Nama produk                     │     │
│  │  description  │  text       │  Deskripsi produk                │     │
│  │  price        │  integer    │  Harga (INTEGER, bukan decimal!) │     │
│  │  stock        │  integer    │  Stok barang (default 0)        │     │
│  │  image_url    │  varchar    │  URL gambar produk (nullable)     │     │
│  │  is_active    │  boolean    │  Produk aktif atau tidak         │     │
│  │  created_at  │  timestamp  │  Waktu dibuat                    │     │
│  │  updated_at  │  timestamp  │  Waktu diupdate                  │     │
│  └───────────────┴──────────────┴─────────────────────────────────┘     │
│                                                                         │
│  KEY POINTS:                                                          │
│  • store_id = Foreign Key → Produk selalu milik 1 toko                │
│  • price = INTEGER → Rp 25.000 disimpan sebagai 25000               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3.2 Relasi Antar Tabel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RELASI ANTAR TABEL                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  USERS ──────────< STORES ──────────< PRODUCTS                           │
│    │                 │                                                  │
│    │ 1 Seller        │ 1 Store                                         │
│    │ punya 1 Toko   │ punya banyak Produk                              │
│    │                 │                                                  │
│    │                 │                                                  │
│  ┌─┴───────────────┐ │                                                  │
│  │                 │ │                                                  │
│  │ Store::find(1) │ │                                                  │
│  │ → $store->user │ │                                                  │
│  │ → $store->products                                                │
│  │                 │ │                                                  │
│  └─────────────────┘ └───────────────────────────────────────────────┘ │
│                                                                         │
│  CONTOH:                                                              │
│  $toko = Store::find(1);                                              │
│  echo $toko->user->name;      // "Budi"                               │
│  echo $toko->products->count(); // 15                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6.4 Model Store - Penjelasan Detail

### 6.4.1 File: app/Models/Store.php

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ISI FILE STORE.PHP                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  namespace App\Models;                                                  │
│                                                                         │
│  class Store extends Model                                              │
│  ├── protected $fillable = [...]    → Field yang boleh di-isi massal   │
│  ├── protected $casts = [...]        → Konversi tipe data               │
│  ├── public function user()          → Relasi: toko punya 1 pemilik     │
│  ├── public function products()       → Relasi: toko punya banyak produk │
│  ├── public function scopeActive()    → Filter toko yang aktif          │
│  ├── public function scopeSearch()    → Cari toko berdasarkan nama      │
│  ├── getFormattedPriceRangeAttribute → Format range harga produk         │
│  ├── getActiveProductsCountAttribute  → Hitung produk aktif              │
│  ├── isOwnedBy()                     → Cek apakah dimiliki user tertentu │
│  └── canBeEditedBy()                 → Cek apakah bisa diedit user    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.4.2 Penjelasan Setiap Bagian

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PENJELASAN SETIAP BAGIAN                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣  $fillable = [...]                                              │
│  ─────────────────────────────────────────────────────────────────────  │
│  FIELD yang BOLEH di-set saat membuat/mengupdate data.                  │
│                                                                         │
│  Contoh:                                                               │
│  Store::create([                                                       │
│      'user_id' => 1,              ← BOLEH (ada di fillable)          │
│      'name' => 'Dapur Budi',      ← BOLEH (ada di fillable)          │
│      'is_active' => true          ← TIDAK BOLEH (tidak ada di fillable)│
│  ]);                                                                   │
│                                                                         │
│  2️⃣  $casts = [...]                                                  │
│  ─────────────────────────────────────────────────────────────────────  │
│  KONVERSI OTOMATIS tipe data saat dibaca dari database.                 │
│                                                                         │
│  'is_active' => 'boolean'                                              │
│  → Database: 1 atau 0                                                │
│  → PHP: true atau false                                                │
│                                                                         │
│  3️⃣  RELASI (user, products)                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│  CARA mengakses data dari tabel lain yang terkait.                       │
│                                                                         │
│  $store->user         → Dapat data pemilik toko                        │
│  $store->products     → Dapat semua produk toko                        │
│                                                                         │
│  4️⃣  SCOPES (scopeActive, scopeSearch)                               │
│  ─────────────────────────────────────────────────────────────────────  │
│  QUERY yang sering dipakai, bisa chaining.                               │
│                                                                         │
│  Store::active()->get()           → Semua toko aktif                   │
│  Store::search('dapur')->get()   → Cari toko "dapur"                 │
│                                                                         │
│  5️⃣  ACCESSORS (getXxxAttribute)                                    │
│  ─────────────────────────────────────────────────────────────────────  │
│  MEMFORMAT data saat DIAMBIL dari database.                             │
│                                                                         │
│  $store->formatted_price_range → "Rp 10.000 - Rp 100.000"           │
│                                                                         │
│  6️⃣  HELPER METHODS (isOwnedBy, canBeEditedBy)                        │
│  ─────────────────────────────────────────────────────────────────────  │
│  FUNGSI helper untuk cek kondisi tertentu.                              │
│                                                                         │
│  $store->isOwnedBy(1) → true/false                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.4.3 Contoh Kode Store Model

```php
<?php
// app/Models/Store.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    // Field yang boleh di-set massal (create, update)
    protected $fillable = [
        'user_id',      // Siapa pemilik toko
        'name',         // Nama toko
        'description',  // Deskripsi
        'address',      // Alamat
        'phone',        // Telepon
        'logo_url',     // URL logo
    ];

    // Konversi tipe data otomatis
    protected $casts = [
        'is_active' => 'boolean',  // 0/1 → true/false
    ];

    // ============================================
    // RELASI: Hubungan dengan tabel lain
    // ============================================

    /**
     * Toko dimiliki oleh 1 User (Seller)
     * Usage: $store->user->name
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Toko punya banyak Products
     * Usage: $store->products
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // ============================================
    // SCOPES: Query yang sering dipakai
    // ============================================

    /**
     * Scope: Hanya toko yang aktif
     * Usage: Store::active()->get()
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Cari toko berdasarkan nama
     * Usage: Store::search('dapur')->get()
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('name', 'LIKE', "%{$keyword}%");
    }

    // ============================================
    // ACCESSORS: Format data saat diambil
    // ============================================

    /**
     * Accessor: Range harga produk toko
     * Usage: $store->formatted_price_range → "Rp 10.000 - Rp 50.000"
     */
    public function getFormattedPriceRangeAttribute(): string
    {
        if ($this->products->isEmpty()) {
            return 'Tidak ada produk';
        }

        $min = $this->products->min('price');
        $max = $this->products->max('price');

        return 'Rp ' . number_format($min, 0, ',', '.') . ' - Rp ' . number_format($max, 0, ',', '.');
    }

    // ============================================
    // HELPER: Fungsi bantu
    // ============================================

    /**
     * Cek apakah toko dimiliki user tertentu
     * Usage: $store->isOwnedBy(auth()->id())
     */
    public function isOwnedBy(int $userId): bool
    {
        return $this->user_id === $userId;
    }
}
```

---

## 6.5 Model Product - Penjelasan Detail

### 6.5.1 File: app/Models/Product.php

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ISI FILE PRODUCT.PHP                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  namespace App\Models;                                                  │
│                                                                         │
│  class Product extends Model                                             │
│  ├── protected $fillable = [...]    → Field yang boleh di-isi massal    │
│  ├── protected $casts = [...]        → Konversi tipe data               │
│  ├── public function store()         → Relasi: produk milik 1 toko       │
│  ├── public function scopeActive()   → Filter produk aktif              │
│  ├── public function scopeInStock()  → Filter produk ada stok           │
│  ├── public function scopeSearch()   → Cari produk berdasarkan nama     │
│  ├── public function getFormattedPriceAttribute → Format harga (Rp)       │
│  ├── public function getHasStockAttribute      → Cek ada stok atau tidak  │
│  ├── public function setPriceAttribute()      → Set harga (bersihkan)   │
│  ├── reduceStock()                   → Kurangi stok                       │
│  └── addStock()                     → Tambah stok                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.5.2 Penjelasan Konsep Penting

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    KONSEP PENTING PRODUK                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣  HARGA SEBAGAI INTEGER                                             │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  ❌ SALAH: Simpan sebagai string/decimal                                │
│     "25000.00" atau 25000.00                                           │
│     → Bisa ada masalah presisi (25.0001, 24.9999)                      │
│                                                                         │
│  ✅ BENAR: Simpan sebagai INTEGER                                       │
│     25000 = Rp 25.000                                                 │
│     → Selalu tepat, tidak ada koma aneh                                  │
│                                                                         │
│  📍 KENAPA INTEGER?                                                     │
│  ─────────────────────────────────────────────────────────────────────  │
│  Karena uang membutuhkan PRESISI.                                        │
│                                                                         │
│  Contoh masalah dengan float:                                            │
│  $harga = 0.1 + 0.2;                                                  │
│  echo $harga; // 0.30000000000000004 ❌                                 │
│                                                                         │
│  Contoh dengan integer:                                                  │
│  $harga = 10000 + 20000;  // = 30000 ✓                                │
│                                                                         │
│  2️⃣  STOK = 0 vs PRODUK NONAKTIF                                     │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  Stok = 0                                                              │
│  → Produk masih AKTIF, tapi barang HABIS                                │
│  → Nanti bisa restok                                                   │
│                                                                         │
│  is_active = false                                                     │
│  → Produk DINONAKTIFKAN                                                │
│  → Tidak ditampilkan di listing                                          │
│  → Bukan dihapus, tapi "disembunyikan"                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.5.3 Contoh Kode Product Model

```php
<?php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    // Field yang boleh di-set massal
    protected $fillable = [
        'store_id',    // Milik toko apa
        'name',        // Nama produk
        'description', // Deskripsi
        'price',       // Harga (sebagai INTEGER!)
        'stock',       // Stok
        'image_url',   // URL gambar
    ];

    // Konversi tipe data otomatis
    protected $casts = [
        'price' => 'integer',      // Pastikan price selalu integer
        'stock' => 'integer',     // Pastikan stock selalu integer
        'is_active' => 'boolean',
    ];

    // ============================================
    // RELASI
    // ============================================

    /**
     * Produk dimiliki oleh 1 Store
     * Usage: $product->store->name
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    // ============================================
    // SCOPES
    // ============================================

    /**
     * Scope: Hanya produk aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Hanya produk yang ada stoknya
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    // ============================================
    // ACCESSORS & MUTATORS
    // ============================================

    /**
     * Accessor: Format harga untuk display
     * Usage: $product->formatted_price → "Rp 25.000"
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    /**
     * Accessor: Cek apakah stok cukup
     * Usage: $product->has_stock → true/false
     */
    public function getHasStockAttribute(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Mutator: Set harga dari input user
     * Usage: $product->price = "Rp 25.000" → tersimpan 25000
     */
    public function setPriceAttribute($value)
    {
        // Hapus semua karakter non-angka: "Rp ", ".", ","
        $cleaned = preg_replace('/[^0-9]/', '', $value);
        $this->attributes['price'] = (int) $cleaned;
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    /**
     * Kurangi stok
     * Usage: $product->reduceStock(2)
     */
    public function reduceStock(int $quantity): bool
    {
        if ($this->stock < $quantity) {
            return false; // Stok tidak cukup
        }

        $this->decrement('stock', $quantity);
        return true;
    }

    /**
     * Tambah stok
     * Usage: $product->addStock(10)
     */
    public function addStock(int $quantity): void
    {
        $this->increment('stock', $quantity);
    }
}
```

---

## 6.6 Controller Store - Penjelasan Detail

### 6.6.1 File: app/Http/Controllers/StoreController.php

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ISI FILE STORECONTROLLER.PHP                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  class StoreController extends Controller                                 │
│  ├── public function index()      → Lihat semua toko (PUBLIC)            │
│  ├── public function show()       → Lihat detail 1 toko (PUBLIC)        │
│  ├── public function myStore()     → Lihat toko sendiri (SELLER)         │
│  ├── public function store()       → Buat toko baru (SELLER)             │
│  └── public function update()      → Update toko sendiri (SELLER)         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.6.2 Endpoint API Store

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ENDPOINT API STORE                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🌐 PUBLIC (Tanpa login bisa akses)                                      │
│  ─────────────────────────────────────────────────────────────────────  │
│  GET  /api/stores           → Lihat semua toko                         │
│  GET  /api/stores/{id}     → Lihat detail 1 toko                     │
│                                                                         │
│  🔐 PROTECTED (Harus login sebagai SELLER)                              │
│  ─────────────────────────────────────────────────────────────────────  │
│  POST /api/stores           → Buat toko baru                            │
│  GET  /api/stores/my       → Lihat toko sendiri                        │
│  PUT  /api/stores/my       → Update toko sendiri                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.6.3 Alur Kerja: Seller Membuat Toko

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ALUR: SELLER MEMBUAT TOKO                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣  CEK AUTHENTICATION (Siapa?)                                       │
│  ─────────────────────────────────────────────────────────────────────  │
│  User kirim request dengan token                                        │
│  ↓                                                                    │
│  Sanctum cek token valid?                                              │
│  ↓ Valid                                                               │
│  Dapat user_id dari token                                              │
│                                                                         │
│  2️⃣  CEK AUTHORIZATION (Boleh apa?)                                    │
│  ─────────────────────────────────────────────────────────────────────  │
│  User punya role 'seller'?                                             │
│  ↓ Tidak                                                               │
│  ❌ 403 Forbidden: "Hanya seller"                                       │
│  ↓ Ya                                                                  │
│  User sudah punya toko?                                                 │
│  ↓ Sudah                                                               │
│  ❌ 400 Bad Request: "Sudah punya toko"                               │
│  ↓ Belum                                                               │
│  ✅ Lanjut ke create                                                   │
│                                                                         │
│  3️⃣  VALIDASI INPUT (Data benar?)                                      │
│  ─────────────────────────────────────────────────────────────────────  │
│  name: required, unique, max:255                                        │
│  address: required, string                                             │
│  phone: required, string                                               │
│  ↓ Ada yang salah                                                      │
│  ❌ 422 Validation Error                                              │
│  ↓ Semua benar                                                         │
│  ✅ Lanjut ke create                                                   │
│                                                                         │
│  4️⃣  CREATE DATA                                                      │
│  ─────────────────────────────────────────────────────────────────────  │
│  INSERT INTO stores (user_id, name, ...) VALUES (1, 'Dapur Budi', ...) │
│  ↓                                                                    │
│  ✅ Toko berhasil dibuat!                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.6.4 Contoh Kode StoreController

```php
<?php
// app/Http/Controllers/StoreController.php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    // ============================================
    // 🌐 PUBLIC: Bisa diakses semua orang
    // ============================================

    /**
     * GET /api/stores
     * Lihat semua toko aktif
     */
    public function index(): JsonResponse
    {
        // Ambil semua toko yang aktif, urut dari terbaru
        $stores = Store::with('user:id,name')  // Eager load: sekalian ambil nama seller
                      ->active()                // Scope: is_active = true
                      ->withCount('products')    // Tambah field: products_count
                      ->latest()               // Urut dari terbaru
                      ->paginate(12);          // Pagination: 12 per halaman

        return response()->json([
            'success' => true,
            'data' => $stores->items(),
            'meta' => [
                'current_page' => $stores->currentPage(),
                'per_page' => $stores->perPage(),
                'total' => $stores->total(),
                'last_page' => $stores->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/stores/{id}
     * Lihat detail 1 toko
     */
    public function show(int $id): JsonResponse
    {
        // Ambil toko beserta produk-prodaknya
        $store = Store::with([
            'user:id,name,email',                          // Info seller
            'products' => function ($query) {              // Produk aktif & ada stok
                $query->active()->inStock()->latest();
            }
        ])->find($id);

        // Kalau tidak ketemu
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }

    // ============================================
    // 🔐 PROTECTED: Seller saja
    // ============================================

    /**
     * GET /api/stores/my
     * Lihat toko sendiri (hanya untuk seller yang sudah punya toko)
     */
    public function myStore(): JsonResponse
    {
        $user = auth()->user();

        // Cek apakah punya toko
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 404);
        }

        // Ambil toko beserta semua produknya
        $store = Store::with('products')->find($user->store->id);

        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }

    /**
     * POST /api/stores
     * Buat toko baru
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        // ==========================================
        // CEK AUTHORIZATION
        // ==========================================
        // Cek apakah punya role seller
        if (!$user->hasRole('seller')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya seller yang bisa membuat toko',
            ], 403);
        }

        // Cek apakah sudah punya toko
        if ($user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memiliki toko',
            ], 400);
        }

        // ==========================================
        // VALIDASI INPUT
        // ==========================================
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:stores,name',
            'description' => 'nullable|string|max:1000',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
        ]);

        // ==========================================
        // CREATE DATA
        // ==========================================
        $store = Store::create([
            'user_id' => $user->id,           // Pemilik = user yang login
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'],
            'phone' => $validated['phone'],
            'is_active' => true,              // Langsung aktif
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil dibuat!',
            'data' => $store,
        ], 201);
    }

    /**
     * PUT /api/stores/my
     * Update toko sendiri
     */
    public function update(Request $request): JsonResponse
    {
        $user = auth()->user();

        // Cek apakah punya toko
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        // Validasi input (mirip store, tapi field optional)
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:stores,name,' . $user->store->id,
            'description' => 'nullable|string|max:1000',
            'address' => 'sometimes|string|max:500',
            'phone' => 'sometimes|string|max:20',
        ]);

        // Update data
        $user->store->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil diupdate!',
            'data' => $user->store->fresh(),  // Ambil data terbaru
        ]);
    }
}
```

---

## 6.7 Controller Product - Penjelasan Detail

### 6.7.1 File: app/Http/Controllers/ProductController.php

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ISI FILE PRODUCTCONTROLLER.PHP                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  class ProductController extends Controller                              │
│  ├── public function index()        → Lihat semua produk (PUBLIC)       │
│  ├── public function show()         → Lihat detail 1 produk (PUBLIC)    │
│  ├── public function myProducts()   → Lihat produk sendiri (SELLER)     │
│  ├── public function myProductsStats() → Statistik produk (SELLER)       │
│  ├── public function store()        → Tambah produk (SELLER)             │
│  ├── public function update()       → Update produk (SELLER)             │
│  └── public function destroy()      → Hapus produk (SELLER, soft)      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.7.2 Endpoint API Product

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ENDPOINT API PRODUCT                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🌐 PUBLIC (Tanpa login)                                               │
│  ─────────────────────────────────────────────────────────────────────  │
│  GET  /api/products           → Lihat semua produk aktif & ada stok     │
│  GET  /api/products/{id}     → Lihat detail 1 produk                  │
│                                                                         │
│  🔐 PROTECTED (Seller saja)                                           │
│  ─────────────────────────────────────────────────────────────────────  │
│  GET    /api/seller/products        → Lihat semua produk sendiri       │
│  GET    /api/seller/products/stats → Statistik produk sendiri           │
│  POST   /api/seller/products        → Tambah produk baru               │
│  PUT    /api/seller/products/{id}  → Update produk                    │
│  DELETE /api/seller/products/{id}  → Hapus produk (soft delete)       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.7.3 Alur Kerja: Seller Menambah Produk

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ALUR: SELLER MENAMBAH PRODUK                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣  CEK AUTHENTICATION                                              │
│  User kirim request dengan token                                        │
│  ↓                                                                    │
│  Sanctum validasi token                                                │
│  ↓ Valid → Dapat user_id                                              │
│                                                                         │
│  2️⃣  CEK SELLER & STORE                                              │
│  User punya role 'seller'?                                             │
│  ↓ Tidak → ❌ 403                                                     │
│  ↓ Ya → Lanjut                                                        │
│  User punya toko?                                                      │
│  ↓ Tidak → ❌ 400 "Harus buat toko dulu"                             │
│  ↓ Ya → Lanjut → Dapat store_id                                       │
│                                                                         │
│  3️⃣  VALIDASI INPUT                                                  │
│  name: required, string, max:255                                       │
│  price: required, integer, min:100, max:999999999                      │
│  stock: required, integer, min:0, max:999999                           │
│  ↓ Tidak valid → ❌ 422 Validation Error                              │
│  ↓ Valid → Lanjut                                                     │
│                                                                         │
│  4️⃣  CREATE PRODUCT                                                  │
│  INSERT INTO products (store_id, name, price, stock, ...)              │
│  VALUES (1, 'Nasi Goreng', 25000, 50, ...)                           │
│  ↓                                                                    │
│  ✅ Produk berhasil dibuat!                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.7.4 Contoh Kode ProductController

```php
<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // ============================================
    // 🌐 PUBLIC: Bisa diakses semua orang
    // ============================================

    /**
     * GET /api/products
     * Lihat semua produk (hanya yang aktif & ada stok)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('store:id,name')  // Ambil info toko
                      ->active()                  // is_active = true
                      ->inStock();               // stock > 0

        // Filter: cari nama produk
        if ($search = $request->get('search')) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        // Filter: berdasarkan toko tertentu
        if ($storeId = $request->get('store_id')) {
            $query->where('store_id', $storeId);
        }

        // Filter: range harga
        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', (int) $minPrice);
        }
        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', (int) $maxPrice);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = (int) $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/products/{id}
     * Lihat detail 1 produk
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::with([
            'store:id,name,description,address,phone',
            'store.user:id,name'
        ])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // Produk nonaktif hanya bisa dilihat owner
        if (!$product->is_active) {
            $user = auth()->user();
            if (!$user || !$product->isOwnedByUser($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produk tidak ditemukan',
                ], 404);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    // ============================================
    // 🔐 PROTECTED: Seller saja
    // ============================================

    /**
     * GET /api/seller/products
     * Lihat semua produk sendiri (termasuk yang nonaktif)
     */
    public function myProducts(): JsonResponse
    {
        $user = auth()->user();

        // Cek apakah punya toko
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 404);
        }

        // Ambil semua produk toko ini (termasuk nonaktif)
        $products = Product::where('store_id', $user->store->id)
                          ->latest()
                          ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    /**
     * POST /api/seller/products
     * Tambah produk baru
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        // Cek apakah punya toko
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus membuat toko terlebih dahulu',
            ], 400);
        }

        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|integer|min:100|max:999999999',
            'stock' => 'required|integer|min:0|max:999999',
            'image_url' => 'nullable|url|max:500',
        ]);

        // Buat produk
        $product = Product::create([
            'store_id' => $user->store->id,    // Otomatis dari toko seller
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'image_url' => $validated['image_url'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan!',
            'data' => $product,
        ], 201);
    }

    /**
     * PUT /api/seller/products/{id}
     * Update produk
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = auth()->user();

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // ⭐ SECURITY: Cek kepemilikan
        if (!$product->isOwnedByUser($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke produk ini',
            ], 403);
        }

        // Validasi input
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'sometimes|integer|min:100|max:999999999',
            'stock' => 'sometimes|integer|min:0|max:999999',
            'image_url' => 'nullable|url|max:500',
        ]);

        // Update data
        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diupdate!',
            'data' => $product->fresh(),
        ]);
    }

    /**
     * DELETE /api/seller/products/{id}
     * Hapus produk (SOFT DELETE - hanya nonaktifkan)
     */
    public function destroy(int $id): JsonResponse
    {
        $user = auth()->user();

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // Cek kepemilikan
        if (!$product->isOwnedByUser($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke produk ini',
            ], 403);
        }

        // SOFT DELETE: Set is_active = false
        // BUKAN hapus permanen, karena mungkin ada order yang reference
        $product->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}
```

---

## 6.8 Request Validation - Penjelasan Detail

### 6.8.1 Apa itu Request Validation?

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    APA ITU REQUEST VALIDATION?                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Request Validation = MEMASTIKAN data yang masuk SUDAH BENAR              │
│                                                                         │
│  Tanpa Validation:                                                      │
│  ─────────────────                                                     │
│  User bisa kirim data SALAH:                                           │
│  • name: ""                    → Nama kosong!                         │
│  • price: "sepulu"            → Harga bukan angka!                    │
│  • email: "budi@budi"         → Email tidak valid!                   │
│                                                                         │
│  Dengan Validation:                                                    │
│  ───────────────────                                                   │
│  Request::validate([                                                   │
│      'name' => 'required',          → Wajib ada, tidak kosong         │
│      'price' => 'integer|min:100', → Harus angka, minimal 100        │
│      'email' => 'email',           → Harus format email valid         │
│  ]);                                                                  │
│  ↓ Data tidak valid? → ❌ 422 Validation Error + pesan error          │
│  ↓ Data valid? → Lanjut ke controller                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.8.2 Rule Validation yang Sering Dipakai

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RULE VALIDATION YANG SERING DIPAKAI                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  required       → Wajib diisi, tidak boleh kosong                        │
│  nullable       → Boleh kosong (null)                                    │
│  string         → Harus teks                                             │
│  integer        → Harus angka bulat                                       │
│  numeric        → Harus angka (bisa desimal)                            │
│  boolean        → Harus true/false/1/0                                  │
│  email          → Harus format email valid                               │
│  url            → Harus URL valid (http://...)                          │
│  min:N          → Minimal N karakter/angka                               │
│  max:N          → Maksimal N karakter/angka                             │
│  unique:table   → Tidak boleh sama dengan data lain di tabel             │
│  exists:table   → Harus ada di tabel tertentu                           │
│  in:a,b,c       → Harus salah satu dari: a, b, atau c                 │
│  sometimes      → Hanya divalidasi jika ada di request                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.8.3 Contoh Kode CreateProductRequest

```php
<?php
// app/Http/Requests/CreateProductRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    /**
     * Apakah user boleh melakukan request ini?
     * Dipanggil SEBELUM validasi
     */
    public function authorize(): bool
    {
        // User harus login
        if (!auth()->check()) {
            return false;
        }

        // User harus punya role seller
        if (!auth()->user()->hasRole('seller')) {
            return false;
        }

        // User harus punya toko
        if (!auth()->user()->store) {
            return false;
        }

        return true;
    }

    /**
     * Rule validasi untuk setiap field
     */
    public function rules(): array
    {
        return [
            // Nama produk
            'name' => [
                'required',              // Wajib diisi
                'string',               // Harus teks
                'max:255',              // Maksimal 255 karakter
            ],

            // Deskripsi (nullable = boleh kosong)
            'description' => [
                'nullable',             // Boleh kosong
                'string',               // Jika ada, harus teks
                'max:2000',            // Maksimal 2000 karakter
            ],

            // Harga
            'price' => [
                'required',             // Wajib diisi
                'integer',             // Harus ANGKA BULAT (bukan desimal)
                'min:100',             // Minimal Rp 100
                'max:999999999',       // Maksimal ~1 miliar
            ],

            // Stok
            'stock' => [
                'required',             // Wajib diisi
                'integer',             // Harus angka bulat
                'min:0',              // Minimal 0 (boleh kosong/habis)
                'max:999999',          // Maksimal 999.999
            ],

            // Gambar (nullable = boleh kosong)
            'image_url' => [
                'nullable',             // Boleh kosong
                'url',                  // Jika ada, harus URL valid
                'max:500',             // Maksimal 500 karakter
            ],
        ];
    }

    /**
     * Pesan error kustom (Bahasa Indonesia)
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi',
            'name.max' => 'Nama produk maksimal 255 karakter',

            'price.required' => 'Harga produk wajib diisi',
            'price.integer' => 'Harga harus berupa angka bulat',
            'price.min' => 'Harga minimal Rp 100',
            'price.max' => 'Harga maksimal Rp 1.000.000.000',

            'stock.required' => 'Stok produk wajib diisi',
            'stock.integer' => 'Stok harus berupa angka bulat',
            'stock.min' => 'Stok minimal 0 (kosong)',
            'stock.max' => 'Stok maksimal 999.999',

            'image_url.url' => 'URL gambar tidak valid',
        ];
    }

    /**
     * Normalisasi data SEBELUM validasi
     * Dipanggil sebelum rules diterapkan
     */
    protected function prepareForValidation(): void
    {
        // Jika price ada dan berupa string dengan formatting
        if ($this->has('price') && is_string($this->price)) {
            // Hapus karakter non-angka: "Rp ", ".", ","
            $cleaned = preg_replace('/[^0-9]/', '', $this->price);
            $this->merge(['price' => (int) $cleaned]);
        }

        // Pastikan stock adalah integer
        if ($this->has('stock')) {
            $this->merge(['stock' => (int) $this->stock]);
        }
    }
}
```

---

## 6.9 Routes API - Penjelasan Detail

### 6.9.1 File: routes/api.php

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ISI FILE ROUTES/API.PHP                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Fungsi: Mendefinisikan SEMUA endpoint API yang tersedia                  │
│                                                                         │
│  Struktur dasar:                                                        │
│  Route::METHOD('/uri', [Controller::class, 'method']);                  │
│                                                                         │
│  HTTP Methods:                                                          │
│  GET    → Ambil data (READ)                                            │
│  POST   → Buat data baru (CREATE)                                       │
│  PUT    → Update seluruh data (UPDATE)                                  │
│  DELETE → Hapus data (DELETE)                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.9.2 Route Groups

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ROUTE GROUPS                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  prefix('stores')                                                       │
│  ───────────────────                                                    │
│  Menambahkan prefix di URI                                              │
│                                                                         │
│  Route::get('/', ...)        → GET /api/stores                         │
│  Route::get('/{id}', ...)  → GET /api/stores/1                        │
│                                                                         │
│  middleware('auth:sanctum')                                             │
│  ──────────────────────────                                            │
│  Semua route di dalam group HARUS punya token valid                      │
│                                                                         │
│  Route::get('/me', ...)  → ❌ 401 jika tidak ada token                │
│                                                                         │
│  Contoh kombinasi:                                                     │
│  Route::prefix('stores')->middleware('auth:sanctum')->group(function(){ │
│      // Semua route di sini:                                            │
│      // 1. Harus login (ada token)                                    │
│      // 2. Punya prefix /api/stores                                    │
│  });                                                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.9.3 Contoh Kode Routes

```php
<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Tanpa autentikasi)
|--------------------------------------------------------------------------
| Siapa saja bisa akses - Guest maupun User yang sudah login
*/

// Store routes - Publik
Route::prefix('stores')->group(function () {
    // GET /api/stores - List semua toko aktif
    Route::get('/', [StoreController::class, 'index']);

    // GET /api/stores/{id} - Detail toko
    Route::get('/{id}', [StoreController::class, 'show'])
        ->where('id', '[0-9]+');  // Cegah SQL injection
});

// Product routes - Publik
Route::prefix('products')->group(function () {
    // GET /api/products - List semua produk aktif
    Route::get('/', [ProductController::class, 'index']);

    // GET /api/products/{id} - Detail produk
    Route::get('/{id}', [ProductController::class, 'show'])
        ->where('id', '[0-9]+');
});

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Harus autentikasi)
|--------------------------------------------------------------------------
| Semua route di bawah ini MEMBUTUHKAN token valid
*/

Route::middleware('auth:sanctum')->group(function () {

    // Seller Products
    Route::prefix('seller/products')->group(function () {
        // GET /api/seller/products - List produk sendiri
        Route::get('/', [ProductController::class, 'myProducts']);

        // POST /api/seller/products - Tambah produk
        Route::post('/', [ProductController::class, 'store']);

        // PUT /api/seller/products/{id} - Update produk
        Route::put('/{id}', [ProductController::class, 'update'])
            ->where('id', '[0-9]+');

        // DELETE /api/seller/products/{id} - Hapus produk
        Route::delete('/{id}', [ProductController::class, 'destroy'])
            ->where('id', '[0-9]+');
    });
});
```

---

## 6.10 Ringkasan BAB 6

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RINGKASAN BAB 6                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📦 YANG SUDAH DIBUAT:                                                  │
│  ────────────────────────────────────────────────────────────────────     │
│                                                                         │
│  DATABASE:                                                              │
│  ├── stores          → Tabel toko                                      │
│  └── products         → Tabel produk                                    │
│                                                                         │
│  MODELS:                                                                │
│  ├── Store.php          → Relasi, scopes, accessors                     │
│  └── Product.php        → Relasi, scopes, price formatting              │
│                                                                         │
│  CONTROLLERS:                                                           │
│  ├── StoreController.php  → CRUD toko                                   │
│  └── ProductController.php → CRUD produk                                │
│                                                                         │
│  ROUTES:                                                                │
│  ├── Public: /stores, /products                                        │
│  └── Seller: /seller/products (CRUD)                                  │
│                                                                         │
│  ────────────────────────────────────────────────────────────────────     │
│                                                                         │
│  💡 KONSEP PENTING:                                                    │
│  ────────────────────────────────────────────────────────────────────     │
│                                                                         │
│  1. 1 Seller = 1 Store → user_id di stores = UNIQUE                   │
│  2. Harga sebagai INTEGER → 25000 = Rp 25.000                          │
│  3. Soft Delete → is_active = false, bukan hapus permanen              │
│  4. Ownership Check → Seller hanya bisa edit produk SENDIRI              │
│  5. Validation → Selalu validasi input SEBELUM simpan                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6.11 Checklist BAB 6

- [ ] Migration: stores dan products
- [ ] Model: Store.php dengan relasi, scopes, accessors
- [ ] Model: Product.php dengan relasi, scopes, accessors
- [ ] Controller: StoreController.php (index, show, store, update)
- [ ] Controller: ProductController.php (index, show, myProducts, store, update, destroy)
- [ ] Routes: api.php dengan public dan protected routes
- [ ] Testing: List toko & produk
- [ ] Testing: Create toko & produk sebagai seller
- [ ] Testing: Seller tidak bisa edit produk orang lain

---

**Lanjut ke BAB 7?** [Backend: Cart, Orders & Wallet](07-backend-wallet-cart-order/07-wallet-cart-order.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-13*
