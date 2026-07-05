# BAB 3: Backend - User & Authentication

> **Tujuan:** Memahami dan mengimplementasikan sistem autentikasi user, role management, dan API endpoints menggunakan Laravel Sanctum

---

## 3.1 Recap: Apa yang Sudah Kita Pelajari

Di BAB 0-2, kita sudah:
- Memahami arsitektur client-server
- Mendesain database schema 12 tabel
- Membuat migration, model, dan relasi
- Memahami ERD SEAPEDIA
- Seed data dummy

**Sekarang:** Kita akan membuat sistem autentikasi dan role management!

---

## 3.2 Konsep Authentication

### Apa itu Authentication?

```
┌─────────────────────────────────────────────────────────────────┐
│                    APA ITU AUTHENTICATION?                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Authentication = Memverifikasi identitas user                      │
│                                                                  │
│  Analogi:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  Di dunia nyata:                                                 │
│  Kamu mau masuk ke rumah → Tunjuk KTP → "Saya Budi" → MASUK   │
│                                                                  │
│  Di aplikasi:                                                    │
│  Kamu mau akses fitur → Masukkan email & password → VERIFIED   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  AUTHENTICATION vs AUTHORIZATION                                │
│                                                                  │
│  🔐 AUTHENTICATION = "Siapa kamu?"                              │
│  ─────────────────────────────────────────────────────────────   │
│  • Login dengan email & password                                 │
│  • Verifikasi credentials                                        │
│  • "Email Budi dan password benar!"                            │
│                                                                  │
│  🔒 AUTHORIZATION = "Apa yang boleh kamu lakukan?"              │
│  ─────────────────────────────────────────────────────────────   │
│  • Cek role user                                               │
│  • "Budi role=Seller → boleh tambah produk"                    │
│  • "Ani role=Buyer → boleh checkout"                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.3 Laravel Sanctum

### Apa itu Laravel Sanctum?

```
┌─────────────────────────────────────────────────────────────────┐
│                    APA ITU LARAVEL SANCTUM?                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Sanctum = Package Laravel untuk Authentication API              │
│             (Mirip JWT tapi lebih simpel untuk SPA)             │
│                                                                  │
│  Kenapa pakai Sanctum?                                          │
│  ─────────────────────────────────────────────────────────────   │
│  • Simple dan mudah di-setup                                   │
│  • Cocok untuk SPA (React, Vue)                               │
│  • Mendukung token-based auth                                   │
│  • Mendukung cookie-based auth (untuk SPA)                     │
│                                                                  │
│  Alternatif:                                                   │
│  • Laravel Passport → OAuth2 (lebih kompleks)                  │
│  • Custom JWT → Lebih flexible tapi perlu bikin sendiri         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Cara Kerja Sanctum

```
┌─────────────────────────────────────────────────────────────────┐
│                    CARA KERJA SANCTUM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  USER LOGIN                                               │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│     React                    Laravel                          │
│       │                         │                              │
│       │  POST /api/auth/login  │                              │
│       │────────────────────────>│                              │
│       │  {email, password}     │                              │
│       │                         │                              │
│       │  Validasi credentials  │                              │
│       │                         │                              │
│       │  Buat token baru       │                              │
│       │                         │                              │
│       │  <────────────────────────│                             │
│       │  {token: "xxx"}        │                             │
│       │                         │                              │
│       │  Token disimpan di      │                              │
│       │  localStorage/cookie   │                              │
│                                                                  │
│  2️⃣  REQUEST BERIKUTNYA                                       │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│     React                    Laravel                          │
│       │                         │                              │
│       │  GET /api/cart         │                              │
│       │  Header:               │                              │
│       │  Authorization:        │                              │
│       │  Bearer xxx-token-xxx  │                              │
│       │────────────────────────>│                              │
│       │                         │                              │
│       │  Validasi token        │                              │
│       │                         │                              │
│       │  Dapat user_id dari    │                              │
│       │  token                 │                              │
│       │                         │                              │
│       │  Return cart data      │                              │
│       │  untuk user ini        │                              │
│       │                         │                              │
│       │  <────────────────────────│                             │
│       │  {cart: {...}}         │                             │
│                                                                  │
│  3️⃣  USER LOGOUT                                              │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│     React                    Laravel                          │
│       │                         │                              │
│       │  POST /api/auth/logout │                              │
│       │  Header: Bearer token  │                              │
│       │────────────────────────>│                              │
│       │                         │                              │
│       │  Invalidasi token      │                              │
│       │                         │                              │
│       │  Token tidak bisa      │                              │
│       │  dipakai lagi          │                              │
│       │                         │                              │
│       │  <────────────────────────│                             │
│       │  {message: "Success"}   │                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.4 Setup Laravel Sanctum

### Langkah 1: Install Sanctum

```bash
cd e:\PROJEKAN GABUT\SEAPEDIA\seapedia-backend

