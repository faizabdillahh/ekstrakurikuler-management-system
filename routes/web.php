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

    // Kesiswaan (Admin) Routes
    Route::middleware(['role:kesiswaan'])->group(function () {
        Route::get('/admin/siswa/import', [\App\Http\Controllers\Admin\ImportController::class, 'create'])->name('admin.siswa.import');
        Route::post('/admin/siswa/import', [\App\Http\Controllers\Admin\ImportController::class, 'store']);
    });
});

