<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\EkskulTahunAjaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EkskulController extends Controller
{
    /**
     * Show the form for editing the extracurricular profile.
     */
    public function edit(string $ekskul_ta_id): Response
    {
        $eta = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        return Inertia::render('Manage/Ekskul/Edit', [
            'ekskulTa' => [
                'id' => $eta->id,
                'ekskul_nama' => $eta->ekskul->nama,
            ],
            'ekskul' => [
                'id' => $eta->ekskul->id,
                'nama' => $eta->ekskul->nama,
                'kategori' => $eta->ekskul->kategori,
                'deskripsi' => $eta->ekskul->deskripsi,
                'logo_url' => $eta->ekskul->logo_url ? Storage::disk('public')->url($eta->ekskul->logo_url) : null,
                'warna_primer' => $eta->ekskul->warna_primer,
                'warna_sekunder' => $eta->ekskul->warna_sekunder,
                'media_sosial' => is_string($eta->ekskul->media_sosial) 
                    ? json_decode($eta->ekskul->media_sosial, true) 
                    : $eta->ekskul->media_sosial,
            ],
        ]);
    }

    /**
     * Update the extracurricular profile.
     */
    public function update(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $eta = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $ekskul = $eta->ekskul;

        $request->validate([
            'nama' => 'required|string|max:100',
            'kategori' => 'required|string|max:50',
            'deskripsi' => 'nullable|string',
            'warna_primer' => 'nullable|regex:/^#[0-9A-Fa-f]{6}$/',
            'warna_sekunder' => 'nullable|regex:/^#[0-9A-Fa-f]{6}$/',
            'media_sosial' => 'nullable|array',
        ]);

        $ekskul->update([
            'nama' => $request->nama,
            'kategori' => $request->kategori,
            'deskripsi' => $request->deskripsi,
            'warna_primer' => $request->warna_primer ?? '#fff000',
            'warna_sekunder' => $request->warna_sekunder ?? '#00a2e9',
            'media_sosial' => $request->media_sosial,
        ]);

        return redirect()->route('manage.ekskul.edit', $ekskul_ta_id)
            ->with('success', 'Profil ekstrakurikuler berhasil diperbarui.');
    }

    /**
     * Update the extracurricular logo.
     */
    public function updateLogo(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $eta = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $ekskul = $eta->ekskul;

        $request->validate([
            'logo' => 'required|image|mimes:jpeg,jpg,png|max:2048', // Max 2MB
        ]);

        // Delete old logo if exists
        if ($ekskul->logo_url) {
            Storage::disk('public')->delete($ekskul->logo_url);
        }

        $file = $request->file('logo');
        $path = $file->store('ekskul_logos', 'public');

        $ekskul->update([
            'logo_url' => $path,
        ]);

        return redirect()->route('manage.ekskul.edit', $ekskul_ta_id)
            ->with('success', 'Logo ekstrakurikuler berhasil diperbarui.');
    }
}
