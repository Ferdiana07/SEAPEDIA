<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Wallet;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * GET /api/admin/stats
     * Statistik keseluruhan platform untuk Admin Dashboard
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        // Hanya admin
        if (!$user->hasRole('admin')) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        $stats = [
            'total_users'    => User::count(),
            'total_products' => Product::where('is_active', true)->count(),
            'total_orders'   => Order::count(),
            'total_stores'   => Store::where('is_active', true)->count(),
            'total_revenue'  => Order::where('status', 'completed')->sum('total_amount'),
            'pending_orders' => Order::where('status', 'packaging')->count(),
        ];

        return response()->json([
            'success' => true,
            'data'    => $stats,
        ]);
    }

    /**
     * GET /api/admin/users
     * Daftar semua user beserta roles mereka
     */
    public function users(Request $request): JsonResponse
    {
        $user = $request->user();

        // Hanya admin
        if (!$user->hasRole('admin')) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        $users = User::with('roles')
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $users->items(),
            'meta'    => [
                'current_page' => $users->currentPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
                'last_page'    => $users->lastPage(),
            ],
        ]);
    }
}
