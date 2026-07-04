# BAB 2: Database & Migration

> **Tujuan:** Mendesain database schema, memahami migration di Laravel, membuat tabel-tabel sesuai ERD, dan seed data awal

---

## 2.1 Recap: Apa yang Sudah Kita Pelajari

Di BAB 0, kita sudah memahami:
- **Database** = Tempat penyimpanan data terstruktur
- **ERD** = Peta relasi antar tabel
- **Primary Key** = Kunci utama setiap tabel
- **Foreign Key** = Kunci tamu yang mereferensi tabel lain
- **Relasi** = One-to-One, One-to-Many, Many-to-Many

Di BAB 1, kita sudah:
- Install Laravel
- Setup .env dengan konfigurasi database
- Buat database `seapedia` di MySQL

**Sekarang:** Kita akan implementasikan semua itu dalam kode!

---

## 2.2 Konsep Migration di Laravel

### Apa itu Migration?

```
┌─────────────────────────────────────────────────────────────────┐
│                        APA ITU MIGRATION?                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Migration = Script/Skeleton untuk membuat & mengubah tabel     │
│              di database secara versioned dan repeatable.          │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Analoginya:                                                     │
│                                                                  │
│  Database = Rumah                                                │
│  Migration = Blueprint/Rencana rumah                            │
│                                                                  │
│  • Blueprint menunjukkan:                                       │
│    - Berapa kamar                                                │
│    - Ukuran dapur                                                │
│    - Letak toilet                                                │
│                                                                  │
│  • Dengan blueprint, kita bisa:                                 │
│    - Bikin rumah baru dari awal                                 │
│    - Rekonstruksi rumah di lokasi berbeda                       │
│    - Semua orang pakai blueprint yang sama                       │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Command Migration Laravel:                                      │
│                                                                  │
│  php artisan make:migration create_products_table               │
│  → Membuat file: database/migrations/xxxx_create_products_table  │
│                                                                  │
│  php artisan migrate                                            │
│  → Menjalankan semua migration → Buat tabel di database         │
│                                                                  │
│  php artisan migrate:rollback                                   │
│  → Membatalkan migration terakhir                                │
│                                                                  │
│  php artisan migrate:fresh                                       │
│  → Hapus semua tabel + jalankan ulang semua migration           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Kenapa Pakai Migration?

| Tanpa Migration | Dengan Migration |
|----------------|------------------|
| Buat tabel via SQL manual | Buat tabel via kode PHP |
| Sulit di-track perubahan | Tergenerate Git history |
| Beda developer, beda struktur | Semua pakai blueprint sama |
| Tidak bisa rollback | Bisa rollback mudah |
| Susah kolaborasi | Mudah kolaborasi |

---

## 2.3 Database Schema SEAPEDIA

### 12 Tabel yang Akan Dibuat

```
┌─────────────────────────────────────────────────────────────────┐
│                    12 TABEL SEAPEDIA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. users          → Data user (nama, email, password)         │
│  2. user_roles     → Role user (admin, seller, buyer, driver)  │
│  3. stores         → Toko seller                                │
│  4. products       → Produk di toko                             │
│  5. wallets        → Dompet digital user                        │
│  6. addresses      → Alamat pengiriman                          │
│  7. carts          → Keranjang belanja                          │
│  8. cart_items     → Item di keranjang                          │
│  9. orders         → Pesanan                                    │
│  10. order_items   → Item dalam pesanan                         │
│  11. reviews       → Review produk                              │
│  12. transactions  → Riwayat transaksi wallet                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ERD Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ERD SEAPEDIA - 12 TABEL                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│                           ┌──────────────┐                                  │
│                           │    users     │                                  │
│                           │──────────────│                                  │
│                           │ id (PK)      │                                  │
│                           │ name         │                                  │
│                           │ email        │                                  │
│                           │ password     │                                  │
│                           │ avatar_url   │                                  │
│                           │ created_at   │                                  │
│                           │ updated_at   │                                  │
│                           └──────┬───────┘                                  │
│                                  │                                          │
│                                  │ 1:N                                      │
│                    ┌─────────────┼─────────────┐                            │
│                    │             │             │                            │
│                    ▼             ▼             ▼                            │
│            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│            │ user_roles   │ │   stores    │ │   wallets   │              │
│            │──────────────│ │─────────────│ │─────────────│              │
│            │ id (PK)     │ │ id (PK)     │ │ id (PK)     │              │
│            │ user_id (FK)│ │ user_id (FK)│ │ user_id (FK)│              │
│            │ role        │ │ name        │ │ balance     │              │
│            │ is_active   │ │ description │ │ created_at  │              │
│            │ created_at  │ │ address     │ │ updated_at  │              │
│            │ updated_at  │ │ phone       │ └──────────────┘              │
│            └──────────────┘ │ logo_url    │                                 │
│                             │ is_active   │                                 │
│                             │ created_at  │                                 │
│                             │ updated_at  │                                 │
│                             └──────┬─────┘                                 │
│                                    │                                        │
│                                    │ 1:N                                    │
│                                    ▼                                        │
│                             ┌──────────────┐                               │
│                             │  products    │                               │
│                             │──────────────│                               │
│                             │ id (PK)     │                               │
│                             │ store_id (FK)│                               │
│                             │ name        │                               │
│                             │ description │                               │
│                             │ price       │                               │
│                             │ stock       │                               │
│                             │ image_url   │                               │
│                             │ is_active   │                               │
│                             │ created_at  │                               │
│                             │ updated_at  │                               │
│                             └──────┬──────┘                               │
│                                    │                                        │
│                                    │ 1:N                                    │
│                                    │                                        │
│              ┌────────────────────┼────────────────────┐                │
│              │                    │                    │                │
│              ▼                    │                    ▼                │
│     ┌──────────────┐              │            ┌──────────────┐            │
│     │   reviews    │              │            │  cart_items  │            │
│     │──────────────│              │            │──────────────│            │
│     │ id (PK)     │              │            │ id (PK)     │            │
│     │ user_id (FK)│              │            │ cart_id (FK)│            │
│     │ product_id  │              │            │ product_id  │            │
│     │ (FK)        │              │            │ (FK)       │            │
│     │ rating      │              │            │ quantity   │            │
│     │ comment     │              │            │ created_at │            │
│     │ created_at  │              │            │ updated_at │            │
│     │ updated_at  │              │            └──────┬─────┘            │
│     └──────────────┘              │                   │                   │
│                                   │                   │                   │
│                                   │             ┌─────┴─────┐            │
│                                   │             │           │            │
│                                   │             ▼           ▼            │
│                             ┌──────────────┐ ┌──────────┐ ┌───────────┐  │
│                             │   orders    │ │  carts   │ │addresses │  │
│                             │─────────────│ │──────────│ │──────────│  │
│                             │ id (PK)    │ │ id (PK) │ │ id (PK) │  │
│                             │ order_number│ │ user_id │ │ user_id  │  │
│                             │ user_id (FK)│ │(FK)    │ │(FK)    │  │
│                             │ store_id(FK)│ │created_ │ │ label   │  │
│                             │ driver_id   │ │at      │ │recip_   │  │
│                             │ (FK) nullable│ │updated_ │ │name    │  │
│                             │ status      │ │at      │ │phone    │  │
│                             │ total_amount│ └──────────┘ │full_    │  │
│                             │shipping_add │              │address  │  │
│                             │ created_at │              │is_def.. │  │
│                             │ updated_at │              │created_ │  │
│                             └──────┬──────┘              │at      │  │
│                                    │                     │updated_ │  │
│                                    │ 1:N                 │at      │  │
│                                    ▼                     └─────────┘  │
│                             ┌──────────────┐                                 │
│                             │ order_items │                                 │
│                             │─────────────│                                 │
│                             │ id (PK)    │                                 │
│                             │ order_id(FK)│                                 │
│                             │ product_id │                                 │
│                             │ (FK)       │                                 │
│                             │ quantity   │                                 │
│                             │price_at_   │                                 │
│                             │purchase    │                                 │
│                             │ created_at │                                 │
│                             └─────────────┘                                 │
│                                                                              │
│                             ┌──────────────┐                                 │
│                             │transactions │                                 │
│                             │─────────────│                                 │
│                             │ id (PK)    │                                 │
│                             │ wallet_id  │                                 │
│                             │ (FK)       │                                 │
│                             │ order_id   │                                 │
│                             │ (FK) nullable                                 │
│                             │ type       │                                 │
│                             │ amount     │                                 │
│                             │ description│                                 │
│                             │ created_at │                                 │
│                             └─────────────┘                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.4 Langkah 1: Buat routes/api.php

