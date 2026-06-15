<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Models\DokumentasiEvent;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokumentasiController extends Controller
{
    /**
     * Upload documentation photo for an event.
     */
    public function store(Request $request, string $ekskul_ta_id, string $eventId): RedirectResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,jpg,png|max:5120', // Max 5MB
            'caption' => 'nullable|string|max:255',
        ]);

        $event = Event::where('ekskul_ta_id', $ekskul_ta_id)->findOrFail($eventId);

        $file = $request->file('file');
        $path = $file->store('event_dokumentasi', 'public');

        $event->dokumentasi()->create([
            'path' => $path,
            'caption' => $request->caption,
        ]);

        return redirect()->back()->with('success', 'Foto dokumentasi berhasil diunggah.');
    }

    /**
     * Delete a documentation photo.
     */
    public function destroy(string $ekskul_ta_id, string $id): RedirectResponse
    {
        // Note: although $ekskul_ta_id is passed by the prefix, we can optionally check it or just find the dokumentasi.
        $doc = DokumentasiEvent::whereHas('event', function ($query) use ($ekskul_ta_id) {
            $query->where('ekskul_ta_id', $ekskul_ta_id);
        })->findOrFail($id);

        Storage::disk('public')->delete($doc->path);
        $doc->delete();

        return redirect()->back()->with('success', 'Foto dokumentasi berhasil dihapus.');
    }
}
