<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Anggota;
use App\Models\EkskulTahunAjaran;
use App\Models\SesiAbsensi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiController extends Controller
{
    /**
     * Display listing of attendance sessions.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $sessions = SesiAbsensi::withCount([
            'absensi as total_hadir' => function ($q) {
                $q->where('status', 'hadir');
            },
            'absensi as total_peserta'
        ])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'tanggal' => $s->tanggal,
                    'keterangan' => $s->keterangan,
                    'total_hadir' => $s->total_hadir,
                    'total_peserta' => $s->total_peserta,
                ];
            });

        return Inertia::render('Manage/Absensi/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'sessions' => $sessions,
        ]);
    }

    /**
     * Store a new attendance session.
     */
    public function store(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $request->validate([
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        // Create Sesi
        $sesi = SesiAbsensi::create([
            'ekskul_ta_id' => $ekskul_ta_id,
            'tanggal' => $request->tanggal,
            'keterangan' => $request->keterangan,
            'dibuat_oleh' => auth()->id(),
        ]);

        // Automatically populate attendance sheets for all currently active members
        $activeMembers = Anggota::where('ekskul_ta_id', $ekskul_ta_id)
            ->where('status', 'aktif')
            ->get();

        foreach ($activeMembers as $member) {
            Absensi::create([
                'sesi_absensi_id' => $sesi->id,
                'anggota_id' => $member->id,
                'status' => 'hadir', // default to present
            ]);
        }

        return redirect()->route('manage.absensi.show', [$ekskul_ta_id, $sesi->id])
            ->with('success', 'Sesi latihan berhasil dibuat. Silakan perbarui status absensi siswa.');
    }

    /**
     * Show attendance list for a specific session.
     */
    public function show(string $ekskul_ta_id, string $id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $sesi = SesiAbsensi::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);

        $records = Absensi::with(['anggota.user'])
            ->where('sesi_absensi_id', $sesi->id)
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id, // PK of absensi table
                    'status' => $r->status,
                    'anggota' => [
                        'id' => $r->anggota->id,
                        'nama' => $r->anggota->user->nama,
                        'nis' => $r->anggota->user->nis,
                        'kelas' => $r->anggota->user->kelas,
                        'jurusan' => $r->anggota->user->jurusan,
                    ],
                ];
            });

        return Inertia::render('Manage/Absensi/Show', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'session' => [
                'id' => $sesi->id,
                'tanggal' => $sesi->tanggal,
                'keterangan' => $sesi->keterangan,
            ],
            'records' => $records,
        ]);
    }

    /**
     * Update bulk attendance sheet for a session.
     */
    public function update(Request $request, string $ekskul_ta_id, string $id): RedirectResponse
    {
        $request->validate([
            'attendance' => 'required|array',
            'attendance.*' => 'required|in:hadir,izin,sakit,alfa',
        ]);

        foreach ($request->attendance as $absensiId => $status) {
            Absensi::where('id', $absensiId)
                ->where('sesi_absensi_id', $id)
                ->update(['status' => $status]);
        }

        return redirect()->route('manage.absensi.index', $ekskul_ta_id)
            ->with('success', 'Rekap absensi berhasil diperbarui.');
    }

    /**
     * Delete an attendance session.
     */
    public function destroy(string $ekskul_ta_id, string $id): RedirectResponse
    {
        $sesi = SesiAbsensi::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);
        
        // Cascades automatically delete attendance sheets in DB, but let's run delete to trigger model events if any
        $sesi->delete();

        return redirect()->route('manage.absensi.index', $ekskul_ta_id)
            ->with('success', 'Sesi absensi berhasil dihapus.');
    }
}
