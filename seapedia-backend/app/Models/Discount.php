<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    public const TYPE_VOUCHER = 'voucher';

    public const TYPE_PROMO = 'promo';

    public const CALCULATION_PERCENTAGE = 'percentage';

    public const CALCULATION_FIXED = 'fixed';

    protected $fillable = [
        'code',
        'name',
        'type',
        'calculation_type',
        'value',
        'minimum_purchase',
        'maximum_discount',
        'usage_limit',
        'used_count',
        'starts_at',
        'expires_at',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'value' => 'float',
        'minimum_purchase' => 'float',
        'maximum_discount' => 'float',
        'usage_limit' => 'integer',
        'used_count' => 'integer',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function isAvailable(float $subtotal): bool
    {
        if (! $this->is_active || $this->expires_at->isPast()) {
            return false;
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }

        if ($this->usage_limit !== null && $this->used_count >= $this->usage_limit) {
            return false;
        }

        return $subtotal >= $this->minimum_purchase;
    }

    public function calculate(float $subtotal): float
    {
        if (! $this->isAvailable($subtotal)) {
            return 0;
        }

        $amount = $this->calculation_type === self::CALCULATION_PERCENTAGE
            ? $subtotal * ($this->value / 100)
            : $this->value;

        if ($this->maximum_discount !== null) {
            $amount = min($amount, $this->maximum_discount);
        }

        return round(min($amount, $subtotal), 2);
    }
}
