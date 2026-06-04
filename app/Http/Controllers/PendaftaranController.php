<?php

namespace App\Http\Controllers;

use App\Models\EkskulTahunAjaran;
use App\Models\Pendaftaran;
use App\Models\PeriodePendaftaran;
use App\Models\TahunAjaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PendaftaranController extends Controller
{
    /**
     * Display a listing of student registrations.
     */
    public function index(): Response
    {
        $activeTa = TahunAjaran::where('is_aktif', true)->first();

        if (!$activeTa) {
            return Inertia::render('Pendaftaran/Index', [
                'pendaftaranList' => [],
                'periodePendaftaran' => null,
            ]);
        }

        $periode = PeriodePendaftaran::where('tahun_ajaran_id', $activeTa->id)->first();

        $pendaftarans = Pendaftaran::with(['ekskulTahunAjaran.ekskul', 'sertifikat'])
            ->where('user_id', auth()->id())
            ->whereHas('ekskulTahunAjaran', function ($query) use ($activeTa) {
                $query->where('tahun_ajaran_id', $activeTa->id);
            })
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'status' => $p->status,
                    'created_at' => $p->created_at->format('Y-m-d H:i'),
                    'ekskul' => [
                        'id' => $p->ekskulTahunAjaran->id,
                        'nama' => $p->ekskulTahunAjaran->ekskul->nama,
                        'kategori' => $p->ekskulTahunAjaran->ekskul->kategori,
                        'logo_url' => $p->ekskulTahunAjaran->ekskul->logo_url,
                    ],
                    'sertifikat' => $p->sertifikat->map(function ($s) {
                        return [
                            'id' => $s->id,
                            'nama_file' => $s->nama_file,
                            'url' => asset('storage/' . $s->path),
                        ];
                    }),
                ];
            });

        return Inertia::render('Pendaftaran/Index', [
            'pendaftaranList' => $pendaftarans,
            'periodePendaftaran' => $periode ? [
                'is_buka' => now()->between($periode->tanggal_buka, $periode->tanggal_tutup),
                'tanggal_buka' => $periode->tanggal_buka->format('Y-m-d H:i'),
                'tanggal_tutup' => $periode->tanggal_tutup->format('Y-m-d H:i'),
            ] : null,
        ]);
    }

    /**
     * Show the form for creating a new registration.
     */
    public function create(string $ekskul_ta_id)
    {
        $eta = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        // Check if user already registered
        $exists = Pendaftaran::where('user_id', auth()->id())
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->exists();

        if ($exists) {
            return redirect()->route('pendaftaran.index')->with('error', 'Anda sudah mendaftar di ekstrakurikuler ini.');
        }

        return Inertia::render('Pendaftaran/Create', [
            'ekskul' => [
                'id' => $eta->id,
                'nama' => $eta->ekskul->nama,
                'kategori' => $eta->ekskul->kategori,
            ]
        ]);
    }

    /**
     * Store a newly created registration.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'ekskul_ta_id' => 'required|uuid|exists:ekskul_tahun_ajaran,id',
            'sertifikat_files' => 'nullable|array',
            'sertifikat_files.*' => 'file|mimes:pdf,jpg,jpeg,png|max:2048', // 2 MB max
        ]);

        $ekskul_ta_id = $request->ekskul_ta_id;
        $activeTa = TahunAjaran::where('is_aktif', true)->first();

        if (!$activeTa) {
            return redirect()->back()->with('error', 'Tahun ajaran aktif tidak ditemukan.');
        }

        // Check if registration period is open
        $periode = PeriodePendaftaran::where('tahun_ajaran_id', $activeTa->id)->first();
        if (!$periode || !now()->between($periode->tanggal_buka, $periode->tanggal_tutup)) {
            return redirect()->back()->with('error', 'Periode pendaftaran sedang ditutup.');
        }

        $eta = EkskulTahunAjaran::findOrFail($ekskul_ta_id);
        if (!$eta->is_pendaftaran_dibuka) {
            return redirect()->back()->with('error', 'Pendaftaran untuk ekstrakurikuler ini sedang ditutup.');
        }

        // Check uniqueness
        $exists = Pendaftaran::where('user_id', auth()->id())
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->exists();

        if ($exists) {
            return redirect()->back()->with('error', 'Anda sudah mendaftar di ekstrakurikuler ini.');
        }

        // Create registration
        $pendaftaran = Pendaftaran::create([
            'user_id' => auth()->id(),
            'ekskul_ta_id' => $ekskul_ta_id,
            'status' => 'dalam_review',
        ]);

        // Create in-app notification for the student
        \App\Models\Notifikasi::create([
            'user_id' => auth()->id(),
            'tipe' => 'pendaftaran',
            'judul' => 'Pendaftaran Diajukan',
            'pesan' => 'Pendaftaran Anda ke ' . $eta->ekskul->nama . ' berhasil diajukan dan sedang dalam review.',
            'link' => '/pendaftaran',
            'is_read' => false,
        ]);

        // Upload certificates
        if ($request->hasFile('sertifikat_files')) {
            foreach ($request->file('sertifikat_files') as $file) {
                $path = $file->store('sertifikats', 'public');
                $pendaftaran->sertifikat()->create([
                    'nama_file' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getClientMimeType(),
                    'ukuran_bytes' => $file->getSize(),
                ]);
            }
        }

        return redirect()->route('pendaftaran.index')->with('success', 'Pendaftaran berhasil diajukan.');
    }

    /**
     * Display the specified registration.
     */
    public function show(string $id): Response
    {
        $pendaftaran = Pendaftaran::with(['ekskulTahunAjaran.ekskul', 'sertifikat'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return Inertia::render('Pendaftaran/Show', [
            'pendaftaran' => [
                'id' => $pendaftaran->id,
                'status' => $pendaftaran->status,
                'created_at' => $pendaftaran->created_at->format('Y-m-d H:i'),
                'ekskul' => [
                    'id' => $pendaftaran->ekskulTahunAjaran->id,
                    'nama' => $pendaftaran->ekskulTahunAjaran->ekskul->nama,
                    'kategori' => $pendaftaran->ekskulTahunAjaran->ekskul->kategori,
                    'warna_primer' => $pendaftaran->ekskulTahunAjaran->ekskul->warna_primer,
                    'warna_sekunder' => $pendaftaran->ekskulTahunAjaran->ekskul->warna_sekunder,
                ],
                'sertifikat' => $pendaftaran->sertifikat->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'nama_file' => $s->nama_file,
                        'url' => asset('storage/' . $s->path),
                    ];
                }),
            ]
        ]);
    }

    /**
     * Cancel a pending registration.
     */
    public function destroy(string $id): RedirectResponse
    {
        $pendaftaran = Pendaftaran::where('user_id', auth()->id())->findOrFail($id);

        if ($pendaftaran->status !== 'dalam_review') {
            return redirect()->back()->with('error', 'Pendaftaran tidak dapat dibatalkan karena status seleksi sudah diproses.');
        }

        $eta = EkskulTahunAjaran::findOrFail($pendaftaran->ekskul_ta_id);
        if ($eta->is_seleksi_final) {
            return redirect()->back()->with('error', 'Seleksi sudah final, pendaftaran tidak dapat dibatalkan.');
        }

        // Delete certificates
        foreach ($pendaftaran->sertifikat as $sertifikat) {
            Storage::disk('public')->delete($sertifikat->path);
        }

        $pendaftaran->delete();

        return redirect()->route('pendaftaran.index')->with('success', 'Pendaftaran berhasil dibatalkan.');
    }
}
