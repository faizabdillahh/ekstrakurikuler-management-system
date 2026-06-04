<?php

namespace App\Http\Middleware;

use App\Models\AdminEkskulAssignment;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureEkskulAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            abort(401);
        }

        // Kesiswaan and OSIS have global access to manage all ekskuls
        if ($user->hasRole('kesiswaan') || $user->hasRole('pengurus-osis')) {
            return $next($request);
        }

        // Extract extracurricular year id parameter from the route
        $ekskulTaId = $request->route('ekskul_ta_id') ?? $request->route('ekskul_tahun_ajaran');

        if ($ekskulTaId) {
            $hasAccess = AdminEkskulAssignment::where('user_id', $user->id)
                ->where('ekskul_ta_id', $ekskulTaId)
                ->exists();

            if ($hasAccess) {
                return $next($request);
            }
        }

        abort(403, 'Akses ditolak. Anda tidak ditugaskan untuk mengelola ekstrakurikuler ini.');
    }
}
