<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Jadwal;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KalenderController extends Controller
{
    /**
     * Display the combined calendar of schedules and events.
     */
    public function index(): Response
    {
        $ta = TahunAjaran::where('is_aktif', true)->first();

        if (!$ta) {
            return Inertia::render('Kalender/Index', [
                'schedules' => [],
                'events' => [],
            ]);
        }

        $schedules = Jadwal::with(['ekskulTahunAjaran.ekskul'])
            ->whereHas('ekskulTahunAjaran', function ($query) use ($ta) {
                $query->where('tahun_ajaran_id', $ta->id);
            })
            ->get()
            ->map(function ($j) {
                return [
                    'id' => $j->id,
                    'hari' => $j->hari,
                    'jam_mulai' => substr($j->jam_mulai, 0, 5),
                    'jam_selesai' => substr($j->jam_selesai, 0, 5),
                    'lokasi' => $j->lokasi,
                    'keterangan' => $j->keterangan,
                    'ekskul_nama' => $j->ekskulTahunAjaran->ekskul->nama,
                    'warna_primer' => $j->ekskulTahunAjaran->ekskul->warna_primer,
                    'warna_sekunder' => $j->ekskulTahunAjaran->ekskul->warna_sekunder,
                ];
            });

        $events = Event::with(['ekskulTahunAjaran.ekskul'])
            ->whereHas('ekskulTahunAjaran', function ($query) use ($ta) {
                $query->where('tahun_ajaran_id', $ta->id);
            })
            ->get()
            ->map(function ($e) {
                return [
                    'id' => $e->id,
                    'judul' => $e->judul,
                    'deskripsi' => $e->deskripsi,
                    'tanggal_mulai' => $e->tanggal_mulai->toIso8601String(),
                    'tanggal_selesai' => $e->tanggal_selesai?->toIso8601String(),
                    'lokasi' => $e->lokasi,
                    'ekskul_nama' => $e->ekskulTahunAjaran->ekskul->nama,
                    'warna_primer' => $e->ekskulTahunAjaran->ekskul->warna_primer,
                    'warna_sekunder' => $e->ekskulTahunAjaran->ekskul->warna_sekunder,
                ];
            });

        return Inertia::render('Kalender/Index', [
            'schedules' => $schedules,
            'events' => $events,
        ]);
    }
}
