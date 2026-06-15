<?php

namespace App\Http\Controllers;

use App\Models\AlbumFoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GaleriPublikController extends Controller
{
    /**
     * Display a listing of public albums.
     */
    public function index(): Response
    {
        $albums = AlbumFoto::with(['ekskul', 'foto'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($a) {
                $coverPhoto = $a->foto->sortBy('urutan')->first();
                return [
                    'id' => $a->id,
                    'judul' => $a->judul,
                    'deskripsi' => $a->deskripsi,
                    'ekskul_nama' => $a->ekskul->nama,
                    'cover_url' => $coverPhoto ? Storage::disk('public')->url($coverPhoto->path) : null,
                    'jumlah_foto' => $a->foto->count(),
                    'created_at' => $a->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Galeri/Index', [
            'albums' => $albums,
        ]);
    }

    /**
     * Display the specified public album.
     */
    public function show(string $album_id): Response
    {
        $album = AlbumFoto::with(['ekskul', 'foto'])
            ->findOrFail($album_id);

        $fotos = $album->foto->sortBy('urutan')->values()->map(function ($f) {
            return [
                'id' => $f->id,
                'path' => Storage::disk('public')->url($f->path),
                'caption' => $f->caption,
                'urutan' => $f->urutan,
            ];
        });

        return Inertia::render('Galeri/Show', [
            'album' => [
                'id' => $album->id,
                'judul' => $album->judul,
                'deskripsi' => $album->deskripsi,
                'ekskul_nama' => $album->ekskul->nama,
                'created_at' => $album->created_at->toIso8601String(),
            ],
            'fotos' => $fotos,
        ]);
    }
}
