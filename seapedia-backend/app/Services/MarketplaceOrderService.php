<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Discount;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Wallet;
use DomainException;

class MarketplaceOrderService
{
    public const TAX_RATE = 0.12;

    public function quote(User $user, string $deliveryMethod, ?string $discountCode = null, bool $lock = false): array
    {
        if (! array_key_exists($deliveryMethod, Order::DELIVERY_FEES)) {
            throw new DomainException('Metode pengiriman tidak valid.');
        }

        $cartQuery = Cart::where('user_id', $user->id);
        if ($lock) {
            $cartQuery->lockForUpdate();
        }

        $cart = $cartQuery->first();
        if (! $cart) {
            throw new DomainException('Cart tidak ditemukan.');
        }

        $cart->load('items.product.store');
        if ($cart->items->isEmpty()) {
            throw new DomainException('Cart masih kosong.');
        }

        $storeId = null;
        $subtotal = 0.0;
        $items = [];

        // Lock product rows in a stable order. This prevents two transactions
        // containing the same products in a different cart order from deadlocking.
        foreach ($cart->items->sortBy('product_id') as $cartItem) {
            $product = $lock
                ? Product::whereKey($cartItem->product_id)->lockForUpdate()->first()
                : $cartItem->product;

            if (! $product || ! $product->is_active) {
                throw new DomainException('Salah satu produk sudah tidak tersedia.');
            }

            $product->loadMissing('store');
            if (! $product->store?->is_active) {
                throw new DomainException('Toko sedang tidak aktif.');
            }

            $storeId ??= $product->store_id;
            if ($product->store_id !== $storeId) {
                throw new DomainException('Satu checkout hanya dapat berisi produk dari satu toko.');
            }

            if ($product->stock < $cartItem->quantity) {
                throw new DomainException("Stok {$product->name} tidak mencukupi.");
            }

            $lineTotal = (float) $product->price * $cartItem->quantity;
            $subtotal += $lineTotal;
            $items[] = [
                'cart_item' => $cartItem,
                'product' => $product,
                'quantity' => $cartItem->quantity,
                'unit_price' => (float) $product->price,
                'line_total' => $lineTotal,
            ];
        }

        $discount = null;
        $discountAmount = 0.0;
        if ($discountCode) {
            $discountQuery = Discount::whereRaw('UPPER(code) = ?', [strtoupper(trim($discountCode))]);
            if ($lock) {
                $discountQuery->lockForUpdate();
            }
            $discount = $discountQuery->first();

            if (! $discount) {
                throw new DomainException('Kode diskon tidak ditemukan.');
            }

            if (! $discount->isAvailable($subtotal)) {
                throw new DomainException('Kode diskon sudah tidak berlaku atau syarat minimum belum terpenuhi.');
            }

            $discountAmount = $discount->calculate($subtotal);
        }

        $taxBase = max(0, $subtotal - $discountAmount);
        $taxAmount = round($taxBase * self::TAX_RATE, 2);
        $deliveryFee = (float) Order::DELIVERY_FEES[$deliveryMethod];
        $total = round($taxBase + $taxAmount + $deliveryFee, 2);

        return [
            'cart' => $cart,
            'items' => $items,
            'store_id' => $storeId,
            'delivery_method' => $deliveryMethod,
            'subtotal' => round($subtotal, 2),
            'discount' => $discount,
            'discount_amount' => round($discountAmount, 2),
            'delivery_fee' => $deliveryFee,
            'tax_rate' => self::TAX_RATE,
            'tax_amount' => $taxAmount,
            'total_amount' => $total,
        ];
    }

    public function refund(Order $order, ?User $actor, string $note): Order
    {
        if (! $order->refunded_at) {
            $wallet = Wallet::where('user_id', $order->user_id)->lockForUpdate()->first();
            if ($wallet) {
                $wallet->refund(
                    (float) $order->total_amount,
                    $order->id,
                    "Refund order #{$order->order_number}: {$note}"
                );
            }
            $order->refunded_at = now();
        }

        if (! $order->stock_restored_at) {
            $order->loadMissing('items');
            foreach ($order->items->sortBy('product_id') as $item) {
                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }
            $order->stock_restored_at = now();
        }

        $order->status = Order::STATUS_RETURNED;
        $order->cancellation_reason = $note;
        $order->save();

        $alreadyRecorded = $order->statusHistories()
            ->where('status', Order::STATUS_RETURNED)
            ->where('note', $note)
            ->exists();

        if (! $alreadyRecorded) {
            $order->recordStatus($actor, $note);
        }

        return $order->fresh();
    }
}
