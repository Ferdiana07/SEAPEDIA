<?php

namespace App\Http\Controllers;

use App\Models\ApplicationReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reviews = ApplicationReview::query()
            ->where('is_published', true)
            ->latest()
            ->paginate(max(1, min((int) $request->input('per_page', 8), 30)));

        return response()->json([
            'success' => true,
            'data' => $reviews->items(),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reviewer_name' => ['required', 'string', 'min:2', 'max:100'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        $review = ApplicationReview::create([
            ...$validated,
            'user_id' => $request->user()?->id,
            'is_published' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih. Ulasanmu sudah diterbitkan.',
            'data' => $review,
        ], 201);
    }
}
