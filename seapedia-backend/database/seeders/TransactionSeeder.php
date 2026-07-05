<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat riwayat transaksi wallet
     *
     * Tipe Transaksi:
     * - topup      = Isi saldo
     * - purchase   = Pembelian
     * - refund     = Pengembalian saldo
     * - withdrawal = Penarikan saldo
     */
    public function run(): void
    {
        // Transaksi untuk Wallet Ani (Wallet ID 4) - User ID 4
        Transaction::create([
            'wallet_id' => 4,
            'order_id' => null,
            'type' => Transaction::TYPE_TOPUP,
            'amount' => 500000,
            'description' => 'Top up via transfer bank',
        ]);

        Transaction::create([
            'wallet_id' => 4,
            'order_id' => 1,
            'type' => Transaction::TYPE_PURCHASE,
            'amount' => -72000,
            'description' => 'Pembelian Order #1 - Nasi Goreng + Ayam Geprek',
        ]);

        Transaction::create([
            'wallet_id' => 4,
            'order_id' => 3,
            'type' => Transaction::TYPE_PURCHASE,
            'amount' => -40000,
            'description' => 'Pembelian Order #3 - Mie Ayam (pending)',
        ]);

        // Transaksi untuk Wallet Rudi (Wallet ID 5) - User ID 5
        Transaction::create([
            'wallet_id' => 5,
            'order_id' => null,
            'type' => Transaction::TYPE_TOPUP,
            'amount' => 300000,
            'description' => 'Top up via e-wallet',
        ]);

        Transaction::create([
            'wallet_id' => 5,
            'order_id' => 2,
            'type' => Transaction::TYPE_PURCHASE,
            'amount' => -65000,
            'description' => 'Pembelian Order #2 - Rendang + Gado-Gado',
        ]);

        // Transaksi untuk Wallet Fika (Wallet ID 8) - User ID 8
        Transaction::create([
            'wallet_id' => 8,
            'order_id' => null,
            'type' => Transaction::TYPE_TOPUP,
            'amount' => 200000,
            'description' => 'Top up via transfer',
        ]);

        Transaction::create([
            'wallet_id' => 8,
            'order_id' => null,
            'type' => Transaction::TYPE_TOPUP,
            'amount' => 100000,
            'description' => 'Top up tambahan',
        ]);

        // Transaksi Refund Contoh
        Transaction::create([
            'wallet_id' => 5,
            'order_id' => null,
            'type' => Transaction::TYPE_REFUND,
            'amount' => 25000,
            'description' => 'Refund pesanan yang dibatalkan',
        ]);

        $this->command->info('TransactionSeeder berhasil! 8 transaksi dibuat.');
    }
}
