<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Atribut yang dapat diisi secara massal (mass assignment).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_url',
    ];

    /**
     * Atribut yang disembunyikan saat serialisasi.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan semua role user ini
     */
    public function roles()
    {
        return $this->hasMany(UserRole::class);
    }

    /**
     * Mendapatkan toko yang dimiliki user ini (sebagai seller)
     */
    public function store()
    {
        return $this->hasOne(Store::class);
    }

    /**
     * Mendapatkan wallet user ini
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Mendapatkan semua alamat user ini
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Mendapatkan cart user ini (sebagai buyer)
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    /**
     * Mendapatkan semua pesanan yang dibuat user ini (sebagai buyer)
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    /**
     * Mendapatkan semua pesanan yang ditugaskan ke user ini (sebagai driver)
     */
    public function driverOrders()
    {
        return $this->hasMany(Order::class, 'driver_id');
    }

    /**
     * Mendapatkan semua review yang ditulis user ini
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Memeriksa apakah user memiliki role tertentu
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()->where('role', $role)->exists();
    }

    /**
     * Memeriksa apakah user memiliki role tertentu yang aktif
     */
    public function hasActiveRole(string $role): bool
    {
        return $this->roles()
            ->where('role', $role)
            ->where('is_active', true)
            ->exists();
    }

    /**
     * Mendapatkan role yang sedang aktif
     */
    public function getActiveRole(): ?UserRole
    {
        return $this->roles()->where('is_active', true)->first();
    }

    /**
     * Mengaktifkan role tertentu
     */
    public function activateRole(string $role): bool
    {
        // Nonaktifkan semua role terlebih dahulu
        $this->roles()->update(['is_active' => false]);

        // Aktifkan role yang dipilih
        return $this->roles()
            ->where('role', $role)
            ->update(['is_active' => true]);
    }
}
