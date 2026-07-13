<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan cart yang memiliki item ini
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Mendapatkan produk untuk item ini
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Mendapatkan subtotal untuk item ini (jumlah * harga produk)
     */
    public function getSubtotalAttribute(): float
    {
        return $this->quantity * $this->product->price;
    }

    /**
     * Mendapatkan subtotal yang sudah diformat
     */
    public function getFormattedSubtotalAttribute(): string
    {
        $subtotal = (float) $this->subtotal;
        return 'Rp ' . number_format($subtotal, 0, ',', '.');
    }

    /**
     * Menambah jumlah sebanyak jumlah tertentu
     */
    public function increaseQuantity(int $amount = 1): void
    {
        $this->increment('quantity', $amount);
    }

    /**
     * Mengurangi jumlah sebanyak jumlah tertentu
     */
    public function decreaseQuantity(int $amount = 1): void
    {
        $newQuantity = $this->quantity - $amount;
        if ($newQuantity <= 0) {
            $this->delete();
        } else {
            $this->update(['quantity' => $newQuantity]);
        }
    }
}
