<?php

use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\KalenderController;
use App\Http\Controllers\PencarianController;
use App\Http\Controllers\GaleriPublikController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Welcome Route
Route::get('/', [HomeController::class, 'index'])->name('home');

// Login Page Route
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login')->middleware('guest');

// Google OAuth Authentication Routes
Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->name('auth.google.callback');
Route::post('/auth/logout', [SocialiteController::class, 'logout'])->name('logout');

// Public Galeri Routes (No auth required)
Route::get('/galeri', [GaleriPublikController::class, 'index'])->name('galeri.index');
Route::get('/galeri/{album_id}', [GaleriPublikController::class, 'show'])->name('galeri.show');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    // Dashboard Route (Dynamic via DashboardController)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Shared Notifications
    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::put('/notifikasi/{id}/read', [NotifikasiController::class, 'markRead'])->name('notifikasi.mark_read');
    Route::put('/notifikasi/read-all', [NotifikasiController::class, 'markAllRead'])->name('notifikasi.mark_all_read');

    // Shared Kalender & Pencarian
    Route::get('/kalender', [KalenderController::class, 'index'])->name('kalender.index');
    Route::get('/pencarian', [PencarianController::class, 'index'])->name('pencarian.index');

    // Shared Ekskul Profile Routes
    Route::get('/ekskul', [\App\Http\Controllers\EkskulController::class, 'index'])->name('ekskul.index');
    Route::get('/ekskul/{id}', [\App\Http\Controllers\EkskulController::class, 'show'])->name('ekskul.show');

    // Siswa (Registration) Routes
    Route::middleware(['role:siswa'])->group(function () {
        Route::get('/pendaftaran', [\App\Http\Controllers\PendaftaranController::class, 'index'])->name('pendaftaran.index');
        Route::get('/pendaftaran/buat/{ekskul_ta_id}', [\App\Http\Controllers\PendaftaranController::class, 'create'])->name('pendaftaran.create');
        Route::post('/pendaftaran', [\App\Http\Controllers\PendaftaranController::class, 'store'])->name('pendaftaran.store');
        Route::get('/pendaftaran/{id}', [\App\Http\Controllers\PendaftaranController::class, 'show'])->name('pendaftaran.show');
        Route::delete('/pendaftaran/{id}', [\App\Http\Controllers\PendaftaranController::class, 'destroy'])->name('pendaftaran.destroy');

        Route::post('/pendaftaran/{id}/sertifikat', [\App\Http\Controllers\SertifikatController::class, 'store'])->name('pendaftaran.sertifikat.store');
        Route::delete('/sertifikat/{id}', [\App\Http\Controllers\SertifikatController::class, 'destroy'])->name('sertifikat.destroy');
    });

    // Admin Ekskul (Management) Routes
    Route::middleware(['role:admin-ekskul|pembina', 'ekskul.access'])
        ->prefix('manage/ekskul/{ekskul_ta_id}')
        ->group(function () {
            // Profil & Branding
            Route::get('/edit', [\App\Http\Controllers\Manage\EkskulController::class, 'edit'])->name('manage.ekskul.edit');
            Route::put('/update', [\App\Http\Controllers\Manage\EkskulController::class, 'update'])->name('manage.ekskul.update');
            Route::post('/logo', [\App\Http\Controllers\Manage\EkskulController::class, 'updateLogo'])->name('manage.ekskul.logo');

            // Seleksi
            Route::get('/seleksi', [\App\Http\Controllers\Manage\SeleksiController::class, 'index'])->name('manage.seleksi.index');
            Route::put('/seleksi/bulk', [\App\Http\Controllers\Manage\SeleksiController::class, 'bulkUpdate'])->name('manage.seleksi.bulk');
            Route::put('/seleksi/{pendaftaran_id}', [\App\Http\Controllers\Manage\SeleksiController::class, 'update'])->name('manage.seleksi.update');
            Route::post('/seleksi/finalize', [\App\Http\Controllers\Manage\SeleksiController::class, 'finalize'])->name('manage.seleksi.finalize');
            Route::put('/kuota', [\App\Http\Controllers\Manage\SeleksiController::class, 'updateKuota'])->name('manage.seleksi.kuota');

            // Anggota
            Route::get('/anggota', [\App\Http\Controllers\Manage\AnggotaController::class, 'index'])->name('manage.anggota.index');
            Route::post('/anggota', [\App\Http\Controllers\Manage\AnggotaController::class, 'store'])->name('manage.anggota.store');
            Route::put('/anggota/{id}/status', [\App\Http\Controllers\Manage\AnggotaController::class, 'updateStatus'])->name('manage.anggota.update_status');

            // Absensi
            Route::get('/absensi', [\App\Http\Controllers\Manage\AbsensiController::class, 'index'])->name('manage.absensi.index');
            Route::post('/absensi', [\App\Http\Controllers\Manage\AbsensiController::class, 'store'])->name('manage.absensi.store');
            Route::get('/absensi/{id}', [\App\Http\Controllers\Manage\AbsensiController::class, 'show'])->name('manage.absensi.show');
            Route::put('/absensi/{id}', [\App\Http\Controllers\Manage\AbsensiController::class, 'update'])->name('manage.absensi.update');
            Route::delete('/absensi/{id}', [\App\Http\Controllers\Manage\AbsensiController::class, 'destroy'])->name('manage.absensi.destroy');

            // Penilaian
            Route::get('/penilaian', [\App\Http\Controllers\Manage\PenilaianController::class, 'index'])->name('manage.penilaian.index');
            Route::put('/penilaian', [\App\Http\Controllers\Manage\PenilaianController::class, 'update'])->name('manage.penilaian.update');

            // Pengumuman
            Route::get('/pengumuman', [\App\Http\Controllers\Manage\PengumumanController::class, 'index'])->name('manage.pengumuman.index');
            Route::get('/pengumuman/create', [\App\Http\Controllers\Manage\PengumumanController::class, 'create'])->name('manage.pengumuman.create');
            Route::post('/pengumuman', [\App\Http\Controllers\Manage\PengumumanController::class, 'store'])->name('manage.pengumuman.store');
            Route::get('/pengumuman/{id}', [\App\Http\Controllers\Manage\PengumumanController::class, 'show'])->name('manage.pengumuman.show');
            Route::get('/pengumuman/{id}/edit', [\App\Http\Controllers\Manage\PengumumanController::class, 'edit'])->name('manage.pengumuman.edit');
            Route::put('/pengumuman/{id}', [\App\Http\Controllers\Manage\PengumumanController::class, 'update'])->name('manage.pengumuman.update');
            Route::delete('/pengumuman/{id}', [\App\Http\Controllers\Manage\PengumumanController::class, 'destroy'])->name('manage.pengumuman.destroy');

            // Event
            Route::get('/event', [\App\Http\Controllers\Manage\EventController::class, 'index'])->name('manage.event.index');
            Route::post('/event', [\App\Http\Controllers\Manage\EventController::class, 'store'])->name('manage.event.store');
            Route::get('/event/{id}/edit', [\App\Http\Controllers\Manage\EventController::class, 'edit'])->name('manage.event.edit');
            Route::put('/event/{id}', [\App\Http\Controllers\Manage\EventController::class, 'update'])->name('manage.event.update');
            Route::delete('/event/{id}', [\App\Http\Controllers\Manage\EventController::class, 'destroy'])->name('manage.event.destroy');
            Route::post('/event/{id}/dokumentasi', [\App\Http\Controllers\Manage\DokumentasiController::class, 'store'])->name('manage.event.dokumentasi.store');
            Route::delete('/dokumentasi/{id}', [\App\Http\Controllers\Manage\DokumentasiController::class, 'destroy'])->name('manage.event.dokumentasi.destroy');

            // Jadwal
            Route::get('/jadwal', [\App\Http\Controllers\Manage\JadwalController::class, 'index'])->name('manage.jadwal.index');
            Route::post('/jadwal', [\App\Http\Controllers\Manage\JadwalController::class, 'store'])->name('manage.jadwal.store');
            Route::put('/jadwal/{id}', [\App\Http\Controllers\Manage\JadwalController::class, 'update'])->name('manage.jadwal.update');
            Route::delete('/jadwal/{id}', [\App\Http\Controllers\Manage\JadwalController::class, 'destroy'])->name('manage.jadwal.destroy');

            // Struktur Organisasi
            Route::get('/struktur', [\App\Http\Controllers\Manage\StrukturController::class, 'index'])->name('manage.struktur.index');
            Route::post('/struktur', [\App\Http\Controllers\Manage\StrukturController::class, 'store'])->name('manage.struktur.store');
            Route::put('/struktur/{id}', [\App\Http\Controllers\Manage\StrukturController::class, 'update'])->name('manage.struktur.update');
            Route::delete('/struktur/{id}', [\App\Http\Controllers\Manage\StrukturController::class, 'destroy'])->name('manage.struktur.destroy');

            // Album & Galeri
            Route::get('/album', [\App\Http\Controllers\Manage\AlbumController::class, 'index'])->name('manage.album.index');
            Route::post('/album', [\App\Http\Controllers\Manage\AlbumController::class, 'store'])->name('manage.album.store');
            Route::put('/album/{id}', [\App\Http\Controllers\Manage\AlbumController::class, 'update'])->name('manage.album.update');
            Route::delete('/album/{id}', [\App\Http\Controllers\Manage\AlbumController::class, 'destroy'])->name('manage.album.destroy');
            Route::post('/album/{id}/foto', [\App\Http\Controllers\Manage\FotoController::class, 'store'])->name('manage.album.foto.store');
            Route::delete('/foto/{id}', [\App\Http\Controllers\Manage\FotoController::class, 'destroy'])->name('manage.album.foto.destroy');

            // Laporan
            Route::get('/laporan', [\App\Http\Controllers\Manage\LaporanController::class, 'index'])->name('manage.laporan.index');
            Route::get('/laporan/pdf/anggota', [\App\Http\Controllers\Manage\LaporanController::class, 'exportAnggotaPdf'])->name('manage.laporan.anggota.pdf');
            Route::get('/laporan/excel/anggota', [\App\Http\Controllers\Manage\LaporanController::class, 'exportAnggotaExcel'])->name('manage.laporan.anggota.excel');
            Route::get('/laporan/pdf/absensi', [\App\Http\Controllers\Manage\LaporanController::class, 'exportAbsensiPdf'])->name('manage.laporan.absensi.pdf');
            Route::get('/laporan/excel/absensi', [\App\Http\Controllers\Manage\LaporanController::class, 'exportAbsensiExcel'])->name('manage.laporan.absensi.excel');
            Route::get('/laporan/pdf/penilaian', [\App\Http\Controllers\Manage\LaporanController::class, 'exportPenilaianPdf'])->name('manage.laporan.penilaian.pdf');
            Route::get('/laporan/excel/penilaian', [\App\Http\Controllers\Manage\LaporanController::class, 'exportPenilaianExcel'])->name('manage.laporan.penilaian.excel');
        });

    // Kesiswaan (Admin) Routes
    Route::middleware(['role:kesiswaan'])->group(function () {
        Route::get('/admin/siswa/import', [\App\Http\Controllers\Admin\ImportController::class, 'create'])->name('admin.siswa.import');
        Route::post('/admin/siswa/import', [\App\Http\Controllers\Admin\ImportController::class, 'store']);
        Route::get('/admin/audit-log', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('admin.audit-log.index');
    });

    // Pengurus OSIS Routes
    Route::middleware(['role:pengurus-osis'])->group(function () {
        Route::get('/admin/pengurus', [\App\Http\Controllers\Admin\PengurusController::class, 'index'])->name('admin.pengurus.index');
        Route::post('/admin/pengurus/assign', [\App\Http\Controllers\Admin\PengurusController::class, 'assign'])->name('admin.pengurus.assign');
        Route::delete('/admin/pengurus/{id}', [\App\Http\Controllers\Admin\PengurusController::class, 'revoke'])->name('admin.pengurus.revoke');
        Route::post('/admin/pengurus/suksesi-osis', [\App\Http\Controllers\Admin\PengurusController::class, 'suksesiOsis'])->name('admin.pengurus.suksesi-osis');
    });
});
