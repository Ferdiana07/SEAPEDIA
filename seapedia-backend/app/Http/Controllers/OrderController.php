<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Wallet;
use App\Models\Address;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * ============================================================
     * INDEX - BUYER
     * ============================================================
     * Ambil semua pesanan buyer
     *
     * Fungsi:
     * - Buyer melihat semua pesanan yang dibuat
     * - Include relasi store, items, driver
     * - Diurutkan dari yang terbaru
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $orders = Order::where('user_id', $user->id)
            ->with(['store', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage(),
            ],
        ]);
    }

    /**
     * ============================================================
     * SHOW
     * ============================================================
     * Ambil detail satu pesanan
     *
     * Fungsi:
     * - Menampilkan detail pesanan lengkap
     * - Include store, driver, items
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['store', 'driver', 'items.product'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * ============================================================
     * STORE - CHECKOUT
     * ============================================================
     * Buat pesanan baru (checkout)
     *
     * Fungsi:
     * - Membuat pesanan dari cart
     * - Mendebit wallet
     * - Mengurangi stok produk
     * - Membuat record transaksi
     *
     * Alur:
     * 1. Validasi input
     * 2. Cek alamat ada dan milik user
     * 3. Hitung total dan validasi stok
     * 4. Cek saldo wallet cukup
     * 5. DB Transaction:
     *    - Debit wallet
     *    - Insert transaction
     *    - Insert order
     *    - Insert order items
     *    - Kurangi stock
     *    - Hapus cart items
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address_id' => ['required', 'integer', 'exists:addresses,id'],
        ]);

        $user = $request->user();

        // Cek apakah user punya role buyer
        if (!$user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa checkout',
            ], 403);
        }

        // Ambil alamat
        $address = Address::where('id', $validated['address_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }

        // Ambil cart
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart kosong',
            ], 400);
        }

        // Load items dengan relasi
        $cart->load('items.product.store');

        // Validasi single-store
        $storeId = $cart->items->first()->product->store_id;
        foreach ($cart->items as $item) {
            if ($item->product->store_id !== $storeId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Checkout hanya boleh untuk produk dari 1 toko',
                ], 400);
            }
        }

        // Hitung total
        $total = 0;
        $products = [];
        foreach ($cart->items as $item) {
            $product = $item->product;

            // Cek stok
            if ($product->stock < $item->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Stok {$product->name} tidak mencukupi",
                ], 400);
            }

            $total += $product->price * $item->quantity;
            $products[] = [
                'item' => $item,
                'product' => $product,
            ];
        }

        // Ambil wallet
        $wallet = Wallet::where('user_id', $user->id)->first();

        if (!$wallet) {
            return response()->json([
                'success' => false,
                'message' => 'Wallet tidak ditemukan',
            ], 400);
        }

        // Cek saldo
        if ($wallet->balance < $total) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo wallet tidak mencukupi',
                'errors' => [
                    'balance' => ['Saldo Anda: Rp ' . number_format($wallet->balance, 0, ',', '.')],
                ],
            ], 400);
        }

        // Generate order number
        $orderNumber = Order::generateOrderNumber();

        // DATABASE TRANSACTION
        try {
            DB::beginTransaction();

            // 1. Debit wallet
            $wallet->decrement('balance', $total);

            // 2. Create transaction
            Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => Transaction::TYPE_PURCHASE,
                'amount' => -$total,
                'order_id' => null, // Akan diupdate
                'description' => "Pembelian order #{$orderNumber}",
            ]);

            // 3. Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'store_id' => $storeId,
                'status' => Order::STATUS_PACKAGING,
                'total_amount' => $total,
                'shipping_address' => "{$address->recipient_name}\n{$address->full_address}\n{$address->phone}",
            ]);

            // 4. Create order items & reduce stock
            foreach ($products as $data) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $data['product']->id,
                    'quantity' => $data['item']->quantity,
                    'price_at_purchase' => $data['product']->price,
                ]);

                // Reduce stock
                $data['product']->decrement('stock', $data['item']->quantity);
            }

            // 5. Hapus cart items
            $cart->items()->delete();

            // Update transaction dengan order_id
            Transaction::where('wallet_id', $wallet->id)
                ->whereNull('order_id')
                ->where('description', 'LIKE', "%{$orderNumber}%")
                ->update(['order_id' => $order->id]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat!',
                'data' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'shipping_address' => $order->shipping_address,
                    'new_balance' => $wallet->fresh()->balance,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat pesanan',
            ], 500);
        }
    }

    /**
     * ============================================================
     * CANCEL - BUYER
     * ============================================================
     * Buyer membatalkan pesanan
     *
     * Fungsi:
     * - Membatalkan pesanan yang belum dikirim
     * - Refund ke wallet
     * - Restore stock
     *
     * Aturan:
     * - Hanya bisa batalkan jika status packaging atau waiting_shipper
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }

        if (!$order->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak dapat dibatalkan',
            ], 400);
        }

        // Refund ke wallet
        $wallet = Wallet::where('user_id', $user->id)->first();

        if ($wallet) {
            $wallet->refund(
                $order->total_amount,
                $order->order_number,
                "Refund pembatalan order #{$order->order_number}"
            );
        }

        // Restore stock
        foreach ($order->items as $item) {
            $item->product->increment('stock', $item->quantity);
        }

        // Update status
        $order->update(['status' => Order::STATUS_RETURNED]);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibatalkan. Saldo akan dikembalikan.',
            'data' => [
                'status' => $order->status,
                'refunded_amount' => $order->total_amount,
                'new_balance' => $wallet?->fresh()->balance,
            ],
        ]);
    }

    /**
     * ============================================================
     * SELLER: ORDER LIST
     * ============================================================
     * Ambil pesanan masuk untuk seller
     */
    public function sellerOrders(Request $request): JsonResponse
    {
        $user = $request->user();

        // Cek apakah user punya store
        $store = $user->store;

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 400);
        }

        $orders = Order::where('store_id', $store->id)
            ->with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * ============================================================
     * SELLER: UPDATE STATUS
     * ============================================================
     * Seller mengupdate status pesanan
     *
     * Fungsi:
     * - Seller mengkonfirmasi pesanan sudah dikemas
     * - Mengubah status dari packaging ke waiting_shipper
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:packaging,waiting_shipper'],
        ]);

        $user = $request->user();

        $order = Order::where('id', $id)
            ->whereHas('store', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan',
            ], 404);
        }

        // Validasi status transition
        if ($order->status === Order::STATUS_PACKAGING && $validated['status'] === 'waiting_shipper') {
            $order->update(['status' => Order::STATUS_WAITING_SHIPPER]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Status tidak valid untuk transition ini',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diupdate',
            'data' => [
                'id' => $order->id,
                'status' => $order->status,
            ],
        ]);
    }

    /**
     * ============================================================
     * DRIVER: ORDER LIST
     * ============================================================
     * Ambil pesanan yang bisa diambil driver
     */
    public function driverOrders(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ambil pesanan waiting_shipper yang belum punya driver
        $orders = Order::where('status', Order::STATUS_WAITING_SHIPPER)
            ->whereNull('driver_id')
            ->with(['user', 'store', 'items.product'])
            ->orderBy('created_at', 'asc') // FIFO
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * ============================================================
     * DRIVER: PICKUP ORDER
     * ============================================================
     * Driver mengambil pesanan
     */
    public function pickupOrder(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->hasRole('driver')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya driver yang bisa mengambil pesanan',
            ], 403);
        }

        $order = Order::where('id', $id)
            ->where('status', Order::STATUS_WAITING_SHIPPER)
            ->whereNull('driver_id')
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan atau sudah diambil',
            ], 404);
        }

        $order->update([
            'driver_id' => $user->id,
            'status' => Order::STATUS_SHIPPING,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil diambil!',
            'data' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'shipping_address' => $order->shipping_address,
            ],
        ]);
    }

    /**
     * ============================================================
     * DRIVER: COMPLETE ORDER
     * ============================================================
     * Driver menyelesaikan pesanan (barang terkirim ke buyer).
     * Status: shipping -> completed
     */
    public function completeOrder(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->hasRole('driver')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya driver yang bisa menyelesaikan pesanan',
            ], 403);
        }

        $order = Order::where('id', $id)
            ->where('driver_id', $user->id)
            ->where('status', Order::STATUS_SHIPPING)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan atau bukan tanggung jawab kamu',
            ], 404);
        }

        $order->update(['status' => Order::STATUS_COMPLETED]);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil diselesaikan!',
            'data' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
            ],
        ]);
    }

    /**
     * ============================================================
     * DRIVER: RETURN ORDER (BAB 9)
     * ============================================================
     * Driver menandai pesanan gagal diantar (misal: alamat salah,
     * buyer tidak ditemukan). Status: shipping -> returned.
     * Stok produk akan di-restore agar bisa dijual lagi.
     */
    public function returnOrder(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->hasRole('driver')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya driver yang bisa mengembalikan pesanan',
            ], 403);
        }

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $order = Order::where('id', $id)
            ->where('driver_id', $user->id)
            ->where('status', Order::STATUS_SHIPPING)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan atau bukan tanggung jawab kamu',
            ], 404);
        }

        DB::beginTransaction();
        try {
            // Kembalikan stok produk
            foreach ($order->items as $item) {
                $item->product->increment('stock', $item->quantity);
            }

            // Kembalikan saldo buyer (refund)
            $buyer = $order->user;
            $wallet = Wallet::where('user_id', $buyer->id)->first();

            if ($wallet) {
                $wallet->refund(
                    $order->total_amount,
                    $order->order_number,
                    "Refund order #{$order->order_number} dikembalikan driver: {$validated['reason']}"
                );
            }

            $order->update([
                'status' => Order::STATUS_RETURNED,
                'cancellation_reason' => "Dikembalikan driver: {$validated['reason']}",
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan dikembalikan. Stok direstore & saldo buyer direfund.',
                'data' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'reason' => $validated['reason'],
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengembalikan pesanan',
            ], 500);
        }
    }
}