Karena Laravel 12 tidak punya file ini otomatis, kita buat dulu:

```php
<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Di sini kita akan definisikan semua endpoint API SEAPEDIA
| Nanti akan kita isi di BAB 3, 6, 7 dst
|
*/

Route::get('/ping', function () {
    return response()->json([
        'message' => 'SEAPEDIA API is running!',
        'version' => '1.0.0'
    ]);
});
```

**Cara buat via Terminal:**
```bash
cd e:\PROJEKAN GABUT\SEAPEDIA\seapedia-backend
```

Lalu buat file `routes/api.php` dengan isi di atas.

---

## 2.5 Langkah 2: Install Laravel Sanctum

Sanctum adalah package untuk autentikasi API di Laravel:

```bash
composer require laravel/sanctum
```

---

## 2.6 Langkah 3: Buat Migration

### 2.6.1 Prinsip Migration

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRINSIP MEMBUAT MIGRATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. SATU TABEL = SATU MIGRATION FILE                           │
│     create_users_table      → bikin tabel users                 │
│     create_products_table   → bikin tabel products               │
│                                                                  │
│  2. NAMA FILE = TIMESTAMP + NAMA_ACTION                         │
│     2024_01_01_000000_create_users_table.php                   │
│     2024_01_01_000001_create_stores_table.php                  │
│                                                                  │
│  3. METHOD up() = CREATE TABLE                                  │
│     Method down() = DROP TABLE (untuk rollback)                  │
│                                                                  │
│  4. JALANKAN SECARA BERURUTAN                                  │
│     php artisan migrate                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.6.2 Generate Migration dengan Artisan

