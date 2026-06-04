<?php

namespace App\Http\Controllers;

use App\Models\EkskulTahunAjaran;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EkskulController extends Controller
{
    /**
     * Display a listing of active extracurriculars.
     */
    public function index(Request $request): Response
    {
        $activeTa = TahunAjaran::where('is_aktif', true)->first();

        if (!$activeTa) {
            return Inertia::render('Ekskul/Index', [
                'ekskulList' => [],
                'kategori' => $request->kategori,
            ]);
        }

        $query = EkskulTahunAjaran::with(['ekskul'])
            ->where('tahun_ajaran_id', $activeTa->id);

        if ($request->filled('kategori')) {
            $query->whereHas('ekskul', function ($q) use ($request) {
                $q->where('kategori', $request->kategori);
            });
        }

        $ekskuls = $query->get()->map(function ($eta) {
            return [
                'id' => $eta->id, // Pivot ID
                'nama' => $eta->ekskul->nama,
                'kategori' => $eta->ekskul->kategori,
                'logo_url' => $eta->ekskul->logo_url,
                'deskripsi' => $eta->ekskul->deskripsi,
                'warna_primer' => $eta->ekskul->warna_primer,
                'warna_sekunder' => $eta->ekskul->warna_sekunder,
                'kuota_anggota' => $eta->kuota_anggota,
                'is_pendaftaran_dibuka' => $eta->is_pendaftaran_dibuka,
            ];
        });

        return Inertia::render('Ekskul/Index', [
            'ekskulList' => $ekskuls,
            'kategori' => $request->kategori,
        ]);
    }

    /**
     * Display the specified extracurricular profile.
     */
    public function show(string $id): Response
    {
        $eta = EkskulTahunAjaran::with(['ekskul', 'jadwal', 'adminAssignments.user'])->findOrFail($id);

        return Inertia::render('Ekskul/Show', [
            'ekskul' => [
                'id' => $eta->id,
                'nama' => $eta->ekskul->nama,
                'kategori' => $eta->ekskul->kategori,
                'logo_url' => $eta->ekskul->logo_url,
                'deskripsi' => $eta->ekskul->deskripsi,
                'warna_primer' => $eta->ekskul->warna_primer,
                'warna_sekunder' => $eta->ekskul->warna_sekunder,
                'media_sosial' => is_string($eta->ekskul->media_sosial) 
                    ? json_decode($eta->ekskul->media_sosial, true) 
                    : $eta->ekskul->media_sosial,
                'kuota_anggota' => $eta->kuota_anggota,
                'is_pendaftaran_dibuka' => $eta->is_pendaftaran_dibuka,
                'jadwal' => $eta->jadwal->map(function ($j) {
                    return [
                        'hari' => $j->hari,
                        'jam_mulai' => substr($j->jam_mulai, 0, 5),
                        'jam_selesai' => substr($j->jam_selesai, 0, 5),
                        'lokasi' => $j->lokasi,
                        'keterangan' => $j->keterangan,
                    ];
                }),
                'pembina' => $eta->adminAssignments->map(function ($assignment) {
                    return [
                        'nama' => $assignment->user->nama,
                        'email' => $assignment->user->email,
                    ];
                }),
            ]
        ]);
    }
}
