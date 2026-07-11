<?php
// File: app/Http/Controllers/ProductController.php
// Penjelasan: Controller untuk operasi Product (CRUD)

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
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
     * 
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('store:id,name,logo_url')  // Eager load toko
                      ->active()                            // Hanya aktif
                      ->inStock();                         // Hanya ada stok
        
        // Pencarian
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Filter by store
        if ($storeId = $request->input('store_id')) {
            $query->where('store_id', $storeId);
        }

        // Filter by price range
        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', (int) $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', (int) $maxPrice);
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
        $perPage = (int) $request->input('per_page', 12);
        $products = $query->paginate($perPage);
        
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
     * @param int $id Product ID
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::with([
            'store:id,name,description,address,phone',
            'store.user:id,name'  // Info seller
        ])->find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }
        
        // Jika produk tidak aktif, hanya owner yang bisa lihat
        if (!$product->is_active) {
            $user = auth()->user();
            if (!$user || !$product->isOwnedByUser($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produk tidak ditemukan',
                ], 404);
            }
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
     * 
     * @return JsonResponse
     */
    public function myProducts(): JsonResponse
    {
        $user = auth()->user();
        
        // Cek apakah punya toko
        if (!$user->store) {
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
     * 
     * @return JsonResponse
     */
    public function myProductsStats(): JsonResponse
    {
        $user = auth()->user();
        
        if (!$user->store) {
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
     *   "name": "Nasi Goreng Spesial",
     *   "description": "Nasi goreng dengan telur dan ayam",
     *   "price": 25000,
     *   "stock": 100,
     *   "image_url": "https://..."
     * }
     * 
     * @param ProductRequest $request
     * @return JsonResponse
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $user = auth()->user();
        
        // Pastikan punya toko
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus membuat toko terlebih dahulu',
            ], 400);
        }
        
        $validated = $request->validated();
        
        // Buat produk dengan store_id dari toko seller
        $product = Product::create([
            'store_id' => $user->store->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'image_url' => $validated['image_url'] ?? null,
            'is_active' => true,
        ]);
        
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
     * @param ProductRequest $request
     * @param int $id Product ID
     * @return JsonResponse
     */
    public function update(ProductRequest $request, int $id): JsonResponse
    {
        $user = auth()->user();
        
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }
        
        // ⭐ SECURITY: Pastikan produk milik seller ini
        if (!$product->isOwnedByUser($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke produk ini',
            ], 403);
        }
        
        $validated = $request->validated();
        $product->update($validated);
        
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
     * @param int $id Product ID
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $user = auth()->user();
        
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }
        
        // ⭐ SECURITY: Cek kepemilikan
        if (!$product->isOwnedByUser($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke produk ini',
            ], 403);
        }
        
        // Soft delete: set is_active = false
        $product->update(['is_active' => false]);
        
        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus',
        ]);
    }
}