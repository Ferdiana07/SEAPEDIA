<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // WalletSeeder defines the available demo balance after these purchases.
        // Opening credits make the ledger reconcile without mutating that balance.
        foreach (Wallet::orderBy('id')->get() as $wallet) {
            $orders = Order::where('user_id', $wallet->user_id)->get();
            $opening = (float) $wallet->balance + (float) $orders->sum('total_amount');
            if ($opening > 0) {
                Transaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => Transaction::TYPE_TOPUP,
                    'amount' => $opening,
                    'description' => 'Saldo awal simulasi, bukan transfer bank nyata',
                ]);
            }
            foreach ($orders as $order) {
                Transaction::create([
                    'wallet_id' => $wallet->id,
                    'order_id' => $order->id,
                    'type' => Transaction::TYPE_PURCHASE,
                    'amount' => -(float) $order->total_amount,
                    'description' => 'Pembelian demo #'.$order->order_number,
                ]);
            }
        }

        $this->command?->info('Ledger demo sesuai total pesanan dan saldo wallet.');
    }
}
