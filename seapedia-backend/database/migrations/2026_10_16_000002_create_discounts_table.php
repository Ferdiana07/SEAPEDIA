<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('code', 40)->unique();
            $table->string('name', 120);
            $table->enum('type', ['voucher', 'promo']);
            $table->enum('calculation_type', ['percentage', 'fixed']);
            $table->decimal('value', 15, 2);
            $table->decimal('minimum_purchase', 15, 2)->default(0);
            $table->decimal('maximum_discount', 15, 2)->nullable();
            $table->unsignedInteger('usage_limit')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at');
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['type', 'is_active']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
