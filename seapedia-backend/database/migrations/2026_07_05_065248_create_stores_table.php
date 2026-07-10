<?php
// File: database/migrations/2024_01_15_000001_create_stores_table.php
// Penjelasan: Membuat tabel stores untuk menyimpan data toko seller

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Penjelasan:
     * Migration ini membuat tabel stores yang menyimpan informasi toko.
     * 
     * Relasi:
     * - 1 User memiliki 1 Store (1:1)
     * - 1 Store memiliki banyak Products (1:N)
     * 
     * Kenapa user_id UNIQUE?
     * → Karena 1 user (seller) hanya boleh punya 1 toko
     * → Jika tidak unique, 1 user bisa punya banyak toko
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            // Primary Key
            $table->id();
            
            // Foreign Key ke users
            // onDelete('cascade') → jika user dihapus, store ikut terhapus
            // unique() → 1 user = 1 store
            $table->foreignId('user_id')
                  ->unique()  // ⭐ Kunci: 1 user hanya boleh punya 1 toko
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Nama toko (UNIQUE untuk prevent duplicate names)
            // Ini penting karena storefronts mencari toko berdasarkan nama
            $table->string('name')->unique();
            
            // Deskripsi toko (nullable karena boleh kosong)
            $table->text('description')->nullable();
            
            // Alamat fisik toko
            $table->string('address');
            
            // Nomor telepon toko
            $table->string('phone');
            
            // URL gambar/logo toko (nullable, bisa ditambahkan nanti)
            $table->string('image_url')->nullable();
            
            // Status aktif/tidak
            // false = toko dinonaktifkan (bisa terjadi jika违反规则)
            $table->boolean('is_active')->default(true);
            
            // Timestamps (created_at, updated_at)
            $table->timestamps();
            
            // Index untuk query yang sering
            // Sering dicari berdasarkan nama
            $table->index('name');
            
            // Sering filter berdasarkan status aktif
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};