composer require laravel/sanctum
```

### Langkah 2: Publish Sanctum Config

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### Langkah 3: Install Sanctum Migration

```bash
php artisan install:api
```

Ini akan membuat tabel `personal_access_tokens` untuk menyimpan token.

### Langkah 4: Tambahkan Trait ke User Model

Buka `app/Models/User.php`, pastikan ada `HasApiTokens`:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;
    // ...
}
```

### Konfigurasi CORS

Buka `config/cors.php` atau buat baru:

```bash
php artisan config:publish cors
```

Pastikan `supports_credentials` = true:

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,  // PENTING!
];
```

---

## 3.5 Authentication Flow

### Alur Lengkap Authentication SEAPEDIA

```
┌─────────────────────────────────────────────────────────────────┐
│                 AUTHENTICATION FLOW SEAPEDIA                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    1. REGISTER                         │   │
│  │                                                          │   │
│  │  POST /api/auth/register                               │   │
│  │  { name, email, password, password_confirmation }       │   │
│  │                                                          │   │
│  │  → Buat user baru                                      │   │
│  │  → Buat wallet otomatis                                 │   │
│  │  → Return user data (tanpa token)                      │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    2. LOGIN                             │   │
│  │                                                          │   │
│  │  POST /api/auth/login                                  │   │
│  │  { email, password }                                   │   │
│  │                                                          │   │
│  │  → Validasi credentials                                 │   │
│  │  → Buat Sanctum token                                  │   │
│  │  → Return token                                        │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    3. GET ME                            │   │
│  │                                                          │   │
│  │  GET /api/auth/me (with token)                         │   │
│  │                                                          │   │
│  │  → Return user data + roles                             │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    4. SELECT ROLE                       │   │
│  │                                                          │   │
│  │  POST /api/auth/select-role                             │   │
│  │  { role: 'buyer' }                                     │   │
│  │                                                          │   │
│  │  → Validasi user punya role ini                        │   │
│  │  → Update is_active = true untuk role ini              │   │
│  │  → Update is_active = false untuk role lain           │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                 │
│                              ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    5. LOGOUT                            │   │
│  │                                                          │   │
│  │  POST /api/auth/logout (with token)                     │   │
│  │                                                          │   │
│  │  → Invalidasi token                                    │   │
│  │  → Return success                                     │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.6 Membuat AuthController

### Struktur AuthController

