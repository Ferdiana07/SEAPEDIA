# BAB 6: Backend - Store & Product Management

> **Tujuan:** Membuat fitur backend untuk Store Management (Seller) dan Product Management, termasuk CRUD operations, validasi, dan authorization

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

## 6.2 Overview: Arsitektur Store & Products

### 6.2.1 Diagram Relasi Database

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    RELASI STORE & PRODUCTS                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────────┐         │
│  │    USERS    │         │    STORES   │         │    PRODUCTS     │         │
│  ├─────────────┤         ├─────────────┤         ├─────────────────┤         │
│  │ id (PK)    │         │ id (PK)     │         │ id (PK)        │         │
│  │ name       │         │ user_id (FK) │         │ store_id (FK)  │         │
│  │ email      │    1───0│ name        │    1───0│ name           │         │
│  │ password   │         │ description │         │ description    │         │
│  │ created_at │         │ address     │         │ price          │         │
│  │ updated_at │         │ phone       │         │ stock          │         │
│  └─────────────┘         │ is_active   │         │ image_url      │         │
│         │                │ created_at  │         │ is_active      │         │
│         │                │ updated_at  │         │ created_at     │         │
│         │                └─────────────┘         │ updated_at     │         │
│         │                        │                └─────────────────┘         │
│         │                        │                        │                   │
│         │                        │                        │                   │
│         │         ┌──────────────┴────────────────────────┘                │
│         │         │                                                        │
│         │    HAS MANY                                                    │
│         │         │                                                        │
│         │         ▼                                                        │
│         │  ┌─────────────────────────────────────────────────────┐       │
│         │  │                  RELASI                               │       │
│         │  │                                                      │       │
│         │  │  User (seller)                                        │       │
│         │  │    │                                                  │       │
│         │  │    ├── HAS ONE Store (1:1)                          │       │
│         │  │    │    └── Store dimiliki oleh 1 user               │       │
│         │  │    │                                                  │       │
│         │  │    └── HAS MANY Products (1:N)                       │       │
│         │  │         └── Product milik Store, Store milik User     │       │
│         │  │                                                      │       │
│         │  └─────────────────────────────────────────────────────┘       │
│         │                                                                │
│         │                                                                │
│         ▼                                                                │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │                   ROLE-BASED ACCESS                             │      │
│  ├─────────────────────────────────────────────────────────────────┤      │
│  │                                                                  │      │
│  │   BUYER                                                            │      │
│  │   ├── ✅ Lihat semua produk (public)                           │      │
│  │   ├── ✅ Lihat detail produk (public)                          │      │
│  │   ├── ✅ Lihat toko (public)                                    │      │
│  │   ├── ❌ Buat toko (harus seller)                               │      │
│  │   └── ❌ Kelola produk (harus seller)                          │      │
│  │                                                                  │      │
│  │   SELLER                                                           │      │
│  │   ├── ✅ CRUD toko sendiri                                        │      │
│  │   ├── ✅ CRUD produk sendiri                                      │      │
│  │   ├── ❌ CRUD produk orang lain                                 │      │
│  │   └── ❌ CRUD toko orang lain                                    │      │
│  │                                                                  │      │
│  │   DRIVER                                                          │      │
│  │   ├── ❌ CRUD store/produk                                       │      │
│  │   └── ❌ Viewing tidak terbatas role                             │      │
│  │                                                                  │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2.2 Alur Create Store

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ALUR CREATE STORE                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1️⃣  USER (SELLER) KLIK "BUAT TOKO"                                        │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│       User membuka halaman /seller/store/create                                 │
│       atau POST /api/stores                                                     │
│       dengan data:                                                             │
│       {                                                                         │
│         name: "Dapur Enak",                                                   │
│         description: "Masakan rumahan berkualitas",                             │
│         address: "Jl. Sehat No. 5",                                            │
│         phone: "02112345678"                                                   │
│       }                                                                        │
│                                                                                  │
│  2️⃣  BACKEND VALIDASI                                                        │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│       ┌─────────────────────────────────────────────────────────────┐         │
│       │                   VALIDATION RULES                           │         │
│       ├─────────────────────────────────────────────────────────────┤         │
│       │                                                              │         │
│       │  name:                                                      │         │
│       │  ├── required               → "Nama toko wajib diisi"       │         │
│       │  ├── string                → "Nama harus teks"             │         │
│       │  ├── max:255              → "Nama maksimal 255 karakter"   │         │
│       │  ├── unique:stores        → "Nama toko sudah digunakan!"  │         │
│       │  └── ...                                                         │         │
│       │                                                              │         │
│       │  description:                                                │         │
│       │  ├── nullable              → Boleh kosong                 │         │
│       │  ├── string                → "Harus teks"                 │         │
│       │  └── max:1000              → "Maksimal 1000 karakter"    │         │
│       │                                                              │         │
│       │  address:                                                      │         │
│       │  ├── required               → "Alamat wajib diisi"          │         │
│       │  └── string                → "Harus teks"                 │         │
│       │                                                              │         │
│       │  phone:                                                       │         │
│       │  ├── required               → "Telepon wajib diisi"       │         │
│       │  └── string                → "Harus teks"                 │         │
│       │                                                              │         │
│       └─────────────────────────────────────────────────────────────┘         │
│                                                                                  │
│  3️⃣  CHECK AUTHORIZATION                                                      │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│       ┌─────────────────────────────────────────────────────────────┐         │
│       │                   MIDDLEWARE CHECK                         │         │
│       ├─────────────────────────────────────────────────────────────┤         │
│       │                                                              │         │
│       │  1. User sudah login?                                       │         │
│       │     ❌ 401 Unauthorized → "Silakan login dulu"              │         │
│       │                                                              │         │
│       │  2. User punya role "seller"?                                │         │
│       │     ❌ 403 Forbidden → "Hanya seller yang bisa"             │         │
│       │                                                              │         │
│       │  3. User sudah punya toko?                                   │         │
│       │     ❌ 400 Bad Request → "Anda sudah punya toko"             │         │
│       │                                                              │         │
│       │  ✅ Semua pass → Lanjut ke create                           │         │
│       │                                                              │         │
│       └─────────────────────────────────────────────────────────────┘         │
│                                                                                  │
│  4️⃣  CREATE STORE                                                             │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│       Store::create([                                                         │
│         'user_id' => auth()->id(),  // ID user yang login                     │
│         'name' => $request->name,                                             │
│         'description' => $request->description,                                │
│         'address' => $request->address,                                        │
│         'phone' => $request->phone,                                           │
│         'is_active' => true,                                                  │
│       ])                                                                      │
│                                                                                  │
│  5️⃣  RESPONSE                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│       ✅ 201 Created                                                           │
│       {                                                                         │
│         success: true,                                                         │
│         message: "Toko berhasil dibuat",                                        │
│         data: {                                                                │
│           id: 1,                                                              │
│           user_id: 5,                                                         │
│           name: "Dapur Enak",                                                 │
│           description: "Masakan rumahan berkualitas",                           │
│           address: "Jl. Sehat No. 5",                                         │
│           phone: "02112345678",                                                │
│           is_active: true,                                                     │
│           created_at: "2024-01-15T10:00:00Z"                                  │
│         }                                                                      │
│       }                                                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.3 Step-by-Step Implementation

