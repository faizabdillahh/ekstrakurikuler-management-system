<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\Anggota;
use App\Models\EkskulTahunAjaran;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StrukturController extends Controller
{
    /**
     * Display a listing of the structure.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $struktur = StrukturOrganisasi::with(['anggota.user'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->orderBy('urutan')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'anggota_id' => $s->anggota_id,
                    'jabatan' => $s->jabatan,
                    'urutan' => $s->urutan,
                    'anggota' => [
                        'id' => $s->anggota->id,
                        'nama' => $s->anggota->user->nama,
                        'nis' => $s->anggota->user->nis,
                    ],
                ];
            });

        $activeMembers = Anggota::with(['user'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->where('status', 'aktif')
            ->get()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'nama' => $m->user->nama,
                    'nis' => $m->user->nis,
                ];
            });

        return Inertia::render('Manage/Struktur/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'struktur' => $struktur,
            'activeMembers' => $activeMembers,
        ]);
    }

    /**
     * Store a newly created organizational structure role.
     */
    public function store(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $request->validate([
            'anggota_id' => 'required|uuid|exists:anggota,id',
            'jabatan' => 'required|string|max:100',
            'urutan' => 'nullable|integer',
        ]);

        // Verify that the member belongs to the same extracurricular year
        $member = Anggota::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($request->anggota_id);

        StrukturOrganisasi::create([
            'ekskul_ta_id' => $ekskul_ta_id,
            'anggota_id' => $request->anggota_id,
            'jabatan' => $request->jabatan,
            'urutan' => $request->urutan ?? 0,
        ]);

        return redirect()->route('manage.struktur.index', $ekskul_ta_id)
            ->with('success', 'Struktur organisasi berhasil ditambahkan.');
    }

    /**
     * Update the specified role in organizational structure.
     */
    public function update(Request $request, string $ekskul_ta_id, string $id): RedirectResponse
    {
        $request->validate([
            'anggota_id' => 'required|uuid|exists:anggota,id',
            'jabatan' => 'required|string|max:100',
            'urutan' => 'nullable|integer',
        ]);

        $member = Anggota::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($request->anggota_id);
        $role = StrukturOrganisasi::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);

        $role->update([
            'anggota_id' => $request->anggota_id,
            'jabatan' => $request->jabatan,
            'urutan' => $request->urutan ?? 0,
        ]);

        return redirect()->route('manage.struktur.index', $ekskul_ta_id)
            ->with('success', 'Struktur organisasi berhasil diperbarui.');
    }

    /**
     * Remove the specified role from organizational structure.
     */
    public function destroy(string $ekskul_ta_id, string $id): RedirectResponse
    {
        $role = StrukturOrganisasi::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);
        $role->delete();

        return redirect()->route('manage.struktur.index', $ekskul_ta_id)
            ->with('success', 'Struktur organisasi berhasil dihapus.');
    }
}
