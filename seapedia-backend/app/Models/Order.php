<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_number',
        'user_id',
        'store_id',
        'driver_id',
        'status',
        'total_amount',
        'shipping_address',
        'cancellation_reason',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    /**
     * Konstanta status pesanan
     */
    public const STATUS_PACKAGING = 'packaging';
    public const STATUS_WAITING_SHIPPER = 'waiting_shipper';
    public const STATUS_SHIPPING = 'shipping';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_RETURNED = 'returned';

    public const STATUSES = [
        self::STATUS_PACKAGING,
        self::STATUS_WAITING_SHIPPER,
        self::STATUS_SHIPPING,
        self::STATUS_COMPLETED,
        self::STATUS_RETURNED,
    ];

    /**
     * ============================================================
     * BOOT METHOD
     * ============================================================
     */

    protected static function boot()
    {
        parent::boot();

        // Auto-generate nomor pesanan saat membuat
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = self::generateOrderNumber();
            }
        });
    }

    /**
     * Membuat nomor pesanan unik
     */
    public static function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(6));
        return "ORD-{$date}-{$random}";
    }

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan user (pembeli) yang membuat pesanan ini
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Mendapatkan toko untuk pesanan ini
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Mendapatkan driver yang ditugaskan ke pesanan ini
     */
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    /**
     * Mendapatkan semua item untuk pesanan ini
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Mendapatkan semua transaksi untuk pesanan ini
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * ============================================================
     * SCOPE QUERY
     * ============================================================
     */

    /**
     * Scope untuk menyaring berdasarkan status
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope untuk menyaring berdasarkan user
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope untuk menyaring berdasarkan toko
     */
    public function scopeForStore($query, int $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Scope untuk menyaring untuk driver
     */
    public function scopeForDriver($query, int $driverId)
    {
        return $query->where('driver_id', $driverId);
    }

    /**
     * Scope untuk mendapatkan pesanan yang menunggu driver
     */
    public function scopeWaitingForDriver($query)
    {
        return $query->where('status', self::STATUS_WAITING_SHIPPER);
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Memeriksa apakah pesanan dapat diperbarui ke status tertentu
     */
    public function canUpdateToStatus(string $newStatus): bool
    {
        $validTransitions = [
            self::STATUS_PACKAGING => [self::STATUS_WAITING_SHIPPER],
            self::STATUS_WAITING_SHIPPER => [self::STATUS_SHIPPING],
            self::STATUS_SHIPPING => [self::STATUS_COMPLETED, self::STATUS_RETURNED],
        ];

        if (!isset($validTransitions[$this->status])) {
            return false;
        }

        return in_array($newStatus, $validTransitions[$this->status]);
    }

    /**
     * Memperbarui status pesanan
     */
    public function updateStatus(string $newStatus): bool
    {
        if (!$this->canUpdateToStatus($newStatus)) {
            return false;
        }

        $this->update(['status' => $newStatus]);
        return true;
    }

    /**
     * Menugaskan driver ke pesanan
     */
    public function assignDriver(User $driver): void
    {
        $this->update(['driver_id' => $driver->id]);
    }

    /**
     * Mendapatkan total amount yang sudah diformat
     */
    public function getFormattedTotalAttribute(): string
    {
        $amount = (float) $this->total_amount;
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }

    /**
     * Memeriksa apakah pesanan sudah selesai
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Memeriksa apakah pesanan dapat dibatalkan
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [
            self::STATUS_PACKAGING,
            self::STATUS_WAITING_SHIPPER,
        ]);
    }

    /**
     * Memeriksa apakah pesanan dapat dibatalkan (alias)
     */
    public function isCancellable(): bool
    {
        return $this->canBeCancelled();
    }
}
