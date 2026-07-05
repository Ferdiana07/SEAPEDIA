<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'address',
        'phone',
        'logo_url',
        'is_active',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan user (pemilik) yang memiliki toko ini
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mendapatkan semua produk untuk toko ini
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Mendapatkan semua pesanan untuk toko ini
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * ============================================================
     * SCOPE QUERY
     * ============================================================
     */

    /**
     * Scope untuk mendapatkan hanya toko yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Memeriksa apakah toko aktif
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Mendapatkan jumlah total produk
     */
    public function getProductCountAttribute(): int
    {
        return $this->products()->count();
    }

    /**
     * Mendapatkan jumlah total pesanan
     */
    public function getOrderCountAttribute(): int
    {
        return $this->orders()->count();
    }
}