```bash
# Format:
php artisan make:migration create_<table_name>_table

# Contoh:
php artisan make:migration create_users_table
php artisan make:migration create_stores_table
php artisan make:migration create_products_table
```

### 2.6.3 Migration Tables (12 Tabel)

Berikut semua migration yang perlu dibuat:

```
1. create_users_table              (sudah ada default Laravel)
2. create_user_roles_table         (BARU)
3. create_stores_table             (BARU)
4. create_products_table           (BARU)
5. create_wallets_table            (BARU)
6. create_addresses_table           (BARU)
7. create_carts_table              (BARU)
8. create_cart_items_table         (BARU)
9. create_orders_table             (BARU)
10. create_order_items_table       (BARU)
11. create_reviews_table           (BARU)
12. create_transactions_table      (BARU)
```

---

## 2.7 Penjelasan Detail Setiap Tabel

### 2.7.1 Tabel users (Sudah Ada Default Laravel)

```php
// database/migrations/xxxx_create_users_table.php

Schema::create('users', function (Blueprint $table) {
    $table->id();                              // BIGINT UNSIGNED, PK, AUTO_INCREMENT
    $table->string('name');                    // VARCHAR(255)
    $table->string('email')->unique();         // VARCHAR(255), UNIQUE
    $table->timestamp('email_verified_at')     // TIMESTAMP, NULLABLE
        ->nullable();
    $table->string('password');                // VARCHAR(255)
    $table->string('avatar_url', 500)         // VARCHAR(500), NULLABLE
        ->nullable();
    $table->rememberToken();                   // VARCHAR(100), NULLABLE
    $table->timestamps();                       // created_at & updated_at
});
```

### 2.7.2 Tabel user_roles (BARU)

```php
// Fungsi: Menyimpan role user (admin, seller, buyer, driver)
// Relasi: users (1:N) - satu user bisa punya banyak role

Schema::create('user_roles', function (Blueprint $table) {
    $table->id();                              // PK
    $table->foreignId('user_id')               // FK ke users.id
        ->constrained()
        ->onDelete('cascade');
    $table->enum('role', ['admin', 'seller', 'buyer', 'driver']);
    $table->boolean('is_active')->default(false);
    $table->timestamps();

    // Constraint: 1 user hanya boleh punya 1 role per type
    $table->unique(['user_id', 'role']);
});
```

**Contoh Data:**
| id | user_id | role | is_active |
|----|---------|------|-----------|
| 1 | 1 | admin | false |
| 2 | 1 | seller | true |
| 3 | 1 | buyer | false |
| 4 | 2 | buyer | true |

### 2.7.3 Tabel stores (BARU)

