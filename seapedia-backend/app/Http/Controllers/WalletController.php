<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WalletController extends Controller
{
    /**
     * ============================================================
     * GET WALLET
     * ============================================================
     * Ambil data wallet user yang sedang login
     *
     * Fungsi:
     * - Setiap user memiliki 1 wallet
     * - Wallet otomatis dibuat saat register (via AuthController)
     * - Berfungsi untuk cek saldo dan formatted balance
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ambil atau buat wallet jika belum ada
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $wallet->id,
                'balance' => $wallet->balance,
                'formatted_balance' => $wallet->formatted_balance,
            ],
        ]);
    }

    /**
     * ============================================================
     * GET TRANSACTIONS
     * ============================================================
     * Ambil riwayat transaksi wallet user
     *
     * Fungsi:
     * - Menampilkan history semua transaksi
     * - Sudah include pagination untuk performance
     * - Diurutkan dari yang terbaru
     */
    public function transactions(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ambil wallet user
        $wallet = Wallet::where('user_id', $user->id)->first();

        // Jika wallet tidak ada, return empty
        if (!$wallet) {
            return response()->json([
                'success' => true,
                'data' => [],
                'meta' => [
                    'current_page' => 1,
                    'per_page' => 20,
                    'total' => 0,
                ],
            ]);
        }

        // Ambil transaksi dengan pagination
        $transactions = Transaction::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
                'last_page' => $transactions->lastPage(),
            ],
        ]);
    }

    /**
     * ============================================================
     * TOP UP
     * ============================================================
     * Top up saldo wallet
     *
     * Fungsi:
     * - Menambah saldo wallet
     * - Membuat record transaksi
     * - Hanya buyer yang bisa top up
     *
     * Alur:
     * 1. Validasi input (amount harus numeric, min 1000, max 100jt)
     * 2. Cek apakah user punya role buyer
     * 3. Top up menggunakan method di Wallet model
     */
    public function topUp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000', 'max:100000000'],
        ]);

        $user = $request->user();

        // Cek apakah user punya role buyer
        if (!$user->hasRole('buyer')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya buyer yang bisa top up wallet',
            ], 403);
        }

        // Ambil atau buat wallet
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        // Top up menggunakan method dari Wallet model
        $transaction = $wallet->credit(
            $validated['amount'],
            'Top up saldo'
        );

        return response()->json([
            'success' => true,
            'message' => 'Top up berhasil!',
            'data' => [
                'balance' => $wallet->fresh()->balance,
                'transaction' => [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at,
                ],
            ],
        ]);
    }
}
