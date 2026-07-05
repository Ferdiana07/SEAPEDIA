<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'balance',
    ];

    /**
     * Atribut yang perlu di-cast ke tipe tertentu.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'balance' => 'decimal:2',
    ];

    /**
     * ============================================================
     * RELASI
     * ============================================================
     */

    /**
     * Mendapatkan user yang memiliki wallet ini
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mendapatkan semua transaksi untuk wallet ini
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * ============================================================
     * METHOD HELPER
     * ============================================================
     */

    /**
     * Memeriksa apakah wallet memiliki saldo yang cukup
     */
    public function hasSufficientBalance(float $amount): bool
    {
        return $this->balance >= $amount;
    }

    /**
     * Menambah (kredit) saldo
     */
    public function credit(float $amount, string $description = null): Transaction
    {
        $this->increment('balance', $amount);

        return $this->transactions()->create([
            'type' => Transaction::TYPE_TOPUP,
            'amount' => $amount,
            'description' => $description ?? 'Top up balance',
        ]);
    }

    /**
     * Mengurangi (debit) saldo
     */
    public function debit(float $amount, ?int $orderId = null, string $description = null): bool
    {
        if (!$this->hasSufficientBalance($amount)) {
            return false;
        }

        $this->decrement('balance', $amount);

        $this->transactions()->create([
            'type' => Transaction::TYPE_PURCHASE,
            'amount' => -$amount,
            'order_id' => $orderId,
            'description' => $description ?? 'Purchase',
        ]);

        return true;
    }

    /**
     * Mengembalikan (refund) saldo
     */
    public function refund(float $amount, ?int $orderId = null, string $description = null): Transaction
    {
        $this->increment('balance', $amount);

        return $this->transactions()->create([
            'type' => Transaction::TYPE_REFUND,
            'amount' => $amount,
            'order_id' => $orderId,
            'description' => $description ?? 'Refund',
        ]);
    }

    /**
     * Mendapatkan saldo yang sudah diformat
     */
    public function getFormattedBalanceAttribute(): string
    {
        return 'Rp ' . number_format($this->balance, 0, ',', '.');
    }
}
