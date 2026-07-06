<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        // Cek apakah user punya role ini
        if (!$user || !$user->hasRole($role)) {
            return response()->json([
                'success' => false,
                'message' => "Kamu tidak memiliki akses. Butuh role '$role'.",
            ], 403);
        }

        // Cek apakah role ini sedang aktif
        if (!$user->hasActiveRole($role)) {
            return response()->json([
                'success' => false,
                'message' => "Role '$role' tidak aktif. Aktifkan dulu dengan POST /api/auth/select-role.",
            ], 403);
        }

        return $next($request);
    }
}