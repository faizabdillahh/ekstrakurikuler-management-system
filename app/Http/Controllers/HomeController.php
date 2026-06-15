<?php

namespace App\Http\Controllers;

use App\Models\EkskulTahunAjaran;
use App\Models\Pengumuman;
use App\Models\TahunAjaran;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Show the landing page.
     */
    public function index(): Response
    {
        $ta = TahunAjaran::where('is_aktif', true)->first();

        $ekskulList = [];
        $pengumumanPublik = [];

        if ($ta) {
            $ekskulList = EkskulTahunAjaran::with(['ekskul'])
                ->where('tahun_ajaran_id', $ta->id)
                ->get()
                ->map(function ($eta) {
                    return [
                        'id' => $eta->id,
                        'nama' => $eta->ekskul->nama,
                        'kategori' => $eta->ekskul->kategori,
                        'logo_url' => $eta->ekskul->logo_url,
                        'deskripsi' => $eta->ekskul->deskripsi,
                    ];
                });

            $pengumumanPublik = Pengumuman::with(['ekskulTahunAjaran.ekskul'])
                ->whereHas('ekskulTahunAjaran', function ($q) use ($ta) {
                    $q->where('tahun_ajaran_id', $ta->id);
                })
                ->whereNotNull('diterbitkan_pada')
                ->where('diterbitkan_pada', '<=', now())
                ->orderBy('diterbitkan_pada', 'desc')
                ->take(5)
                ->get()
                ->map(function ($p) {
                    return [
                        'judul' => $p->judul,
                        'konten' => $p->konten,
                        'tanggal' => $p->diterbitkan_pada->toIso8601String(),
                        'ekskul_nama' => $p->ekskulTahunAjaran->ekskul->nama,
                    ];
                });
        }

        return Inertia::render('Welcome', [
            'ekskulList' => $ekskulList,
            'pengumumanPublik' => $pengumumanPublik,
        ]);
    }
}
