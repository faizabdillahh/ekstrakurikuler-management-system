<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\Anggota;
use App\Models\EkskulTahunAjaran;
use App\Models\Pendaftaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeleksiController extends Controller
{
    /**
     * Display selection dashboard.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $pendaftarQuery = Pendaftaran::with(['user', 'sertifikat'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->get();

        $pendaftar = $pendaftarQuery->map(function ($p) {
            return [
                'id' => $p->id,
                'status' => $p->status,
                'created_at' => $p->created_at->format('Y-m-d H:i'),
                'user' => [
                    'id' => $p->user->id,
                    'nama' => $p->user->nama,
                    'nis' => $p->user->nis,
                    'kelas' => $p->user->kelas,
                    'jurusan' => $p->user->jurusan,
                    'no_hp' => $p->user->no_hp,
                ],
                'sertifikat' => $p->sertifikat->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'nama_file' => $s->nama_file,
                        'url' => asset('storage/' . $s->path),
                    ];
                }),
            ];
        });

        // Calculate statistics
        $stats = [
            'total' => $pendaftarQuery->count(),
            'dalam_review' => $pendaftarQuery->where('status', 'dalam_review')->count(),
            'diterima' => $pendaftarQuery->where('status', 'diterima')->count(),
            'ditolak' => $pendaftarQuery->where('status', 'ditolak')->count(),
        ];

        return Inertia::render('Manage/Seleksi/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
                'kuota_anggota' => $ekskulTa->kuota_anggota,
                'is_seleksi_final' => $ekskulTa->is_seleksi_final,
            ],
            'pendaftar' => $pendaftar,
            'statistik' => $stats,
        ]);
    }

    /**
     * Update individual selection status.
     */
    public function update(Request $request, string $ekskul_ta_id, string $pendaftaran_id): RedirectResponse
    {
        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);

        if ($ekskulTa->is_seleksi_final) {
            return redirect()->back()->with('error', 'Seleksi sudah final, keputusan tidak dapat diubah.');
        }

        $request->validate([
            'status' => 'required|in:diterima,ditolak',
        ]);

        $pendaftaran = Pendaftaran::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($pendaftaran_id);
        
        $pendaftaran->update([
            'status' => $request->status,
            'diputuskan_oleh' => auth()->id(),
            'diputuskan_pada' => now(),
        ]);

        return redirect()->back()->with('success', 'Keputusan seleksi berhasil diperbarui.');
    }

    /**
     * Update selection status in bulk.
     */
    public function bulkUpdate(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);

        if ($ekskulTa->is_seleksi_final) {
            return redirect()->back()->with('error', 'Seleksi sudah final, keputusan tidak dapat diubah.');
        }

        $request->validate([
            'status' => 'required|in:diterima,ditolak',
            'pendaftaran_ids' => 'required|array|min:1',
            'pendaftaran_ids.*' => 'required|uuid|exists:pendaftaran,id',
        ]);

        Pendaftaran::where('ekskul_ta_id', $ekskul_ta_id)
            ->whereIn('id', $request->pendaftaran_ids)
            ->update([
                'status' => $request->status,
                'diputuskan_oleh' => auth()->id(),
                'diputuskan_pada' => now(),
            ]);

        return redirect()->back()->with('success', 'Keputusan seleksi massal berhasil diperbarui.');
    }

    /**
     * Finalize selections and lock registration decisions.
     */
    public function finalize(string $ekskul_ta_id): RedirectResponse
    {
        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);

        if ($ekskulTa->is_seleksi_final) {
            return redirect()->back()->with('error', 'Seleksi sudah dalam status final sebelumnya.');
        }

        // Lock selection
        $ekskulTa->update([
            'is_seleksi_final' => true,
        ]);

        // Query accepted registrations
        $accepted = Pendaftaran::where('ekskul_ta_id', $ekskul_ta_id)
            ->where('status', 'diterima')
            ->get();

        // Migrate accepted registrations to anggota table
        foreach ($accepted as $p) {
            Anggota::firstOrCreate(
                [
                    'user_id' => $p->user_id,
                    'ekskul_ta_id' => $ekskul_ta_id,
                ],
                [
                    'status' => 'aktif',
                    'tanggal_bergabung' => now(),
                    'sumber' => 'seleksi',
                ]
            );
        }

        // Send notifications to all applicants upon selection release/finalization
        $allPendaftars = Pendaftaran::where('ekskul_ta_id', $ekskul_ta_id)->get();
        foreach ($allPendaftars as $p) {
            $statusText = $p->status === 'diterima' ? 'DITERIMA' : 'DITOLAK';
            \App\Models\Notifikasi::create([
                'user_id' => $p->user_id,
                'tipe' => 'seleksi',
                'judul' => 'Hasil Seleksi ' . $ekskulTa->ekskul->nama,
                'pesan' => 'Hasil seleksi telah dirilis: Anda dinyatakan ' . $statusText . '.',
                'link' => '/pendaftaran/' . $p->id,
                'is_read' => false,
            ]);
        }

        return redirect()->back()->with('success', 'Seleksi berhasil difinalisasi. Seluruh siswa yang diterima telah resmi menjadi anggota.');
    }

    /**
     * Update extracurricular quota.
     */
    public function updateKuota(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);

        if ($ekskulTa->is_seleksi_final) {
            return redirect()->back()->with('error', 'Seleksi sudah final, kuota tidak dapat diubah.');
        }

        $request->validate([
            'kuota' => 'required|integer|min:1',
        ]);

        $ekskulTa->update([
            'kuota_anggota' => $request->kuota,
        ]);

        return redirect()->back()->with('success', 'Kuota ekskul berhasil diperbarui.');
    }
}
