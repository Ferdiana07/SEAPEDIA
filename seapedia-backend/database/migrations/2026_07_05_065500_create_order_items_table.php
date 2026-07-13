<?php
// File: database/migrations/xxxx_create_order_items_table.php
// Penjelasan: Membuat tabel order_items untuk menyimpan item dalam pesanan
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key ke orders
            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->onDelete('cascade');
            
            // Foreign Key ke products
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade');
            
            // Jumlah yang dipesan
            $table->unsignedInteger('quantity');
            
            // Harga SAAT checkout
            // PENTING: Harga disimpan di sini karena harga produk bisa berubah
            // Jika tidak disimpan, order lama akan，显示 harga baru
            $table->decimal('price_at_purchase', 12, 2);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
