<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Uses firstOrCreate to be idempotent — safe to run multiple times.
     */
    public function run(): void
    {
        $users = [
            'admin@seapedia.com' => ['admin'],
            'budi@seapedia.com' => ['seller'],
            'siti@seapedia.com' => ['seller'],
            'ani@seapedia.com' => ['buyer'],
            'rudi@seapedia.com' => ['buyer'],
            'caca@seapedia.com' => ['driver'],
            'dedi@seapedia.com' => ['driver'],
            'fika@seapedia.com' => ['buyer', 'seller'], // Multi-role
        ];

        foreach ($users as $email => $roles) {
            $user = User::where('email', $email)->first();
            if ($user) {
                foreach ($roles as $index => $role) {
                    // Use firstOrCreate to avoid duplicate entries
                    $user->roles()->firstOrCreate(
                        ['role' => $role],
                        ['is_active' => $index === 0]
                    );
                }
            }
        }
    }
}