```
┌─────────────────────────────────────────────────────────────────┐
│                   AUTHCONTROLLER METHODS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AuthController.php                                             │
│  ├── register()     → Daftar user baru                         │
│  ├── login()       → Login user                                │
│  ├── logout()      → Logout user                               │
│  ├── me()         → Get current user                           │
│  └── selectRole()  → Pilih role aktif                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Kode Lengkap AuthController

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * ============================================================
     * REGISTER
     * ============================================================
     * Mendaftarkan user baru
     *
     * Request: { name, email, password, password_confirmation }
     * Response: { user, message }
     */
    public function register(Request $request): JsonResponse
    {
        // Validasi input
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        // Buat user baru
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Buat wallet otomatis untuk user baru
        Wallet::create([
            'user_id' => $user->id,
            'balance' => 0,
        ]);

        // Return success (user harus login dulu untuk dapat token)
        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil! Silakan login.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }

    /**
     * ============================================================
     * LOGIN
     * ============================================================
     * Login user dan generate token
     *
     * Request: { email, password }
     * Response: { user, token, message }
     */
    public function login(Request $request): JsonResponse
    {
        // Validasi input
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Cek credentials
        if (!Auth::attempt($validated)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Ambil user yang login
        $user = Auth::user();

        // Hapus token lama (optional, bisa dimulti-device)
        $user->tokens()->delete();

        // Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'user' => $this->getUserWithRoles($user),
            'token' => $token,
        ]);
    }

    /**
     * ============================================================
     * LOGOUT
     * ============================================================
     * Logout user dan invalidasi token
     *
     * Request: (token required)
     * Response: { message }
     */
    public function logout(Request $request): JsonResponse
    {
        // Hapus token user saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil!',
        ]);
    }

    /**
     * ============================================================
     * ME
     * ============================================================
     * Get data user yang sedang login
     *
     * Request: (token required)
     * Response: { user }
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => $this->getUserWithRoles($user),
        ]);
    }

    /**
     * ============================================================
     * SELECT ROLE
     * ============================================================
     * Memilih role aktif
     *
     * Request: { role: 'buyer' | 'seller' | 'driver' }
     * Response: { user, message }
     */
    public function selectRole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:buyer,seller,driver'],
        ]);

        $user = $request->user();
        $role = $validated['role'];

        // Cek apakah user punya role ini
        if (!$user->hasRole($role)) {
            return response()->json([
                'success' => false,
                'message' => "Kamu tidak memiliki role '$role'. Dapatkan role ini terlebih dahulu.",
            ], 403);
        }

        // Aktifkan role yang dipilih
        $user->activateRole($role);

        return response()->json([
            'success' => true,
            'message' => "Role '$role' berhasil diaktifkan!",
            'user' => $this->getUserWithRoles($user->fresh()),
        ]);
    }

    /**
     * ============================================================
     * ASSIGN ROLE
     * ============================================================
     * Memberikan role baru ke user
     *
     * Request: { role: 'buyer' | 'seller' | 'driver' }
     * Response: { user, message }
     */
    public function assignRole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:buyer,seller,driver'],
        ]);

        $user = $request->user();
        $role = $validated['role'];

        // Cek apakah sudah punya role ini
        if ($user->hasRole($role)) {
            return response()->json([
                'success' => false,
                'message' => "Kamu sudah memiliki role '$role'.",
            ], 400);
        }

        // Cek apakah mencoba assign admin
        if ($role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat assign role admin!',
            ], 403);
        }

        // Buat role baru
        $user->roles()->create([
            'role' => $role,
            'is_active' => false, // Default tidak aktif
        ]);

        return response()->json([
            'success' => true,
            'message' => "Role '$role' berhasil ditambahkan!",
            'user' => $this->getUserWithRoles($user->fresh()),
        ]);
    }

    /**
     * ============================================================
     * HELPER: Get User with Roles
     * ============================================================
     */
    private function getUserWithRoles(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar_url' => $user->avatar_url,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'role' => $role->role,
                    'is_active' => $role->is_active,
                ];
            }),
            'active_role' => $user->getActiveRole()?->role,
        ];
    }
}
```

---

## 3.7 API Routes

### Konfigurasi Routes API

Buka `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Semua endpoint API SEAPEDIA didefinisikan di sini
|
*/

// ============================================================
// PUBLIC ROUTES (Tanpa autentikasi)
// ============================================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// ============================================================
// PROTECTED ROUTES (Perlu autentikasi)
// ============================================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/select-role', [AuthController::class, 'selectRole']);
        Route::post('/assign-role', [AuthController::class, 'assignRole']);
    });

});
```

