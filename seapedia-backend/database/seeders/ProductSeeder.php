<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Sync demo fixtures without resetting IDs, stocks, prices, uploads or orders.
     */
    public function run(): void
    {
        $products = json_decode(file_get_contents(database_path('data/demo-products.json')), true, 512, JSON_THROW_ON_ERROR);
        $owners = [1 => 'budi@seapedia.com', 2 => 'siti@seapedia.com', 3 => 'fika@seapedia.com'];
        $stores = [];
        foreach ($owners as $key => $email) {
            $stores[$key] = Store::whereHas('user', fn ($user) => $user->where('email', $email))->first();
            if (! $stores[$key]) {
                throw new RuntimeException("Toko demo {$email} belum ada. Jalankan StoreSeeder pada database demo baru terlebih dahulu.");
            }
        }

        $created = DB::transaction(function () use ($products, $stores): int {
            $created = 0;
            foreach ($products as $data) {
                $storeId = $stores[$data['store_id']]->id;
                $product = Product::where('store_id', $storeId)
                    ->whereIn('name', array_unique([$data['name'], $data['legacy_name'] ?? $data['name']]))
                    ->first();
                if (! $product) {
                    Product::create([
                        'store_id' => $storeId,
                        ...array_intersect_key($data, array_flip(['name', 'description', 'category', 'price', 'stock', 'image_url'])),
                        'is_active' => true,
                    ]);
                    $created++;

                    continue;
                }

                $fixtureUrls = [$data['image_url'], $data['legacy_image_url'] ?? $data['image_url']];
                if (! $product->image_path && in_array($product->getRawOriginal('image_url'), $fixtureUrls, true)) {
                    $product->update(array_intersect_key($data, array_flip(['name', 'description', 'category', 'image_url'])));
                }
            }

            return $created;
        });

        $this->command?->info("Katalog demo: {$created} produk baru; ".count($products).' fixture diperiksa tanpa reset data.');
    }
}
