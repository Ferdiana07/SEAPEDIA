<?php

namespace Database\Seeders;

use App\Models\Discount;
use App\Models\User;
use Illuminate\Database\Seeder;

class DiscountSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = User::where('email', 'admin@seapedia.com')->value('id');

        Discount::updateOrCreate(['code' => 'LAUT10'], [
            'name' => 'Promo Belanja Laut',
            'type' => 'promo',
            'calculation_type' => 'percentage',
            'value' => 10,
            'minimum_purchase' => 50000,
            'maximum_discount' => 30000,
            'expires_at' => now()->addMonths(6),
            'is_active' => true,
            'created_by' => $adminId,
        ]);

        Discount::updateOrCreate(['code' => 'ONGKIR15'], [
            'name' => 'Voucher Hemat Rp15.000',
            'type' => 'voucher',
            'calculation_type' => 'fixed',
            'value' => 15000,
            'minimum_purchase' => 100000,
            'usage_limit' => 100,
            'expires_at' => now()->addMonths(3),
            'is_active' => true,
            'created_by' => $adminId,
        ]);
    }
}