### Penjelasan Route Groups

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTE GROUPS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ROUTE PREFIX vs MIDDLEWARE                                   │
│                                                                  │
│  prefix('auth')  → Semua route dapat prefix /api/auth/        │
│  ─────────────────────────────────────────────────────────────   │
│  Route::post('/register', ...)                                 │
│  → Bisa diakses di: POST /api/auth/register                    │
│                                                                  │
│  middleware('auth:sanctum')  → Semua route butuh token       │
│  ─────────────────────────────────────────────────────────────   │
│  GET /api/auth/me                                            │
│  → BUTUH header: Authorization: Bearer xxx                    │
│  → Jika tidak ada token → Error 401 Unauthorized             │
│                                                                  │
│  WITHOUT middleware  → Route publik (tanpa token)               │
│  ─────────────────────────────────────────────────────────────   │
│  POST /api/auth/register                                      │
│  → BISA diakses TANPA token                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.8 Protected vs Public Routes

### Public Routes (Tanpa Login)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLIC ROUTES                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Bisa diakses TANPA token/autentikasi:                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  POST /api/auth/register                               │   │
│  │  POST /api/auth/login                                │   │
│  │                                                          │   │
│  │  GET /api/products                                    │   │
│  │  GET /api/products/{id}                              │   │
│  │                                                          │   │
│  │  GET /api/stores                                     │   │
│  │  GET /api/stores/{id}                                │   │
│  │                                                          │   │
│  │  GET /api/reviews                                    │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Siapa saja bisa akses - Guest maupun User                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Protected Routes (Perlu Login)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROTECTED ROUTES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BUTUH token untuk akses:                                      │
│                                                                  │
│  Header: Authorization: Bearer xxx-token-xxx                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  POST /api/auth/logout                                │   │
│  │  GET /api/auth/me                                     │   │
│  │  POST /api/auth/select-role                           │   │
│  │  POST /api/auth/assign-role                          │   │
│  │                                                          │   │
│  │  GET /api/wallet                                      │   │
│  │  POST /api/wallet/topup                               │   │
│  │                                                          │   │
│  │  GET /api/cart                                       │   │
│  │  POST /api/cart/items                                 │   │
│  │                                                          │   │
│  │  POST /api/orders                                    │   │
│  │  GET /api/orders                                     │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Jika tidak ada token → Error 401 Unauthorized                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.9 Middleware

### Apa itu Middleware?

```
┌─────────────────────────────────────────────────────────────────┐
│                       APA ITU MIDDLEWARE?                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Middleware = Kode yang berjalan SEBELUM request sampai ke       │
│              controller. Seperti "penjaga gerbang".            │
│                                                                  │
│  Analogi:                                                        │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  Mau masuk gedung → PenjagaSecurity → "Bawa KTP?"              │
│  │                        │                                     │
│  │    Token valid?      │                                     │
│  │                        ↓                                     │
│  │                  ┌─────────┐                              │
│  │                  │Middleware│ ←─┐                           │
│  │                  │  Auth   │   │ Cek token                  │
│  │                  └────┬────┘───┘                           │
│  │                       │                                     │
│  │                       ↓                                     │
│  │                  ┌─────────┐                              │
│  │                  │Controller│                              │
│  │                  └─────────┘                              │
│                                                                  │
│  Request → [Middleware Auth] → [Controller] → Response         │
│                      ↓                                         │
│               Token valid?                                       │
│               ├─ Ya → Lanjut ke Controller                    │
│               └─ Tidak → Return 401 Unauthorized              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Middleware yang Tersedia di Laravel

```
┌─────────────────────────────────────────────────────────────────┐
│                   MIDDLEWARE LARAVEL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  auth           → Cek user sudah login (token valid)           │
│  auth:sanctum  → Cek user sudah login via Sanctum             │
│  guest          → Cek user BELUM login                        │
│  admin          → Cek user adalah admin                       │
│  throttle       → Batasi request (rate limiting)               │
│                                                                  │
│  Custom Middleware:                                             │
│  • role:buyer    → Cek user punya role buyer                 │
│  • role:seller   → Cek user punya role seller                │
│  • role:driver   → Cek user punya role driver                │
│  • active_role:buyer → Cek role buyer sedang aktif           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Contoh Custom Middleware: Role Check

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        // Cek apakah user punya role ini
        if (!$user || !$user->hasRole($role)) {
            return response()->json([
                'success' => false,
                'message' => "Kamu tidak memiliki akses. Butuh role '$role'.",
            ], 403);
        }

        // Cek apakah role ini sedang aktif
        if (!$user->hasActiveRole($role)) {
            return response()->json([
                'success' => false,
                'message' => "Role '$role' tidak aktif. Aktifkan dulu dengan POST /api/auth/select-role.",
            ], 403);
        }

        return $next($request);
    }
}
```

Daftarkan middleware di `bootstrap/app.php`:

```php
// bootstrap/app.php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Daftarkan alias middleware
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->create();
```

---

## 3.10 Contoh Request/Response

### 1. Register

```bash
# Request
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
    "name": "Joko Susilo",
    "email": "joko@email.com",
    "password": "password123",
    "password_confirmation": "password123"
}

