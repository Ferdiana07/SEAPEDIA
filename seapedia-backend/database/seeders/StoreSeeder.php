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
            'name' => 'Dapur Budi',
            'description' => 'Makanan rumahan enak dengan cita rasa khas Indonesia. Masakan segar setiap hari!',
            'address' => 'Jl. Merdeka No. 10, Jakarta Pusat',
            'phone' => '081234567890',
            'logo_url' => 'https://via.placeholder.com/150?text=Dapur+Budi',
            'is_active' => true,
        ]);

        // Toko untuk Seller 2 - Siti (User ID 3)
        Store::create([
            'user_id' => 3,
            'name' => 'Warung Siti',
            'description' => 'Warung tradisional dengan menu lengkap. Harga terjangkau!',
            'address' => 'Jl. Sudirman No. 25, Jakarta Selatan',
            'phone' => '081234567891',
            'logo_url' => 'https://via.placeholder.com/150?text=Warung+Siti',
            'is_active' => true,
        ]);

        // Toko untuk Multi-role - Fika (User ID 8)
        Store::create([
            'user_id' => 8,
            'name' => 'Kue Fika',
            'description' => 'Toko kue dan bakery homemade. Fresh from oven!',
            'address' => 'Jl. Gatot Subroto No. 15, Jakarta Barat',
            'phone' => '081234567892',
            'logo_url' => 'https://via.placeholder.com/150?text=Kue+Fika',
            'is_active' => true,
        ]);

        $this->command->info('StoreSeeder berhasil! 3 toko dibuat (Dapur Budi, Warung Siti, Kue Fika).');
    }
}
