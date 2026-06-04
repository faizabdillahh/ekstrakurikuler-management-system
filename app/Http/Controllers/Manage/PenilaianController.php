<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\Anggota;
use App\Models\EkskulTahunAjaran;
use App\Models\Penilaian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PenilaianController extends Controller
{
    /**
     * Display the assessment entry sheet.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $anggotaList = Anggota::with(['user', 'penilaian'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->where('status', 'aktif')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'nilai_akhir' => $a->penilaian ? floatval($a->penilaian->nilai_akhir) : '',
                    'user' => [
                        'id' => $a->user->id,
                        'nama' => $a->user->nama,
                        'nis' => $a->user->nis,
                        'kelas' => $a->user->kelas,
                        'jurusan' => $a->user->jurusan,
                    ],
                ];
            });

        return Inertia::render('Manage/Penilaian/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'anggotaList' => $anggotaList,
        ]);
    }

    /**
     * Save final assessments in bulk.
     */
    public function update(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $request->validate([
            'grades' => 'required|array',
            'grades.*' => 'nullable|numeric|min:0|max:100',
        ]);

        foreach ($request->grades as $anggotaId => $nilai) {
            // Confirm the member belongs to this extracurricular and is active
            $anggota = Anggota::where('ekskul_ta_id', $ekskul_ta_id)
                ->where('status', 'aktif')
                ->findOrFail($anggotaId);

            if (is_null($nilai) || $nilai === '') {
                // Delete grade if cleared
                Penilaian::where('anggota_id', $anggotaId)->delete();
            } else {
                Penilaian::updateOrCreate(
                    ['anggota_id' => $anggotaId],
                    [
                        'nilai_akhir' => $nilai,
                        'dinilai_oleh' => auth()->id(),
                    ]
                );
            }
        }

        return redirect()->route('manage.penilaian.index', $ekskul_ta_id)
            ->with('success', 'Nilai akhir anggota berhasil diperbarui.');
    }
}
