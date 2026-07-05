<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'role',
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
     * Konstanta role yang tersedia
     */
    public const ROLE_ADMIN = 'admin';
    public const ROLE_SELLER = 'seller';
    public const ROLE_BUYER = 'buyer';
    public const ROLE_DRIVER = 'driver';

    public const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_SELLER,
        self::ROLE_BUYER,
        self::ROLE_DRIVER,
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan user yang memiliki role ini
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ============================================================
     * SCOPE QUERY
     * ============================================================
     */

    /**
     * Scope untuk mendapatkan hanya role yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope untuk mendapatkan role berdasarkan tipe
     */
    public function scopeOfRole($query, string $role)
    {
        return $query->where('role', $role);
    }
}
