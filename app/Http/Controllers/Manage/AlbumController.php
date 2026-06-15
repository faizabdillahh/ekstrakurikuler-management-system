<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\AlbumFoto;
use App\Models\EkskulTahunAjaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    /**
     * Display a listing of albums.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $albums = AlbumFoto::with(['creator', 'foto'])
            ->where('ekskul_id', $ekskulTa->ekskul_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'judul' => $a->judul,
                    'deskripsi' => $a->deskripsi,
                    'creator' => [
                        'nama' => $a->creator->nama,
                    ],
                    'foto' => $a->foto->sortBy('urutan')->values()->map(function ($f) {
                        return [
                            'id' => $f->id,
                            'path' => Storage::disk('public')->url($f->path),
                            'caption' => $f->caption,
                            'urutan' => $f->urutan,
                        ];
                    }),
                    'cover_url' => $a->foto->sortBy('urutan')->first() 
                        ? Storage::disk('public')->url($a->foto->sortBy('urutan')->first()->path) 
                        : null,
                    'created_at' => $a->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Manage/Album/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'albums' => $albums,
        ]);
    }

    /**
     * Store a newly created album.
     */
    public function store(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);

        AlbumFoto::create([
            'ekskul_id' => $ekskulTa->ekskul_id,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'dibuat_oleh' => auth()->id(),
        ]);

        return redirect()->route('manage.album.index', $ekskul_ta_id)
            ->with('success', 'Album foto berhasil dibuat.');
    }

    /**
     * Update the specified album.
     */
    public function update(Request $request, string $ekskul_ta_id, string $id): RedirectResponse
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);
        $album = AlbumFoto::where('ekskul_id', $ekskulTa->ekskul_id)->findOrFail($id);

        $album->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
        ]);

        return redirect()->route('manage.album.index', $ekskul_ta_id)
            ->with('success', 'Album foto berhasil diperbarui.');
    }

    /**
     * Remove the specified album from storage.
     */
    public function destroy(string $ekskul_ta_id, string $id): RedirectResponse
    {
        $ekskulTa = EkskulTahunAjaran::findOrFail($ekskul_ta_id);
        $album = AlbumFoto::where('ekskul_id', $ekskulTa->ekskul_id)->findOrFail($id);

        // Delete all physical files first
        foreach ($album->foto as $f) {
            Storage::disk('public')->delete($f->path);
        }

        $album->delete();

        return redirect()->route('manage.album.index', $ekskul_ta_id)
            ->with('success', 'Album foto berhasil dihapus.');
    }
}
