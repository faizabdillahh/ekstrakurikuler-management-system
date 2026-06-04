<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create {nama} {email} {--role=siswa} {--nis=} {--kelas=} {--jurusan=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user in the database for local testing and assign a role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $nama = $this->argument('nama');
        $email = $this->argument('email');
        $roleName = $this->option('role');
        $nis = $this->option('nis');
        $kelas = $this->option('kelas');
        $jurusan = $this->option('jurusan');

        if (User::where('email', $email)->exists()) {
            $this->error("User dengan email {$email} sudah terdaftar!");
            return Command::FAILURE;
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
        return Command::SUCCESS;
    }
}