### 6.3.1 Step 1: Database Migration

#### Migration: stores

```php
<?php
// File: database/migrations/2024_01_15_000001_create_stores_table.php
// Penjelasan: Membuat tabel stores untuk menyimpan data toko seller

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Penjelasan:
     * Migration ini membuat tabel stores yang menyimpan informasi toko.
     * 
     * Relasi:
     * - 1 User memiliki 1 Store (1:1)
     * - 1 Store memiliki banyak Products (1:N)
     * 
     * Kenapa user_id UNIQUE?
     * → Karena 1 user (seller) hanya boleh punya 1 toko
     * → Jika tidak unique, 1 user bisa punya banyak toko
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            // Primary Key
            $table->id();
            
            // Foreign Key ke users
            // onDelete('cascade') → jika user dihapus, store ikut terhapus
            // unique() → 1 user = 1 store
            $table->foreignId('user_id')
                  ->unique()  // ⭐ Kunci: 1 user hanya boleh punya 1 toko
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Nama toko (UNIQUE untuk prevent duplicate names)
            // Ini penting karena storefronts mencari toko berdasarkan nama
            $table->string('name')->unique();
            
            // Deskripsi toko (nullable karena boleh kosong)
            $table->text('description')->nullable();
            
            // Alamat fisik toko
            $table->string('address');
            
            // Nomor telepon toko
            $table->string('phone');
            
            // URL gambar/logo toko (nullable, bisa ditambahkan nanti)
            $table->string('image_url')->nullable();
            
            // Status aktif/tidak
            // false = toko dinonaktifkan (bisa terjadi jika违反规则)
            $table->boolean('is_active')->default(true);
            
            // Timestamps (created_at, updated_at)
            $table->timestamps();
            
            // Index untuk query yang sering
            // Sering dicari berdasarkan nama
            $table->index('name');
            
            // Sering filter berdasarkan status aktif
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
```

#### Migration: products

