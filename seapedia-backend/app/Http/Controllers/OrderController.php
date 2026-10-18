<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Wallet;
use App\Services\MarketplaceOrderService;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly MarketplaceOrderService $orders) {}

    public function index(Request $request): JsonResponse
    {
        $query = Order::where('user_id', $request->user()->id)
            ->with(['store', 'items.product', 'driver', 'discount', 'statusHistories.actor'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return $this->paginated($query->paginate(20));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::whereKey($id)
            ->where('user_id', $request->user()->id)
            ->with(['store', 'driver', 'items.product', 'discount', 'statusHistories.actor'])
            ->first();

        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Pesanan tidak ditemukan.'], 404);
        }

        return response()->json(['success' => true, 'data' => $order]);
    }

    public function quote(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'delivery_method' => ['required', Rule::in(array_keys(Order::DELIVERY_FEES))],
            'discount_code' => ['nullable', 'string', 'max:40'],
        ]);

        try {
            $quote = $this->orders->quote(
                $request->user(),
                $validated['delivery_method'],
                $validated['discount_code'] ?? null
            );

            return response()->json(['success' => true, 'data' => $this->serializeQuote($quote)]);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $idempotencyKey = trim((string) $request->header('Idempotency-Key')) ?: null;
        if ($idempotencyKey !== null && mb_strlen($idempotencyKey) > 100) {
            return response()->json(['success' => false, 'message' => 'Idempotency key terlalu panjang.'], 422);
        }

        $validated = $request->validate([
            'address_id' => ['required', 'integer', 'exists:addresses,id'],
            'delivery_method' => ['required', Rule::in(array_keys(Order::DELIVERY_FEES))],
            'discount_code' => ['nullable', 'string', 'max:40'],
        ]);

        $user = $request->user();

        if ($idempotencyKey) {
            $existingOrder = Order::where('user_id', $user->id)
                ->where('idempotency_key', $idempotencyKey)
                ->first();

            if ($existingOrder) {
                return response()->json([
                    'success' => true,
                    'message' => 'Pesanan yang sama sudah berhasil dibuat.',
                    'replayed' => true,
                    'data' => $existingOrder->load(['items.product', 'store', 'discount', 'statusHistories.actor']),
                ]);
            }
        }

        $address = Address::whereKey($validated['address_id'])->where('user_id', $user->id)->first();
        if (! $address) {
            return response()->json(['success' => false, 'message' => 'Alamat tidak ditemukan.'], 404);
        }

        try {
            $result = DB::transaction(function () use ($user, $address, $validated, $idempotencyKey) {
                // Shared resources always follow wallet -> cart -> products -> discount.
                // Refunds use order -> wallet -> products, so no transaction can hold
                // a product while waiting for the same wallet.
                $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->first();
                if (! $wallet) {
                    throw new DomainException('Wallet tidak ditemukan.');
                }

                if ($idempotencyKey) {
                    $existingOrder = Order::where('user_id', $user->id)
                        ->where('idempotency_key', $idempotencyKey)
                        ->first();

                    if ($existingOrder) {
                        return ['order' => $existingOrder, 'replayed' => true];
                    }
                }

                $quote = $this->orders->quote(
                    $user,
                    $validated['delivery_method'],
                    $validated['discount_code'] ?? null,
                    true
                );

                if (! $wallet->hasSufficientBalance($quote['total_amount'])) {
                    throw new DomainException('Saldo wallet tidak mencukupi.');
                }

                $order = Order::create([
                    'user_id' => $user->id,
                    'idempotency_key' => $idempotencyKey,
                    'store_id' => $quote['store_id'],
                    'status' => Order::STATUS_PACKAGING,
                    'delivery_method' => $quote['delivery_method'],
                    'subtotal' => $quote['subtotal'],
                    'discount_amount' => $quote['discount_amount'],
                    'delivery_fee' => $quote['delivery_fee'],
                    'tax_amount' => $quote['tax_amount'],
                    'discount_id' => $quote['discount']?->id,
                    'total_amount' => $quote['total_amount'],
                    'shipping_address' => "{$address->recipient_name}\n{$address->full_address}\n{$address->phone}",
                ]);

                foreach ($quote['items'] as $line) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $line['product']->id,
                        'quantity' => $line['quantity'],
                        'price_at_purchase' => $line['unit_price'],
                    ]);
                    $line['product']->decrement('stock', $line['quantity']);
                }

                if (! $wallet->debit(
                    $quote['total_amount'],
                    $order->id,
                    "Pembelian order #{$order->order_number}"
                )) {
                    throw new DomainException('Saldo wallet tidak mencukupi.');
                }

                if ($quote['discount']) {
                    $quote['discount']->increment('used_count');
                }

                $quote['cart']->items()->delete();
                $order->recordStatus($user, 'Checkout berhasil dan pembayaran wallet diterima.');

                return ['order' => $order, 'replayed' => false];
            }, 3);

            $order = $result['order'];
            $status = $result['replayed'] ? 200 : 201;

            return response()->json([
                'success' => true,
                'message' => $result['replayed'] ? 'Pesanan yang sama sudah berhasil dibuat.' : 'Pesanan berhasil dibuat.',
                'replayed' => $result['replayed'],
                'data' => $order->load(['items.product', 'store', 'discount', 'statusHistories.actor']),
            ], $status);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json(['success' => false, 'message' => 'Checkout gagal diproses.'], 500);
        }
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = Order::whereKey($id)->where('user_id', $request->user()->id)->first();
        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Pesanan tidak ditemukan.'], 404);
        }
        if (! $order->canBeCancelled()) {
            return response()->json(['success' => false, 'message' => 'Pesanan tidak dapat dibatalkan pada status ini.'], 422);
        }

        try {
            $returned = DB::transaction(function () use ($id, $request) {
                $lockedOrder = Order::whereKey($id)
                    ->where('user_id', $request->user()->id)
                    ->lockForUpdate()
                    ->first();

                if (! $lockedOrder || ! $lockedOrder->canBeCancelled()) {
                    throw new DomainException('Pesanan tidak dapat dibatalkan pada status ini.');
                }

                return $this->orders->refund($lockedOrder, $request->user(), 'Dibatalkan oleh Buyer.');
            }, 3);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesanan dibatalkan dan saldo dikembalikan.',
            'data' => $returned,
        ]);
    }

    public function buyerReport(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id);

        return response()->json(['success' => true, 'data' => [
            'total_orders' => (clone $orders)->count(),
            'active_orders' => (clone $orders)->whereIn('status', [Order::STATUS_PACKAGING, Order::STATUS_WAITING_SHIPPER, Order::STATUS_SHIPPING])->count(),
            'completed_orders' => (clone $orders)->where('status', Order::STATUS_COMPLETED)->count(),
            'total_spending' => (float) (clone $orders)->where('status', '!=', Order::STATUS_RETURNED)->sum('total_amount'),
            'total_savings' => (float) (clone $orders)->where('status', '!=', Order::STATUS_RETURNED)->sum('discount_amount'),
        ]]);
    }

    public function sellerOrders(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            return response()->json(['success' => false, 'message' => 'Buat toko sebelum menerima pesanan.'], 422);
        }

        $query = Order::where('store_id', $store->id)
            ->with(['user', 'driver', 'items.product', 'discount', 'statusHistories.actor'])
            ->latest();
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return $this->paginated($query->paginate(20));
    }

    public function sellerReport(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        if (! $store) {
            return response()->json(['success' => true, 'data' => ['total_orders' => 0, 'income' => 0, 'pending_orders' => 0]]);
        }

        $orders = Order::where('store_id', $store->id);
        $income = (clone $orders)->where('status', Order::STATUS_COMPLETED)
            ->selectRaw('COALESCE(SUM(subtotal - discount_amount), 0) as amount')->value('amount');

        return response()->json(['success' => true, 'data' => [
            'total_orders' => (clone $orders)->count(),
            'completed_orders' => (clone $orders)->where('status', Order::STATUS_COMPLETED)->count(),
            'pending_orders' => (clone $orders)->whereIn('status', [Order::STATUS_PACKAGING, Order::STATUS_WAITING_SHIPPER])->count(),
            'income' => (float) $income,
        ]]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate(['status' => ['required', Rule::in([Order::STATUS_WAITING_SHIPPER])]]);
        $store = $request->user()->store;
        $order = $store ? Order::whereKey($id)->where('store_id', $store->id)->first() : null;

        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Pesanan tidak ditemukan.'], 404);
        }
        try {
            $order = DB::transaction(function () use ($id, $request, $store) {
                $lockedOrder = Order::whereKey($id)->where('store_id', $store->id)->lockForUpdate()->first();
                if (! $lockedOrder || ! $lockedOrder->updateStatus(Order::STATUS_WAITING_SHIPPER)) {
                    throw new DomainException('Transition status tidak valid.');
                }
                $lockedOrder->recordStatus($request->user(), 'Pesanan selesai dikemas dan siap diambil Driver.');

                return $lockedOrder;
            }, 3);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }

        return response()->json(['success' => true, 'message' => 'Pesanan siap diantar.', 'data' => $order]);
    }

    public function driverOrders(Request $request): JsonResponse
    {
        $user = $request->user();
        $status = $request->input('status', Order::STATUS_WAITING_SHIPPER);
        $query = Order::with(['user', 'store', 'items.product', 'statusHistories.actor']);

        if ($status === Order::STATUS_WAITING_SHIPPER) {
            $query->where('status', $status)->whereNull('driver_id')->oldest();
        } elseif ($status === 'history') {
            $query->whereIn('status', [Order::STATUS_COMPLETED, Order::STATUS_RETURNED])
                ->where('driver_id', $user->id)->latest('updated_at');
        } else {
            $query->where('status', $status)->where('driver_id', $user->id)->latest('updated_at');
        }

        return $this->paginated($query->paginate(20));
    }

    public function driverReport(Request $request): JsonResponse
    {
        $orders = Order::where('driver_id', $request->user()->id);
        $fees = (float) (clone $orders)->where('status', Order::STATUS_COMPLETED)->sum('delivery_fee');

        return response()->json(['success' => true, 'data' => [
            'available_jobs' => Order::waitingForDriver()->whereNull('driver_id')->count(),
            'active_jobs' => (clone $orders)->where('status', Order::STATUS_SHIPPING)->count(),
            'completed_jobs' => (clone $orders)->where('status', Order::STATUS_COMPLETED)->count(),
            'earnings' => round($fees * 0.8, 2),
            'earning_rate' => 0.8,
        ]]);
    }

    public function pickupOrder(Request $request, int $id): JsonResponse
    {
        try {
            $order = DB::transaction(function () use ($request, $id) {
                $order = Order::whereKey($id)->lockForUpdate()->first();
                if (! $order || $order->status !== Order::STATUS_WAITING_SHIPPER || $order->driver_id !== null) {
                    throw new DomainException('Job sudah diambil atau tidak lagi tersedia.');
                }

                $order->driver_id = $request->user()->id;
                $order->status = Order::STATUS_SHIPPING;
                $order->save();
                $order->recordStatus($request->user(), 'Job diambil Driver dan pengiriman dimulai.');

                return $order;
            }, 3);

            return response()->json(['success' => true, 'message' => 'Job berhasil diambil.', 'data' => $order]);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 409);
        }
    }

    public function completeOrder(Request $request, int $id): JsonResponse
    {
        try {
            $order = DB::transaction(function () use ($request, $id) {
                $lockedOrder = Order::whereKey($id)
                    ->where('driver_id', $request->user()->id)
                    ->lockForUpdate()
                    ->first();

                if (! $lockedOrder || $lockedOrder->status !== Order::STATUS_SHIPPING) {
                    throw new DomainException('Job aktif tidak ditemukan.');
                }

                $lockedOrder->status = Order::STATUS_COMPLETED;
                $lockedOrder->save();
                $lockedOrder->recordStatus($request->user(), 'Pesanan diterima Buyer.');

                return $lockedOrder;
            }, 3);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 409);
        }

        return response()->json(['success' => true, 'message' => 'Pengantaran selesai.', 'data' => $order]);
    }

    public function returnOrder(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['reason' => ['required', 'string', 'min:10', 'max:500']]);
        try {
            $returned = DB::transaction(function () use ($request, $id, $validated) {
                $lockedOrder = Order::whereKey($id)
                    ->where('driver_id', $request->user()->id)
                    ->lockForUpdate()
                    ->first();

                if (! $lockedOrder || $lockedOrder->status !== Order::STATUS_SHIPPING) {
                    throw new DomainException('Job aktif tidak ditemukan.');
                }

                return $this->orders->refund(
                    $lockedOrder,
                    $request->user(),
                    'Dikembalikan Driver: '.$validated['reason']
                );
            }, 3);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesanan dikembalikan. Saldo dan stok sudah dipulihkan.',
            'data' => $returned,
        ]);
    }

    private function serializeQuote(array $quote): array
    {
        return [
            'items' => collect($quote['items'])->map(fn ($line) => [
                'product_id' => $line['product']->id,
                'name' => $line['product']->name,
                'quantity' => $line['quantity'],
                'unit_price' => $line['unit_price'],
                'line_total' => $line['line_total'],
            ])->values(),
            'delivery_method' => $quote['delivery_method'],
            'subtotal' => $quote['subtotal'],
            'discount' => $quote['discount'] ? [
                'code' => $quote['discount']->code,
                'type' => $quote['discount']->type,
                'name' => $quote['discount']->name,
            ] : null,
            'discount_amount' => $quote['discount_amount'],
            'delivery_fee' => $quote['delivery_fee'],
            'tax_rate' => $quote['tax_rate'],
            'tax_amount' => $quote['tax_amount'],
            'total_amount' => $quote['total_amount'],
        ];
    }

    private function paginated($paginator): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }
}
