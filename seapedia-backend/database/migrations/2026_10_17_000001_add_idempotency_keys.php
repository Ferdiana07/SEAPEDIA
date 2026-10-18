<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->string('idempotency_key', 100)->nullable()->after('order_number');
            $table->unique(['user_id', 'idempotency_key'], 'orders_user_idempotency_unique');
        });

        Schema::table('transactions', function (Blueprint $table): void {
            $table->string('idempotency_key', 100)->nullable()->after('order_id');
            $table->unique(['wallet_id', 'idempotency_key'], 'transactions_wallet_idempotency_unique');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table): void {
            $table->dropUnique('transactions_wallet_idempotency_unique');
            $table->dropColumn('idempotency_key');
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropUnique('orders_user_idempotency_unique');
            $table->dropColumn('idempotency_key');
        });
    }
};
