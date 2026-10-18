<?php

namespace Database\Seeders;

use App\Models\ApplicationReview;
use Illuminate\Database\Seeder;

class ApplicationReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = [
            ['reviewer_name' => 'Maya Anindita', 'rating' => 5, 'comment' => 'Pemesanan bibit ikan dan perlengkapan budidaya tiba dengan kondisi prima. Status pengiriman terpantau jelas.'],
            ['reviewer_name' => 'Raka Mahendra', 'rating' => 5, 'comment' => 'Sangat membantu toko alat pancing kami menjangkau pembeli baru. Pencairan saldo hasil penjualan berlangsung tertib dan aman.'],
            ['reviewer_name' => 'Nadia Puspita', 'rating' => 5, 'comment' => 'Pengemasan rantai dingin untuk tuna dan hasil laut segar sangat terjaga. Ikan diterima tetap dingin dan segar.'],
            ['reviewer_name' => 'Bambang Hartono', 'rating' => 5, 'comment' => 'Set joran dan reel laut yang saya pesan sesuai spesifikasi. Kualitas produk mitra pesisir terkurasi dengan baik.'],
        ];

        foreach ($reviews as $review) {
            ApplicationReview::firstOrCreate($review);
        }
    }
}
