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