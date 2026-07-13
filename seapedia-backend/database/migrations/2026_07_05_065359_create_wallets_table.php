<?php
// File: database/migrations/xxxx_create_wallets_table.php
// Penjelasan: Membuat tabel wallets untuk menyimpan saldo dompet digital user

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Penjelasan:
     * Tabel wallets menyimpan saldo dompet digital untuk setiap user.
     * 
     * Aturan:
     * - 1 User = 1 Wallet (relasi 1:1)
     * - Balance tidak boleh negatif
     * - Balance awal = 0 saat register
     */
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            // Primary Key
            $table->id();
            
            // Foreign Key ke users
            // unique() → 1 user hanya punya 1 wallet
            // onDelete('cascade') → jika user dihapus, wallet ikut terhapus
            $table->foreignId('user_id')
                  ->unique()
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Saldo dompet
            // decimal(15,2) → max: 9.999.999.999.999,99
            // default(0) → saldo awal 0
            $table->decimal('balance', 15, 2)->default(0);
            
            // Timestamps
            $table->timestamps();
            
            // Index untuk query
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};