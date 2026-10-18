<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('orders')
            ->where('subtotal', 0)
            ->select(['id', 'total_amount'])
            ->orderBy('id')
            ->each(function (object $order): void {
                $itemSubtotal = (float) DB::table('order_items')
                    ->where('order_id', $order->id)
                    ->selectRaw('COALESCE(SUM(quantity * price_at_purchase), 0) as subtotal')
                    ->value('subtotal');

                DB::table('orders')
                    ->where('id', $order->id)
                    ->update([
                        'subtotal' => $itemSubtotal > 0 ? $itemSubtotal : (float) $order->total_amount,
                    ]);
            });
    }

    public function down(): void
    {
        // Data backfills are intentionally not reversed.
    }
};
