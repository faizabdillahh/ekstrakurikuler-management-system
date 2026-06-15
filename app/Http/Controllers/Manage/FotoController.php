<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\AlbumFoto;
use App\Models\EkskulTahunAjaran;
use App\Models\Foto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FotoController extends Controller
{
    /**
     * Upload photo to an album.
     */
    public function store(Request $request, string $ekskul_ta_id, string $albumId): RedirectResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,jpg,png|max:5120', // Max 5MB
            'caption' => 'nullable|string|max:255',
            'urutan' => 'nullable|integer',
        ]);

        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);
        $album = AlbumFoto::where('ekskul_id', $ekskulTa->ekskul_id)->findOrFail($albumId);

        $file = $request->file('file');
        $path = $file->store('album_photos', 'public');

        $album->foto()->create([
            'path' => $path,
            'caption' => $request->caption,
            'urutan' => $request->urutan ?? 0,
        ]);

        return redirect()->back()->with('success', 'Foto berhasil ditambahkan ke album.');
    }

    /**
     * Delete a photo from an album.
     */
    public function destroy(string $ekskul_ta_id, string $id): RedirectResponse
    {
        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);
        
        $foto = Foto::whereHas('albumFoto', function ($query) use ($ekskulTa) {
            $query->where('ekskul_id', $ekskulTa->ekskul_id);
        })->findOrFail($id);

        Storage::disk('public')->delete($foto->path);
        $foto->delete();

        return redirect()->back()->with('success', 'Foto berhasil dihapus.');
    }
}
