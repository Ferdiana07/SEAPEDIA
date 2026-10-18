<?php

namespace Database\Seeders;

use App\Models\CartItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartItemSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat item di dalam cart
     *
     * Catatan Penting:
     * - Cart hanya boleh berisi produk dari 1 TOKO yang SAMA
     * - Ini adalah aturan single-store checkout
     */
    public function run(): void
    {
        // Cart untuk Ani (User ID 4) - Cart ID 1
        // Isi: Produk dari Laut Lestari Gear
        CartItem::create([
            'cart_id' => 1,
            'product_id' => 1,  // Set Pancing Pantai
            'quantity' => 2,
        ]);

        CartItem::create([
            'cart_id' => 1,
            'product_id' => 2,  // Reel Spinning Laut
            'quantity' => 1,
        ]);

        // Cart untuk Rudi (User ID 5) - Cart ID 2
        // Isi: Produk dari Mina Pesisir Aquaculture
        CartItem::create([
            'cart_id' => 2,
            'product_id' => 5,  // Aerator Kolam
            'quantity' => 1,
        ]);

        CartItem::create([
            'cart_id' => 2,
            'product_id' => 7,  // Pelet Ikan Laut
            'quantity' => 2,
        ]);

        // Cart untuk Fika (User ID 8) - Cart ID 3
        // Isi: Produk dari Terumbu Pesisir Market
        CartItem::create([
            'cart_id' => 3,
            'product_id' => 9,  // Akuarium Nano Reef
            'quantity' => 3,
        ]);

        $this->command->info('CartItemSeeder berhasil! 6 item cart dibuat (masing-masing dari 1 toko berbeda).');
    }
}
