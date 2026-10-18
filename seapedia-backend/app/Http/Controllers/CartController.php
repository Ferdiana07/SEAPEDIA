<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * ============================================================
     * INDEX
     * ============================================================
     * Ambil isi cart user
     *
     * Fungsi:
     * - Menampilkan semua item di keranjang
     * - Include info store dan total harga
     *
     * Relasi data:
     * - Cart milik User (1:1)
     * - Cart punya banyak CartItem (1:N)
     * - CartItem milik Product (N:1)
     * - Product milik Store (N:1)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ambil atau buat cart
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Ambil items dengan relasi product dan store
        $items = CartItem::where('cart_id', $cart->id)
            ->with(['product.store'])
            ->get();

        // Hitung total
        $total = $items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        // Ambil info store dari item pertama
        $store = $items->first()?->product->store;

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $items,
                'store' => $store ? [
                    'id' => $store->id,
                    'name' => $store->name,
                ] : null,
                'total' => $total,
                'total_items' => $items->sum('quantity'),
            ],
        ]);
    }

    /**
     * ============================================================
     * ADD ITEM
     * ============================================================
     * Tambah item ke cart
     *
     * Fungsi:
     * - Menambah produk ke keranjang
     * - Validasi single-store rule (cart hanya boleh dari 1 toko)
     * - Validasi stok
     *
     * Aturan Single-Store:
     * - Cart hanya boleh berisi produk dari 1 toko
     * - Jika toko berbeda, return error
     *
     * Validasi:
     * - product_id: required, exists
     * - quantity: optional, min 1
     */
    public function addItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
        ]);

        $user = $request->user();
        $quantity = $validated['quantity'] ?? 1;

        // Cek apakah user punya role buyer
        if (! $user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa menambahkan ke cart',
            ], 403);
        }

        try {
            $result = DB::transaction(function () use ($user, $validated, $quantity): array {
                $cart = Cart::firstOrCreate(['user_id' => $user->id]);
                $cart = Cart::whereKey($cart->id)->lockForUpdate()->firstOrFail();
                $cart->load('items.product');

                $product = Product::with('store')->whereKey($validated['product_id'])->lockForUpdate()->firstOrFail();
                if (! $product->is_active || ! $product->store?->is_active) {
                    throw new DomainException('Produk atau toko sedang tidak aktif.');
                }

                $firstStoreId = $cart->items->first()?->product?->store_id;
                if ($firstStoreId !== null && $firstStoreId !== $product->store_id) {
                    throw new DomainException('Cart hanya boleh berisi produk dari 1 toko yang sama. Selesaikan checkout atau kosongkan cart terlebih dahulu.');
                }

                $existingItem = CartItem::where('cart_id', $cart->id)
                    ->where('product_id', $product->id)
                    ->lockForUpdate()
                    ->first();
                $newQuantity = ($existingItem?->quantity ?? 0) + $quantity;
                if ($product->stock < $newQuantity) {
                    throw new DomainException('Stok tidak mencukupi untuk jumlah yang diminta.');
                }

                if ($existingItem) {
                    $existingItem->update(['quantity' => $newQuantity]);

                    return ['item' => $existingItem->fresh(), 'created' => false];
                }

                return ['item' => CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                ]), 'created' => true];
            }, 3);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 409);
        }

        return response()->json([
            'success' => true,
            'message' => $result['created'] ? 'Item berhasil ditambahkan ke cart' : 'Jumlah item di cart berhasil diupdate',
            'data' => $result['item']->load('product'),
        ], $result['created'] ? 201 : 200);
    }

    /**
     * ============================================================
     * UPDATE ITEM
     * ============================================================
     * Update jumlah item di cart
     *
     * Fungsi:
     * - Mengubah quantity item
     * - Jika quantity = 0, hapus item
     */
    public function updateItem(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $user = $request->user();

        $cart = Cart::where('user_id', $user->id)->first();
        if (! $cart) {
            return response()->json([
                'success' => false,
                'message' => 'Item tidak ditemukan',
            ], 404);
        }

        try {
            $item = DB::transaction(function () use ($cart, $id, $validated) {
                Cart::whereKey($cart->id)->lockForUpdate()->firstOrFail();
                $item = CartItem::where('cart_id', $cart->id)->whereKey($id)->lockForUpdate()->first();
                if (! $item) {
                    throw new DomainException('Item tidak ditemukan.');
                }
                if ($validated['quantity'] === 0) {
                    $item->delete();

                    return null;
                }

                $product = Product::whereKey($item->product_id)->lockForUpdate()->first();
                if (! $product || ! $product->is_active || $product->stock < $validated['quantity']) {
                    throw new DomainException('Produk tidak aktif atau stok tidak mencukupi.');
                }
                $item->update(['quantity' => $validated['quantity']]);

                return $item->fresh();
            }, 3);
        } catch (DomainException $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 409);
        }

        if (! $item) {
            return response()->json(['success' => true, 'message' => 'Item dihapus dari cart']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Jumlah item berhasil diupdate',
            'data' => $item->fresh()->load('product'),
        ]);
    }

    /**
     * ============================================================
     * REMOVE ITEM
     * ============================================================
     * Hapus item dari cart
     *
     * Fungsi:
     * - Menghapus satu item dari cart
     */
    public function removeItem(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $cart = Cart::where('user_id', $user->id)->first();
        if (! $cart) {
            return response()->json([
                'success' => false,
                'message' => 'Item tidak ditemukan',
            ], 404);
        }

        $removed = DB::transaction(function () use ($cart, $id): bool {
            Cart::whereKey($cart->id)->lockForUpdate()->firstOrFail();
            $item = CartItem::where('cart_id', $cart->id)->whereKey($id)->lockForUpdate()->first();
            if (! $item) {
                return false;
            }
            $item->delete();

            return true;
        }, 3);

        if (! $removed) {
            return response()->json(['success' => false, 'message' => 'Item tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil dihapus dari cart',
        ]);
    }

    /**
     * ============================================================
     * CLEAR CART
     * ============================================================
     * Kosongkan cart
     *
     * Fungsi:
     * - Menghapus semua item dari cart
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user();

        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            DB::transaction(function () use ($cart): void {
                $lockedCart = Cart::whereKey($cart->id)->lockForUpdate()->firstOrFail();
                $lockedCart->items()->delete();
            }, 3);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart berhasil dikosongkan',
        ]);
    }
}
