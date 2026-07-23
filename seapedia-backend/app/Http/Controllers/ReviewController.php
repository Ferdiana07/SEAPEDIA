<?php
// File: app/Http/Controllers/ReviewController.php
// Penjelasan: Controller untuk review produk.
// Aturan COMPFEST (Level 1):
//  - Guest & user boleh membaca review publik.
//  - Hanya user LOGIN yang boleh membuat review (1 user × 1 produk = 1 review).

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * ============================================================
     * INDEX - PUBLIK
     * ============================================================
     * Ambil semua review untuk satu produk.
     *
     * Endpoint: GET /api/products/{product}/reviews
     * Akses: Guest + User (tidak butuh login)
     * Response: list review + ringkasan rata-rata rating.
     */
    public function index(Request $request, int $productId): JsonResponse
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $reviews = Review::with('user:id,name')
            ->where('product_id', $productId)
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $reviews->items(),
            'summary' => [
                'average_rating' => round((float) $reviews->avg('rating'), 1),
                'total_reviews' => $reviews->total(),
            ],
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    /**
     * ============================================================
     * STORE - BUYER ONLY
     * ============================================================
     * Buyer membuat review baru untuk produk.
     *
     * Endpoint: POST /api/products/{product}/reviews
     * Akses: Authenticated (semua role boleh, sesuai aturan COMPFEST
     *        yang tidak membatasi role tertentu)
     *
     * Validasi:
     *  - rating 1-5
     *  - comment opsional (max 1000 karakter)
     *
     * Aturan:
     *  - 1 user hanya boleh review 1 produk sekali (unique constraint).
     *    Kalau sudah pernah, gunakan PUT untuk update.
     */
    public function store(Request $request, int $productId): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        // Cegah double review (1 user × 1 produk = 1 review)
        $existing = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Kamu sudah pernah mereview produk ini. Gunakan update untuk mengubah.',
            ], 409);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $productId,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        $review->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil dikirim!',
            'data' => $review,
        ], 201);
    }

    /**
     * ============================================================
     * UPDATE - PEMILIK REVIEW
     * ============================================================
     * Update review yang sudah dibuat user.
     *
     * Endpoint: PUT /api/reviews/{review}
     * Akses: Authenticated, hanya pemilik review
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review tidak ditemukan',
            ], 404);
        }

        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Kamu tidak bisa mengubah review orang lain',
            ], 403);
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $review->update($validated);
        $review->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil diperbarui',
            'data' => $review,
        ]);
    }

    /**
     * ============================================================
     * DESTROY - PEMILIK REVIEW
     * ============================================================
     * Hapus review milik sendiri.
     *
     * Endpoint: DELETE /api/reviews/{review}
     * Akses: Authenticated, hanya pemilik review
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review tidak ditemukan',
            ], 404);
        }

        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Kamu tidak bisa menghapus review orang lain',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review berhasil dihapus',
        ]);
    }
}
