<?php

// Script untuk cek dan update kategori produk

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

// Update produk sesuai kategori
$updates = [
    'alat pancing' => ['pancing', 'joran', 'reel', 'tackle', 'kail', 'rompi'],
    'budidaya' => ['aerator', 'keramba', 'tambak', 'salinitas', 'kualitas air'],
    'pakan' => ['pakan', 'pelet'],
    'akuarium' => ['akuarium', 'reef', 'aragonit', 'skimmer', 'lampu'],
    'biota hidup' => ['ikan badut', 'udang hias', 'biota'],
    'tanaman laut' => ['caulerpa', 'rumput laut', 'tanaman laut'],
    'hasil laut' => ['tuna segar', 'loin', 'udang segar', 'cumi segar'],
    'kuliner laut' => ['rice bowl', 'siap santap', 'panggang', 'sambal matah'],
];

echo "=== Produk di Database ===\n";
$products = DB::table('products')->get();
foreach ($products as $product) {
    echo "- {$product->name} | kategori: ".($product->category ?? 'NULL')."\n";
}

echo "\n=== Update Kategori ===\n";
foreach ($products as $product) {
    if (! $product->category) {
        $nameLower = strtolower($product->name);
        foreach ($updates as $category => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($nameLower, $keyword)) {
                    DB::table('products')->where('id', $product->id)->update(['category' => $category]);
                    echo "Updated: {$product->name} => {$category}\n";
                    break 2;
                }
            }
        }
    }
}

echo "\n=== Hasil Akhir ===\n";
$updated = DB::table('products')->get();
foreach ($updated as $p) {
    echo "- {$p->name} | {$p->category}\n";
}
