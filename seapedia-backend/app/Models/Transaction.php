<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'wallet_id',
        'order_id',
        'type',
        'amount',
        'description',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Konstanta tipe transaksi
     */
    public const TYPE_TOPUP = 'topup';
    public const TYPE_PURCHASE = 'purchase';
    public const TYPE_REFUND = 'refund';
    public const TYPE_WITHDRAWAL = 'withdrawal';

    public const TYPES = [
        self::TYPE_TOPUP,
        self::TYPE_PURCHASE,
        self::TYPE_REFUND,
        self::TYPE_WITHDRAWAL,
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan wallet yang memiliki transaksi ini
     */
    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    /**
     * Mendapatkan pesanan yang terkait dengan transaksi ini (jika ada)
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * ============================================================
     * SCOPE QUERY
     * ============================================================
     */

    /**
     * Scope untuk menyaring berdasarkan tipe
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope untuk menyaring untuk wallet
     */
    public function scopeForWallet($query, int $walletId)
    {
        return $query->where('wallet_id', $walletId);
    }

    /**
     * Scope untuk mendapatkan transaksi topup
     */
    public function scopeTopups($query)
    {
        return $query->where('type', self::TYPE_TOPUP);
    }

    /**
     * Scope untuk mendapatkan transaksi pembelian
     */
    public function scopePurchases($query)
    {
        return $query->where('type', self::TYPE_PURCHASE);
    }

    /**
     * Scope untuk mendapatkan transaksi refund
     */
    public function scopeRefunds($query)
    {
        return $query->where('type', self::TYPE_REFUND);
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
     * Memeriksa apakah transaksi positif (topup, refund)
     */
    public function isPositive(): bool
    {
        return in_array($this->type, [self::TYPE_TOPUP, self::TYPE_REFUND]);
    }

    /**
     * Memeriksa apakah transaksi negatif (pembelian, penarikan)
     */
    public function isNegative(): bool
    {
        return in_array($this->type, [self::TYPE_PURCHASE, self::TYPE_WITHDRAWAL]);
    }

    /**
     * Mendapatkan jumlah yang diformat dengan tanda
     */
    public function getFormattedAmountAttribute(): string
    {
        $prefix = $this->isPositive() ? '+' : '-';
        return $prefix . 'Rp ' . number_format(abs($this->amount), 0, ',', '.');
    }

    /**
     * Mendapatkan label tipe
     */
    public function getTypeLabelAttribute(): string
    {
        $labels = [
            self::TYPE_TOPUP => 'Top Up',
            self::TYPE_PURCHASE => 'Pembelian',
            self::TYPE_REFUND => 'Refund',
            self::TYPE_WITHDRAWAL => 'Penarikan',
        ];

        return $labels[$this->type] ?? $this->type;
    }
}
