<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Mengisi katalog demo bertema kelautan untuk setiap toko.
     */
    public function run(): void
    {
        $products = [
            // Laut Lestari Gear
            [
                'store_id' => 1,
                'name' => 'Set Pancing Pantai Carbon 3,6 m',
                'description' => 'Paket joran carbon, reel spinning, dan senar untuk memancing dari pantai. Ringan, kokoh, serta memakai komponen tahan korosi air asin.',
                'category' => 'alat pancing',
                'price' => 175000,
                'stock' => 24,
                'image_url' => '/images/products/set-pancing-pantai.webp',
            ],
            [
                'store_id' => 1,
                'name' => 'Reel Spinning Laut Anti-Korosi',
                'description' => 'Reel aluminium bersegel dengan drag halus dan spool berkapasitas besar. Bilas dengan air tawar setelah digunakan agar umur pakai lebih panjang.',
                'category' => 'alat pancing',
                'price' => 145000,
                'stock' => 32,
                'image_url' => '/images/products/reel-spinning-laut.webp',
            ],
            [
                'store_id' => 1,
                'name' => 'Kotak Tackle Kedap Air 48 Kompartemen',
                'description' => 'Kotak perlengkapan dengan sekat transparan, pengunci rapat, kail, swivel, umpan lunak, dan tang mini untuk perjalanan memancing.',
                'category' => 'alat pancing',
                'price' => 99000,
                'stock' => 41,
                'image_url' => '/images/products/kotak-tackle.webp',
            ],
            [
                'store_id' => 1,
                'name' => 'Rompi Pancing Pesisir Quick-Dry',
                'description' => 'Rompi ringan dengan banyak saku, panel jaring bernapas, dan bahan cepat kering. Nyaman untuk aktivitas memancing di cuaca tropis.',
                'category' => 'alat pancing',
                'price' => 135000,
                'stock' => 27,
                'image_url' => '/images/products/rompi-pancing.webp',
            ],

            // Mina Pesisir Aquaculture
            [
                'store_id' => 2,
                'name' => 'Kincir Air Aerator Tambak 4 Kipas',
                'description' => 'Kincir air paddlewheel 4 kipas bertenaga untuk tambak udang dan kolam budidaya pesisir. Menjaga aerasi dan kadar oksigen terlarut tetap optimal.',
                'category' => 'budidaya',
                'price' => 225000,
                'stock' => 18,
                'image_url' => '/images/products/aerator-kolam.webp',
            ],
            [
                'store_id' => 2,
                'name' => 'Jaring Keramba Apung HDPE Pesisir',
                'description' => 'Fasilitas jaring keramba apung (KJA) berstruktur pipa HDPE kokoh tahan gelombang. Sesuai untuk budidaya kerapu, bawal bintang, dan kakap pesisir.',
                'category' => 'budidaya',
                'price' => 275000,
                'stock' => 12,
                'image_url' => '/images/products/jaring-keramba.webp',
            ],
            [
                'store_id' => 2,
                'name' => 'Pelet Ikan Laut Protein Tinggi 2 kg',
                'description' => 'Pakan apung butiran padat nutrisi tinggi untuk ikan laut budidaya. Memacu pertumbuhan optimal dan menjaga stabilitas kualitas air kolam.',
                'category' => 'pakan',
                'price' => 58000,
                'stock' => 80,
                'image_url' => '/images/products/pelet-ikan-laut.webp',
            ],
            [
                'store_id' => 2,
                'name' => 'Meter Digital Salinitas & Kualitas Air',
                'description' => 'Perangkat portabel untuk memantau salinitas dan kondisi air tambak atau akuarium. Dilengkapi probe, larutan kalibrasi, dan kotak pelindung.',
                'category' => 'budidaya',
                'price' => 325000,
                'stock' => 15,
                'image_url' => '/images/products/meter-kualitas-air.webp',
            ],

            // Terumbu Pesisir Market
            [
                'store_id' => 3,
                'name' => 'Akuarium Nano Reef 45 L Starter Kit',
                'description' => 'Akuarium kaca rimless lengkap dengan filter gantung dan lampu ringkas. Cocok untuk memulai ekosistem laut kecil setelah proses cycling selesai.',
                'category' => 'akuarium',
                'price' => 585000,
                'stock' => 9,
                'image_url' => '/images/products/akuarium-nano-reef.webp',
            ],
            [
                'store_id' => 3,
                'name' => 'Pasir Aragonit Natural Karang 5 kg',
                'description' => 'Substrat pasir aragonit karang laut alami berbutir halus dan bersih. Menstabilkan pH serta kalsium akuarium reef dan aman untuk biota dasar.',
                'category' => 'akuarium',
                'price' => 75000,
                'stock' => 36,
                'image_url' => '/images/products/pasir-aragonit.webp',
            ],
            [
                'store_id' => 3,
                'name' => 'Lampu LED Reef Full-Spectrum 60 cm',
                'description' => 'Lampu akuarium laut dengan spektrum biru-putih yang dapat diatur. Braket kokoh dan kontrol sederhana untuk siklus pencahayaan harian.',
                'category' => 'akuarium',
                'price' => 285000,
                'stock' => 17,
                'image_url' => '/images/products/lampu-led-reef.webp',
            ],
            [
                'store_id' => 3,
                'name' => 'Protein Skimmer Reef Compact',
                'description' => 'Skimmer ringkas untuk membantu mengangkat limbah organik sebelum terurai. Sesuai untuk akuarium laut hingga 120 liter.',
                'category' => 'akuarium',
                'price' => 375000,
                'stock' => 11,
                'image_url' => '/images/products/protein-skimmer.webp',
            ],
            [
                'store_id' => 3,
                'name' => 'Sepasang Ikan Badut Hasil Budidaya',
                'description' => 'Sepasang ikan badut (Amphiprion ocellaris) sehat hasil budidaya lokal pada anemon laut. Sudah adaptif dengan pelet dan siap huni tangki reef.',
                'category' => 'biota hidup',
                'price' => 195000,
                'stock' => 8,
                'image_url' => '/images/products/ikan-badut-budidaya.webp',
            ],
            [
                'store_id' => 3,
                'name' => 'Starter Caulerpa Anggur Laut Budidaya',
                'description' => 'Rumpun Caulerpa lentillifera (anggur laut/green caviar) segar hasil budidaya untuk refugium penyerap nutrien atau konsumsi segar.',
                'category' => 'tanaman laut',
                'price' => 45000,
                'stock' => 22,
                'image_url' => '/images/products/caulerpa-budidaya.webp',
            ],
            [
                'store_id' => 3,
                'name' => 'Loin Tuna Sirip Kuning Segar 500 g',
                'description' => 'Potongan loin tuna rantai dingin dari pemasok terverifikasi. Dikirim dengan kemasan berinsulasi dan sebaiknya segera disimpan pada suhu dingin.',
                'category' => 'hasil laut',
                'price' => 125000,
                'stock' => 20,
                'image_url' => '/images/products/loin-tuna-segar.webp',
            ],
            [
                'store_id' => 3,
                'name' => 'Rice Bowl Tuna Sambal Matah',
                'description' => 'Tuna panggang, nasi hangat, dan sambal matah segar dalam satu porsi. Dimasak setelah pesanan diterima dan tersedia untuk pengiriman instan.',
                'category' => 'kuliner laut',
                'price' => 38000,
                'stock' => 30,
                'image_url' => '/images/products/rice-bowl-tuna.webp',
            ],
        ];

        foreach ($products as $product) {
            Product::create([...$product, 'is_active' => true]);
        }

        $this->command->info('ProductSeeder berhasil! 16 produk kelautan dibuat.');
    }
}
