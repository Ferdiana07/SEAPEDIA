<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * BAB 9: Driver Return Flow
     * Driver butuh menyimpan alasan pesanan dikembalikan (misal: alamat salah,
     * buyer tidak ditemukan). Kolom ini nullable agar order lama tetap valid.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->text('cancellation_reason')
                ->nullable()
                ->after('shipping_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('cancellation_reason');
        });
    }
};
