<?php
// File: routes/api.php
// Penjelasan: Definisi API routes untuk SEAPEDIA

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdminController;
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

    // ============================================================
    // REVIEW ROUTES (BAB 9)
    // ============================================================
    // GET /api/products/{id}/reviews - Lihat semua review produk
    //     Bisa diakses publik (guest & user login).
    Route::get('/{id}/reviews', [ReviewController::class, 'index'])
        ->where('id', '[0-9]+');
});

// Review routes - Protected (butuh login)
// Dipindahkan ke dalam Route::middleware('auth:sanctum') utama di bawah.

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
    // REVIEW ROUTES (BAB 9) - butuh login
    // =================================================================
    // POST /api/products/{id}/reviews - Buat review
    Route::post('/products/{id}/reviews', [ReviewController::class, 'store'])
        ->where('id', '[0-9]+');

    // PUT /api/reviews/{id} - Update review milik sendiri
    Route::put('/reviews/{id}', [ReviewController::class, 'update'])
        ->where('id', '[0-9]+');

    // DELETE /api/reviews/{id} - Hapus review milik sendiri
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy'])
        ->where('id', '[0-9]+');

    // =================================================================
    // AUTH ROUTES - Protected
    // =================================================================
    Route::prefix('auth')->group(function () {
        // POST /api/auth/logout - Logout
        Route::post('/logout', [AuthController::class, 'logout']);

        // GET /api/auth/me - Ambil data user yang login
        Route::get('/me', [AuthController::class, 'me']);

        // PUT /api/auth/profile - Update profil
        Route::put('/profile', [AuthController::class, 'updateProfile']);

        // PUT /api/auth/password - Ganti password
        Route::put('/password', [AuthController::class, 'changePassword']);

        // POST /api/auth/select-role - Pilih role aktif
        Route::post('/select-role', [AuthController::class, 'selectRole']);

        // POST /api/auth/assign-role - Assign role ke user (admin only)
        Route::post('/assign-role', [AuthController::class, 'assignRole']);
    });

    // =================================================================
    // BUYER ROUTES
    // =================================================================

    // Wallet
    Route::prefix('wallet')->group(function () {
        // GET /api/wallet - Ambil data wallet
        Route::get('/', [WalletController::class, 'show']);

        // POST /api/wallet/topup - Top up saldo
        Route::post('/topup', [WalletController::class, 'topUp']);
    });

    // Transactions
    // GET /api/transactions - Riwayat transaksi
    Route::get('/transactions', [WalletController::class, 'transactions']);

    // Addresses
    Route::prefix('addresses')->group(function () {
        // GET /api/addresses - List semua alamat
        Route::get('/', [AddressController::class, 'index']);

        // POST /api/addresses - Tambah alamat baru
        Route::post('/', [AddressController::class, 'store']);

        // GET /api/addresses/{id} - Detail alamat
        Route::get('/{id}', [AddressController::class, 'show'])
            ->where('id', '[0-9]+');

        // PUT /api/addresses/{id} - Update alamat
        Route::put('/{id}', [AddressController::class, 'update'])
            ->where('id', '[0-9]+');

        // DELETE /api/addresses/{id} - Hapus alamat
        Route::delete('/{id}', [AddressController::class, 'destroy'])
            ->where('id', '[0-9]+');

        // POST /api/addresses/{id}/set-default - Set alamat default
        Route::post('/{id}/set-default', [AddressController::class, 'setDefault'])
            ->where('id', '[0-9]+');
    });

    // Cart
    Route::prefix('cart')->group(function () {
        // GET /api/cart - Ambil isi cart
        Route::get('/', [CartController::class, 'index']);

        // POST /api/cart/items - Tambah item
        Route::post('/items', [CartController::class, 'addItem']);

        // PUT /api/cart/items/{id} - Update quantity
        Route::put('/items/{id}', [CartController::class, 'updateItem'])
            ->where('id', '[0-9]+');

        // DELETE /api/cart/items/{id} - Hapus item
        Route::delete('/items/{id}', [CartController::class, 'removeItem'])
            ->where('id', '[0-9]+');

        // DELETE /api/cart - Kosongkan cart
        Route::delete('/', [CartController::class, 'clear']);
    });

    // Orders - Buyer
    Route::prefix('orders')->group(function () {
        // GET /api/orders - List pesanan buyer
        Route::get('/', [OrderController::class, 'index']);

        // POST /api/orders - Checkout (buat pesanan)
        Route::post('/', [OrderController::class, 'store']);

        // GET /api/orders/{id} - Detail pesanan
        Route::get('/{id}', [OrderController::class, 'show'])
            ->where('id', '[0-9]+');

        // POST /api/orders/{id}/cancel - Batalkan pesanan
        Route::post('/{id}/cancel', [OrderController::class, 'cancel'])
            ->where('id', '[0-9]+');
    });

    // =================================================================
    // SELLER ROUTES
    // =================================================================

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

    // Seller Orders
    Route::prefix('seller/orders')->group(function () {
        // GET /api/seller/orders - List pesanan masuk
        Route::get('/', [OrderController::class, 'sellerOrders']);

        // PUT /api/seller/orders/{id}/status - Update status
        Route::put('/{id}/status', [OrderController::class, 'updateStatus'])
            ->where('id', '[0-9]+');
    });

    // =================================================================
    // DRIVER ROUTES
    // =================================================================

    Route::prefix('driver/orders')->group(function () {
        // GET /api/driver/orders - List pesanan untuk driver
        Route::get('/', [OrderController::class, 'driverOrders']);

        // POST /api/driver/orders/{id}/pickup - Ambil pesanan
        Route::post('/{id}/pickup', [OrderController::class, 'pickupOrder'])
            ->where('id', '[0-9]+');

        // POST /api/driver/orders/{id}/complete - Selesaikan pesanan
        Route::post('/{id}/complete', [OrderController::class, 'completeOrder'])
            ->where('id', '[0-9]+');

        // POST /api/driver/orders/{id}/return - Kembalikan pesanan (BAB 9)
        Route::post('/{id}/return', [OrderController::class, 'returnOrder'])
            ->where('id', '[0-9]+');
    });

    // =================================================================
    // ADMIN ROUTES
    // =================================================================
    Route::prefix('admin')->group(function () {
        // GET /api/admin/stats - Statistik platform
        Route::get('/stats', [AdminController::class, 'stats']);

        // GET /api/admin/users - Daftar semua user
        Route::get('/users', [AdminController::class, 'users']);
    });
});