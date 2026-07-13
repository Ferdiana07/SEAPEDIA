<?php
// File: database/migrations/xxxx_create_orders_table.php
// Penjelasan: Membuat tabel orders untuk menyimpan pesanan
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            
            // Order number unik (untuk display)
            $table->string('order_number', 50)->unique();
            
            // Foreign Key ke users (buyer)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Foreign Key ke stores
            $table->foreignId('store_id')
                  ->constrained('stores')
                  ->onDelete('cascade');
            
            // Foreign Key ke users (driver) - nullable
            // Nullable karena driver belum tentu ada saat order dibuat
            $table->foreignId('driver_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
            
            // Status pesanan
            // packaging → seller sedang kemas
            // waiting_shipper → menunggu driver ambil
            // shipping → sedang diantar
            // completed → selesai
            // returned → dikembalikan
            $table->enum('status', [
                'packaging',
                'waiting_shipper',
                'shipping',
                'completed',
                'returned'
            ])->default('packaging');
            
            // Total jumlah pesanan
            $table->decimal('total_amount', 15, 2);
            
            // Alamat pengiriman (di-copy dari addresses karena alamat bisa dihapus)
            $table->text('shipping_address');
            
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('store_id');
            $table->index('driver_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};