# Response (201 Created)
{
    "success": true,
    "message": "Registrasi berhasil! Silakan login.",
    "user": {
        "id": 10,
        "name": "Joko Susilo",
        "email": "joko@email.com"
    }
}
```

### 2. Login

```bash
# Request
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
    "email": "joko@email.com",
    "password": "password123"
}

# Response (200 OK)
{
    "success": true,
    "message": "Login berhasil!",
    "user": {
        "id": 10,
        "name": "Joko Susilo",
        "email": "joko@email.com",
        "avatar_url": null,
        "roles": [],
        "active_role": null
    },
    "token": "1|abc123xyz..."
}
```

### 3. Get Me (Dengan Token)

```bash
# Request
GET http://localhost:8000/api/auth/me
Authorization: Bearer 1|abc123xyz...

# Response (200 OK)
{
    "success": true,
    "user": {
        "id": 10,
        "name": "Joko Susilo",
        "email": "joko@email.com",
        "avatar_url": null,
        "roles": [],
        "active_role": null
    }
}
```

### 4. Assign Role

```bash
# Request
POST http://localhost:8000/api/auth/assign-role
Authorization: Bearer 1|abc123xyz...
Content-Type: application/json

{
    "role": "buyer"
}

# Response (200 OK)
{
    "success": true,
    "message": "Role 'buyer' berhasil ditambahkan!",
    "user": {
        "id": 10,
        "name": "Joko Susilo",
        "email": "joko@email.com",
        "roles": [
            {"role": "buyer", "is_active": false}
        ],
        "active_role": null
    }
}
```

### 5. Select Role

```bash
# Request
POST http://localhost:8000/api/auth/select-role
Authorization: Bearer 1|abc123xyz...
Content-Type: application/json

{
    "role": "buyer"
}

# Response (200 OK)
{
    "success": true,
    "message": "Role 'buyer' berhasil diaktifkan!",
    "user": {
        "id": 10,
        "name": "Joko Susilo",
        "email": "joko@email.com",
        "roles": [
            {"role": "buyer", "is_active": true}
        ],
        "active_role": "buyer"
    }
}
```

### 6. Logout

```bash
# Request
POST http://localhost:8000/api/auth/logout
Authorization: Bearer 1|abc123xyz...

# Response (200 OK)
{
    "success": true,
    "message": "Logout berhasil!"
}
```

---

## 3.11 Error Responses

### Format Error Standard

```json
{
    "success": false,
    "message": "Pesan error",
    "errors": {
        "email": ["Email sudah digunakan."],
        "password": ["Password minimal 8 karakter."]
    }
}
```

### Error Codes

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR CODES                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  400 Bad Request     → Input tidak valid                        │
│  401 Unauthorized    → Belum login / Token invalid              │
│  403 Forbidden       → Tidak punya akses (role tidak sesuai)     │
│  404 Not Found       → Data tidak ditemukan                   │
│  422 Unprocessable  → Validasi gagal                          │
│     Entity                                                     │
│  500 Server Error    → Error di server                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Contoh Error Responses

```json
// 401 Unauthorized - Login gagal
{
    "success": false,
    "message": "Email atau password salah."
}

// 401 Unauthorized - Token tidak ada
{
    "message": "Unauthenticated."
}

// 403 Forbidden - Tidak punya role
{
    "success": false,
    "message": "Kamu tidak memiliki role 'seller'. Dapatkan role ini terlebih dahulu."
}

