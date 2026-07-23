<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * ============================================================
     * REGISTER
     * ============================================================
     * Mendaftarkan user baru
     *
     * Request: { name, email, password, password_confirmation }
     * Response: { user, message }
     */
    public function register(Request $request): JsonResponse
    {
        // Validasi input
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        // Buat user baru
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Buat wallet otomatis untuk user baru
        Wallet::create([
            'user_id' => $user->id,
            'balance' => 0,
        ]);

        // Buat role buyer default dan aktifkan
        $user->roles()->create([
            'role' => 'buyer',
            'is_active' => true,
        ]);

        // Return success (user harus login dulu untuk dapat token)
        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil! Silakan login.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }

    /**
     * ============================================================
     * LOGIN
     * ============================================================
     * Login user dan generate token
     *
     * Request: { email, password }
     * Response: { user, token, message }
     */
    public function login(Request $request): JsonResponse
    {
        // Validasi input
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Cek credentials
        if (!Auth::attempt($validated)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        // Ambil user yang login
        $user = Auth::user();

        // Hapus token lama (optional, bisa dimulti-device)
        $user->tokens()->delete();

        // Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'user' => $this->getUserWithRoles($user),
            'token' => $token,
        ]);
    }

    /**
     * ============================================================
     * LOGOUT
     * ============================================================
     * Logout user dan invalidasi token
     *
     * Request: (token required)
     * Response: { message }
     */
    public function logout(Request $request): JsonResponse
    {
        // Hapus token user saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil!',
        ]);
    }

    /**
     * ============================================================
     * ME
     * ============================================================
     * Get data user yang sedang login
     *
     * Request: (token required)
     * Response: { user }
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => $this->getUserWithRoles($user),
        ]);
    }

    /**
     * ============================================================
     * SELECT ROLE
     * ============================================================
     * Memilih role aktif
     *
     * Request: { role: 'buyer' | 'seller' | 'driver' }
     * Response: { user, message }
     */
    public function selectRole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:buyer,seller,driver'],
        ]);

        $user = $request->user();
        $role = $validated['role'];

        // Cek apakah user punya role ini
        if (!$user->hasRole($role)) {
            return response()->json([
                'success' => false,
                'message' => "Kamu tidak memiliki role '$role'. Dapatkan role ini terlebih dahulu.",
            ], 403);
        }

        // Aktifkan role yang dipilih
        $user->activateRole($role);

        return response()->json([
            'success' => true,
            'message' => "Role '$role' berhasil diaktifkan!",
            'user' => $this->getUserWithRoles($user->fresh()),
        ]);
    }

    /**
     * ============================================================
     * ASSIGN ROLE
     * ============================================================
     * Memberikan role baru ke user
     *
     * Request: { role: 'buyer' | 'seller' | 'driver' }
     * Response: { user, message }
     */
    public function assignRole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'in:buyer,seller,driver'],
        ]);

        $user = $request->user();
        $role = $validated['role'];

        // Cek apakah sudah punya role ini
        if ($user->hasRole($role)) {
            return response()->json([
                'success' => false,
                'message' => "Kamu sudah memiliki role '$role'.",
            ], 400);
        }

        // Cek apakah mencoba assign admin
        if ($role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat assign role admin!',
            ], 403);
        }

        // Buat role baru
        $user->roles()->create([
            'role'      => $role,
            'is_active' => false, // Default tidak aktif
        ]);

        return response()->json([
            'success' => true,
            'message' => "Role '$role' berhasil ditambahkan!",
            'user'    => $this->getUserWithRoles($user->fresh()),
        ]);
    }

    /**
     * ============================================================
     * UPDATE PROFILE
     * ============================================================
     * Update data profil user (name, phone, bio, birth_date, gender, avatar_url)
     *
     * Request: { name, phone, bio, birth_date, gender, avatar_url }
     * Response: { user, message }
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'       => ['sometimes', 'string', 'max:255'],
            'phone'      => ['sometimes', 'nullable', 'string', 'max:20'],
            'bio'        => ['sometimes', 'nullable', 'string', 'max:255'],
            'birth_date' => ['sometimes', 'nullable', 'date'],
            'gender'     => ['sometimes', 'nullable', 'in:male,female,other'],
            'avatar_url' => ['sometimes', 'nullable', 'url', 'max:500'],
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui!',
            'user'    => $this->getUserWithRoles($user->fresh()),
        ]);
    }

    /**
     * ============================================================
     * CHANGE PASSWORD
     * ============================================================
     * Ganti password user
     *
     * Request: { current_password, password, password_confirmation }
     * Response: { message }
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'confirmed', Password::min(8)],
        ]);

        // Cek current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password lama tidak sesuai.',
            ], 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah!',
        ]);
    }

    /**
     * ============================================================
     * HELPER: Get User with Roles
     * ============================================================
     */
    private function getUserWithRoles(User $user): array
    {
        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'phone'      => $user->phone,
            'bio'        => $user->bio,
            'birth_date' => $user->birth_date,
            'gender'     => $user->gender,
            'avatar_url' => $user->avatar_url,
            'roles'      => $user->roles->map(function ($role) {
                return [
                    'role'      => $role->role,
                    'is_active' => $role->is_active,
                ];
            }),
            'active_role' => $user->getActiveRole()?->role,
        ];
    }
}