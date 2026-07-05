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
            'product_id' => 1,      // Nasi Goreng Spesial
            'quantity' => 2,
            'price_at_purchase' => 25000,
        ]);

        OrderItem::create([
            'order_id' => 1,
            'product_id' => 2,      // Ayam Geprek
            'quantity' => 1,
            'price_at_purchase' => 22000,
        ]);

        // Order 2: Shipping - Item dari Toko 2
        OrderItem::create([
            'order_id' => 2,
            'product_id' => 5,      // Nasi Rendang
            'quantity' => 1,
            'price_at_purchase' => 35000,
        ]);

        OrderItem::create([
            'order_id' => 2,
            'product_id' => 7,      // Gado-Gado
            'quantity' => 2,
            'price_at_purchase' => 15000,
        ]);

        // Order 3: Waiting Shipper - Item dari Toko 1
        OrderItem::create([
            'order_id' => 3,
            'product_id' => 3,      // Mie Ayam Bakso
            'quantity' => 2,
            'price_at_purchase' => 20000,
        ]);

        // Order 4: Packaging - Item dari Toko 3
        OrderItem::create([
            'order_id' => 4,
            'product_id' => 10,     // Cheesecake Stroberi
            'quantity' => 1,
            'price_at_purchase' => 55000,
        ]);

        OrderItem::create([
            'order_id' => 4,
            'product_id' => 11,     // Croissant Mentega
            'quantity' => 2,
            'price_at_purchase' => 18000,
        ]);

        OrderItem::create([
            'order_id' => 4,
            'product_id' => 12,     // Kue Cubit Blueberry
            'quantity' => 2,
            'price_at_purchase' => 12000,
        ]);

        $this->command->info('OrderItemSeeder berhasil! 8 item pesanan dibuat.');
    }
}