```php
// Fungsi: Toko seller
// Relasi: users (1:1) - satu seller = satu toko
// Relasi: products (1:N) - satu toko punya banyak produk

Schema::create('stores', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
        ->constrained()
        ->onDelete('cascade');
    $table->string('name', 255)->unique();    // UNIQUE: 1 toko = 1 nama unik
    $table->text('description')->nullable();
    $table->string('address', 500)->nullable();
    $table->string('phone', 20)->nullable();
    $table->string('logo_url', 500)->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

### 2.7.4 Tabel products (BARU)

```php
// Fungsi: Produk di toko
// Relasi: stores (N:1) - produk milik satu toko

Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('store_id')
        ->constrained()
        ->onDelete('cascade');
    $table->string('name', 255);
    $table->text('description')->nullable();
    $table->decimal('price', 12, 2);          // Contoh: 9999999999.99
    $table->unsignedInteger('stock')->default(0);
    $table->string('image_url', 500)->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

### 2.7.5 Tabel wallets (BARU)

```php
// Fungsi: Dompet digital user (khusus role buyer)
// Relasi: users (1:1) - setiap user punya 1 wallet

Schema::create('wallets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
        ->constrained()
        ->onDelete('cascade')
        ->unique();                           // 1 user = 1 wallet
    $table->decimal('balance', 15, 2)         // Contoh: 9999999999999.99
        ->default(0);
    $table->timestamps();
});
```

### 2.7.6 Tabel addresses (BARU)

```php
// Fungsi: Alamat pengiriman buyer
// Relasi: users (1:N) - satu user bisa punya banyak alamat

Schema::create('addresses', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
        ->constrained()
        ->onDelete('cascade');
    $table->string('label', 50);              // "Rumah", "Kantor", dll
    $table->string('recipient_name', 255);
    $table->string('phone', 20);
    $table->text('full_address');
    $table->boolean('is_default')->default(false);
    $table->timestamps();
});
```

### 2.7.7 Tabel carts (BARU)

```php
// Fungsi: Keranjang belanja buyer
// Relasi: users (1:1) - setiap user punya 1 cart

Schema::create('carts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
        ->constrained()
        ->onDelete('cascade')
        ->unique();                           // 1 user = 1 cart
    $table->timestamps();
});
```

### 2.7.8 Tabel cart_items (BARU)

```php
// Fungsi: Item-item di keranjang
// Relasi: carts (1:N) - satu cart punya banyak item
// Relasi: products (N:1) - satu item = satu produk
// ⚠️ CONSTRAINT: Semua item harus dari toko yang sama!

Schema::create('cart_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('cart_id')
        ->constrained()
        ->onDelete('cascade');
    $table->foreignId('product_id')
        ->constrained()
        ->onDelete('cascade');
    $table->unsignedInteger('quantity')->default(1);
    $table->timestamps();

    // Constraint: 1 produk hanya boleh ada 1x di cart
    $table->unique(['cart_id', 'product_id']);
});
```

### 2.7.9 Tabel orders (BARU)

```php
// Fungsi: Pesanan
// Relasi: users (N:1) - buyer yang pesan
// Relasi: stores (N:1) - toko tujuan
// Relasi: users (N:1, nullable) - driver yang antar

Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->string('order_number', 50)->unique();  // Contoh: ORD-20240101-001
    $table->foreignId('user_id')
        ->constrained()
        ->onDelete('cascade');
    $table->foreignId('store_id')
        ->constrained()
        ->onDelete('cascade');
    $table->foreignId('driver_id')                 // Nullable: belum ada driver
        ->nullable()
        ->constrained('users')
        ->onDelete('set null');
    $table->enum('status', [
        'packaging',           // Sedang dikemas seller
        'waiting_shipper',     // Menunggu driver
        'shipping',            // Sedang diantar
        'completed',           // Selesai
        'returned'            // Dikembalikan
    ])->default('packaging');
    $table->decimal('total_amount', 15, 2);
    $table->text('shipping_address');
    $table->timestamps();
});
```

### 2.7.10 Tabel order_items (BARU)

```php
// Fungsi: Item-item dalam pesanan
// Relasi: orders (N:1) - item milik satu pesanan
// Relasi: products (N:1) - item berdasarkan produk

Schema::create('order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')
        ->constrained()
        ->onDelete('cascade');
    $table->foreignId('product_id')
        ->constrained()
        ->onDelete('cascade');
    $table->unsignedInteger('quantity');
    $table->decimal('price_at_purchase', 12, 2);  // Harga SAAT beli
    $table->timestamps();
});
```

