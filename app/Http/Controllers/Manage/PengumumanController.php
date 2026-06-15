<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\EkskulTahunAjaran;
use App\Models\LampiranPengumuman;
use App\Models\Pengumuman;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PengumumanController extends Controller
{
    /**
     * Display a listing of announcements.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $pengumuman = Pengumuman::with(['creator', 'lampiran'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'judul' => $p->judul,
                    'konten' => $p->konten,
                    'dijadwalkan_pada' => $p->dijadwalkan_pada?->toIso8601String(),
                    'diterbitkan_pada' => $p->diterbitkan_pada?->toIso8601String(),
                    'creator' => [
                        'nama' => $p->creator->nama,
                    ],
                    'lampiran' => $p->lampiran->map(function ($l) {
                        return [
                            'id' => $l->id,
                            'nama_file' => $l->nama_file,
                            'url' => Storage::disk('public')->url($l->path),
                            'ukuran_bytes' => $l->ukuran_bytes,
                        ];
                    }),
                    'created_at' => $p->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Manage/Pengumuman/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'pengumuman' => $pengumuman,
        ]);
    }

    /**
     * Show the form for creating a new announcement.
     */
    public function create(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        return Inertia::render('Manage/Pengumuman/Create', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
        ]);
    }

    /**
     * Store a newly created announcement in storage.
     */
    public function store(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'dijadwalkan_pada' => 'nullable|date',
            'files' => 'nullable|array',
            'files.*' => 'required|file|max:5120', // Max 5MB per file
        ]);

        $dijadwalkan = $request->filled('dijadwalkan_pada') ? new \DateTime($request->dijadwalkan_pada) : null;
        $diterbitkan = $dijadwalkan ? null : now();

        $pengumuman = Pengumuman::create([
            'ekskul_ta_id' => $ekskul_ta_id,
            'judul' => $request->judul,
            'konten' => $request->konten,
            'dijadwalkan_pada' => $dijadwalkan,
            'diterbitkan_pada' => $diterbitkan,
            'dibuat_oleh' => auth()->id(),
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('pengumuman_lampiran', 'public');
                $pengumuman->lampiran()->create([
                    'nama_file' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getClientMimeType(),
                    'ukuran_bytes' => $file->getSize(),
                ]);
            }
        }

        // Send real-time in-app notifications to active members if published immediately
        if (!$dijadwalkan) {
            $activeMembers = \App\Models\Anggota::where('ekskul_ta_id', $ekskul_ta_id)
                ->where('status', 'aktif')
                ->get();

            foreach ($activeMembers as $member) {
                \App\Models\Notifikasi::create([
                    'user_id' => $member->user_id,
                    'tipe' => 'pengumuman',
                    'judul' => 'Pengumuman Baru: ' . $request->judul,
                    'pesan' => 'Ada pengumuman baru di ekskul Anda. Silakan cek detailnya.',
                    'link' => '/dashboard',
                ]);
            }
        }

        return redirect()->route('manage.pengumuman.index', $ekskul_ta_id)
            ->with('success', 'Pengumuman berhasil diterbitkan.');
    }

    /**
     * Display the specified announcement.
     */
    public function show(string $ekskul_ta_id, string $id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $pengumuman = Pengumuman::with(['creator', 'lampiran'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->findOrFail($id);

        return Inertia::render('Manage/Pengumuman/Show', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'pengumuman' => [
                'id' => $pengumuman->id,
                'judul' => $pengumuman->judul,
                'konten' => $pengumuman->konten,
                'dijadwalkan_pada' => $pengumuman->dijadwalkan_pada?->toIso8601String(),
                'diterbitkan_pada' => $pengumuman->diterbitkan_pada?->toIso8601String(),
                'creator' => [
                    'nama' => $pengumuman->creator->nama,
                ],
                'lampiran' => $pengumuman->lampiran->map(function ($l) {
                    return [
                        'id' => $l->id,
                        'nama_file' => $l->nama_file,
                        'url' => Storage::disk('public')->url($l->path),
                        'ukuran_bytes' => $l->ukuran_bytes,
                    ];
                }),
                'created_at' => $pengumuman->created_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified announcement.
     */
    public function edit(string $ekskul_ta_id, string $id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $pengumuman = Pengumuman::with(['lampiran'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->findOrFail($id);

        return Inertia::render('Manage/Pengumuman/Edit', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'pengumuman' => [
                'id' => $pengumuman->id,
                'judul' => $pengumuman->judul,
                'konten' => $pengumuman->konten,
                'dijadwalkan_pada' => $pengumuman->dijadwalkan_pada?->format('Y-m-d\TH:i'),
                'lampiran' => $pengumuman->lampiran->map(function ($l) {
                    return [
                        'id' => $l->id,
                        'nama_file' => $l->nama_file,
                        'url' => Storage::disk('public')->url($l->path),
                        'ukuran_bytes' => $l->ukuran_bytes,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update the specified announcement in storage.
     */
    public function update(Request $request, string $ekskul_ta_id, string $id): RedirectResponse
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'dijadwalkan_pada' => 'nullable|date',
            'files' => 'nullable|array',
            'files.*' => 'required|file|max:5120',
            'delete_attachments' => 'nullable|array',
            'delete_attachments.*' => 'required|uuid|exists:lampiran_pengumuman,id',
        ]);

        $pengumuman = Pengumuman::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);

        $dijadwalkan = $request->filled('dijadwalkan_pada') ? new \DateTime($request->dijadwalkan_pada) : null;
        $diterbitkan = $pengumuman->diterbitkan_pada;

        // If it wasn't published yet and now scheduled_at is null, publish it now
        if (!$diterbitkan && !$dijadwalkan) {
            $diterbitkan = now();
        }

        $pengumuman->update([
            'judul' => $request->judul,
            'konten' => $request->konten,
            'dijadwalkan_pada' => $dijadwalkan,
            'diterbitkan_pada' => $diterbitkan,
        ]);

        // Handle deleted attachments
        if ($request->filled('delete_attachments')) {
            $toDelete = LampiranPengumuman::where('pengumuman_id', $pengumuman->id)
                ->whereIn('id', $request->delete_attachments)
                ->get();

            foreach ($toDelete as $attachment) {
                Storage::disk('public')->delete($attachment->path);
                $attachment->delete();
            }
        }

        // Handle new files
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('pengumuman_lampiran', 'public');
                $pengumuman->lampiran()->create([
                    'nama_file' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getClientMimeType(),
                    'ukuran_bytes' => $file->getSize(),
                ]);
            }
        }

        return redirect()->route('manage.pengumuman.index', $ekskul_ta_id)
            ->with('success', 'Pengumuman berhasil diperbarui.');
    }

    /**
     * Remove the specified announcement from storage.
     */
    public function destroy(string $ekskul_ta_id, string $id): RedirectResponse
    {
        $pengumuman = Pengumuman::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);

        // Delete all physical attachments first
        foreach ($pengumuman->lampiran as $attachment) {
            Storage::disk('public')->delete($attachment->path);
        }

        $pengumuman->delete();

        return redirect()->route('manage.pengumuman.index', $ekskul_ta_id)
            ->with('success', 'Pengumuman berhasil dihapus.');
    }
}