```php
<?php
// File: database/migrations/2024_01_15_000002_create_products_table.php
// Penjelasan: Membuat tabel products untuk menyimpan data produk

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Penjelasan:
     * Tabel products menyimpan semua produk yang dijual di platform.
     * 
     * Relasi:
     * - Product dimiliki oleh 1 Store (N:1)
     * - Store dimiliki oleh 1 User (N:1)
     * 
     * Struktur:
     * - Data produk: name, description, price, stock
     * - Media: image_url (gambar produk)
     * - Status: is_active (soft delete, bukan hard delete)
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            // Primary Key
            $table->id();
            
            // Foreign Key ke stores
            // onDelete('cascade') → jika store dihapus, semua produk ikut terhapus
            $table->foreignId('store_id')
                  ->constrained('stores')
                  ->onDelete('cascade');
            
            // Nama produk
            $table->string('name');
            
            // Deskripsi produk (nullable, boleh kosong)
            $table->text('description')->nullable();
            
            // Harga dalam Rupiah (integer untuk avoid floating point issues)
            // Disimpan sebagai integer: 25000 = Rp 25.000
            // ⭐ Kenapa integer bukan decimal?
            // → Decimal di MySQL bisa jadi 25.0000001
            // → Integer lebih reliable untuk mata uang
            $table->integer('price');
            
            // Stok produk
            // 0 = habis, >0 = tersedia
            $table->integer('stock')->default(0);
            
            // URL gambar produk (nullable)
            // Bisa dari cloud storage (S3, Cloudinary) atau local
            $table->string('image_url')->nullable();
            
            // Status aktif
            // false = produk tidak ditampilkan (soft delete)
            // Bukan hard delete karena mungkin ada order yang reference
            $table->boolean('is_active')->default(true);
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            // Pencarian produk berdasarkan nama
            $table->index('name');
            
            // Filter produk aktif
            $table->index('is_active');
            
            // Filter berdasarkan store
            $table->index('store_id');
            
            // composite index untuk query: products by store that are active
            $table->index(['store_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

---

### 6.3.2 Step 2: Models

#### Model: Store

```php
<?php
// File: app/Models/Store.php
// Penjelasan: Model Store untuk interaksi dengan tabel stores

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     * 
     * Penjelasan:
     * Field-field yang boleh di-set secara mass assignment
     * (misalnya: Store::create([...]) atau $store->fill([...]))
     * 
     * ⚠️ ATTENTION: 
     * Jangan masukkan field yang tidak boleh diubah langsung oleh user
     * seperti user_id (seharusnya dari auth), is_active (admin only)
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'address',
        'phone',
        'image_url',
        // 'is_active' ← sebaiknya tidakfillable untuk keamanan
    ];
    
    /**
     * The attributes that should be cast.
     * 
     * Penjelasan:
     * Type casting untuk konversi otomatis
     * - boolean → true/false
     * - integer → number
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    /**
     * Store dimiliki oleh satu User (Seller)
     * 
     * @return BelongsTo
     * 
     * Penggunaan:
     * ```php
     * $store = Store::find(1);
     * $owner = $store->user; // Returns User object
     * echo $owner->name; // "Budi"
     * ```
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Store memiliki banyak Products
     * 
     * @return HasMany
     * 
     * Penggunaan:
     * ```php
     * $store = Store::find(1);
     * $products = $store->products; // Returns Collection of Product
     * 
     * // Dengan filter
     * $activeProducts = $store->products()->where('is_active', true)->get();
     * ```
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
    
    // =================================================================
    // SCOPES (Query Builder Extensions)
    // =================================================================
    
    /**
     * Scope: Hanya toko yang aktif
     * 
     * Penggunaan:
     * ```php
     * $activeStores = Store::active()->get();
     * // SELECT * FROM stores WHERE is_active = true
     * ```
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    /**
     * Scope: Pencarian berdasarkan nama
     * 
     * Penggunaan:
     * ```php
     * $results = Store::search('dapur')->get();
     * // SELECT * FROM stores WHERE name LIKE '%dapur%'
     * ```
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('name', 'LIKE', "%{$keyword}%");
    }
    
    // =================================================================
    // ACCESSORS & MUTATORS
    // =================================================================
    
    /**
     * Accessor: Format harga dengan mata uang
     * 
     * Penggunaan:
     * ```php
     * $store = Store::find(1);
     * echo $store->formatted_price_range;
     * // "Rp 10.000 - Rp 500.000"
     * ```
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
    
    /**
     * Accessor: Total produk aktif
     */
    public function getActiveProductsCountAttribute(): int
    {
        return $this->products()->where('is_active', true)->count();
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Cek apakah user tertentu adalah pemilik toko
     * 
     * @param int $userId
     * @return bool
     */
    public function isOwnedBy(int $userId): bool
    {
        return $this->user_id === $userId;
    }
    
    /**
     * Cek apakah toko bisa diedit oleh user tertentu
     * 
     * @param User $user
     * @return bool
     */
    public function canBeEditedBy(User $user): bool
    {
        return $this->isOwnedBy($user->id);
    }
}
```

#### Model: Product

```php
<?php
// File: app/Models/Product.php
// Penjelasan: Model Product untuk interaksi dengan tabel products

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;
    
    /**
     * Mass assignable attributes.
     */
    protected $fillable = [
        'store_id',
        'name',
        'description',
        'price',
        'stock',
        'image_url',
        // 'is_active' ← sebaiknya tidakfillable
    ];
    
    /**
     * Castable attributes.
     */
    protected $casts = [
        'price' => 'integer',  // ⭐ Simpan sebagai integer
        'stock' => 'integer',
        'is_active' => 'boolean',
    ];
    
    /**
     * Default attribute values.
     */
    protected $attributes = [
        'stock' => 0,
        'is_active' => true,
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    /**
     * Product dimiliki oleh satu Store
     * 
     * @return BelongsTo
     * 
     * Penggunaan:
     * ```php
     * $product = Product::find(1);
     * $store = $product->store; // Returns Store object
     * $seller = $product->store->user; // Returns User (seller)
     * ```
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
    
    // =================================================================
    // SCOPES
    // =================================================================
    
    /**
     * Scope: Hanya produk aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    /**
     * Scope: Hanya produk dengan stok
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }
    
    /**
     * Scope: Pencarian berdasarkan nama
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('name', 'LIKE', "%{$keyword}%");
    }
    
    /**
     * Scope: Filter berdasarkan range harga
     */
    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }
    
    // =================================================================
    // ACCESSORS & MUTATORS
    // =================================================================
    
    /**
     * Accessor: Format harga untuk display
     * 
     * Penggunaan:
     * ```php
     * $product = Product::find(1);
     * echo $product->formatted_price;
     * // "Rp 25.000"
     * ```
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }
    
    /**
     * Accessor: Cek apakah stok cukup
     */
    public function getHasStockAttribute(): bool
    {
        return $this->stock > 0;
    }
    
    /**
     * Mutator: Set price dari input user
     * 
     * Penjelasan:
     * Jika user input "25000" (string), konversi ke integer
     * Hapus titik ribuan: "Rp 25.000" → 25000
     */
    public function setPriceAttribute($value)
    {
        // Hapus karakter non-numerik (titik, koma, Rp, spasi)
        $cleaned = preg_replace('/[^0-9]/', '', $value);
        $this->attributes['price'] = (int) $cleaned;
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Kurangi stok
     * 
     * @param int $quantity
     * @return bool
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
     * 
     * @param int $quantity
     */
    public function addStock(int $quantity): void
    {
        $this->increment('stock', $quantity);
    }
    
    /**
     * Cek apakah dimiliki oleh user tertentu
     */
    public function isOwnedByUser(int $userId): bool
    {
        return $this->store->user_id === $userId;
    }
}
```

---

### 6.3.3 Step 3: Request Validation

#### CreateStoreRequest

```php
<?php
// File: app/Http/Requests/CreateStoreRequest.php
// Penjelasan: Validasi untuk request pembuatan toko baru

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * 
     * Penjelasan:
     * Method ini menentukan apakah user boleh membuat toko.
     * Dipanggil SEBELUM validasi.
     * 
     * @return bool
     */
    public function authorize(): bool
    {
        // ✅ User harus login
        if (!auth()->check()) {
            return false;
        }
        
        // ✅ User harus punya role "seller"
        if (!auth()->user()->hasRole('seller')) {
            return false;
        }
        
        // ✅ User belum punya toko
        if (auth()->user()->store) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Get the validation rules that apply to the request.
     * 
     * Penjelasan:
     * Rules validasi untuk field-field yang diinput.
     * Jika ada yang violate, return 422 dengan pesan error.
     * 
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Nama toko
            'name' => [
                'required',              // Wajib diisi
                'string',               // Harus teks
                'max:255',              // Maksimal 255 karakter
                'unique:stores,name',   // ⭐ UNIK: tidak boleh sama dengan toko lain
            ],
            
            // Deskripsi
            'description' => [
                'nullable',             // Boleh kosong (null)
                'string',               // Harus teks
                'max:1000',             // Maksimal 1000 karakter
            ],
            
            // Alamat
            'address' => [
                'required',             // Wajib diisi
                'string',               // Harus teks
                'max:500',              // Maksimal 500 karakter
            ],
            
            // Telepon
            'phone' => [
                'required',             // Wajib diisi
                'string',               // Harus teks
                'max:20',               // Maksimal 20 karakter
            ],
            
            // Gambar (optional)
            'image_url' => [
                'nullable',             // Boleh kosong
                'url',                  // Harus valid URL
                'max:500',              // Maksimal 500 karakter
            ],
        ];
    }
    
    /**
     * Get custom messages for validator errors.
     * 
     * Penjelasan:
     * Pesan error kustom untuk setiap rule yang gagal.
     * Bahasa Indonesia untuk UX Indonesia.
     * 
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama toko wajib diisi',
            'name.unique' => 'Nama toko sudah digunakan oleh toko lain',
            'name.max' => 'Nama toko maksimal 255 karakter',
            
            'description.max' => 'Deskripsi maksimal 1000 karakter',
            
            'address.required' => 'Alamat toko wajib diisi',
            'address.max' => 'Alamat maksimal 500 karakter',
            
            'phone.required' => 'Nomor telepon wajib diisi',
            'phone.max' => 'Nomor telepon maksimal 20 karakter',
            
            'image_url.url' => 'URL gambar tidak valid',
        ];
    }
    
    /**
     * Handle a failed authorization attempt.
     * 
     * Penjelasan:
     * Dipanggil ketika authorize() return false.
     * Override untuk custom error response.
     */
    protected function failedAuthorization()
    {
        // Jika user belum punya role seller
        if (!auth()->user()->hasRole('seller')) {
            abort(403, 'Hanya pengguna dengan role Seller yang dapat membuat toko');
        }
        
        // Jika user sudah punya toko
        if (auth()->user()->store) {
            abort(400, 'Anda sudah memiliki toko. Setiap seller hanya boleh memiliki 1 toko.');
        }
        
        abort(401, 'Silakan login terlebih dahulu');
    }
}
```

#### StoreRequest (Update)

```php
<?php
// File: app/Http/Requests/UpdateStoreRequest.php

