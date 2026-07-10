<?php
// File: database/migrations/2024_01_15_000002_create_products_table.php
// Penjelasan: Membuat tabel products untuk menyimpan data produk

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Penjelasan:
     * Tabel products menyimpan semua produk yang dijual di platform.
     * 
     * Relasi:
     * - Product dimiliki oleh 1 Store (N:1)
     * - Store dimiliki oleh 1 User (N:1)
     * 
     * Struktur:
     * - Data produk: name, description, price, stock
     * - Media: image_url (gambar produk)
     * - Status: is_active (soft delete, bukan hard delete)
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            // Primary Key
            $table->id();
            
            // Foreign Key ke stores
            // onDelete('cascade') → jika store dihapus, semua produk ikut terhapus
            $table->foreignId('store_id')
                  ->constrained('stores')
                  ->onDelete('cascade');
            
            // Nama produk
            $table->string('name');
            
            // Deskripsi produk (nullable, boleh kosong)
            $table->text('description')->nullable();
            
            // Harga dalam Rupiah (integer untuk avoid floating point issues)
            // Disimpan sebagai integer: 25000 = Rp 25.000
            // ⭐ Kenapa integer bukan decimal?
            // → Decimal di MySQL bisa jadi 25.0000001
            // → Integer lebih reliable untuk mata uang
            $table->integer('price');
            
            // Stok produk
            // 0 = habis, >0 = tersedia
            $table->integer('stock')->default(0);
            
            // URL gambar produk (nullable)
            // Bisa dari cloud storage (S3, Cloudinary) atau local
            $table->string('image_url')->nullable();
            
            // Status aktif
            // false = produk tidak ditampilkan (soft delete)
            // Bukan hard delete karena mungkin ada order yang reference
            $table->boolean('is_active')->default(true);
            
            // Timestamps
            $table->timestamps();
            
            // Indexes
            // Pencarian produk berdasarkan nama
            $table->index('name');
            
            // Filter produk aktif
            $table->index('is_active');
            
            // Filter berdasarkan store
            $table->index('store_id');
            
            // composite index untuk query: products by store that are active
            $table->index(['store_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};