### 2.7.11 Tabel reviews (BARU)

```php
// Fungsi: Review produk
// Relasi: users (N:1) - reviewer
// Relasi: products (N:1) - produk yang direview

Schema::create('reviews', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
        ->constrained()
        ->onDelete('cascade');
    $table->foreignId('product_id')
        ->constrained()
        ->onDelete('cascade');
    $table->tinyInteger('rating')->unsigned();    // 1-5
    $table->text('comment')->nullable();
    $table->timestamps();

    // Constraint: 1 user hanya boleh review 1 produk sekali
    $table->unique(['user_id', 'product_id']);
});
```

### 2.7.12 Tabel transactions (BARU)

```php
// Fungsi: Riwayat transaksi wallet
// Relasi: wallets (N:1) - transaksi milik satu wallet
// Relasi: orders (N:1, nullable) - terkait pesanan (untuk purchase/refund)

Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('wallet_id')
        ->constrained()
        ->onDelete('cascade');
    $table->foreignId('order_id')
        ->nullable()
        ->constrained()
        ->onDelete('set null');
    $table->enum('type', ['topup', 'purchase', 'refund', 'withdrawal']);
    $table->decimal('amount', 15, 2);
    $table->string('description', 255)->nullable();
    $table->timestamps();
});
```

---

## 2.8 Model Eloquent

### Apa itu Model?

```
┌─────────────────────────────────────────────────────────────────┐
│                      APA ITU MODEL?                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Model = Representasi tabel database dalam kode PHP              │
│                                                                  │
│  Contoh:                                                         │
│                                                                  │
│  Database:                                                      │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ users                                                 │        │
│  ├─────────────────────────────────────────────────────┤        │
│  │ id: 1                                               │        │
│  │ name: "Budi"                                        │        │
│  │ email: "budi@email.com"                             │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
│  Model di Laravel (app/Models/User.php):                        │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ class User extends Model {                         │        │
│  │     protected $fillable = ['name', 'email'];      │        │
│  │ }                                                  │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
│  Penggunaan:                                                     │
│  $user = User::find(1);              // Ambil user ID 1        │
│  $user = User::where('email', '...')->first();                  │
│  $users = User::all();               // Ambil semua user        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Generate Model

```bash
# Format:
php artisan make:model NamaModel

# Contoh:
php artisan make:model Store
php artisan make:model Product
php artisan make:model Order
```

### Model yang Perlu Dibuat

```
app/Models/
├── User.php           ← Sudah ada (Laravel default)
├── UserRole.php       ← BARU
├── Store.php         ← BARU
├── Product.php       ← BARU
├── Wallet.php        ← BARU
├── Address.php       ← BARU
├── Cart.php         ← BARU
├── CartItem.php      ← BARU
├── Order.php        ← BARU
├── OrderItem.php    ← BARU
├── Review.php       ← BARU
└── Transaction.php  ← BARU
```

---

## 2.9 Relasi antar Model

### Diagram Relasi

```
┌─────────────────────────────────────────────────────────────────┐
│                        RELASI MODEL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User                                                          │
│    ├── hasMany(UserRole)     → satu user punya banyak role      │
│    ├── hasOne(Store)         → satu user punya satu toko       │
│    ├── hasOne(Wallet)        → satu user punya satu wallet     │
│    ├── hasMany(Address)      → satu user punya banyak alamat   │
│    ├── hasOne(Cart)          → satu user punya satu cart       │
│    ├── hasMany(Order)        → satu user punya banyak pesanan  │
│    └── hasMany(Review)       → satu user punya banyak review   │
│                                                                  │
│  UserRole                                                       │
│    └── belongsTo(User)       → role milik satu user           │
│                                                                  │
│  Store                                                          │
│    ├── belongsTo(User)       → toko milik satu user            │
│    └── hasMany(Product)       → satu toko punya banyak produk  │
│                                                                  │
│  Product                                                        │
│    ├── belongsTo(Store)       → produk milik satu toko         │
│    ├── hasMany(CartItem)       → produk di banyak cart          │
│    ├── hasMany(Review)        → produk punya banyak review      │
│    └── hasMany(OrderItem)     → produk di banyak order         │
│                                                                  │
│  Wallet                                                         │
│    └── belongsTo(User)        → wallet milik satu user          │
│                                                                  │
│  Address                                                        │
│    └── belongsTo(User)        → alamat milik satu user         │
│                                                                  │
│  Cart                                                           │
│    ├── belongsTo(User)        → cart milik satu user           │
│    └── hasMany(CartItem)       → cart punya banyak item         │
│                                                                  │
│  CartItem                                                       │
│    ├── belongsTo(Cart)         → item milik satu cart          │
│    └── belongsTo(Product)      → item berdasarkan satu produk  │
│                                                                  │
│  Order                                                          │
│    ├── belongsTo(User)        → order milik satu user (buyer)  │
│    ├── belongsTo(Store)      → order ke satu toko             │
│    ├── belongsTo(Driver)     → order diantar satu driver     │
│    └── hasMany(OrderItem)     → order punya banyak item        │
│                                                                  │
│  OrderItem                                                      │
│    ├── belongsTo(Order)        → item milik satu order        │
│    └── belongsTo(Product)      → item berdasarkan satu produk  │
│                                                                  │
│  Review                                                         │
│    ├── belongsTo(User)        → review dari satu user         │
│    └── belongsTo(Product)     → review untuk satu produk      │
│                                                                  │
│  Transaction                                                    │
│    ├── belongsTo(Wallet)      → transaksi milik satu wallet   │
│    └── belongsTo(Order)       → transaksi terkait satu order  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Contoh Kode Relasi

