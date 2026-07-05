<?php

namespace Database\Seeders;

use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat wallet untuk setiap user
     *
     * Catatan:
     * - Semua user punya wallet
     * - Saldo awal = 0
     * - Nanti bisa di-topup
     */
    public function run(): void
    {
        // Wallet untuk Admin (User ID 1) - saldo 0
        Wallet::create([
            'user_id' => 1,
            'balance' => 0,
        ]);

        // Wallet untuk Seller 1 - Budi (User ID 2) - saldo 100000
        Wallet::create([
            'user_id' => 2,
            'balance' => 100000,
        ]);

        // Wallet untuk Seller 2 - Siti (User ID 3) - saldo 150000
        Wallet::create([
            'user_id' => 3,
            'balance' => 150000,
        ]);

        // Wallet untuk Buyer 1 - Ani (User ID 4) - saldo 500000
        Wallet::create([
            'user_id' => 4,
            'balance' => 500000,
        ]);

        // Wallet untuk Buyer 2 - Rudi (User ID 5) - saldo 300000
        Wallet::create([
            'user_id' => 5,
            'balance' => 300000,
        ]);

        // Wallet untuk Driver 1 - Caca (User ID 6) - saldo 50000
        Wallet::create([
            'user_id' => 6,
            'balance' => 50000,
        ]);

        // Wallet untuk Driver 2 - Dedi (User ID 7) - saldo 75000
        Wallet::create([
            'user_id' => 7,
            'balance' => 75000,
        ]);

        // Wallet untuk Multi-role - Fika (User ID 8) - saldo 200000
        Wallet::create([
            'user_id' => 8,
            'balance' => 200000,
        ]);

        // Wallet untuk Guest (User ID 9) - saldo 100000
        Wallet::create([
            'user_id' => 9,
            'balance' => 100000,
        ]);

        $this->command->info('WalletSeeder berhasil! 9 wallet dibuat.');
    }
}
