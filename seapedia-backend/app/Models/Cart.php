<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan user yang memiliki cart ini
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mendapatkan semua item dalam cart ini
     */
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Mendapatkan toko (melalui item pertama) jika cart memiliki item
     */
    public function getStoreAttribute(): ?Store
    {
        $firstItem = $this->items()->first();
        return $firstItem ? $firstItem->product->store : null;
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Memeriksa apakah cart kosong
     */
    public function isEmpty(): bool
    {
        return $this->items()->count() === 0;
    }

    /**
     * Mendapatkan jumlah total item
     */
    public function getTotalItemsAttribute(): int
    {
        return $this->items()->sum('quantity');
    }

    /**
     * Mendapatkan subtotal (sebelum ongkir)
     */
    public function getSubtotalAttribute(): float
    {
        $subtotal = 0;
        foreach ($this->items as $item) {
            $subtotal += $item->quantity * $item->product->price;
        }
        return $subtotal;
    }

    /**
     * Mendapatkan subtotal yang sudah diformat
     */
    public function getFormattedSubtotalAttribute(): string
    {
        return 'Rp ' . number_format($this->subtotal, 0, ',', '.');
    }

    /**
     * Mengosongkan semua item dari cart
     */
    public function clear(): void
    {
        $this->items()->delete();
    }

    /**
     * Memeriksa apakah menambahkan produk dari toko berbeda diizinkan
     * (Aturan single-store checkout)
     */
    public function canAddProduct(Product $product): bool
    {
        // Jika cart kosong, izinkan
        if ($this->isEmpty()) {
            return true;
        }

        // Periksa apakah toko produk cocok dengan toko cart
        $cartStore = $this->store;
        $productStore = $product->store;

        // Jika produk tidak punya toko atau cart tidak punya toko, jangan izinkan
        if (!$cartStore || !$productStore) {
            return false;
        }

        return $cartStore->id === $productStore->id;
    }
}
