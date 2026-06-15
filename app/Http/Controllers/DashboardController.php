<?php

namespace App\Http\Controllers;

use App\Models\AdminEkskulAssignment;
use App\Models\Anggota;
use App\Models\Ekskul;
use App\Models\EkskulTahunAjaran;
use App\Models\Notifikasi;
use App\Models\Pendaftaran;
use App\Models\PeriodePendaftaran;
use App\Models\TahunAjaran;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the authenticated dashboard.
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $ta = TahunAjaran::where('is_aktif', true)->first();

        // Common prop
        $notifikasiUnread = Notifikasi::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        // 1. Siswa Dashboard Data
        $pendaftaranAktif = [];
        $ekskulDiikuti = [];
        $jadwalBentrok = [];
        $periodePendaftaran = null;

        if ($ta) {
            $pendaftaranAktif = Pendaftaran::with(['ekskulTahunAjaran.ekskul'])
                ->where('user_id', $user->id)
                ->whereHas('ekskulTahunAjaran', function ($q) use ($ta) {
                    $q->where('tahun_ajaran_id', $ta->id);
                })
                ->get()
                ->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'ekskul_nama' => $p->ekskulTahunAjaran->ekskul->nama,
                        'status' => $p->status,
                        'created_at' => $p->created_at->toIso8601String(),
                    ];
                });

            $ekskulDiikuti = Anggota::with(['ekskulTahunAjaran.ekskul.jadwal'])
                ->where('user_id', $user->id)
                ->where('status', 'aktif')
                ->whereHas('ekskulTahunAjaran', function ($q) use ($ta) {
                    $q->where('tahun_ajaran_id', $ta->id);
                })
                ->get()
                ->map(function ($a) {
                    $jadwals = $a->ekskulTahunAjaran->jadwal->map(function ($j) {
                        return $j->hari . ' (' . substr($j->jam_mulai, 0, 5) . ' - ' . substr($j->jam_selesai, 0, 5) . ')';
                    })->join(', ');

                    return [
                        'id' => $a->ekskulTahunAjaran->id,
                        'ekskul_nama' => $a->ekskulTahunAjaran->ekskul->nama,
                        'jadwal' => $jadwals ?: 'Belum diatur',
                    ];
                });

            // SQL Query deteksi bentrok jadwal
            $jadwalBentrok = DB::select("
                SELECT 
                    e1.nama AS ekskul_a,
                    e2.nama AS ekskul_b,
                    j1.hari,
                    CONCAT(SUBSTRING(j1.jam_mulai, 1, 5), ' - ', SUBSTRING(j1.jam_selesai, 1, 5)) AS jam
                FROM jadwal j1
                JOIN ekskul_tahun_ajaran eta1 ON j1.ekskul_ta_id = eta1.id
                JOIN ekskul e1 ON eta1.ekskul_id = e1.id
                JOIN anggota a1 ON a1.ekskul_ta_id = eta1.id AND a1.status = 'aktif'
                JOIN jadwal j2 ON j2.id != j1.id AND j2.hari = j1.hari
                JOIN ekskul_tahun_ajaran eta2 ON j2.ekskul_ta_id = eta2.id
                JOIN ekskul e2 ON eta2.ekskul_id = e2.id
                JOIN anggota a2 ON a2.ekskul_ta_id = eta2.id AND a2.status = 'aktif'
                WHERE a1.user_id = ?
                  AND a2.user_id = ?
                  AND eta1.tahun_ajaran_id = ?
                  AND eta2.tahun_ajaran_id = ?
                  AND j1.jam_mulai < j2.jam_selesai
                  AND j2.jam_mulai < j1.jam_selesai
                  AND j1.id < j2.id
            ", [$user->id, $user->id, $ta->id, $ta->id]);

            $periodeModel = PeriodePendaftaran::where('tahun_ajaran_id', $ta->id)->first();
            if ($periodeModel) {
                $now = now();
                $isBuka = $now->between($periodeModel->tanggal_buka, $periodeModel->tanggal_tutup);
                $periodePendaftaran = [
                    'is_buka' => $isBuka,
                    'tanggal_tutup' => $periodeModel->tanggal_tutup->toIso8601String(),
                ];
            }
        }

        // 2. Admin Ekskul / Pembina Dashboard Data
        $ekskulDikelola = [];
        if ($user->hasRole('admin-ekskul') || $user->hasRole('pembina')) {
            $assignmentsQuery = AdminEkskulAssignment::with(['ekskulTahunAjaran.ekskul'])
                ->where('user_id', $user->id);
            
            if ($ta) {
                $assignmentsQuery->whereHas('ekskulTahunAjaran', function ($q) use ($ta) {
                    $q->where('tahun_ajaran_id', $ta->id);
                });
            }

            $ekskulDikelola = $assignmentsQuery->get()->map(function ($assignment) {
                $eta = $assignment->ekskulTahunAjaran;
                
                $jumlahPendaftar = Pendaftaran::where('ekskul_ta_id', $eta->id)->count();
                $jumlahAnggota = Anggota::where('ekskul_ta_id', $eta->id)->where('status', 'aktif')->count();

                return [
                    'id' => $eta->ekskul_id,
                    'ekskul_ta_id' => $eta->id,
                    'nama' => $eta->ekskul->nama,
                    'jumlah_pendaftar' => $jumlahPendaftar,
                    'jumlah_anggota' => $jumlahAnggota,
                    'kuota' => $eta->kuota_anggota,
                ];
            });
        }

        // 3. Kesiswaan / OSIS Dashboard Data
        $statistik = null;
        if ($user->hasRole('kesiswaan') || $user->hasRole('pengurus-osis')) {
            $totalSiswa = User::where('status', 'aktif')->whereNotNull('nis')->count();
            $totalEkskul = Ekskul::where('is_active', true)->count();
            
            $totalPendaftar = 0;
            $totalAnggota = 0;
            if ($ta) {
                $totalPendaftar = Pendaftaran::whereHas('ekskulTahunAjaran', function ($q) use ($ta) {
                    $q->where('tahun_ajaran_id', $ta->id);
                })->count();

                $totalAnggota = Anggota::where('status', 'aktif')
                    ->whereHas('ekskulTahunAjaran', function ($q) use ($ta) {
                        $q->where('tahun_ajaran_id', $ta->id);
                    })->count();
            }

            $statistik = [
                'total_siswa' => $totalSiswa,
                'total_ekskul' => $totalEkskul,
                'total_pendaftar' => $totalPendaftar,
                'total_anggota' => $totalAnggota,
            ];
        }

        return Inertia::render('Dashboard', [
            'pendaftaranAktif' => $pendaftaranAktif,
            'ekskulDiikuti' => $ekskulDiikuti,
            'jadwalBentrok' => $jadwalBentrok,
            'notifikasiUnread' => $notifikasiUnread,
            'periodePendaftaran' => $periodePendaftaran,
            'ekskulDikelola' => $ekskulDikelola,
            'statistik' => $statistik,
        ]);
    }
}
