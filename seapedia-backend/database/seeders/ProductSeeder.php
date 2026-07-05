<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat produk untuk setiap toko
     *
     * Catatan:
     * - Toko 1 (Dapur Budi) punya 4 produk
     * - Toko 2 (Warung Siti) punya 4 produk
     * - Toko 3 (Kue Fika) punya 4 produk
     */
    public function run(): void
    {
        // ==================== TOKO 1: Dapur Budi ====================
        Product::create([
            'store_id' => 1,
            'name' => 'Nasi Goreng Spesial',
            'description' => 'Nasi goreng dengan telur, ayam suwir, dan sayuran segar. Diberi kecap manis khas Indonesia.',
            'price' => 25000,
            'stock' => 50,
            'image_url' => 'https://via.placeholder.com/300?text=Nasi+Goreng',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 1,
            'name' => 'Ayam Geprek',
            'description' => 'Ayam crispy dengan sambal bawang yang pedas dan gurih. Disajikan dengan nasi putih.',
            'price' => 22000,
            'stock' => 40,
            'image_url' => 'https://via.placeholder.com/300?text=Ayam+Geprek',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 1,
            'name' => 'Mie Ayam Bakso',
            'description' => 'Mie ayam dengan bakso sapi jumbo dan pangsit goreng. Kuahnya bening segar.',
            'price' => 20000,
            'stock' => 35,
            'image_url' => 'https://via.placeholder.com/300?text=Mie+Ayam',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 1,
            'name' => 'Soto Ayam',
            'description' => 'Soto ayam dengan suwiran ayam, tauge, dan soun. Kuahnya rempah-rempah hangat.',
            'price' => 18000,
            'stock' => 25,
            'image_url' => 'https://via.placeholder.com/300?text=Soto+Ayam',
            'is_active' => true,
        ]);

        // ==================== TOKO 2: Warung Siti ====================
        Product::create([
            'store_id' => 2,
            'name' => 'Nasi Rendang',
            'description' => 'Rendang daging sapi yang dimasak lama dengan santan dan rempah. Empuk dan kaya rasa.',
            'price' => 35000,
            'stock' => 20,
            'image_url' => 'https://via.placeholder.com/300?text=Rendang',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 2,
            'name' => 'Ayam Taliwang',
            'description' => 'Ayam bakar khas Lombok dengan bumbu kelapa sangrai. Pedas dan manis!',
            'price' => 28000,
            'stock' => 30,
            'image_url' => 'https://via.placeholder.com/300?text=Ayam+Taliwang',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 2,
            'name' => 'Gado-Gado',
            'description' => 'Sayuran segar dengan bumbu kacang kental. Disajikan dengan lontong dan tahu.',
            'price' => 15000,
            'stock' => 40,
            'image_url' => 'https://via.placeholder.com/300?text=Gado+Gado',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 2,
            'name' => 'Es Teh Manis',
            'description' => 'Teh manis dingin segar. Cocok untuk menemani makan.',
            'price' => 5000,
            'stock' => 100,
            'image_url' => 'https://via.placeholder.com/300?text=Es+Teh',
            'is_active' => true,
        ]);

        // ==================== TOKO 3: Kue Fika ====================
        Product::create([
            'store_id' => 3,
            'name' => 'Brownies Coklat',
            'description' => 'Brownies lembut dengan coklat premium. Cocok untuk cemilan atau hadiah.',
            'price' => 35000,
            'stock' => 20,
            'image_url' => 'https://via.placeholder.com/300?text=Brownies',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 3,
            'name' => 'Cheesecake Stroberi',
            'description' => 'Cheesecake creamy dengan topping selai stroberi segar. Cake premium!',
            'price' => 55000,
            'stock' => 15,
            'image_url' => 'https://via.placeholder.com/300?text=Cheesecake',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 3,
            'name' => 'Croissant Mentega',
            'description' => 'Croissant renyah dengan lapisan mentega. Fresh from oven setiap pagi.',
            'price' => 18000,
            'stock' => 30,
            'image_url' => 'https://via.placeholder.com/300?text=Croissant',
            'is_active' => true,
        ]);

        Product::create([
            'store_id' => 3,
            'name' => 'Kue Cubit Blueberry',
            'description' => 'Kue cubit mini dengan topping blueberry. Manis dan addictive!',
            'price' => 12000,
            'stock' => 50,
            'image_url' => 'https://via.placeholder.com/300?text=Kue+Cubit',
            'is_active' => true,
        ]);

        $this->command->info('ProductSeeder berhasil! 12 produk dibuat (4 untuk setiap toko).');
    }
}