```php
// app/Models/User.php
class User extends Model
{
    public function roles()
    {
        return $this->hasMany(UserRole::class);
    }

    public function store()
    {
        return $this->hasOne(Store::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
```

```php
// app/Models/Store.php
class Store extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'address',
        'phone',
        'logo_url',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
```

```php
// app/Models/Product.php
class Product extends Model
{
    protected $fillable = [
        'store_id',
        'name',
        'description',
        'price',
        'stock',
        'image_url',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
```

---

## 2.10 Langkah Praktik: Buat Migration

### Langkah 1: Cek Migration Existing

```bash
cd e:\PROJEKAN GABUT\SEAPEDIA\seapedia-backend

# Lihat daftar migration
php artisan migrate:status
```

### Langkah 2: Buat Semua Migration

Jalankan perintah berikut satu per satu:

```bash
# 1. User Roles
php artisan make:migration create_user_roles_table

# 2. Stores
php artisan make:migration create_stores_table

# 3. Products
php artisan make:migration create_products_table

# 4. Wallets
php artisan make:migration create_wallets_table

# 5. Addresses
php artisan make:migration create_addresses_table

# 6. Carts
php artisan make:migration create_carts_table

# 7. Cart Items
php artisan make:migration create_cart_items_table

# 8. Orders
php artisan make:migration create_orders_table

# 9. Order Items
php artisan make:migration create_order_items_table

# 10. Reviews
php artisan make:migration create_reviews_table

# 11. Transactions
php artisan make:migration create_transactions_table
```

### Langkah 3: Edit Migration Files

Buka file migration di `database/migrations/` dan edit sesuai penjelasan di atas.

### Langkah 4: Jalankan Migration

```bash
php artisan migrate
```

**Jika error:** Pastikan database `seapedia` sudah dibuat di MySQL!

```bash
# Jika ada error, cek .env
DB_DATABASE=seapedia

# Atau jika pakai SQLite (ada file database.sqlite):
DB_CONNECTION=sqlite
```

### Langkah 5: Verifikasi

```bash
# Lihat tabel yang sudah dibuat
php artisan migrate:status

# Atau via Tinker (interactive shell)
php artisan tinker
>>> Schema::getColumnListing('users')
=> ["id", "name", "email", ...]
```

---

## 2.11 Langkah Praktik: Buat Model

### Generate Semua Model

```bash
php artisan make:model UserRole
php artisan make:model Store
php artisan make:model Product
php artisan make:model Wallet
php artisan make:model Address
php artisan make:model Cart
php artisan make:model CartItem
php artisan make:model Order
php artisan make:model OrderItem
php artisan make:model Review
php artisan make:model Transaction
```

### Edit Model dengan Relasi

Buka setiap file di `app/Models/` dan tambahkan:
- `$fillable` (mass assignment protection)
- `$casts` (type casting)
- Relasi (hasMany, belongsTo, hasOne)

---

## 2.12 Seeder & Factory (Data Dummy)

### Apa itu Seeder?

