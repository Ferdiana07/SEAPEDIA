<?php
// File: app/Models/Store.php
// Penjelasan: Model Store untuk interaksi dengan tabel stores

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     * 
     * Penjelasan:
     * Field-field yang boleh di-set secara mass assignment
     * (misalnya: Store::create([...]) atau $store->fill([...]))
     * 
     * ⚠️ ATTENTION: 
     * Jangan masukkan field yang tidak boleh diubah langsung oleh user
     * seperti user_id (seharusnya dari auth), is_active (admin only)
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'address',
        'phone',
        'image_url',
        // 'is_active' ← sebaiknya tidakfillable untuk keamanan
    ];
    
    /**
     * The attributes that should be cast.
     * 
     * Penjelasan:
     * Type casting untuk konversi otomatis
     * - boolean → true/false
     * - integer → number
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];
    
    // =================================================================
    // RELATIONSHIPS
    // =================================================================
    
    /**
     * Store dimiliki oleh satu User (Seller)
     * 
     * @return BelongsTo
     * 
     * Penggunaan:
     * ```php
     * $store = Store::find(1);
     * $owner = $store->user; // Returns User object
     * echo $owner->name; // "Budi"
     * ```
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Store memiliki banyak Products
     * 
     * @return HasMany
     * 
     * Penggunaan:
     * ```php
     * $store = Store::find(1);
     * $products = $store->products; // Returns Collection of Product
     * 
     * // Dengan filter
     * $activeProducts = $store->products()->where('is_active', true)->get();
     * ```
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
    
    // =================================================================
    // SCOPES (Query Builder Extensions)
    // =================================================================
    
    /**
     * Scope: Hanya toko yang aktif
     * 
     * Penggunaan:
     * ```php
     * $activeStores = Store::active()->get();
     * // SELECT * FROM stores WHERE is_active = true
     * ```
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    /**
     * Scope: Pencarian berdasarkan nama
     * 
     * Penggunaan:
     * ```php
     * $results = Store::search('dapur')->get();
     * // SELECT * FROM stores WHERE name LIKE '%dapur%'
     * ```
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('name', 'LIKE', "%{$keyword}%");
    }
    
    // =================================================================
    // ACCESSORS & MUTATORS
    // =================================================================
    
    /**
     * Accessor: Format harga dengan mata uang
     * 
     * Penggunaan:
     * ```php
     * $store = Store::find(1);
     * echo $store->formatted_price_range;
     * // "Rp 10.000 - Rp 500.000"
     * ```
     */
    public function getFormattedPriceRangeAttribute(): string
    {
        if ($this->products->isEmpty()) {
            return 'Tidak ada produk';
        }
        
        $min = $this->products->min('price');
        $max = $this->products->max('price');
        
        return 'Rp ' . number_format($min, 0, ',', '.') . ' - Rp ' . number_format($max, 0, ',', '.');
    }
    
    /**
     * Accessor: Total produk aktif
     */
    public function getActiveProductsCountAttribute(): int
    {
        return $this->products()->where('is_active', true)->count();
    }
    
    // =================================================================
    // HELPER METHODS
    // =================================================================
    
    /**
     * Cek apakah user tertentu adalah pemilik toko
     * 
     * @param int $userId
     * @return bool
     */
    public function isOwnedBy(int $userId): bool
    {
        return $this->user_id === $userId;
    }
    
    /**
     * Cek apakah toko bisa diedit oleh user tertentu
     * 
     * @param User $user
     * @return bool
     */
    public function canBeEditedBy(User $user): bool
    {
        return $this->isOwnedBy($user->id);
    }
}