<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\EkskulTahunAjaran;
use App\Models\Jadwal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    /**
     * Display a listing of extracurricular schedules.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $jadwal = Jadwal::where('ekskul_ta_id', $ekskul_ta_id)
            ->orderByRaw("FIELD(hari, 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu')")
            ->orderBy('jam_mulai')
            ->get()
            ->map(function ($j) {
                return [
                    'id' => $j->id,
                    'hari' => $j->hari,
                    'jam_mulai' => substr($j->jam_mulai, 0, 5), // 'HH:MM'
                    'jam_selesai' => substr($j->jam_selesai, 0, 5), // 'HH:MM'
                    'lokasi' => $j->lokasi,
                    'keterangan' => $j->keterangan,
                ];
            });

        return Inertia::render('Manage/Jadwal/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'jadwal' => $jadwal,
        ]);
    }

    /**
     * Store a newly created schedule.
     */
    public function store(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $request->validate([
            'hari' => 'required|in:senin,selasa,rabu,kamis,jumat,sabtu,minggu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'lokasi' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string|max:255',
        ]);

        Jadwal::create([
            'ekskul_ta_id' => $ekskul_ta_id,
            'hari' => $request->hari,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'lokasi' => $request->lokasi,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->route('manage.jadwal.index', $ekskul_ta_id)
            ->with('success', 'Jadwal latihan berhasil ditambahkan.');
    }

    /**
     * Update the specified schedule.
     */
    public function update(Request $request, string $ekskul_ta_id, string $id): RedirectResponse
    {
        $request->validate([
            'hari' => 'required|in:senin,selasa,rabu,kamis,jumat,sabtu,minggu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'lokasi' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string|max:255',
        ]);

        $jadwal = Jadwal::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);

        $jadwal->update([
            'hari' => $request->hari,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'lokasi' => $request->lokasi,
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->route('manage.jadwal.index', $ekskul_ta_id)
            ->with('success', 'Jadwal latihan berhasil diperbarui.');
    }

    /**
     * Remove the specified schedule from storage.
     */
    public function destroy(string $ekskul_ta_id, string $id): RedirectResponse
    {
        $jadwal = Jadwal::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);
        $jadwal->delete();

        return redirect()->route('manage.jadwal.index', $ekskul_ta_id)
            ->with('success', 'Jadwal latihan berhasil dihapus.');
    }
}