```
┌─────────────────────────────────────────────────────────────────┐
│                        APA ITU SEEDER?                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Seeder = Script untuk mengisi data awal ke database            │
│                                                                  │
│  Gunanya:                                                        │
│  • Data dummy untuk development                                  │
│  • Data awal yang diperlukan (provinsi, kategori, dll)          │
│  • Testing                                                       │
│                                                                  │
│  Command:                                                        │
│  php artisan db:seed           → Jalankan semua seeder          │
│  php artisan db:seed --class=UserSeeder   → Jalankan 1 seeder  │
│  php artisan migrate:fresh --seed  → Hapus + migrate + seed    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Generate Seeder

```bash
php artisan make:seeder UserSeeder
php artisan make:seeder StoreSeeder
php artisan make:seeder ProductSeeder
```

### Contoh Seeder

```php
// database/seeders/ProductSeeder.php
namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'store_id' => 1,
                'name' => 'Nasi Goreng Spesial',
                'description' => 'Nasi goreng dengan telur, ayam, dan sayuran segar',
                'price' => 25000,
                'stock' => 50,
                'image_url' => 'https://via.placeholder.com/300?text=Nasi+Goreng',
            ],
            [
                'store_id' => 1,
                'name' => 'Ayam Geprek',
                'description' => 'Ayam crispy dengan sambal khas',
                'price' => 22000,
                'stock' => 30,
                'image_url' => 'https://via.placeholder.com/300?text=Ayam+Geprek',
            ],
            [
                'store_id' => 1,
                'name' => 'Mie Ayam',
                'description' => 'Mie ayam dengan pangsit dan bakso',
                'price' => 20000,
                'stock' => 40,
                'image_url' => 'https://via.placeholder.com/300?text=Mie+Ayam',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
```

### Jalankan Seeder

```bash
php artisan db:seed
# Atau:
php artisan db:seed --class=ProductSeeder
```

---

## 2.13 Tipe Data di Migration

### Ringkasan Tipe Data

```php
// Angka
$table->id();                    // BIGINT UNSIGNED, PK, AI
$table->unsignedInteger('stock'); // INT UNSIGNED
$table->unsignedBigInteger('qty'); // BIGINT UNSIGNED
$table->decimal('price', 12, 2);  // DECIMAL(12,2)
$table->float('rate');            // FLOAT
$table->double('amount');         // DOUBLE
$table->boolean('is_active');     // TINYINT(1)

// Teks
$table->string('name', 255);      // VARCHAR(255)
$table->text('description');      // TEXT
$table->longText('content');      // LONGTEXT
$table->char('code', 10);         // CHAR(10)

// Waktu
$table->timestamps();             // created_at, updated_at
$table->timestamp('published_at'); // TIMESTAMP
$table->date('birth_date');       // DATE
$table->time('open_time');        // TIME
$table->dateTime('created_at');   // DATETIME

// Enum
$table->enum('status', ['active', 'inactive', 'pending']);

// JSON
$table->json('metadata');         // JSON
$table->jsonb('config');          // JSONB (PostgreSQL)

// Lainnya
$table->uuid('uuid');            // UUID
$table->binary('data');          // BLOB
```

### Penjelasan decimal

```php
// decimal(precision, scale)
// precision = total digit
// scale = digit di belakang koma

$table->decimal('price', 10, 2);
// Maksimum: 99999999.99
// 10 digit total, 2 di belakang koma

$table->decimal('balance', 15, 2);
// Maksimum: 9999999999999.99
// 15 digit total, 2 di belakang koma
```

---

## 2.14 Foreign Key Constraint

### Apa itu Foreign Key?

```php
// Tanpa FK Constraint
$table->unsignedBigInteger('user_id');  // Cuma angka biasa

// Dengan FK Constraint
$table->foreignId('user_id')            // BIGINT + FK + constraint
    ->constrained()
    ->onDelete('cascade');
```

### Opsi onDelete

| Opsi | Arti |
|------|------|
| `cascade` | Jika parent dihapus, child ikut terhapus |
| `set null` | Jika parent dihapus, FK jadi NULL |
| `restrict` | Jika ada child, parent tidak bisa dihapus |
| `no action` | DB tidak lakukan apa-apa |

```php
// Contoh: Jika user dihapus, semua ordernya ikut hapus
$table->foreignId('user_id')
    ->constrained()
    ->onDelete('cascade');

// Contoh: Jika driver dihapus, order tetap ada tapi driver_id jadi NULL
$table->foreignId('driver_id')
    ->nullable()
    ->constrained('users')
    ->onDelete('set null');
```

---

## 2.15 Troubleshooting

```
┌─────────────────────────────────────────────────────────────────┐
│                    TROUBLESHOOTING MIGRATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ❌ SQLSTATE[HY000] [1049] Unknown database 'seapedia'         │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI: Buat database dulu di MySQL/phpMyAdmin                │
│                                                                  │
│  ❌ SQLSTATE[HY000] [2002] Connection refused                   │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI: Pastikan MySQL running di XAMPP                        │
│                                                                  │
│  ❌ Nothing to migrate                                          │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI: Semua migration sudah jalan. Cek:                      │
│  php artisan migrate:status                                     │
│                                                                  │
│  ❌ Column already exists                                        │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI: Rollback dulu, baru migrate lagi:                     │
│  php artisan migrate:fresh                                      │
│  ⚠️ PERINGATAN: Ini HAPUS SEMUA DATA!                         │
│                                                                  │
│  ❌ Too many arguments, expected arguments                      │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI: Cek syntax migration, mungkin ada typo                 │
│                                                                  │
│  ❌ Syntax error or access violation                           │
│  ─────────────────────────────────────────────────────────────  │
│  SOLUSI: Cek nama kolom, mungkin pakai keyword reserved         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2.16 Command Penting Migration

```bash
# Lihat status migration
php artisan migrate:status

# Jalankan migration
php artisan migrate

# Rollback последнюю миграцию
php artisan migrate:rollback

# Rollback semua & jalankan ulang
php artisan migrate:fresh

# Rollback semua & jalankan ulang + seed
php artisan migrate:fresh --seed

# Jalankan 1 step saja
php artisan migrate:step

# Buat migration baru
php artisan make:migration create_products_table

# Buat model + migration sekaligus
php artisan make:model Product -m
```

---

## 2.17 Latihan BAB 2

### Latihan Teori

**Q1.** Jelaskan perbedaan:
- `id()` vs `foreignId()` vs `unsignedBigInteger()`
- `string()` vs `text()` vs `longText()`
- `decimal()` vs `float()` vs `double()`

**Q2.** Apa fungsi `onDelete('cascade')`? Berikan contoh penggunaannya.

**Q3.** Di tabel `orders`, kenapa `driver_id` nullable?

**Q4.** Apa bedanya Seeder dan Factory?

**Q5.** Jika kita mau hapus tabel `products`, tabel apa saja yang ikut kehapus?

### Latihan Praktik

**P1.** Jalankan `php artisan migrate:status` dan screenshot hasilnya.

**P2.** Buka phpMyAdmin, verifikasi bahwa semua 12 tabel sudah dibuat.

**P3.** Buat seeder dengan 5 data produk dummy.

**P4.** Jalankan `php artisan db:seed` dan verifikasi data sudah masuk.

---

## 2.18 Checklist BAB 2

- [ ] Buat `routes/api.php`
- [ ] Install Laravel Sanctum
- [ ] Buat 11 migration baru (user_roles, stores, products, wallets, addresses, carts, cart_items, orders, order_items, reviews, transactions)
- [ ] Edit migration files dengan schema yang benar
- [ ] Jalankan `php artisan migrate`
- [ ] Verifikasi tabel di database
- [ ] Buat 11 Model dengan relasi
- [ ] Buat Seeder untuk data dummy
- [ ] Jalankan Seeder
- [ ] Verifikasi data di database

---

## 2.19 Ringkasan BAB 2

```
┌─────────────────────────────────────────────────────────────────┐
│                    YANG SUDAH DIPELAJARI                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Konsep Migration di Laravel                                │
│  ✅ Schema Builder Laravel                                      │
│  ✅ 12 Tabel Database SEAPEDIA                                 │
│  ✅ Foreign Key Constraint                                     │
│  ✅ Relasi antar Model (1:1, 1:N, N:1)                        │
│  ✅ Model Eloquent dengan relasi                               │
│  ✅ Seeder & Factory                                           │
│                                                                  │
│  NEXT: BAB 3 - Backend: User & Auth                            │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan:                                                      │
│  1. Setup Laravel Sanctum                                      │
│  2. Buat Authentication (Register, Login, Logout)               │
│  3. Role Management                                           │
│  4. API Endpoints Authentication                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 3?** [Backend: User & Auth](03-backend-auth.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-04*
