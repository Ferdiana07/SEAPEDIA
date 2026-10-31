<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Wallet;
use Database\Seeders\ProductSeeder;
use Database\Seeders\StoreSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_catalog_covers_all_categories_and_can_be_synced_without_resetting_seller_data(): void
    {
        $this->seed([UserSeeder::class, StoreSeeder::class, ProductSeeder::class]);
        $this->assertSame(40, Product::count());
        $counts = Product::query()->selectRaw('category, COUNT(*) as total')->groupBy('category')->pluck('total');
        $this->assertCount(8, $counts);
        foreach ($counts as $count) {
            $this->assertSame(5, (int) $count);
        }

        $product = Product::firstOrFail();
        $product->update(['stock' => 3, 'price' => 99000, 'is_active' => false, 'image_path' => 'seller/custom.jpg', 'image_disk' => 'public']);
        $this->seed(ProductSeeder::class);
        $this->assertSame(40, Product::count());
        $product->refresh();
        $this->assertSame(3, $product->stock);
        $this->assertSame(99000, $product->price);
        $this->assertFalse($product->is_active);
        $this->assertSame('seller/custom.jpg', $product->image_path);
        $this->assertSame(1, $product->id);
    }

    public function test_fresh_demo_orders_and_wallet_ledger_reconcile(): void
    {
        $this->seed();
        foreach (Order::all() as $order) {
            $subtotal = (float) $order->items->sum(fn ($item) => $item->price_at_purchase * $item->quantity);
            $this->assertEquals($subtotal, (float) $order->subtotal);
            $this->assertEquals(round($subtotal * 0.12, 2), (float) $order->tax_amount);
            $this->assertEquals($subtotal + (float) $order->tax_amount + (float) $order->delivery_fee, (float) $order->total_amount);
            $purchase = Transaction::where('order_id', $order->id)->where('type', Transaction::TYPE_PURCHASE)->sole();
            $this->assertEquals(-(float) $order->total_amount, (float) $purchase->amount);
        }
        foreach (Wallet::all() as $wallet) {
            $this->assertEquals((float) $wallet->balance, (float) $wallet->transactions()->sum('amount'));
        }
    }
}
