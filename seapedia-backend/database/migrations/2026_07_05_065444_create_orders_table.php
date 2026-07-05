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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();  // Contoh: ORD-20240101-001
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('store_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('driver_id')                 // Nullable: belum ada driver
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            $table->enum('status', [
                'packaging',           // Sedang dikemas seller
                'waiting_shipper',     // Menunggu driver
                'shipping',            // Sedang diantar
                'completed',           // Selesai
                'returned'            // Dikembalikan
            ])->default('packaging');
            $table->decimal('total_amount', 15, 2);
            $table->text('shipping_address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
