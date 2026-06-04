<?php

namespace App\Http\Controllers;

use App\Models\Anggota;
use App\Models\EkskulTahunAjaran;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnggotaController extends Controller
{
    /**
     * Display a listing of active and removed members.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $anggotaList = Anggota::with(['user', 'decider' => function ($q) {
            // Decider refers to dikeluarkan_oleh in database, let's load it if model defines relation
        }])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'status' => $a->status,
                    'tanggal_bergabung' => $a->tanggal_bergabung,
                    'tanggal_dikeluarkan' => $a->tanggal_dikeluarkan,
                    'sumber' => $a->sumber,
                    'user' => [
                        'id' => $a->user->id,
                        'nama' => $a->user->nama,
                        'nis' => $a->user->nis,
                        'kelas' => $a->user->kelas,
                        'jurusan' => $a->user->jurusan,
                        'no_hp' => $a->user->no_hp,
                    ],
                ];
            });

        // Get list of students not yet in this extracurricular
        $memberUserIds = Anggota::where('ekskul_ta_id', $ekskul_ta_id)->pluck('user_id');
        
        $eligibleStudents = User::role('siswa')
            ->whereNotIn('id', $memberUserIds)
            ->where('status', 'aktif')
            ->orderBy('nama', 'asc')
            ->get(['id', 'nama', 'nis', 'kelas', 'jurusan']);

        return Inertia::render('Manage/Anggota/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'anggotaList' => $anggotaList,
            'eligibleStudents' => $eligibleStudents,
        ]);
    }

    /**
     * Add a member manually (late registration).
     */
    public function store(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:users,id',
        ]);

        $exists = Anggota::where('ekskul_ta_id', $ekskul_ta_id)
            ->where('user_id', $request->user_id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Siswa tersebut sudah terdaftar sebagai anggota.');
        }

        Anggota::create([
            'user_id' => $request->user_id,
            'ekskul_ta_id' => $ekskul_ta_id,
            'status' => 'aktif',
            'tanggal_bergabung' => now(),
            'sumber' => 'manual',
        ]);

        return redirect()->back()->with('success', 'Anggota baru berhasil ditambahkan secara manual.');
    }

    /**
     * Update member membership status (e.g. Dikeluarkan).
     */
    public function updateStatus(Request $request, string $ekskul_ta_id, string $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:aktif,dikeluarkan',
        ]);

        $anggota = Anggota::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);

        $updateData = ['status' => $request->status];

        if ($request->status === 'dikeluarkan') {
            $updateData['tanggal_dikeluarkan'] = now()->toDateString();
            $updateData['dikeluarkan_oleh'] = auth()->id();
        } else {
            $updateData['tanggal_dikeluarkan'] = null;
            $updateData['dikeluarkan_oleh'] = null;
        }

        $anggota->update($updateData);

        $statusStr = $request->status === 'aktif' ? 'diaktifkan kembali' : 'dikeluarkan';
        return redirect()->back()->with('success', "Status anggota berhasil diubah menjadi {$statusStr}.");
    }
}
