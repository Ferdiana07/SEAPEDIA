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