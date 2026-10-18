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
        // Review untuk Produk 1 (Set Pancing Pantai)
        Review::create([
            'user_id' => 4,       // Ani (buyer)
            'product_id' => 1,
            'rating' => 5,
            'comment' => 'Setnya lengkap dan ringan. Sudah dipakai memancing di pantai dua kali tanpa kendala.',
        ]);

        Review::create([
            'user_id' => 5,       // Rudi (buyer)
            'product_id' => 1,
            'rating' => 4,
            'comment' => 'Joran terasa kokoh dan pengemasannya aman. Petunjuk perawatannya juga jelas.',
        ]);

        Review::create([
            'user_id' => 9,       // Guest
            'product_id' => 1,
            'rating' => 5,
            'comment' => 'Cocok untuk pemula karena semua perlengkapan utamanya sudah tersedia.',
        ]);

        // Review untuk Produk 5 (Aerator Kolam)
        Review::create([
            'user_id' => 4,       // Ani
            'product_id' => 5,
            'rating' => 5,
            'comment' => 'Aliran udaranya stabil dan suaranya lebih halus dari aerator lama saya.',
        ]);

        // Review untuk Produk 9 (Akuarium Nano Reef)
        Review::create([
            'user_id' => 8,       // Fika (multi-role buyer)
            'product_id' => 9,
            'rating' => 5,
            'comment' => 'Kacanya jernih dan paket filternya rapi. Ukurannya pas untuk meja kerja.',
        ]);

        Review::create([
            'user_id' => 5,       // Rudi
            'product_id' => 9,
            'rating' => 4,
            'comment' => 'Starter kit bagus, tetapi tetap perlu cycling sebelum memasukkan biota.',
        ]);

        // Review untuk Produk 10 (Pasir Aragonit)
        Review::create([
            'user_id' => 4,       // Ani
            'product_id' => 10,
            'rating' => 5,
            'comment' => 'Butirannya bersih dan warna natural. Perlu dibilas beberapa kali sebelum dipakai.',
        ]);

        // Review untuk Produk 2 (Reel Spinning Laut) - Rating sedang
        Review::create([
            'user_id' => 8,       // Fika
            'product_id' => 2,
            'rating' => 3,
            'comment' => 'Drag cukup halus, tetapi buku panduan perawatannya bisa dibuat lebih rinci.',
        ]);

        $this->command->info('ReviewSeeder berhasil! 8 review dibuat.');
    }
}
