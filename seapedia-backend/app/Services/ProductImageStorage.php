<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class ProductImageStorage
{
    /**
     * @return array{path: string, disk: string}
     */
    public function store(UploadedFile $image, int $storeId): array
    {
        $disk = (string) config('filesystems.product_images_disk', 'public');
        $path = $image->store("products/{$storeId}", $disk);

        if (! $path) {
            throw new \RuntimeException('Gambar produk gagal disimpan.');
        }

        return ['path' => $path, 'disk' => $disk];
    }

    public function delete(?string $path, ?string $disk): void
    {
        if (! $path) {
            return;
        }

        Storage::disk($disk ?: config('filesystems.product_images_disk', 'public'))->delete($path);
    }
}
