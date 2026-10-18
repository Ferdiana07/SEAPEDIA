<?php

// File: app/Models/Product.php
// Penjelasan: Model Product untuk interaksi dengan tabel products

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     */
    protected $fillable = [
        'store_id',
        'name',
        'description',
        'category',
        'price',
        'stock',
        'image_url',
        'image_path',
        'image_disk',
        'is_active',
    ];

    /**
     * Internal storage identifiers are never part of the public API payload.
     */
    protected $hidden = [
        'image_path',
        'image_disk',
    ];

    /**
     * Castable attributes.
     */
    protected $casts = [
        'price' => 'integer',  // ⭐ Simpan sebagai integer
        'stock' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Default attribute values.
     */
    protected $attributes = [
        'stock' => 0,
        'is_active' => true,
    ];

    // =================================================================
    // RELATIONSHIPS
    // =================================================================

    /**
     * Product dimiliki oleh satu Store
     *
     * @return BelongsTo
     *
     * Penggunaan:
     * ```php
     * $product = Product::find(1);
     * $store = $product->store; // Returns Store object
     * $seller = $product->store->user; // Returns User (seller)
     * ```
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Semua review untuk produk ini
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->latest();
    }

    // =================================================================
    // SCOPES
    // =================================================================

    /**
     * Scope: Hanya produk aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Hanya produk dengan stok
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Scope: Pencarian berdasarkan nama atau deskripsi
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('name', 'LIKE', "%{$keyword}%")
                ->orWhere('description', 'LIKE', "%{$keyword}%");
        });
    }

    /**
     * Scope: Filter berdasarkan kategori
     */
    public function scopeByCategory($query, $category)
    {
        return $query->whereRaw('LOWER(category) = ?', [strtolower($category)]);
    }

    /**
     * Scope: Filter berdasarkan range harga
     */
    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    // =================================================================
    // ACCESSORS & MUTATORS
    // =================================================================

    /**
     * Resolve uploaded images from their configured disk while preserving
     * legacy external and frontend-bundled image URLs.
     */
    public function getImageUrlAttribute(?string $value): ?string
    {
        if (! $this->image_path) {
            return $value;
        }

        $disk = $this->image_disk ?: config('filesystems.product_images_disk', 'public');

        return Storage::disk($disk)->url($this->image_path);
    }

    /**
     * Accessor: Format harga untuk display
     *
     * Penggunaan:
     * ```php
     * $product = Product::find(1);
     * echo $product->formatted_price;
     * // "Rp 25.000"
     * ```
     */
    public function getFormattedPriceAttribute(): string
    {
        $price = (float) $this->price;

        return 'Rp '.number_format($price, 0, ',', '.');
    }

    /**
     * Accessor: Cek apakah stok cukup
     */
    public function getHasStockAttribute(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Accessor: rata-rata rating (float, 1 desimal)
     *
     * Penggunaan:
     * ```php
     * $product = Product::find(1);
     * echo $product->average_rating; // 4.5
     * ```
     */
    public function getAverageRatingAttribute(): float
    {
        return round((float) $this->reviews()->avg('rating'), 1);
    }

    /**
     * Accessor: jumlah total review
     */
    public function getTotalReviewsAttribute(): int
    {
        return (int) $this->reviews()->count();
    }

    /**
     * Mutator: Set price dari input user
     *
     * Penjelasan:
     * Jika user input "25000" (string), konversi ke integer
     * Hapus titik ribuan: "Rp 25.000" → 25000
     */
    public function setPriceAttribute($value)
    {
        // Hapus karakter non-numerik (titik, koma, Rp, spasi)
        $cleaned = preg_replace('/[^0-9]/', '', $value);
        $this->attributes['price'] = (int) $cleaned;
    }

    // =================================================================
    // HELPER METHODS
    // =================================================================

    /**
     * Kurangi stok
     */
    public function reduceStock(int $quantity): bool
    {
        if ($this->stock < $quantity) {
            return false; // Stok tidak cukup
        }

        $this->decrement('stock', $quantity);

        return true;
    }

    /**
     * Tambah stok
     */
    public function addStock(int $quantity): void
    {
        $this->increment('stock', $quantity);
    }

    /**
     * Cek apakah dimiliki oleh user tertentu
     */
    public function isOwnedByUser(int $userId): bool
    {
        return $this->store->user_id === $userId;
    }
}
