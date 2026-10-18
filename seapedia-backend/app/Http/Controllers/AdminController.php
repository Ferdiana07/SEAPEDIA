<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Services\MarketplaceOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct(private readonly MarketplaceOrderService $orders) {}

    public function stats(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => [
            'total_users' => User::count(),
            'total_products' => Product::where('is_active', true)->count(),
            'total_orders' => Order::count(),
            'total_stores' => Store::where('is_active', true)->count(),
            'completed_gmv' => (float) Order::where('status', Order::STATUS_COMPLETED)->sum('total_amount'),
            'pending_orders' => Order::whereIn('status', [Order::STATUS_PACKAGING, Order::STATUS_WAITING_SHIPPER])->count(),
            'active_deliveries' => Order::where('status', Order::STATUS_SHIPPING)->count(),
            'returned_orders' => Order::where('status', Order::STATUS_RETURNED)->count(),
            'active_discounts' => Discount::where('is_active', true)->where('expires_at', '>', now())->count(),
        ]]);
    }

    public function users(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $users = User::with('roles')
            ->when($validated['search'] ?? null, function ($query, string $search) {
                $query->where(function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function monitoring(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => [
            'recent_orders' => Order::with(['user:id,name', 'store:id,name', 'driver:id,name'])
                ->latest()->limit(8)->get(),
            'stores' => Store::withCount('products')->latest()->limit(8)->get(),
            'low_stock_products' => Product::with('store:id,name')->where('stock', '<=', 5)->orderBy('stock')->limit(8)->get(),
            'delivery_jobs' => Order::with(['store:id,name', 'driver:id,name'])
                ->whereIn('status', [Order::STATUS_WAITING_SHIPPER, Order::STATUS_SHIPPING])
                ->latest()->limit(8)->get(),
            'discounts' => Discount::latest()->limit(8)->get(),
        ]]);
    }

    public function simulateTime(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hours' => ['required', 'integer', 'min:1', 'max:720'],
        ]);

        $simulatedNow = now()->addHours($validated['hours']);
        $candidates = Order::whereNotIn('status', [Order::STATUS_COMPLETED, Order::STATUS_RETURNED])
            ->with('items')
            ->get()
            ->filter(function (Order $order) use ($simulatedNow) {
                $sla = Order::DELIVERY_SLA_HOURS[$order->delivery_method] ?? Order::DELIVERY_SLA_HOURS[Order::DELIVERY_REGULAR];

                return $order->updated_at->copy()->addHours($sla)->lte($simulatedNow);
            });

        $processed = [];
        foreach ($candidates as $order) {
            $returned = DB::transaction(function () use ($order, $request): ?Order {
                $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->first();
                if (! $lockedOrder || in_array($lockedOrder->status, [Order::STATUS_COMPLETED, Order::STATUS_RETURNED], true)) {
                    return null;
                }

                return $this->orders->refund(
                    $lockedOrder,
                    $request->user(),
                    "Auto-return karena melewati SLA {$lockedOrder->delivery_method}."
                );
            }, 3);
            if (! $returned) {
                continue;
            }
            $processed[] = [
                'id' => $returned->id,
                'order_number' => $returned->order_number,
                'status' => $returned->status,
                'refunded_amount' => (float) $returned->total_amount,
            ];
        }

        return response()->json(['success' => true, 'message' => count($processed).' pesanan overdue diproses.', 'data' => [
            'simulated_now' => $simulatedNow->toIso8601String(),
            'processed' => $processed,
        ]]);
    }
}
