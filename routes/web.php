<?php

use App\Http\Controllers\Auth\SocialiteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Welcome Route
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Login Page Route
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login')->middleware('guest');

// Google OAuth Authentication Routes
Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->name('auth.google.callback');
Route::post('/auth/logout', [SocialiteController::class, 'logout'])->name('logout');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Shared Ekskul Routes
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
        });

    // Kesiswaan (Admin) Routes
    Route::middleware(['role:kesiswaan'])->group(function () {
        Route::get('/admin/siswa/import', [\App\Http\Controllers\Admin\ImportController::class, 'create'])->name('admin.siswa.import');
        Route::post('/admin/siswa/import', [\App\Http\Controllers\Admin\ImportController::class, 'store']);
    });
});

