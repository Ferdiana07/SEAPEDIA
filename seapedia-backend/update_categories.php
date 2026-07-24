<?php
// Script untuk cek dan update kategori produk

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

// Update produk sesuai kategori
$updates = [
    'makanan' => ['nasi', 'ayam', 'mie', 'soto', 'gado', 'rendang', 'taliwang', 'siomay', 'bakso', 'goreng', 'sate', 'bubur', 'lontong', 'ketoprak', 'pecel', 'pempek', 'rawon', 'opor'],
    'elektronik' => ['hp', 'laptop', 'tablet', 'gadget', 'elektronik', 'headphone', 'earphone', 'charger', 'power bank', 'mouse', 'keyboard'],
    'pakaian' => ['baju', 'kaos', 'kemeja', 'celana', 'dress', 'rok', 'jaket', 'pakaian', 'fashion', 'sepatu', 'sandal'],
    'kesehatan' => ['vitamin', 'obat', 'masker', 'suplemen', 'kesehatan', 'skincare', 'cream'],
    'olahraga' => ['sepatu olahraga', 'bola', 'raket', 'dumbbell', 'olahraga', 'gym'],
    'otomotif' => ['helm', 'oli', 'ban', 'motor', 'mobil', 'otomotif'],
];

echo "=== Produk di Database ===\n";
$products = DB::table('products')->get();
foreach ($products as $product) {
    echo "- {$product->name} | kategori: " . ($product->category ?? 'NULL') . "\n";
}

echo "\n=== Update Kategori ===\n";
foreach ($products as $product) {
    if (!$product->category) {
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
