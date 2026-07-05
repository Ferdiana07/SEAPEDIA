<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'store_id',
        'name',
        'description',
        'price',
        'stock',
        'image_url',
        'is_active',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan toko yang memiliki produk ini
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Mendapatkan semua item cart untuk produk ini
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Mendapatkan semua review untuk produk ini
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Mendapatkan semua item pesanan untuk produk ini
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * ============================================================
     * SCOPE QUERY
     * ============================================================
     */

    /**
     * Scope untuk mendapatkan hanya produk yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope untuk mendapatkan produk yang memiliki stok
     */
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    /**
     * Scope untuk mencari produk berdasarkan nama
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }

    /**
     * Scope untuk menyaring berdasarkan rentang harga
     */
    public function scopePriceRange($query, $min = null, $max = null)
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }
        if ($max !== null) {
            $query->where('price', '<=', $max);
        }
        return $query;
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Memeriksa apakah produk ada stoknya
     */
    public function isInStock(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Mengurangi stok sebanyak jumlah tertentu
     */
    public function reduceStock(int $quantity): bool
    {
        if ($this->stock < $quantity) {
            return false;
        }

        $this->decrement('stock', $quantity);
        return true;
    }

    /**
     * Menambah stok sebanyak jumlah tertentu
     */
    public function addStock(int $quantity): void
    {
        $this->increment('stock', $quantity);
    }

    /**
     * Mendapatkan harga yang sudah diformat
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    /**
     * Mendapatkan rating rata-rata dari review
     */
    public function getAverageRatingAttribute(): ?float
    {
        $avg = $this->reviews()->avg('rating');
        return $avg ? round($avg, 1) : null;
    }

    /**
     * Mendapatkan jumlah review
     */
    public function getReviewCountAttribute(): int
    {
        return $this->reviews()->count();
    }
}
