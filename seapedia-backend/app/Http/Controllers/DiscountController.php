<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DiscountController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Discount::query()->latest();
        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        $discounts = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $discounts->items(),
            'meta' => [
                'current_page' => $discounts->currentPage(),
                'last_page' => $discounts->lastPage(),
                'total' => $discounts->total(),
            ],
        ]);
    }

    public function show(Discount $discount): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $discount]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->merge(['code' => strtoupper(trim((string) $request->input('code')))]);

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:40', 'alpha_dash', 'unique:discounts,code'],
            'name' => ['required', 'string', 'max:120'],
            'type' => ['required', Rule::in(['voucher', 'promo'])],
            'calculation_type' => ['required', Rule::in(['percentage', 'fixed'])],
            'value' => ['required', 'numeric', 'gt:0'],
            'minimum_purchase' => ['nullable', 'numeric', 'min:0'],
            'maximum_discount' => ['nullable', 'numeric', 'gt:0'],
            'usage_limit' => ['nullable', 'integer', 'gt:0'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['required', 'date', 'after:now'],
        ]);

        if ($validated['calculation_type'] === 'percentage' && $validated['value'] > 100) {
            return response()->json([
                'success' => false,
                'message' => 'Diskon persentase tidak boleh lebih dari 100%.',
            ], 422);
        }

        $discount = Discount::create([
            ...$validated,
            'code' => strtoupper($validated['code']),
            'minimum_purchase' => $validated['minimum_purchase'] ?? 0,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => ucfirst($discount->type).' berhasil dibuat.',
            'data' => $discount,
        ], 201);
    }

    public function update(Request $request, Discount $discount): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'expires_at' => ['sometimes', 'date'],
            'usage_limit' => ['sometimes', 'nullable', 'integer', 'gt:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $discount->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Diskon berhasil diperbarui.',
            'data' => $discount->fresh(),
        ]);
    }
}
