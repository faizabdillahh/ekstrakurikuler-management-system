<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('user:create {nama} {email} {--role=siswa} {--nis=} {--kelas=} {--jurusan=}', function ($nama, $email) {
    $roleName = $this->option('role');
    $nis = $this->option('nis');
    $kelas = $this->option('kelas');
    $jurusan = $this->option('jurusan');

    if (User::where('email', $email)->exists()) {
        $this->error("User dengan email {$email} sudah terdaftar!");
        return;
    }

    $user = User::create([
        'nama' => $nama,
        'email' => $email,
        'nis' => $nis,
        'kelas' => $kelas,
        'jurusan' => $jurusan,
        'status' => 'aktif',
        'email_verified_at' => now(),
    ]);

    if ($roleName) {
        $user->assignRole($roleName);
    }

    $this->info("User {$nama} ({$email}) berhasil dibuat dengan role '{$roleName}'!");
})->purpose('Create a new user in the database for local testing and assign a role');

use Illuminate\Support\Facades\Schedule;
Schedule::command('sertifikat:cleanup')->daily();


