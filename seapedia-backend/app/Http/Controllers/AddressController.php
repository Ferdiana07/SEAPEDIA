<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    /**
     * ============================================================
     * INDEX
     * ============================================================
     * Ambil semua alamat user
     *
     * Fungsi:
     * - Menampilkan semua alamat yang dimiliki user
     * - Diurutkan: default dulu, lalu terbaru
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ambil alamat user, urutkan: default dulu, terbaru
        $addresses = Address::where('user_id', $user->id)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $addresses,
        ]);
    }

    /**
     * ============================================================
     * STORE
     * ============================================================
     * Buat alamat baru
     *
     * Fungsi:
     * - Menambah alamat pengiriman baru
     * - Jika alamat pertama, otomatis jadi default
     * - Jika is_default=true, reset alamat lain
     *
     * Validasi:
     * - label: required, string, max 50
     * - recipient_name: required, string, max 255
     * - phone: required, string, max 20
     * - full_address: required, text
     * - is_default: optional, boolean
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:50'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'full_address' => ['required', 'string'],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();
        $validated['user_id'] = $user->id;

        $address = DB::transaction(function () use ($user, $validated): Address {
            User::whereKey($user->id)->lockForUpdate()->firstOrFail();

            if ($validated['is_default'] ?? false) {
                Address::where('user_id', $user->id)->update(['is_default' => false]);
            }

            if (! Address::where('user_id', $user->id)->exists()) {
                $validated['is_default'] = true;
            }

            return Address::create($validated);
        }, 3);

        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil ditambahkan',
            'data' => $address,
        ], 201);
    }

    /**
     * ============================================================
     * SHOW
     * ============================================================
     * Ambil detail satu alamat
     *
     * Fungsi:
     * - Menampilkan detail alamat berdasarkan ID
     * - Hanya bisa dilihat oleh pemilik
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $address = Address::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (! $address) {
            return response()->json([
                'success' => false,
                'message' => 'Alamat tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $address,
        ]);
    }

    /**
     * ============================================================
     * UPDATE
     * ============================================================
     * Update alamat
     *
     * Fungsi:
     * - Mengubah data alamat
     * - Jika is_default=true, reset alamat lain
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'label' => ['sometimes', 'string', 'max:50'],
            'recipient_name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'full_address' => ['sometimes', 'string'],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();

        $address = DB::transaction(function () use ($user, $id, $validated): ?Address {
            User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $address = Address::whereKey($id)->where('user_id', $user->id)->lockForUpdate()->first();
            if (! $address) {
                return null;
            }

            if ($validated['is_default'] ?? false) {
                Address::where('user_id', $user->id)->where('id', '!=', $id)->update(['is_default' => false]);
            }
            $address->update($validated);

            return $address;
        }, 3);

        if (! $address) {
            return response()->json(['success' => false, 'message' => 'Alamat tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil diupdate',
            'data' => $address->fresh(),
        ]);
    }

    /**
     * ============================================================
     * DESTROY
     * ============================================================
     * Hapus alamat
     *
     * Fungsi:
     * - Menghapus alamat
     * - Jika yang dihapus adalah default, alamat pertama jadi default
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $deleted = DB::transaction(function () use ($user, $id): bool {
            User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $address = Address::whereKey($id)->where('user_id', $user->id)->lockForUpdate()->first();
            if (! $address) {
                return false;
            }

            $wasDefault = $address->is_default;
            $address->delete();
            if ($wasDefault) {
                Address::where('user_id', $user->id)->oldest('id')->first()?->update(['is_default' => true]);
            }

            return true;
        }, 3);

        if (! $deleted) {
            return response()->json(['success' => false, 'message' => 'Alamat tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil dihapus',
        ]);
    }

    /**
     * ============================================================
     * SET DEFAULT
     * ============================================================
     * Set alamat sebagai default
     *
     * Fungsi:
     * - Mengubah alamat default
     * - Reset default alamat lain
     */
    public function setDefault(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $address = DB::transaction(function () use ($user, $id): ?Address {
            User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $address = Address::whereKey($id)->where('user_id', $user->id)->lockForUpdate()->first();
            if (! $address) {
                return null;
            }
            Address::where('user_id', $user->id)->where('id', '!=', $id)->update(['is_default' => false]);
            $address->update(['is_default' => true]);

            return $address;
        }, 3);

        if (! $address) {
            return response()->json(['success' => false, 'message' => 'Alamat tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Alamat default berhasil diubah',
            'data' => $address->fresh(),
        ]);
    }
}
