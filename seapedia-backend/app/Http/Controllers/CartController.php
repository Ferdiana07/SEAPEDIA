<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

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
        if (!$user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa menambahkan ke cart',
            ], 403);
        }

        // Ambil atau buat cart
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Load items dengan relasi untuk cek store
        $cart->load('items.product.store');

        // Ambil produk
        $product = Product::with('store')->findOrFail($validated['product_id']);

        // CEK SINGLE-STORE RULE
        if ($cart->items->isNotEmpty()) {
            $firstStoreId = $cart->items->first()->product->store_id;

            if ($firstStoreId !== $product->store_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart hanya boleh berisi produk dari 1 toko yang sama. Selesaikan checkout atau kosongkan cart terlebih dahulu.',
                ], 400);
            }
        }

        // Cek stok
        if ($product->stock < $quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
            ], 400);
        }

        // Cek apakah sudah ada di cart
        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existingItem) {
            // Update quantity
            $newQuantity = $existingItem->quantity + $quantity;

            if ($product->stock < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi untuk jumlah yang diminta',
                ], 400);
            }

            $existingItem->update(['quantity' => $newQuantity]);

            return response()->json([
                'success' => true,
                'message' => 'Jumlah item di cart berhasil diupdate',
                'data' => $existingItem->fresh()->load('product'),
            ]);
        }

        // Tambah item baru
        $item = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil ditambahkan ke cart',
            'data' => $item->load('product'),
        ], 201);
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

        // Cari item yang milik cart user ini
        $item = CartItem::whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item tidak ditemukan',
            ], 404);
        }

        // Jika quantity 0, hapus item
        if ($validated['quantity'] === 0) {
            $item->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item dihapus dari cart',
            ]);
        }

        // Cek stok
        if ($item->product->stock < $validated['quantity']) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi',
            ], 400);
        }

        $item->update(['quantity' => $validated['quantity']]);

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

        // Cari item yang milik cart user ini
        $item = CartItem::whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item tidak ditemukan',
            ], 404);
        }

        $item->delete();

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
            $cart->items()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart berhasil dikosongkan',
        ]);
    }
}
