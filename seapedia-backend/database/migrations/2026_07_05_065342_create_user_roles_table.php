<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();                              // PK
            $table->foreignId('user_id')               // FK ke users.id
                ->constrained()
                ->onDelete('cascade');
            $table->enum('role', ['admin', 'seller', 'buyer', 'driver']);
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            // Constraint: 1 user hanya boleh punya 1 role per type
            $table->unique(['user_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};
