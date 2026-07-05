<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat pesanan (order)
     *
     * Status Pesanan:
     * - packaging       = Sedang dikemas seller
     * - waiting_shipper = Menunggu driver ambil
     * - shipping       = Sedang diantar driver
     * - completed      = Pesanan selesai
     * - returned       = Dikembalikan
     */
    public function run(): void
    {
        // Order 1: Completed (dari Ani, ke Toko 1)
        Order::create([
            'order_number' => 'ORD-20240101-001',
            'user_id' => 4,           // Ani
            'store_id' => 1,          // Dapur Budi
            'driver_id' => 6,         // Driver Caca
            'status' => Order::STATUS_COMPLETED,
            'total_amount' => 72000, // (25000*2) + 22000
            'shipping_address' => 'Jl. Mawar No. 5, RT 01/RW 02, Kelurahan Menteng, Jakarta Pusat, 10310',
        ]);

        // Order 2: Shipping (dari Rudi, ke Toko 2)
        Order::create([
            'order_number' => 'ORD-20240101-002',
            'user_id' => 5,           // Rudi
            'store_id' => 2,          // Warung Siti
            'driver_id' => 7,         // Driver Dedi
            'status' => Order::STATUS_SHIPPING,
            'total_amount' => 65000, // 35000 + (15000*2)
            'shipping_address' => 'Jl. Melati No. 15, RT 03/RW 05, Jakarta Selatan, 12110',
        ]);

        // Order 3: Waiting Shipper (dari Ani, ke Toko 1)
        Order::create([
            'order_number' => 'ORD-20240101-003',
            'user_id' => 4,           // Ani
            'store_id' => 1,          // Dapur Budi
            'driver_id' => null,       // Belum ada driver
            'status' => Order::STATUS_WAITING_SHIPPER,
            'total_amount' => 40000, // 20000 + 20000
            'shipping_address' => 'Jl. Mawar No. 5, RT 01/RW 02, Jakarta Pusat, 10310',
        ]);

        // Order 4: Packaging (dari Fika, ke Toko 3)
        Order::create([
            'order_number' => 'ORD-20240101-004',
            'user_id' => 8,           // Fika
            'store_id' => 3,          // Kue Fika
            'driver_id' => null,       // Belum ada driver
            'status' => Order::STATUS_PACKAGING,
            'total_amount' => 105000, // 55000 + (18000*2) + (12000*2) - hanya sebagian item
            'shipping_address' => 'Jl. Anggrek No. 20, Jakarta Barat, 11480',
        ]);

        $this->command->info('OrderSeeder berhasil! 4 pesanan dibuat.');
    }
}
