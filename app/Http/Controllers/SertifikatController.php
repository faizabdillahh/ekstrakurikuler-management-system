<?php

namespace App\Http\Controllers;

use App\Models\EkskulTahunAjaran;
use App\Models\Pendaftaran;
use App\Models\Sertifikat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SertifikatController extends Controller
{
    /**
     * Upload and attach a new certificate.
     */
    public function store(Request $request, string $pendaftaranId): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048', // 2 MB max
        ]);

        $pendaftaran = Pendaftaran::where('user_id', auth()->id())->findOrFail($pendaftaranId);

        if ($pendaftaran->status !== 'dalam_review') {
            return redirect()->back()->with('error', 'Tidak dapat menambahkan sertifikat karena status pendaftaran sudah diproses.');
        }

        $eta = EkskulTahunAjaran::findOrFail($pendaftaran->ekskul_ta_id);
        if ($eta->is_seleksi_final) {
            return redirect()->back()->with('error', 'Seleksi sudah final.');
        }

        $file = $request->file('file');
        $path = $file->store('sertifikats', 'public');

        $pendaftaran->sertifikat()->create([
            'nama_file' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'ukuran_bytes' => $file->getSize(),
        ]);

        return redirect()->back()->with('success', 'Sertifikat berhasil ditambahkan.');
    }

    /**
     * Delete an attached certificate.
     */
    public function destroy(string $id): RedirectResponse
    {
        $sertifikat = Sertifikat::whereHas('pendaftaran', function ($query) {
            $query->where('user_id', auth()->id());
        })->findOrFail($id);

        $pendaftaran = $sertifikat->pendaftaran;
        if ($pendaftaran->status !== 'dalam_review') {
            return redirect()->back()->with('error', 'Tidak dapat menghapus sertifikat karena status pendaftaran sudah diproses.');
        }

        $eta = EkskulTahunAjaran::findOrFail($pendaftaran->ekskul_ta_id);
        if ($eta->is_seleksi_final) {
            return redirect()->back()->with('error', 'Seleksi sudah final.');
        }

        Storage::disk('public')->delete($sertifikat->path);
        $sertifikat->delete();

        return redirect()->back()->with('success', 'Sertifikat berhasil dihapus.');
    }
}
