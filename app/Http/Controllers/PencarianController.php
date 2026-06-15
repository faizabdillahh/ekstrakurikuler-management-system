<?php

namespace App\Http\Controllers;

use App\Models\Ekskul;
use App\Models\Event;
use App\Models\Pengumuman;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PencarianController extends Controller
{
    /**
     * Display global search results.
     */
    public function index(Request $request): Response
    {
        $query = $request->input('q', '');
        $ta = TahunAjaran::where('is_aktif', true)->first();

        $ekskulResults = [];
        $eventResults = [];
        $pengumumanResults = [];

        if (!empty($query) && $ta) {
            // Search Ekstrakurikuler (master)
            $ekskulResults = Ekskul::where('is_active', true)
                ->where(function ($q) use ($query) {
                    $q->where('nama', 'like', "%{$query}%")
                      ->orWhere('kategori', 'like', "%{$query}%")
                      ->orWhere('deskripsi', 'like', "%{$query}%");
                })
                ->get()
                ->map(function ($e) {
                    return [
                        'id' => $e->id,
                        'nama' => $e->nama,
                        'kategori' => $e->kategori,
                        'deskripsi' => $e->deskripsi,
                        'logo_url' => $e->logo_url,
                    ];
                });

            // Search Events in active school year
            $eventResults = Event::with(['ekskulTahunAjaran.ekskul'])
                ->whereHas('ekskulTahunAjaran', function ($q) use ($ta) {
                    $q->where('tahun_ajaran_id', $ta->id);
                })
                ->where(function ($q) use ($query) {
                    $q->where('judul', 'like', "%{$query}%")
                      ->orWhere('deskripsi', 'like', "%{$query}%")
                      ->orWhere('lokasi', 'like', "%{$query}%");
                })
                ->get()
                ->map(function ($e) {
                    return [
                        'id' => $e->id,
                        'judul' => $e->judul,
                        'deskripsi' => $e->deskripsi,
                        'tanggal_mulai' => $e->tanggal_mulai->toIso8601String(),
                        'ekskul_nama' => $e->ekskulTahunAjaran->ekskul->nama,
                    ];
                });

            // Search Announcements in active school year (that are published/not scheduled in future)
            $pengumumanResults = Pengumuman::with(['ekskulTahunAjaran.ekskul'])
                ->whereHas('ekskulTahunAjaran', function ($q) use ($ta) {
                    $q->where('tahun_ajaran_id', $ta->id);
                })
                ->whereNotNull('diterbitkan_pada')
                ->where('diterbitkan_pada', '<=', now())
                ->where(function ($q) use ($query) {
                    $q->where('judul', 'like', "%{$query}%")
                      ->orWhere('konten', 'like', "%{$query}%");
                })
                ->get()
                ->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'judul' => $p->judul,
                        'konten' => $p->konten,
                        'diterbitkan_pada' => $p->diterbitkan_pada->toIso8601String(),
                        'ekskul_nama' => $p->ekskulTahunAjaran->ekskul->nama,
                    ];
                });
        }

        return Inertia::render('Pencarian/Index', [
            'query' => $query,
            'ekskulResults' => $ekskulResults,
            'eventResults' => $eventResults,
            'pengumumanResults' => $pengumumanResults,
        ]);
    }
}
