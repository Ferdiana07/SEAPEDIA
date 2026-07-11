<?php
// File: app/Http/Controllers/StoreController.php
// Penjelasan: Controller untuk operasi Store (CRUD)

namespace App\Http\Controllers;

use App\Http\Requests\CreateStoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    // =================================================================
    // PUBLIC ENDPOINTS (Buyer/Guest)
    // =================================================================
    
    /**
     * GET /api/stores
     * Ambil semua toko aktif
     * 
     * Penjelasan:
     * Endpoint publik untuk melihat daftar toko.
     * Hanya toko yang is_active = true yang ditampilkan.
     * 
     * Query Parameters:
     * - search: string (pencarian nama toko)
     * - page: int (pagination)
     * - per_page: int (default: 12)
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $query = Store::with('user:id,name')  // Eager load seller info
                      ->active()              // Scope: is_active = true
                      ->withCount('products'); // Tambah field: products_count
        
        // Pencarian
        if ($search = request()->input('search')) {
            $query->search($search);
        }

        // Pagination
        $perPage = (int) request()->input('per_page', 12);
        $stores = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $stores->items(),
            'meta' => [
                'current_page' => $stores->currentPage(),
                'per_page' => $stores->perPage(),
                'total' => $stores->total(),
                'last_page' => $stores->lastPage(),
            ],
        ]);
    }
    
    /**
     * GET /api/stores/{id}
     * Ambil detail satu toko
     * 
     * Penjelasan:
     * Endpoint publik untuk melihat detail toko.
     * Include: info seller, produk aktif toko.
     * 
     * @param int $id Store ID
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $store = Store::with([
            'user:id,name,email',  // Info seller
            'products' => function ($query) {
                // ⭐ Hanya produk aktif
                $query->active()
                      ->inStock()
                      ->latest();
            }
        ])->find($id);
        
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }
        
        // Jika toko tidak aktif, hanya owner yang bisa lihat
        if (!$store->is_active && (!$this->user() || !$store->isOwnedBy($this->user()->id))) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }
    
    // =================================================================
    // SELLER ENDPOINTS (Authenticated Seller)
    // =================================================================
    
    /**
     * GET /api/stores/my
     * Ambil toko sendiri (untuk seller)
     * 
     * Penjelasan:
     * Endpoint untuk seller melihat toko mereka sendiri.
     * Include: semua produk (aktif & nonaktif).
     * 
     * @return JsonResponse
     */
    public function myStore(): JsonResponse
    {
        $user = $this->user();
        
        // Cek apakah user punya toko
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki toko',
            ], 404);
        }
        
        $store = Store::with([
            'products' => function ($query) {
                $query->latest();
            }
        ])->find($user->store->id);
        
        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }
    
    /**
     * POST /api/stores
     * Buat toko baru
     * 
     * Penjelasan:
     * Endpoint untuk membuat toko baru.
     * Hanya seller yang belum punya toko yang boleh mengakses.
     * 
     * Request Body:
     * {
     *   "name": "Dapur Enak",
     *   "description": "Masakan rumahan",
     *   "address": "Jl. Sehat No. 5",
     *   "phone": "02112345678"
     * }
     * 
     * @param CreateStoreRequest $request
     * @return JsonResponse
     */
    public function store(CreateStoreRequest $request): JsonResponse
    {
        // Data sudah tervalidasi, bisa langsung dipakai
        $validated = $request->validated();
        
        // Buat toko dengan user_id dari user yang login
        $store = Store::create([
            'user_id' => $this->user()->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'],
            'phone' => $validated['phone'],
            'logo_url' => $validated['logo_url'] ?? null,
            'is_active' => true,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil dibuat',
            'data' => $store,
        ], 201);
    }
    
    /**
     * PUT /api/stores/my
     * Update toko sendiri
     * 
     * @param UpdateStoreRequest $request
     * @return JsonResponse
     */
    public function update(UpdateStoreRequest $request): JsonResponse
    {
        $user = $this->user();
        
        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }
        
        // Update toko
        $user->store->update($request->validated());
        
        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil diupdate',
            'data' => $user->store->fresh(),
        ]);
    }
    
    /**
     * Helper: Get authenticated user
     */
    protected function user()
    {
        return auth()->user();
    }
}