namespace App\Http\Requests;

class UpdateStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // User harus login dan punya role seller
        return auth()->check() && auth()->user()->hasRole('seller');
    }
    
    public function rules(): array
    {
        // Ambil store_id dari route
        $storeId = $this->route('store');
        
        return [
            'name' => [
                'sometimes',            // opsional (tidak wajib ada di request)
                'string',
                'max:255',
                // ⭐ UNIK tapi exclude toko ini sendiri
                // Jika tidak exclude, validasi akan gagal karena nama toko ini
                // sudah ada di database
                Rule::unique('stores', 'name')->ignore($storeId),
            ],
            
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            
            'address' => [
                'sometimes',
                'string',
                'max:500',
            ],
            
            'phone' => [
                'sometimes',
                'string',
                'max:20',
            ],
            
            'image_url' => [
                'nullable',
                'url',
                'max:500',
            ],
        ];
    }
    
    public function messages(): array
    {
        return [
            'name.unique' => 'Nama toko sudah digunakan oleh toko lain',
            'image_url.url' => 'URL gambar tidak valid',
        ];
    }
}
```

#### ProductRequest (Create/Update)

```php
<?php
// File: app/Http/Requests/ProductRequest.php

namespace App\Http\Requests;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // User harus seller dan punya toko
        return auth()->check() 
            && auth()->user()->hasRole('seller')
            && auth()->user()->store;
    }
    
    public function rules(): array
    {
        // Tentukan apakah ini create atau update
        $isCreate = $this->isMethod('post');
        $productId = $this->route('product');
        
        return [
            'name' => [
                $isCreate ? 'required' : 'sometimes',
                'string',
                'max:255',
            ],
            
            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],
            
            'price' => [
                $isCreate ? 'required' : 'sometimes',
                'integer',              // ⭐ Integer, bukan numeric/float
                'min:100',             // Minimal Rp 100
                'max:999999999',       // Maksimal ~1 miliar
            ],
            
            'stock' => [
                $isCreate ? 'required' : 'sometimes',
                'integer',
                'min:0',               // Stok minimal 0
                'max:999999',          // Maksimal 999.999
            ],
            
            'image_url' => [
                'nullable',
                'url',
                'max:500',
            ],
        ];
    }
    
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
            'stock.min' => 'Stok minimal 0',
            'stock.max' => 'Stok maksimal 999.999',
            
            'image_url.url' => 'URL gambar tidak valid',
        ];
    }
    
    /**
     * Persiapan data sebelum validasi
     * 
     * Penjelasan:
     * Dijalankan SEBELUM validasi rules diterapkan.
     * Cocok untuk normalisasi data input.
     */
    protected function prepareForValidation(): void
    {
        // Jika price ada dan berupa string dengan formatting
        if ($this->has('price') && is_string($this->price)) {
            // Hapus karakter non-numerik
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

### 6.3.4 Step 4: Controllers

#### StoreController

```php
<?php
// File: app/Http/Controllers/StoreController.php
// Penjelasan: Controller untuk operasi Store (CRUD)

namespace App\Http\Controllers;

use App\Http\Requests\CreateStoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    // =================================================================
    // PUBLIC ENDPOINTS (Buyer/Guest)
    // =================================================================
    
    /**
     * GET /api/stores
     * Ambil semua toko aktif
     * 
     * Penjelasan:
     * Endpoint publik untuk melihat daftar toko.
     * Hanya toko yang is_active = true yang ditampilkan.
     * 
     * Query Parameters:
     * - search: string (pencarian nama toko)
     * - page: int (pagination)
     * - per_page: int (default: 12)
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $query = Store::with('user:id,name')  // Eager load seller info
                      ->active()              // Scope: is_active = true
                      ->withCount('products'); // Tambah field: products_count
        
        // Pencarian
        if ($search = request('search')) {
            $query->search($search);
        }
        
        // Pagination
        $perPage = (int) request('per_page', 12);
        $stores = $query->paginate($perPage);
        
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
     * Ambil detail satu toko
     * 
     * Penjelasan:
     * Endpoint publik untuk melihat detail toko.
     * Include: info seller, produk aktif toko.
     * 
     * @param int $id Store ID
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $store = Store::with([
            'user:id,name,email',  // Info seller
            'products' => function ($query) {
                // ⭐ Hanya produk aktif
                $query->active()
                      ->inStock()
                      ->latest();
            }
        ])->find($id);
        
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }
        
        // Jika toko tidak aktif, hanya owner yang bisa lihat
        if (!$store->is_active && (!$this->user() || !$store->isOwnedBy($this->user()->id))) {
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
    
    // =================================================================
    // SELLER ENDPOINTS (Authenticated Seller)
    // =================================================================
    
    /**
     * GET /api/stores/my
     * Ambil toko sendiri (untuk seller)
     * 
     * Penjelasan:
     * Endpoint untuk seller melihat toko mereka sendiri.
     * Include: semua produk (aktif & nonaktif).
     * 
     * @return JsonResponse
     */
    public function myStore(): JsonResponse
    {
        $user = $this->user();
        
        // Cek apakah user punya toko
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 404);
        }
        
        $store = Store::with([
            'products' => function ($query) {
                $query->latest();
            }
        ])->find($user->store->id);
        
        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }
    
    /**
     * POST /api/stores
     * Buat toko baru
     * 
     * Penjelasan:
     * Endpoint untuk membuat toko baru.
     * Hanya seller yang belum punya toko yang boleh mengakses.
     * 
     * Request Body:
     * {
     *   "name": "Dapur Enak",
     *   "description": "Masakan rumahan",
     *   "address": "Jl. Sehat No. 5",
     *   "phone": "02112345678"
     * }
     * 
     * @param CreateStoreRequest $request
     * @return JsonResponse
     */
    public function store(CreateStoreRequest $request): JsonResponse
    {
        // Data sudah tervalidasi, bisa langsung dipakai
        $validated = $request->validated();
        
        // Buat toko dengan user_id dari user yang login
        $store = Store::create([
            'user_id' => $this->user()->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'],
            'phone' => $validated['phone'],
            'image_url' => $validated['image_url'] ?? null,
            'is_active' => true,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil dibuat',
            'data' => $store,
        ], 201);
    }
    
    /**
     * PUT /api/stores/my
     * Update toko sendiri
     * 
     * @param UpdateStoreRequest $request
     * @return JsonResponse
     */
    public function update(UpdateStoreRequest $request): JsonResponse
    {
        $user = $this->user();
        
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }
        
        // Update toko
        $user->store->update($request->validated());
        
        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil diupdate',
            'data' => $user->store->fresh(),
        ]);
    }
    
    /**
     * Helper: Get authenticated user
     */
    protected function user()
    {
        return auth()->user();
    }
}
```

#### ProductController

```php
<?php
// File: app/Http/Controllers/ProductController.php
// Penjelasan: Controller untuk operasi Product (CRUD)

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // =================================================================
    // PUBLIC ENDPOINTS (Buyer/Guest)
    // =================================================================
    
    /**
     * GET /api/products
     * Ambil semua produk aktif
     * 
     * Penjelasan:
     * Endpoint publik untuk listing produk.
     * Hanya produk aktif yang ditampilkan.
     * Include: info toko.
     * 
     * Query Parameters:
     * - search: string (pencarian nama)
     * - store_id: int (filter by toko)
     * - min_price: int (harga minimum)
     * - max_price: int (harga maksimum)
     * - page: int
     * - per_page: int
     * 
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('store:id,name,image_url')  // Eager load toko
                      ->active()                            // Hanya aktif
                      ->inStock();                         // Hanya ada stok
        
        // Pencarian
        if ($search = $request->get('search')) {
            $query->search($search);
        }
        
        // Filter by store
        if ($storeId = $request->get('store_id')) {
            $query->where('store_id', $storeId);
        }
        
        // Filter by price range
        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', (int) $minPrice);
        }
        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', (int) $maxPrice);
        }
        
        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['price', 'name', 'created_at'];
        
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }
        
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
     * Ambil detail satu produk
     * 
     * @param int $id Product ID
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::with([
            'store:id,name,description,address,phone',
            'store.user:id,name'  // Info seller
        ])->find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }
        
        // Jika produk tidak aktif, hanya owner yang bisa lihat
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
    
    // =================================================================
    // SELLER ENDPOINTS (Authenticated Seller)
    // =================================================================
    
    /**
     * GET /api/seller/products
     * Ambil semua produk milik seller
     * 
     * Penjelasan:
     * Endpoint untuk seller melihat produk mereka sendiri.
     * Include: semua produk (aktif & nonaktif).
     * 
     * @return JsonResponse
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
                'last_page' => $products->lastPage(),
            ],
        ]);
    }
    
    /**
     * GET /api/seller/products/stats
     * Statistik produk seller
     * 
     * @return JsonResponse
     */
    public function myProductsStats(): JsonResponse
    {
        $user = auth()->user();
        
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 404);
        }
        
        $storeId = $user->store->id;
        
        $stats = [
            'total_products' => Product::where('store_id', $storeId)->count(),
            'active_products' => Product::where('store_id', $storeId)->active()->count(),
            'out_of_stock' => Product::where('store_id', $storeId)->where('stock', 0)->count(),
        ];
        
        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
    
    /**
     * POST /api/seller/products
     * Tambah produk baru
     * 
     * Request Body:
     * {
     *   "name": "Nasi Goreng Spesial",
     *   "description": "Nasi goreng dengan telur dan ayam",
     *   "price": 25000,
     *   "stock": 100,
     *   "image_url": "https://..."
     * }
     * 
     * @param ProductRequest $request
     * @return JsonResponse
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $user = auth()->user();
        
        // Pastikan punya toko
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus membuat toko terlebih dahulu',
            ], 400);
        }
        
        $validated = $request->validated();
        
        // Buat produk dengan store_id dari toko seller
        $product = Product::create([
            'store_id' => $user->store->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'image_url' => $validated['image_url'] ?? null,
            'is_active' => true,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan',
            'data' => $product,
        ], 201);
    }
    
    /**
     * PUT /api/seller/products/{id}
     * Update produk
     * 
     * @param ProductRequest $request
     * @param int $id Product ID
     * @return JsonResponse
     */
    public function update(ProductRequest $request, int $id): JsonResponse
    {
        $user = auth()->user();
        
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }
        
        // ⭐ SECURITY: Pastikan produk milik seller ini
        if (!$product->isOwnedByUser($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke produk ini',
            ], 403);
        }
        
        $validated = $request->validated();
        $product->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diupdate',
            'data' => $product->fresh(),
        ]);
    }
    
    /**
     * DELETE /api/seller/products/{id}
     * Hapus produk
     * 
     * Penjelasan:
     * Menggunakan soft delete (is_active = false).
     * Bukan hard delete karena mungkin ada order yang reference.
     * 
     * @param int $id Product ID
     * @return JsonResponse
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
        
        // ⭐ SECURITY: Cek kepemilikan
        if (!$product->isOwnedByUser($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke produk ini',
            ], 403);
        }
        
        // Soft delete: set is_active = false
        $product->update(['is_active' => false]);
        
        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}
```

---

### 6.3.5 Step 5: API Routes

```php
<?php
// File: routes/api.php
// Penjelasan: Definisi API routes untuk Store & Product

use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
|
| Routes yang bisa diakses tanpa autentikasi.
| Untuk Buyer dan Guest.
|
*/

// Store routes - Publik
Route::prefix('stores')->group(function () {
    // GET /api/stores - List semua toko aktif
    Route::get('/', [StoreController::class, 'index']);
    
    // GET /api/stores/{id} - Detail toko
    Route::get('/{id}', [StoreController::class, 'show'])
        ->where('id', '[0-9]+');
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
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
|
| Routes yang butuh autentikasi (login dengan Sanctum).
| Untuk semua role: Buyer, Seller, Driver.
|
*/

Route::middleware('auth:sanctum')->group(function () {
    
    // =================================================================
    // SELLER: MY STORE
    // =================================================================
    // Routes untuk seller mengelola toko dan produk mereka sendiri
    // Path prefix: /api/stores/my atau /api/seller/products
    
    // Store - Milik Seller
    Route::prefix('stores')->group(function () {
        // GET /api/stores/my - Ambil toko sendiri
        Route::get('/my', [StoreController::class, 'myStore']);
        
        // PUT /api/stores/my - Update toko sendiri
        Route::put('/my', [StoreController::class, 'update']);
    });
    
    // Seller Products
    Route::prefix('seller/products')->group(function () {
        // GET /api/seller/products - List produk sendiri
        Route::get('/', [ProductController::class, 'myProducts']);
        
        // GET /api/seller/products/stats - Statistik produk
        Route::get('/stats', [ProductController::class, 'myProductsStats']);
        
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

## 6.4 Penjelasan Detail: Authorization Flow

### 6.4.1 Alur Authorization untuk Seller

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ALUR AUTHORIZATION SELLER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  BUYER/GUEST ingin melihat produk:                                              │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐                 │
│  │                                                             │                 │
│  │   Request: GET /api/products                               │                 │
│  │                                                             │                 │
│  │   products() {                                              │                 │
│  │     return Product::active()->get();  ✅ Tidak perlu cek   │                 │
│  │   }                                                        │                 │
│  │                                                             │                 │
│  │   Response: [Produk 1, Produk 2, ...]                      │                 │
│  │                                                             │                 │
│  └─────────────────────────────────────────────────────────────┘                 │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  SELLER ingin CRUD produknya sendiri:                                            │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐                 │
│  │                                                             │                 │
│  │   Request: POST /api/seller/products                        │                 │
│  │   Headers: Authorization: Bearer {token}                   │                 │
│  │                                                             │                 │
│  │   STEP 1: Auth Check (Sanctum middleware)                  │                 │
│  │   ─────────────────────────────────────────────────────     │                 │
│  │   if (!auth()->check()) {                                  │                 │
│  │     return 401;  // "Silakan login"                        │                 │
│  │   }                                                        │                 │
│  │                                                             │                 │
│  │   STEP 2: Role Check (authorize() di Request)              │                 │
│  │   ─────────────────────────────────────────────────────     │                 │
│  │   if (!auth()->user()->hasRole('seller')) {                │                 │
│  │     return 403;  // "Hanya seller"                          │                 │
│  │   }                                                        │                 │
│  │                                                             │                 │
│  │   STEP 3: Store Check                                      │                 │
│  │   ─────────────────────────────────────────────────────     │                 │
│  │   if (!auth()->user()->store) {                            │                 │
│  │     return 400;  // "Harus buat toko dulu"                  │                 │
│  │   }                                                        │                 │
│  │                                                             │                 │
│  │   STEP 4: Ownership Check (dalam controller)               │                 │
│  │   ─────────────────────────────────────────────────────     │                 │
│  │   $product = Product::find($id);                          │                 │
│  │   if (!$product->isOwnedByUser(auth()->id())) {           │                 │
│  │     return 403;  // "Bukan produk Anda"                   │                 │
│  │   }                                                        │                 │
│  │                                                             │                 │
│  │   ✅ Lolos semua check → Execute action                    │                 │
│  │                                                             │                 │
│  └─────────────────────────────────────────────────────────────┘                 │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  SELLER ingin HAPUS produk orang lain:                                          │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐                 │
│  │                                                             │                 │
│  │   Request: DELETE /api/seller/products/999                  │                 │
│  │   Headers: Authorization: Bearer {token}                   │                 │
│  │                                                             │                 │
│  │   $product = Product::find(999);  // Produk milik user lain  │                 │
│  │                                                             │                 │
│  │   if (!$product->isOwnedByUser(auth()->id())) {           │                 │
│  │     return 403;  // ⭐ STOP! Bukan milik Anda              │                 │
│  │   }                                                        │                 │
│  │                                                             │                 │
│  └─────────────────────────────────────────────────────────────┘                 │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.4.2 Kenapa Perlu Multiple Authorization Checks?

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    MULTI-LAYER AUTHORIZATION                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │                    TINGKAT 1: MIDDLEWARE                                │     │
│  ├─────────────────────────────────────────────────────────────────────────┤     │
│  │                                                                          │     │
│  │  auth:sanctum                                                           │     │
│  │  ├── Apakah user punya token?                                          │     │
│  │  ├── Apakah token valid?                                               │     │
│  │  └── Apakah token tidak expired?                                        │     │
│  │                                                                          │     │
│  │  ✅ Hasil: User terautentikasi                                          │     │
│  │                                                                          │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                    │                                              │
│                                    ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │                    TINGKAT 2: REQUEST AUTHORIZE                          │     │
│  ├─────────────────────────────────────────────────────────────────────────┤     │
│  │                                                                          │     │
│  │  CreateStoreRequest::authorize()                                         │     │
│  │  ├── Apakah punya role tertentu?                                        │     │
│  │  ├── Apakah sudah punya resource tertentu?                               │     │
│  │  └── Apakah memenuhi kondisi bisnis?                                     │     │
│  │                                                                          │     │
│  │  ✅ Hasil: User punya IZIN untuk operasi ini                            │     │
│  │                                                                          │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                    │                                              │
│                                    ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │                    TINGKAT 3: CONTROLLER CHECK                         │     │
│  ├─────────────────────────────────────────────────────────────────────────┤     │
│  │                                                                          │     │
│  │  ProductController::update()                                             │     │
│  │  ├── Apakah resource ADA?                                              │     │
│  │  ├── Apakah resource MILIK user ini? ⭐                                  │     │
│  │  └── Apakah ada kondisi khusus?                                         │     │
│  │                                                                          │     │
│  │  ✅ Hasil: User punya AKSES ke resource spesifik ini                    │     │
│  │                                                                          │     │
│  └─────────────────────────────────────────────────────────────────────────┘     │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  KENAPA HARUS MULTI-LAYER?                                                     │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ❌ JIKA HANYA MIDDLEWARE:                                                     │
│  │   Semua user login bisa akses endpoint                                   │
│  │   Tidak bisa bedakan buyer/seller                                         │
│  │   Tidak bisa bedakan seller A / seller B                                   │
│  └────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ❌ JIKA HANYA REQUEST AUTHORIZE:                                               │
│  │   Tidak bisa handle update/delete (butuh resource ID)                     │
│  │   Tidak bisa validasi kepemilikan resource                                  │
│  └────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  ✅ DENGAN SEMUA LAYER:                                                        │
│  │   Tepat sekali!                                                          │
│  │   ✓ Cek autentikasi (siapa?)                                             │
│  │   ✓ Cek role/izin (boleh apa?)                                           │
│  │   ✓ Cek kepemilikan (milik siapa?)                                        │
│  └────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.5 Frontend Integration

### 6.5.1 Frontend Service

```javascript
// File: src/services/storeService.js
// Penjelasan: Service untuk operasi Store di frontend

import api from './api'

const storeService = {
  // =================================================================
  // PUBLIC: Ambil semua toko aktif
  // =================================================================
  /**
   * @returns {Promise<Object>} List toko aktif
   */
  getAll: async (params = {}) => {
    const response = await api.get('/stores', { params })
    return response.data
  },
  
  // =================================================================
  // PUBLIC: Ambil detail satu toko
  // =================================================================
  /**
   * @param {number} id - Store ID
   * @returns {Promise<Object>} Detail toko + produk
   */
  getById: async (id) => {
    const response = await api.get(`/stores/${id}`)
    return response.data
  },
  
  // =================================================================
  // SELLER: Ambil toko sendiri
  // =================================================================
  /**
   * @returns {Promise<Object>} Data toko sendiri
   */
  getMyStore: async () => {
    const response = await api.get('/stores/my')
    return response.data
  },
  
  // =================================================================
  // SELLER: Buat toko baru
  // =================================================================
  /**
   * @param {Object} data - { name, description, address, phone, image_url }
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/stores', data)
    return response.data
  },
  
  // =================================================================
  // SELLER: Update toko sendiri
  // =================================================================
  /**
   * @param {Object} data - Field yang diupdate
   * @returns {Promise<Object>}
   */
  update: async (data) => {
    const response = await api.put('/stores/my', data)
    return response.data
  },
}

export default storeService
```

```javascript
// File: src/services/productService.js
// Penjelasan: Service untuk operasi Product di frontend

import api from './api'

const productService = {
  // =================================================================
  // PUBLIC: Ambil semua produk aktif
  // =================================================================
  /**
   * @param {Object} params - { search, store_id, min_price, max_price, sort_by, sort_order, page, per_page }
   * @returns {Promise<Object>}
   */
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },
  
  // =================================================================
  // PUBLIC: Ambil detail satu produk
  // =================================================================
  /**
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  // =================================================================
  // SELLER: Ambil produk sendiri
  // =================================================================
  /**
   * @returns {Promise<Object>}
   */
  getMyProducts: async () => {
    const response = await api.get('/seller/products')
    return response.data
  },
  
  // =================================================================
  // SELLER: Statistik produk
  // =================================================================
  /**
   * @returns {Promise<Object>} { total_products, active_products, out_of_stock }
   */
  getMyStats: async () => {
    const response = await api.get('/seller/products/stats')
    return response.data
  },
  
  // =================================================================
  // SELLER: Tambah produk baru
  // =================================================================
  /**
   * @param {Object} data - { name, description, price, stock, image_url }
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post('/seller/products', data)
    return response.data
  },
  
  // =================================================================
  // SELLER: Update produk
  // =================================================================
  /**
   * @param {number} id - Product ID
   * @param {Object} data - Field yang diupdate
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    const response = await api.put(`/seller/products/${id}`, data)
    return response.data
  },
  
  // =================================================================
  // SELLER: Hapus produk
  // =================================================================
  /**
   * @param {number} id - Product ID
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    const response = await api.delete(`/seller/products/${id}`)
    return response.data
  },
}

export default productService
```

---

## 6.6 Testing Manual (Postman/Thunder Client)

### 6.6.1 Test Public Endpoints

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         TESTING: PUBLIC ENDPOINTS                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  TEST 1: List Stores                                                           │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  Method: GET                                                                   │
│  URL: http://localhost:8000/api/stores                                        │
│                                                                                  │
│  Expected Response:                                                             │
│  {                                                                         │
│    "success": true,                                                          │
│    "data": [                                                                 │
│      { "id": 1, "name": "Dapur Enak", ... }                                │
│    ],                                                                       │
│    "meta": { "current_page": 1, "total": 10, ... }                        │
│  }                                                                         │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  TEST 2: List Products with Search                                            │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  Method: GET                                                                   │
│  URL: http://localhost:8000/api/products                                      │
│  URL Params:                                                                  │
│    search = "nasi"                                                            │
│    min_price = 10000                                                          │
│    max_price = 50000                                                          │
│    sort_by = "price"                                                          │
│    sort_order = "asc"                                                        │
│                                                                                  │
│  Expected Response:                                                            │
│  {                                                                         │
│    "success": true,                                                          │
│    "data": [                                                                 │
│      { "id": 1, "name": "Nasi Goreng", "price": 15000, ... }              │
│    ],                                                                       │
│    "meta": { ... }                                                           │
│  }                                                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.6.2 Test Seller Endpoints

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         TESTING: SELLER ENDPOINTS                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  PREREQUISITE: Login sebagai Seller, simpan token                             │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  TEST 1: Create Store                                                         │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  Method: POST                                                                   │
│  URL: http://localhost:8000/api/stores                                        │
│  Headers:                                                                      │
│    Authorization: Bearer {token_seller}                                        │
│    Content-Type: application/json                                             │
│                                                                                  │
│  Body:                                                                        │
│  {                                                                         │
│    "name": "Dapur Enak",                                                    │
│    "description": "Masakan rumahan berkualitas tinggi",                      │
│    "address": "Jl. Sehat No. 5, Jakarta Selatan",                          │
│    "phone": "02112345678"                                                   │
│  }                                                                         │
│                                                                                  │
│  Expected: 201 Created                                                         │
│  {                                                                         │
│    "success": true,                                                          │
│    "message": "Toko berhasil dibuat",                                        │
│    "data": { "id": 1, "name": "Dapur Enak", ... }                          │
│  }                                                                         │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  TEST 2: Create Product                                                        │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  Method: POST                                                                   │
│  URL: http://localhost:8000/api/seller/products                              │
│  Headers:                                                                      │
│    Authorization: Bearer {token_seller}                                        │
│                                                                                  │
│  Body:                                                                        │
│  {                                                                         │
│    "name": "Nasi Goreng Spesial",                                            │
│    "description": "Nasi goreng dengan telur, ayam suwir, dan kerupuk",        │
│    "price": 25000,                                                            │
│    "stock": 50                                                               │
│  }                                                                         │
│                                                                                  │
│  Expected: 201 Created                                                         │
│  {                                                                         │
│    "success": true,                                                          │
│    "message": "Produk berhasil ditambahkan",                                  │
│    "data": { "id": 1, "name": "Nasi Goreng Spesial", ... }                 │
│  }                                                                         │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  TEST 3: Unauthorized Access (Buyer trying to create)                         │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  Method: POST                                                                   │
│  URL: http://localhost:8000/api/seller/products                              │
│  Headers:                                                                      │
│    Authorization: Bearer {token_buyer}  ← Token Buyer!                       │
│                                                                                  │
│  Expected: 403 Forbidden                                                       │
│  {                                                                         │
│    "message": "Hanya pengguna dengan role Seller yang dapat membuat toko"     │
│  }                                                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.7 Ringkasan BAB 6

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          RINGKASAN BAB 6                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ✅ YANG SUDAH DIBUAT:                                                          │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  DATABASE:                                                                    │
│  ├── Migration: stores (1 user = 1 store)                                     │
│  └── Migration: products (N:1 dengan stores)                                   │
│                                                                                  │
│  MODELS:                                                                      │
│  ├── Store: relationships, scopes, accessors                                   │
│  └── Product: relationships, scopes, price formatting                          │
│                                                                                  │
│  REQUESTS:                                                                     │
│  ├── CreateStoreRequest: authorization + validation                           │
│  ├── UpdateStoreRequest: partial update + unique exclude                      │
│  └── ProductRequest: price as integer, validation                                │
│                                                                                  │
│  CONTROLLERS:                                                                  │
│  ├── StoreController: index, show, store, update                              │
│  └── ProductController: index, show, myProducts, CRUD                          │
│                                                                                  │
│  ROUTES:                                                                       │
│  ├── Public: /stores, /products                                                │
│  └── Seller: /stores/my, /seller/products                                      │
│                                                                                  │
│  FRONTEND:                                                                     │
│  ├── storeService.js                                                            │
│  └── productService.js                                                          │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  KONSEP PENTING:                                                               │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  1. MULTI-LAYER AUTHORIZATION                                                  │
│     middleware → request authorize → controller check                           │
│                                                                                  │
│  2. SOFT DELETE (is_active)                                                    │
│     Jangan hard delete produk/order karena ada reference                        │
│                                                                                  │
│  3. INTEGER PRICE                                                               │
│     Simpan harga sebagai integer untuk avoid floating point                     │
│                                                                                  │
│  4. UNIQUE CONSTRAINTS                                                          │
│     Store name: unique                                                          │
│     User-Store: 1:1 (unique user_id di stores)                                 │
│                                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  NEXT: BAB 7 - Backend: Cart, Orders, Wallet                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                  │
│  Kita akan membuat:                                                             │
│  1. Cart Management (single-store rule)                                        │
│  2. Order Lifecycle (status flow)                                              │
│  3. Wallet & Transactions                                                       │
│  4. Checkout Process                                                            │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.8 Checklist BAB 6

```
┌─────────────────────────────────────────────────────────────────┐
│                        CHECKLIST BAB 6                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DATABASE                                                       │
│  ├── □ stores migration                                         │
│  └── □ products migration                                       │
│                                                                  │
│  MODELS                                                         │
│  ├── □ Store.php (relationships, scopes)                       │
│  └── □ Product.php (relationships, scopes, accessors)           │
│                                                                  │
│  REQUESTS                                                       │
│  ├── □ CreateStoreRequest.php                                   │
│  ├── □ UpdateStoreRequest.php                                   │
│  └── □ ProductRequest.php                                       │
│                                                                  │
│  CONTROLLERS                                                    │
│  ├── □ StoreController.php                                      │
│  └── □ ProductController.php                                     │
│                                                                  │
│  ROUTES                                                         │
│  └── □ api.php (public + seller routes)                        │
│                                                                  │
│  TESTING                                                        │
│  ├── □ Test public store/product listing                        │
│  ├── □ Test seller create store                                 │
│  ├── □ Test seller CRUD products                                │
│  └── □ Test authorization (buyer cannot seller actions)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 7?** [Backend: Cart, Orders & Wallet](../07-backend-cart-order/07-cart-order-wallet.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-10*
