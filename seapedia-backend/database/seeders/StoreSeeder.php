<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat toko untuk seller
     *
     * Aturan:
     * - 1 Seller = 1 Toko
     * - Nama toko harus UNIK
     */
    public function run(): void
    {
        // Toko untuk Seller 1 - Budi (User ID 2)
        Store::create([
            'user_id' => 2,
            'name' => 'Laut Lestari Gear',
            'description' => 'Perlengkapan memancing laut pilihan untuk pemula dan pemancing berpengalaman, dengan panduan perawatan air asin.',
            'address' => 'Jl. Dermaga Bahari No. 10, Jakarta Utara',
            'phone' => '081234567890',
            'logo_url' => null,
            'is_active' => true,
        ]);

        // Toko untuk Seller 2 - Siti (User ID 3)
        Store::create([
            'user_id' => 3,
            'name' => 'Mina Pesisir Aquaculture',
            'description' => 'Peralatan budidaya, pakan, dan instrumen pemantauan air untuk usaha perikanan pesisir yang lebih terukur.',
            'address' => 'Jl. Tambak Mina No. 25, Tangerang',
            'phone' => '081234567891',
            'logo_url' => null,
            'is_active' => true,
        ]);

        // Toko untuk Multi-role - Fika (User ID 8)
        Store::create([
            'user_id' => 8,
            'name' => 'Terumbu Pesisir Market',
            'description' => 'Kebutuhan akuarium laut, biota hasil budidaya, hasil laut berantai dingin, dan menu siap santap dari pesisir.',
            'address' => 'Jl. Pesisir Nusantara No. 15, Jakarta Utara',
            'phone' => '081234567892',
            'logo_url' => null,
            'is_active' => true,
        ]);

        $this->command->info('StoreSeeder berhasil! 3 toko kelautan dibuat.');
    }
}
