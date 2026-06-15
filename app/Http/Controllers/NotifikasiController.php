<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotifikasiController extends Controller
{
    /**
     * Display a listing of user notifications.
     */
    public function index(): Response
    {
        $notifications = Notifikasi::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($n) {
                return [
                    'id' => $n->id,
                    'tipe' => $n->tipe,
                    'judul' => $n->judul,
                    'pesan' => $n->pesan,
                    'link' => $n->link,
                    'is_read' => $n->is_read,
                    'created_at' => $n->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Notifikasi/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markRead(string $id): RedirectResponse
    {
        $notification = Notifikasi::where('user_id', auth()->id())->findOrFail($id);
        $notification->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Notifikasi ditandai telah dibaca.');
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllRead(): RedirectResponse
    {
        Notifikasi::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Semua notifikasi ditandai telah dibaca.');
    }
}
