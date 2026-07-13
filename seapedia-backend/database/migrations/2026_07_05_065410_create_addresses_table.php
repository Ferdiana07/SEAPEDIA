<?php
// File: database/migrations/xxxx_create_addresses_table.php
// Penjelasan: Membuat tabel addresses untuk menyimpan alamat pengiriman buyer\
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            
            // Foreign Key ke users
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            
            // Label alamat (Rumah, Kantor, dll)
            $table->string('label', 50);
            
            // Nama penerima
            $table->string('recipient_name', 255);
            
            // Nomor HP penerima
            $table->string('phone', 20);
            
            // Alamat lengkap
            $table->text('full_address');
            
            // Apakah alamat default
            $table->boolean('is_default')->default(false);
            
            $table->timestamps();
            
            // Index
            $table->index('user_id');
            $table->index('is_default');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};