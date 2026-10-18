<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_method', 20)->default('regular')->after('status');
            $table->decimal('subtotal', 15, 2)->default(0)->after('delivery_method');
            $table->decimal('discount_amount', 15, 2)->default(0)->after('subtotal');
            $table->decimal('delivery_fee', 15, 2)->default(0)->after('discount_amount');
            $table->decimal('tax_amount', 15, 2)->default(0)->after('delivery_fee');
            $table->foreignId('discount_id')->nullable()->after('tax_amount')->constrained('discounts')->nullOnDelete();
            $table->timestamp('refunded_at')->nullable()->after('cancellation_reason');
            $table->timestamp('stock_restored_at')->nullable()->after('refunded_at');

            $table->index('delivery_method');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['discount_id']);
            $table->dropIndex(['delivery_method']);
            $table->dropColumn([
                'delivery_method',
                'subtotal',
                'discount_amount',
                'delivery_fee',
                'tax_amount',
                'discount_id',
                'refunded_at',
                'stock_restored_at',
            ]);
        });
    }
};
