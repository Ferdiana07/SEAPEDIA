<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     * Membuat data user dummy untuk testing
     */
    public function run(): void
    {
        // User Admin
        User::create([
            'name' => 'Admin SEAPEDIA',
            'email' => 'admin@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Admin',
        ]);

        // User Seller 1 (Budi)
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Budi',
        ]);

        // User Seller 2 (Siti)
        User::create([
            'name' => 'Siti Rahayu',
            'email' => 'siti@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Siti',
        ]);

        // User Buyer 1 (Ani)
        User::create([
            'name' => 'Ani Wijaya',
            'email' => 'ani@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Ani',
        ]);

        // User Buyer 2 (Rudi)
        User::create([
            'name' => 'Rudi Hermawan',
            'email' => 'rudi@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Rudi',
        ]);

        // User Driver 1 (Caca)
        User::create([
            'name' => 'Caca Putri',
            'email' => 'caca@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Caca',
        ]);

        // User Driver 2 (Dedi)
        User::create([
            'name' => 'Dedi Kurniawan',
            'email' => 'dedi@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Dedi',
        ]);

        // User Multi-role (Fika - Seller & Buyer)
        User::create([
            'name' => 'Fika Amelia',
            'email' => 'fika@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Fika',
        ]);

        // User untuk Review Guest (tanpa role)
        User::create([
            'name' => 'Guest User',
            'email' => 'guest@seapedia.com',
            'password' => Hash::make('password123'),
            'avatar_url' => 'https://via.placeholder.com/150?text=Guest',
        ]);

        $this->command->info('UserSeeder berhasil! 9 user dibuat.');
    }
}
