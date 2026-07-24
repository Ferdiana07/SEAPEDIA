<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan kolom category ke tabel products untuk filter kategori.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Tambah kolom category setelah description
            // Enum untuk memastikan value selalu valid
            $table->string('category', 50)->nullable()->after('description')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
