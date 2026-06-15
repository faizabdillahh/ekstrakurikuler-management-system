<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\EkskulTahunAjaran;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display a listing of events.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        $events = Event::with(['creator', 'dokumentasi'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->orderBy('tanggal_mulai', 'desc')
            ->get()
            ->map(function ($e) {
                return [
                    'id' => $e->id,
                    'judul' => $e->judul,
                    'deskripsi' => $e->deskripsi,
                    'tanggal_mulai' => $e->tanggal_mulai->toIso8601String(),
                    'tanggal_selesai' => $e->tanggal_selesai?->toIso8601String(),
                    'lokasi' => $e->lokasi,
                    'link_wa_eo' => $e->link_wa_eo,
                    'creator' => [
                        'nama' => $e->creator->nama,
                    ],
                    'dokumentasi' => $e->dokumentasi->map(function ($d) {
                        return [
                            'id' => $d->id,
                            'path' => Storage::disk('public')->url($d->path),
                            'caption' => $d->caption,
                        ];
                    }),
                ];
            });

        return Inertia::render('Manage/Event/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'events' => $events,
        ]);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request, string $ekskul_ta_id): RedirectResponse
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'nullable|string|max:255',
            'link_wa_eo' => 'nullable|string|max:500',
        ]);

        Event::create([
            'ekskul_ta_id' => $ekskul_ta_id,
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi' => $request->lokasi,
            'link_wa_eo' => $request->link_wa_eo,
            'dibuat_oleh' => auth()->id(),
        ]);

        return redirect()->route('manage.event.index', $ekskul_ta_id)
            ->with('success', 'Event berhasil dibuat.');
    }

    /**
     * Show the form for editing the specified event.
     */
    public function edit(string $ekskul_ta_id, string $id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $event = Event::with(['dokumentasi'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->findOrFail($id);

        return Inertia::render('Manage/Event/Edit', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
            'event' => [
                'id' => $event->id,
                'judul' => $event->judul,
                'deskripsi' => $event->deskripsi,
                'tanggal_mulai' => $event->tanggal_mulai->format('Y-m-d\TH:i'),
                'tanggal_selesai' => $event->tanggal_selesai?->format('Y-m-d\TH:i'),
                'lokasi' => $event->lokasi,
                'link_wa_eo' => $event->link_wa_eo,
                'dokumentasi' => $event->dokumentasi->map(function ($d) {
                    return [
                        'id' => $d->id,
                        'path' => Storage::disk('public')->url($d->path),
                        'caption' => $d->caption,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, string $ekskul_ta_id, string $id): RedirectResponse
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'nullable|string|max:255',
            'link_wa_eo' => 'nullable|string|max:500',
        ]);

        $event = Event::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);

        $event->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi' => $request->lokasi,
            'link_wa_eo' => $request->link_wa_eo,
        ]);

        return redirect()->route('manage.event.index', $ekskul_ta_id)
            ->with('success', 'Event berhasil diperbarui.');
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy(string $ekskul_ta_id, string $id): RedirectResponse
    {
        $event = Event::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($id);

        // Delete all documentation photos first
        foreach ($event->dokumentasi as $doc) {
            Storage::disk('public')->delete($doc->path);
        }

        $event->delete();

        return redirect()->route('manage.event.index', $ekskul_ta_id)
            ->with('success', 'Event berhasil dihapus.');
    }
}
