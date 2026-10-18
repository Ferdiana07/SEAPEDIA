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
        $order = Order::create([
            'order_number' => 'ORD-20240101-001',
            'user_id' => 4,           // Ani
            'store_id' => 1,          // Laut Lestari Gear
            'driver_id' => 6,         // Driver Caca
            'status' => Order::STATUS_COMPLETED,
            'delivery_method' => Order::DELIVERY_REGULAR,
            'subtotal' => 320000,
            'delivery_fee' => 10000,
            'tax_amount' => 32000,
            'total_amount' => 362000,
            'shipping_address' => 'Jl. Mawar No. 5, RT 01/RW 02, Kelurahan Menteng, Jakarta Pusat, 10310',
        ]);
        $order->recordStatus(null, 'Pesanan demo selesai.');

        // Order 2: Shipping (dari Rudi, ke Toko 2)
        $order = Order::create([
            'order_number' => 'ORD-20240101-002',
            'user_id' => 5,           // Rudi
            'store_id' => 2,          // Mina Pesisir Aquaculture
            'driver_id' => 7,         // Driver Dedi
            'status' => Order::STATUS_SHIPPING,
            'delivery_method' => Order::DELIVERY_NEXT_DAY,
            'subtotal' => 341000,
            'delivery_fee' => 18000,
            'tax_amount' => 34100,
            'total_amount' => 393100,
            'shipping_address' => 'Jl. Melati No. 15, RT 03/RW 05, Jakarta Selatan, 12110',
        ]);
        $order->recordStatus(null, 'Pesanan demo sedang dikirim.');

        // Order 3: Waiting Shipper (dari Ani, ke Toko 1)
        $order = Order::create([
            'order_number' => 'ORD-20240101-003',
            'user_id' => 4,           // Ani
            'store_id' => 1,          // Laut Lestari Gear
            'driver_id' => null,       // Belum ada driver
            'status' => Order::STATUS_WAITING_SHIPPER,
            'delivery_method' => Order::DELIVERY_REGULAR,
            'subtotal' => 198000,
            'delivery_fee' => 10000,
            'tax_amount' => 19800,
            'total_amount' => 227800,
            'shipping_address' => 'Jl. Mawar No. 5, RT 01/RW 02, Jakarta Pusat, 10310',
        ]);
        $order->recordStatus(null, 'Pesanan demo menunggu Driver.');

        // Order 4: Packaging (dari Fika, ke Toko 3)
        $order = Order::create([
            'order_number' => 'ORD-20240101-004',
            'user_id' => 8,           // Fika
            'store_id' => 3,          // Terumbu Pesisir Market
            'driver_id' => null,       // Belum ada driver
            'status' => Order::STATUS_PACKAGING,
            'delivery_method' => Order::DELIVERY_INSTANT,
            'subtotal' => 735000,
            'delivery_fee' => 30000,
            'tax_amount' => 73500,
            'total_amount' => 838500,
            'shipping_address' => 'Jl. Anggrek No. 20, Jakarta Barat, 11480',
        ]);
        $order->recordStatus(null, 'Pesanan demo sedang dikemas.');

        $this->command->info('OrderSeeder berhasil! 4 pesanan dibuat.');
    }
}
