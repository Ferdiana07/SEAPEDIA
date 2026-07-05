<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'label',
        'recipient_name',
        'phone',
        'full_address',
        'is_default',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan user yang memiliki alamat ini
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
     * Scope untuk mendapatkan alamat default
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Menetapkan alamat ini sebagai default
     */
    public function setAsDefault(): void
    {
        // Hapus default dari alamat lain
        $this->user->addresses()->update(['is_default' => false]);

        // Tetapkan ini sebagai default
        $this->update(['is_default' => true]);
    }

    /**
     * Mendapatkan string alamat lengkap
     */
    public function getFullAddressStringAttribute(): string
    {
        return "{$this->recipient_name}\n{$this->phone}\n{$this->full_address}";
    }
}