// 422 Validation Error
{
    "success": false,
    "message": "Validasi gagal.",
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password confirmation does not match."]
    }
}
```

---

## 3.12 Langkah Praktik

### Langkah 1: Install Sanctum

```bash
cd e:\PROJEKAN GABUT\SEAPEDIA\seapedia-backend

composer require laravel/sanctum
```

### Langkah 2: Install API

```bash
php artisan install:api
```

### Langkah 3: Buat Controller

```bash
php artisan make:controller AuthController
```

### Langkah 4: Buat Middleware (Optional)

```bash
php artisan make:middleware CheckRole
```

### Langkah 5: Isi Kode

Copy kode-kode dari section sebelumnya.

### Langkah 6: Update Routes

Update `routes/api.php` dengan routes yang sudah dibuat.

### Langkah 7: Testing

```bash
# Test register
curl -X POST http://localhost:8000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","password":"password123","password_confirmation":"password123"}'

# Test login
curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"password123"}'

# Test me (dengan token)
curl -X GET http://localhost:8000/api/auth/me \
    -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 3.13 Troubleshooting

```
┌─────────────────────────────────────────────────────────────────┐
│                    TROUBLESHOOTING                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ❌ "Unauthenticated."                                        │
│  ─────────────────────────────────────────────────────────────   │
│  SOLUSI:                                                       │
│  1. Pastikan header Authorization ada                          │
│  2. Format: Authorization: Bearer xxx                        │
│  3. Token tidak boleh expired                                 │
│  4. Token tidak boleh di-revoke                              │
│                                                                  │
│  ❌ "Invalid credentials."                                    │
│  ─────────────────────────────────────────────────────────────   │
│  SOLUSI:                                                       │
│  1. Cek email benar                                           │
│  2. Cek password benar                                       │
│  3. Pastikan password di-hash saat simpan                    │
│                                                                  │
│  ❌ "You are not authorized to access this resource."         │
│  ─────────────────────────────────────────────────────────────   │
│  SOLUSI:                                                       │
│  1. Cek apakah punya role yang dibutuhkan                     │
│  2. Cek apakah role sedang aktif                              │
│                                                                  │
│  ❌ CORS Error                                                │
│  ─────────────────────────────────────────────────────────────   │
│  SOLUSI:                                                       │
│  1. Cek config/cors.php                                      │
│  2. Pastikan supports_credentials = true                      │
│  3. Pastikan FRONTEND_URL di .env benar                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3.14 Checklist BAB 3

- [ ] Install Laravel Sanctum
- [ ] Konfigurasi CORS
- [ ] Buat AuthController
- [ ] Buat middleware CheckRole (optional)
- [ ] Update routes/api.php
- [ ] Testing register endpoint
- [ ] Testing login endpoint
- [ ] Testing protected endpoints
- [ ] Testing role selection

---

## 3.15 Ringkasan BAB 3

```
┌─────────────────────────────────────────────────────────────────┐
│                    YANG SUDAH DIPELAJARI                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Konsep Authentication vs Authorization                    │
│  ✅ Laravel Sanctum setup                                     │
│  ✅ AuthController (register, login, logout, me, selectRole) │
│  ✅ API Routes (public vs protected)                         │
│  ✅ Middleware concept                                        │
│  ✅ Custom Middleware CheckRole                               │
│  ✅ Error handling                                          │
│                                                                  │
│  NEXT: BAB 4 - Frontend UI Foundations                       │
│  ─────────────────────────────────────────────────────────────  │
│  Kita akan:                                                   │
│  1. Setup React project dengan routing                       │
│  2. Buat UI components (Button, Input, Card, Navbar)        │
│  3. Setup Tailwind dengan design system                      │
│  4. Buat halaman-halaman authentication                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Lanjut ke BAB 4?** [Frontend: UI Foundations](../04-frontend-ui/04-ui-foundations.md)

---

*Dokumentasi ini dibuat sebagai bagian dari pembelajaran SEAPEDIA*
*Tanggal: 2026-07-05*
