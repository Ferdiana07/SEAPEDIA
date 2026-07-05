<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat review untuk produk
     *
     * Catatan:
     * - Guest dan logged-in user bisa kasih review
     * - Rating 1-5 bintang
     * - 1 user hanya bisa 1 review per produk
     */
    public function run(): void
    {
        // Review untuk Produk 1 (Nasi Goreng Spesial)
        Review::create([
            'user_id' => 4,       // Ani (buyer)
            'product_id' => 1,
            'rating' => 5,
            'comment' => 'Enak banget! Nasinya pulen, rasanya mantap. Pasti pesan lagi!',
        ]);

        Review::create([
            'user_id' => 5,       // Rudi (buyer)
            'product_id' => 1,
            'rating' => 4,
            'comment' => 'Rasanya enak, tapi menurutku terlalu asin. Tetap recommended!',
        ]);

        Review::create([
            'user_id' => 9,       // Guest
            'product_id' => 1,
            'rating' => 5,
            'comment' => 'Best nasi goreng yang pernah coba!',
        ]);

        // Review untuk Produk 5 (Nasi Rendang)
        Review::create([
            'user_id' => 4,       // Ani
            'product_id' => 5,
            'rating' => 5,
            'comment' => 'Rendangnya empuk dan bumbunya meresap. Harga worth it!',
        ]);

        // Review untuk Produk 9 (Brownies Coklat)
        Review::create([
            'user_id' => 8,       // Fika (multi-role buyer)
            'product_id' => 9,
            'rating' => 5,
            'comment' => 'Browniesnya enak banget! Coklatnya premium. Cocok buat hadiah.',
        ]);

        Review::create([
            'user_id' => 5,       // Rudi
            'product_id' => 9,
            'rating' => 4,
            'comment' => 'Enak, tapi ukurannya agak kecil untuk harga segitu.',
        ]);

        // Review untuk Produk 10 (Cheesecake Stroberi)
        Review::create([
            'user_id' => 4,       // Ani
            'product_id' => 10,
            'rating' => 5,
            'comment' => 'Cheesecakenya lembut dan stroberinya segar. Perfect! 🎂',
        ]);

        // Review untuk Produk 2 (Ayam Geprek) - Rating rendah
        Review::create([
            'user_id' => 8,       // Fika
            'product_id' => 2,
            'rating' => 3,
            'comment' => 'Ayamnya crispy, tapi sambelnya kurang pedas menurutku.',
        ]);

        $this->command->info('ReviewSeeder berhasil! 8 review dibuat.');
    }
}
