<?php

// File: app/Http/Controllers/ProductController.php
// Penjelasan: Controller untuk operasi Product (CRUD)

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Services\ProductImageStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class ProductController extends Controller
{
    public function __construct(private readonly ProductImageStorage $productImages) {}

    // =================================================================
    // PUBLIC ENDPOINTS (Buyer/Guest)
    // =================================================================

    /**
     * GET /api/products
     * Ambil semua produk aktif
     *
     * Penjelasan:
     * Endpoint publik untuk listing produk.
     * Hanya produk aktif yang ditampilkan.
     * Include: info toko.
     *
     * Query Parameters:
     * - search: string (pencarian nama)
     * - store_id: int (filter by toko)
     * - min_price: int (harga minimum)
     * - max_price: int (harga maksimum)
     * - page: int
     * - per_page: int
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:200'],
            'category' => ['nullable', 'string', 'max:80'],
            'store_id' => ['nullable', 'integer', 'min:1'],
            'min_price' => ['nullable', 'integer', 'min:0', 'max:1000000000'],
            'max_price' => ['nullable', 'integer', 'min:0', 'max:1000000000', ...($request->filled('min_price') ? ['gte:min_price'] : [])],
            'sort_by' => ['nullable', 'string', 'in:price,name,created_at'],
            'sort_order' => ['nullable', 'string', 'in:asc,desc'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Product::with('store:id,name,logo_url')  // Eager load toko
            ->whereHas('store', fn ($store) => $store->active())
            ->active()                            // Hanya aktif
            ->inStock();                         // Hanya ada stok

        // Filter by category (kolom category di DB)
        if ($category = $request->input('category')) {
            $query->byCategory($category);
        }

        // Pencarian teks (nama atau deskripsi)
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Filter by store
        if ($storeId = $request->input('store_id')) {
            $query->where('store_id', $storeId);
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (int) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (int) $request->input('max_price'));
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $allowedSorts = ['price', 'name', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        // Pagination
        $perPage = max(1, min((int) $request->input('per_page', 12), 100));
        $products = $query->orderBy('id', $sortOrder === 'asc' ? 'asc' : 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/products/{id}
     * Ambil detail satu produk
     *
     * @param  int  $id  Product ID
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::with([
            'store:id,user_id,name,description,address,phone,is_active',
            'store.user:id,name',  // Info seller
            'reviews.user:id,name', // Reviews + nama reviewer (BAB 9)
        ])->find($id);

        if (! $product || ! $product->is_active || ! $product->store?->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    // =================================================================
    // SELLER ENDPOINTS (Authenticated Seller)
    // =================================================================

    /**
     * GET /api/seller/products
     * Ambil semua produk milik seller
     *
     * Penjelasan:
     * Endpoint untuk seller melihat produk mereka sendiri.
     * Include: semua produk (aktif & nonaktif).
     */
    public function myProducts(): JsonResponse
    {
        $user = auth()->user();

        // Cek apakah punya toko
        if (! $user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 404);
        }

        $products = Product::where('store_id', $user->store->id)
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/seller/products/stats
     * Statistik produk seller
     */
    public function myProductsStats(): JsonResponse
    {
        $user = auth()->user();

        if (! $user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 404);
        }

        $storeId = $user->store->id;

        $stats = [
            'total_products' => Product::where('store_id', $storeId)->count(),
            'active_products' => Product::where('store_id', $storeId)->active()->count(),
            'out_of_stock' => Product::where('store_id', $storeId)->where('stock', 0)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * POST /api/seller/products
     * Tambah produk baru
     *
     * Request Body:
     * {
     *   "name": "Reel Spinning Laut Anti-Korosi",
     *   "description": "Reel bersegel untuk penggunaan air asin",
     *   "price": 25000,
     *   "stock": 100,
     *   "image": <JPG, PNG, atau WebP maksimal 2 MB>
     * }
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $user = auth()->user();

        // Pastikan punya toko
        if (! $user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus membuat toko terlebih dahulu',
            ], 400);
        }

        $validated = $request->validated();

        $storedImage = null;
        if ($request->hasFile('image')) {
            $storedImage = $this->productImages->store($request->file('image'), $user->store->id);
        }

        try {
            // Buat produk dengan store_id dari toko seller.
            $product = Product::create([
                'store_id' => $user->store->id,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'category' => $validated['category'],
                'price' => $validated['price'],
                'stock' => $validated['stock'],
                'image_url' => $storedImage ? null : ($validated['image_url'] ?? null),
                'image_path' => $storedImage['path'] ?? null,
                'image_disk' => $storedImage['disk'] ?? null,
                'is_active' => true,
            ]);
        } catch (Throwable $exception) {
            if ($storedImage) {
                $this->productImages->delete($storedImage['path'], $storedImage['disk']);
            }

            throw $exception;
        }

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan',
            'data' => $product,
        ], 201);
    }

    /**
     * PUT /api/seller/products/{id}
     * Update produk
     *
     * @param  int  $id  Product ID
     */
    public function update(ProductRequest $request, int $id): JsonResponse
    {
        $user = auth()->user();

        $product = Product::find($id);

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // ⭐ SECURITY: Pastikan produk milik seller ini
        if (! $product->isOwnedByUser($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke produk ini',
            ], 403);
        }

        $validated = $request->validated();
        unset($validated['image']);

        $storedImage = null;
        if ($request->hasFile('image')) {
            $storedImage = $this->productImages->store($request->file('image'), $user->store->id);
            $validated['image_url'] = null;
            $validated['image_path'] = $storedImage['path'];
            $validated['image_disk'] = $storedImage['disk'];
        }

        try {
            $result = DB::transaction(function () use ($id, $user, $validated): ?array {
                $lockedProduct = Product::whereKey($id)->lockForUpdate()->first();
                if (! $lockedProduct || ! $lockedProduct->isOwnedByUser($user->id)) {
                    return null;
                }

                $previousImage = [
                    'path' => $lockedProduct->image_path,
                    'disk' => $lockedProduct->image_disk,
                ];
                $lockedProduct->update($validated);

                return ['product' => $lockedProduct, 'previous_image' => $previousImage];
            }, 3);
        } catch (Throwable $exception) {
            if ($storedImage) {
                $this->productImages->delete($storedImage['path'], $storedImage['disk']);
            }

            throw $exception;
        }

        if (! $result) {
            if ($storedImage) {
                $this->productImages->delete($storedImage['path'], $storedImage['disk']);
            }

            return response()->json(['success' => false, 'message' => 'Produk tidak ditemukan atau akses berubah.'], 409);
        }

        if ($storedImage) {
            $this->productImages->delete(
                $result['previous_image']['path'],
                $result['previous_image']['disk'],
            );
        }

        /** @var Product $product */
        $product = $result['product'];

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diupdate',
            'data' => $product->fresh(),
        ]);
    }

    /**
     * DELETE /api/seller/products/{id}
     * Hapus produk
     *
     * Penjelasan:
     * Menggunakan soft delete (is_active = false).
     * Bukan hard delete karena mungkin ada order yang reference.
     *
     * @param  int  $id  Product ID
     */
    public function destroy(int $id): JsonResponse
    {
        $user = auth()->user();

        $product = Product::find($id);

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // ⭐ SECURITY: Cek kepemilikan
        if (! $product->isOwnedByUser($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke produk ini',
            ], 403);
        }

        $deactivated = DB::transaction(function () use ($id, $user): bool {
            $lockedProduct = Product::whereKey($id)->lockForUpdate()->first();
            if (! $lockedProduct || ! $lockedProduct->isOwnedByUser($user->id)) {
                return false;
            }
            $lockedProduct->update(['is_active' => false]);

            return true;
        }, 3);

        if (! $deactivated) {
            return response()->json(['success' => false, 'message' => 'Produk tidak ditemukan atau akses berubah.'], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}
