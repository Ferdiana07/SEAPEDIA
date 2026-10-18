<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Katalog demo dikelola oleh ProductSeeder agar migrasi skema tidak
     * menyisipkan data produk dan aman dijalankan di semua lingkungan.
     */
    public function up(): void
    {
        // Intentionally empty.
    }

    public function down(): void
    {
        // Intentionally empty.
    }
};
