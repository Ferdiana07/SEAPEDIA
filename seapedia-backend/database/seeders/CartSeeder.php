<?php

namespace Database\Seeders;

use App\Models\Cart;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat cart untuk buyer
     *
     * Catatan:
     * - Setiap buyer punya 1 cart
     * - Cart kosong saat dibuat
     * - Item ditambahkan via CartItemSeeder
     */
    public function run(): void
    {
        // Cart untuk Buyer 1 - Ani (User ID 4)
        Cart::create([
            'user_id' => 4,
        ]);

        // Cart untuk Buyer 2 - Rudi (User ID 5)
        Cart::create([
            'user_id' => 5,
        ]);

        // Cart untuk Multi-role - Fika (User ID 8)
        Cart::create([
            'user_id' => 8,
        ]);

        $this->command->info('CartSeeder berhasil! 3 cart dibuat.');
    }
}
