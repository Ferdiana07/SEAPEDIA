<?php

namespace Database\Seeders;

use App\Models\Address;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat alamat pengiriman untuk buyer
     *
     * Catatan:
     * - Buyer punya alamat pengiriman
     * - 1 alamat ditandai sebagai default
     */
    public function run(): void
    {
        // Alamat untuk Buyer 1 - Ani (User ID 4)
        Address::create([
            'user_id' => 4,
            'label' => 'Rumah',
            'recipient_name' => 'Ani Wijaya',
            'phone' => '081234567890',
            'full_address' => 'Jl. Mawar No. 5, RT 01/RW 02, Kelurahan Menteng, Kecamatan Jakarta Pusat, Kota Jakarta Pusat, 10310',
            'is_default' => true,
        ]);

        Address::create([
            'user_id' => 4,
            'label' => 'Kantor',
            'recipient_name' => 'Ani Wijaya',
            'phone' => '081234567890',
            'full_address' => 'Jl. Sudirman No. 50, Lantai 10, Jakarta Selatan, 12190',
            'is_default' => false,
        ]);

        // Alamat untuk Buyer 2 - Rudi (User ID 5)
        Address::create([
            'user_id' => 5,
            'label' => 'Rumah',
            'recipient_name' => 'Rudi Hermawan',
            'phone' => '081234567891',
            'full_address' => 'Jl. Melati No. 15, RT 03/RW 05, Kelurahan Kebayoran Baru, Jakarta Selatan, 12110',
            'is_default' => true,
        ]);

        // Alamat untuk Multi-role - Fika (User ID 8) - sebagai buyer
        Address::create([
            'user_id' => 8,
            'label' => 'Rumah',
            'recipient_name' => 'Fika Amelia',
            'phone' => '081234567892',
            'full_address' => 'Jl. Anggrek No. 20, RT 02/RW 01, Jakarta Barat, 11480',
            'is_default' => true,
        ]);

        $this->command->info('AddressSeeder berhasil! 5 alamat dibuat.');
    }
}
