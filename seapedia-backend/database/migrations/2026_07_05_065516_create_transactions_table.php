<?php
// File: database/migrations/xxxx_create_transactions_table.php
// Penjelasan: Membuat tabel transactions untuk menyimpan riwayat transaksi wallet
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            // Primary Key
            $table->id();
            
            // Foreign Key ke wallets
            $table->foreignId('wallet_id')
                  ->constrained('wallets')
                  ->onDelete('cascade');
            
            // Foreign Key ke orders (nullable, tidak semua transaksi terkait order)
            $table->foreignId('order_id')
                  ->nullable()
                  ->constrained('orders')
                  ->onDelete('set null');
            
            // Tipe transaksi
            // topup → user top up saldo
            // purchase → user checkout (debit)
            // refund → uang dikembalikan
            $table->enum('type', ['topup', 'purchase', 'refund']);
            
            // Jumlah transaksi
            // Untuk purchase: nilai positif (Rp 50.000)
            // Bisa juga disimpan negatif untuk debit, tapi lebih jelas dengan enum type
            $table->decimal('amount', 15, 2);
            
            // Deskripsi transaksi
            $table->string('description', 255)->nullable();
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            $table->index('wallet_id');
            $table->index('type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};