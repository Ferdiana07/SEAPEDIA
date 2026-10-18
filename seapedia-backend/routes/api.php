<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApplicationReviewController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/application-reviews', [ApplicationReviewController::class, 'index']);
Route::post('/application-reviews', [ApplicationReviewController::class, 'store'])
    ->middleware('throttle:10,1');

Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{id}', [StoreController::class, 'show'])->whereNumber('id');

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show'])->whereNumber('id');
Route::get('/products/{id}/reviews', [ReviewController::class, 'index'])->whereNumber('id');

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'changePassword']);
        Route::post('/select-role', [AuthController::class, 'selectRole']);
        Route::post('/assign-role', [AuthController::class, 'assignRole']);
    });

    Route::middleware('role:buyer')->group(function () {
        Route::post('/products/{id}/reviews', [ReviewController::class, 'store'])->whereNumber('id');
        Route::put('/reviews/{id}', [ReviewController::class, 'update'])->whereNumber('id');
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy'])->whereNumber('id');

        Route::get('/wallet', [WalletController::class, 'show']);
        Route::post('/wallet/topup', [WalletController::class, 'topUp']);
        Route::get('/transactions', [WalletController::class, 'transactions']);

        Route::get('/addresses', [AddressController::class, 'index']);
        Route::post('/addresses', [AddressController::class, 'store']);
        Route::get('/addresses/{id}', [AddressController::class, 'show'])->whereNumber('id');
        Route::put('/addresses/{id}', [AddressController::class, 'update'])->whereNumber('id');
        Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->whereNumber('id');
        Route::post('/addresses/{id}/set-default', [AddressController::class, 'setDefault'])->whereNumber('id');

        Route::get('/cart', [CartController::class, 'index']);
        Route::delete('/cart', [CartController::class, 'clear']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::put('/cart/items/{id}', [CartController::class, 'updateItem'])->whereNumber('id');
        Route::delete('/cart/items/{id}', [CartController::class, 'removeItem'])->whereNumber('id');

        Route::get('/orders/report/summary', [OrderController::class, 'buyerReport']);
        Route::post('/orders/quote', [OrderController::class, 'quote']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{id}', [OrderController::class, 'show'])->whereNumber('id');
        Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel'])->whereNumber('id');
    });

    Route::middleware('role:seller')->group(function () {
        Route::get('/stores/my', [StoreController::class, 'myStore']);
        Route::post('/stores', [StoreController::class, 'store']);
        Route::put('/stores/my', [StoreController::class, 'update']);

        Route::get('/seller/products/stats', [ProductController::class, 'myProductsStats']);
        Route::get('/seller/products', [ProductController::class, 'myProducts']);
        Route::post('/seller/products', [ProductController::class, 'store']);
        Route::put('/seller/products/{id}', [ProductController::class, 'update'])->whereNumber('id');
        Route::delete('/seller/products/{id}', [ProductController::class, 'destroy'])->whereNumber('id');

        Route::get('/seller/orders/report/summary', [OrderController::class, 'sellerReport']);
        Route::get('/seller/orders', [OrderController::class, 'sellerOrders']);
        Route::put('/seller/orders/{id}/status', [OrderController::class, 'updateStatus'])->whereNumber('id');
    });

    Route::middleware('role:driver')->prefix('driver/orders')->group(function () {
        Route::get('/report/summary', [OrderController::class, 'driverReport']);
        Route::get('/', [OrderController::class, 'driverOrders']);
        Route::post('/{id}/pickup', [OrderController::class, 'pickupOrder'])->whereNumber('id');
        Route::post('/{id}/complete', [OrderController::class, 'completeOrder'])->whereNumber('id');
        Route::post('/{id}/return', [OrderController::class, 'returnOrder'])->whereNumber('id');
    });

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/monitoring', [AdminController::class, 'monitoring']);
        Route::post('/simulate-time', [AdminController::class, 'simulateTime']);

        Route::get('/discounts', [DiscountController::class, 'index']);
        Route::post('/discounts', [DiscountController::class, 'store']);
        Route::get('/discounts/{discount}', [DiscountController::class, 'show']);
        Route::put('/discounts/{discount}', [DiscountController::class, 'update']);
    });
});
