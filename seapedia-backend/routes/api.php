<?php
// File: routes/api.php
// Penjelasan: Definisi API routes untuk Auth, Store & Product

use App\Http\Controllers\AuthController;
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

// =================================================================
// AUTH ROUTES - Publik
// =================================================================
Route::prefix('auth')->group(function () {
    // POST /api/auth/register - Daftar pengguna baru
    Route::post('/register', [AuthController::class, 'register']);

    // POST /api/auth/login - Login
    Route::post('/login', [AuthController::class, 'login']);
});

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
    // AUTH ROUTES - Protected
    // =================================================================
    Route::prefix('auth')->group(function () {
        // POST /api/auth/logout - Logout
        Route::post('/logout', [AuthController::class, 'logout']);

        // GET /api/auth/me - Ambil data user yang login
        Route::get('/me', [AuthController::class, 'me']);

        // POST /api/auth/select-role - Pilih role aktif
        Route::post('/select-role', [AuthController::class, 'selectRole']);

        // POST /api/auth/assign-role - Assign role ke user (admin only)
        Route::post('/assign-role', [AuthController::class, 'assignRole']);
    });

    // =================================================================
    // SELLER: MY STORE
    // =================================================================
    // Routes untuk seller mengelola toko dan produk mereka sendiri
    // Path prefix: /api/stores/my atau /api/seller/products

    // Store - Milik Seller
    Route::prefix('stores')->group(function () {
        // POST /api/stores - Buat toko baru (seller only)
        Route::post('/', [StoreController::class, 'store']);

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