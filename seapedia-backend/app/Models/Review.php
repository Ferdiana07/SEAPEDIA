<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'rating',
        'comment',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Batas rating
     */
    public const MIN_RATING = 1;
    public const MAX_RATING = 5;

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan user yang menulis review ini
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mendapatkan produk yang di-review
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * ============================================================
     * SCOPE QUERY
     * ============================================================
     */

    /**
     * Scope untuk menyaring berdasarkan rating
     */
    public function scopeRating($query, int $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Scope untuk mendapatkan review untuk suatu produk
     */
    public function scopeForProduct($query, int $productId)
    {
        return $query->where('product_id', $productId);
    }

    /**
     * Scope untuk mengurutkan dari yang terbaru
     */
    public function scopeNewest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Mendapatkan representasi bintang dari rating
     */
    public function getStarsAttribute(): string
    {
        return str_repeat('⭐', $this->rating);
    }
}
