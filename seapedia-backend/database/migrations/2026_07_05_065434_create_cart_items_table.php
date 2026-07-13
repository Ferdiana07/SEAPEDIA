<?php
// File: database/migrations/xxxx_create_cart_items_table.php
// Penjelasan: Membuat tabel cart_items untuk menyimpan item di keranjang
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key ke carts
            $table->foreignId('cart_id')
                  ->constrained('carts')
                  ->onDelete('cascade');
            
            // Foreign Key ke products
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade');
            
            // Jumlah item
            $table->unsignedInteger('quantity')->default(1);
            
            $table->timestamps();
            
            // Constraint: 1 produk hanya boleh ada 1x di cart
            // unique(['cart_id', 'product_id'])
            $table->unique(['cart_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};