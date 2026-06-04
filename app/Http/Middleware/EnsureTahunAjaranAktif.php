<?php

namespace App\Http\Middleware;

use App\Models\TahunAjaran;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureTahunAjaranAktif
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tahunAjaranAktif = TahunAjaran::where('is_aktif', true)->first();

        if (!$tahunAjaranAktif) {
            abort(503, 'Tahun ajaran aktif belum dikonfigurasi oleh pihak Kesiswaan.');
        }

        // Share the active year globally to Inertia pages
        Inertia::share('tahunAjaranAktif', $tahunAjaranAktif);

        return $next($request);
    }
}
