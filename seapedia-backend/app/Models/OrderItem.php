<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price_at_purchase',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'price_at_purchase' => 'decimal:2',
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan pesanan yang memiliki item ini
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
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
     * Mendapatkan subtotal untuk item ini (jumlah * harga_saat_beli)
     */
    public function getSubtotalAttribute(): float
    {
        return $this->quantity * $this->price_at_purchase;
    }

    /**
     * Mendapatkan subtotal yang sudah diformat
     */
    public function getFormattedSubtotalAttribute(): string
    {
        return 'Rp ' . number_format($this->subtotal, 0, ',', '.');
    }

    /**
     * Mendapatkan harga saat pembelian yang sudah diformat
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price_at_purchase, 0, ',', '.');
    }
}
