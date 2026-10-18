<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat item-item dalam pesanan
     *
     * Catatan:
     * - price_at_purchase = harga SAAT user beli
     * - Ini penting karena harga bisa berubah di kemudian hari
     */
    public function run(): void
    {
        // Order 1: Completed - Item dari Toko 1
        OrderItem::create([
            'order_id' => 1,
            'product_id' => 1,      // Set Pancing Pantai
            'quantity' => 1,
            'price_at_purchase' => 175000,
        ]);

        OrderItem::create([
            'order_id' => 1,
            'product_id' => 2,      // Reel Spinning Laut
            'quantity' => 1,
            'price_at_purchase' => 145000,
        ]);

        // Order 2: Shipping - Item dari Toko 2
        OrderItem::create([
            'order_id' => 2,
            'product_id' => 5,      // Aerator Kolam
            'quantity' => 1,
            'price_at_purchase' => 225000,
        ]);

        OrderItem::create([
            'order_id' => 2,
            'product_id' => 7,      // Pelet Ikan Laut
            'quantity' => 2,
            'price_at_purchase' => 58000,
        ]);

        // Order 3: Waiting Shipper - Item dari Toko 1
        OrderItem::create([
            'order_id' => 3,
            'product_id' => 3,      // Kotak Tackle
            'quantity' => 2,
            'price_at_purchase' => 99000,
        ]);

        // Order 4: Packaging - Item dari Toko 3
        OrderItem::create([
            'order_id' => 4,
            'product_id' => 10,     // Pasir Aragonit
            'quantity' => 1,
            'price_at_purchase' => 75000,
        ]);

        OrderItem::create([
            'order_id' => 4,
            'product_id' => 11,     // Lampu LED Reef
            'quantity' => 1,
            'price_at_purchase' => 285000,
        ]);

        OrderItem::create([
            'order_id' => 4,
            'product_id' => 12,     // Protein Skimmer
            'quantity' => 1,
            'price_at_purchase' => 375000,
        ]);

        $this->command->info('OrderItemSeeder berhasil! 8 item pesanan dibuat.');
    }
}
