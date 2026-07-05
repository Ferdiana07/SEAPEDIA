<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRole;
use App\Models\Store;
use App\Models\Product;
use App\Models\Wallet;
use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\Transaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application database.
     * Urutan pemanggilan seeder PENTING karena ada relasi!
     */
    public function run(): void
    {
        // 1. UserSeeder - Buat user dummy
        $this->call([
            UserSeeder::class,
        ]);

        // 2. UserRoleSeeder - Buat role untuk user
        $this->call([
            UserRoleSeeder::class,
        ]);

        // 3. WalletSeeder - Buat wallet untuk user
        $this->call([
            WalletSeeder::class,
        ]);

        // 4. StoreSeeder - Buat toko
        $this->call([
            StoreSeeder::class,
        ]);

        // 5. ProductSeeder - Buat produk
        $this->call([
            ProductSeeder::class,
        ]);

        // 6. AddressSeeder - Buat alamat
        $this->call([
            AddressSeeder::class,
        ]);

        // 7. CartSeeder & CartItemSeeder - Buat keranjang
        $this->call([
            CartSeeder::class,
            CartItemSeeder::class,
        ]);

        // 8. OrderSeeder & OrderItemSeeder - Buat pesanan
        $this->call([
            OrderSeeder::class,
            OrderItemSeeder::class,
        ]);

        // 9. ReviewSeeder - Buat review
        $this->call([
            ReviewSeeder::class,
        ]);

        // 10. TransactionSeeder - Buat transaksi
        $this->call([
            TransactionSeeder::class,
        ]);
    }
}
