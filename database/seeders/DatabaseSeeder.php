<?php

namespace Database\Seeders;

use App\Models\Ekskul;
use App\Models\EkskulTahunAjaran;
use App\Models\Permission;
use App\Models\Role;
use App\Models\TahunAjaran;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Roles
        $roles = ['siswa', 'admin-ekskul', 'pengurus-osis', 'pembina', 'kesiswaan'];
        $roleModels = [];
        foreach ($roles as $roleName) {
            $roleModels[$roleName] = Role::create([
                'name' => $roleName,
                'guard_name' => 'web'
            ]);
        }

        // 2. Seed Active Tahun Ajaran
        $tahunAjaran = TahunAjaran::create([
            'nama' => '2026/2027',
            'tanggal_mulai' => '2026-07-01',
            'tanggal_selesai' => '2027-06-30',
            'is_aktif' => true,
            'is_archived' => false,
        ]);

        // 3. Seed 27 Default Extracurricular Activities
        $ekskulsData = [
            // Kategori: Bela Negara
            ['nama' => 'Pramuka Wijaya', 'kategori' => 'Kemanusiaan & Bela Negara', 'warna_primer' => '#124272', 'warna_sekunder' => '#fda800'],
            ['nama' => 'Paskibra', 'kategori' => 'Kemanusiaan & Bela Negara', 'warna_primer' => '#fda800', 'warna_sekunder' => '#124272'],
            ['nama' => 'Pencak Silat', 'kategori' => 'Kemanusiaan & Bela Negara', 'warna_primer' => '#15160c', 'warna_sekunder' => '#fda800'],
            ['nama' => 'Taekwondo', 'kategori' => 'Kemanusiaan & Bela Negara', 'warna_primer' => '#00a2e9', 'warna_sekunder' => '#124272'],

            // Kategori: Kemanusiaan
            ['nama' => 'PMR Wira (Palang Merah Remaja)', 'kategori' => 'Kemanusiaan & Bela Negara', 'warna_primer' => '#ff3b30', 'warna_sekunder' => '#ffffff'],
            ['nama' => 'Pecinta Alam (PA)', 'kategori' => 'Kemanusiaan & Bela Negara', 'warna_primer' => '#34c759', 'warna_sekunder' => '#15160c'],

            // Kategori: Kepemimpinan
            ['nama' => 'OSIS (Organisasi Siswa Intra Sekolah)', 'kategori' => 'Kemanusiaan & Bela Negara', 'warna_primer' => '#124272', 'warna_sekunder' => '#ffffff'],

            // Kategori: Olahraga
            ['nama' => 'Futsal', 'kategori' => 'Olahraga & Kesehatan', 'warna_primer' => '#007aff', 'warna_sekunder' => '#fda800'],
            ['nama' => 'Basket', 'kategori' => 'Olahraga & Kesehatan', 'warna_primer' => '#fda800', 'warna_sekunder' => '#15160c'],
            ['nama' => 'Voli', 'kategori' => 'Olahraga & Kesehatan', 'warna_primer' => '#34c759', 'warna_sekunder' => '#fda800'],
            ['nama' => 'Badminton', 'kategori' => 'Olahraga & Kesehatan', 'warna_primer' => '#ff9500', 'warna_sekunder' => '#00a2e9'],
            ['nama' => 'Tenis Meja', 'kategori' => 'Olahraga & Kesehatan', 'warna_primer' => '#00a2e9', 'warna_sekunder' => '#34c759'],
            ['nama' => 'Catur', 'kategori' => 'Olahraga & Kesehatan', 'warna_primer' => '#15160c', 'warna_sekunder' => '#ffffff'],

            // Kategori: Sains & Teknologi
            ['nama' => 'Klub IT & Robotik', 'kategori' => 'Sains & Teknologi', 'warna_primer' => '#00a2e9', 'warna_sekunder' => '#124272'],
            ['nama' => 'Web Design & Development', 'kategori' => 'Sains & Teknologi', 'warna_primer' => '#5856d6', 'warna_sekunder' => '#00a2e9'],
            ['nama' => 'Karya Ilmiah Remaja (KIR)', 'kategori' => 'Sains & Teknologi', 'warna_primer' => '#af52de', 'warna_sekunder' => '#ffffff'],

            // Kategori: Akademik
            ['nama' => 'English Club', 'kategori' => 'Sains & Teknologi', 'warna_primer' => '#00a2e9', 'warna_sekunder' => '#ff3b30'],
            ['nama' => 'Japanese Club', 'kategori' => 'Sains & Teknologi', 'warna_primer' => '#ff3b30', 'warna_sekunder' => '#15160c'],

            // Kategori: Keagamaan
            ['nama' => 'Rohani Islam (Rohis)', 'kategori' => 'Keagamaan', 'warna_primer' => '#34c759', 'warna_sekunder' => '#ffffff'],
            ['nama' => 'Rohani Kristen (Rohkris)', 'kategori' => 'Keagamaan', 'warna_primer' => '#007aff', 'warna_sekunder' => '#ffffff'],

            // Kategori: Seni & Budaya
            ['nama' => 'Paduan Suara (Gita Suara)', 'kategori' => 'Seni & Budaya', 'warna_primer' => '#ff2d55', 'warna_sekunder' => '#fda800'],
            ['nama' => 'Tari Tradisional', 'kategori' => 'Seni & Budaya', 'warna_primer' => '#fda800', 'warna_sekunder' => '#34c759'],
            ['nama' => 'Tari Modern (Modern Dance)', 'kategori' => 'Seni & Budaya', 'warna_primer' => '#ff2d55', 'warna_sekunder' => '#15160c'],
            ['nama' => 'Teater', 'kategori' => 'Seni & Budaya', 'warna_primer' => '#5856d6', 'warna_sekunder' => '#fda800'],
            ['nama' => 'Jurnalistik & Fotografi', 'kategori' => 'Seni & Budaya', 'warna_primer' => '#00a2e9', 'warna_sekunder' => '#15160c'],
            ['nama' => 'Musik & Band', 'kategori' => 'Seni & Budaya', 'warna_primer' => '#ff9500', 'warna_sekunder' => '#15160c'],
            ['nama' => 'Seni Lukis & Kriya', 'kategori' => 'Seni & Budaya', 'warna_primer' => '#af52de', 'warna_sekunder' => '#fda800'],
        ];

        foreach ($ekskulsData as $ekskulItem) {
            $ekskul = Ekskul::create([
                'nama' => $ekskulItem['nama'],
                'kategori' => $ekskulItem['kategori'],
                'deskripsi' => 'Ekstrakurikuler ' . $ekskulItem['nama'] . ' SMKN 1 Bawang. Tempat menyalurkan minat, bakat, dan potensi diri secara produktif.',
                'warna_primer' => $ekskulItem['warna_primer'],
                'warna_sekunder' => $ekskulItem['warna_sekunder'],
                'media_sosial' => ['instagram' => '@ekskul_' . strtolower(str_replace(' ', '_', $ekskulItem['nama'])), 'tiktok' => '@ekskul_' . strtolower(str_replace(' ', '_', $ekskulItem['nama']))],
                'is_active' => true,
            ]);

            // Activate for this school year (ekskul_tahun_ajaran)
            EkskulTahunAjaran::create([
                'ekskul_id' => $ekskul->id,
                'tahun_ajaran_id' => $tahunAjaran->id,
                'kuota_anggota' => 40,
                'is_pendaftaran_dibuka' => true,
                'is_seleksi_final' => false,
            ]);
        }

        // 4. Seed Users and Roles
        // Kesiswaan User
        $kesiswaan = User::create([
            'nama' => 'Pak Rudi, S.Pd.',
            'email' => 'kesiswaan@smkn1bawang.sch.id',
            'jenis_kelamin' => 'L',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);
        $kesiswaan->assignRole('kesiswaan');

        // Pembina Users
        $pembina1 = User::create([
            'nama' => 'Ibu Sita, M.Pd.',
            'email' => 'sita.pembina@smkn1bawang.sch.id',
            'jenis_kelamin' => 'P',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);
        $pembina1->assignRole('pembina');

        $pembina2 = User::create([
            'nama' => 'Pak Joko, S.Kom.',
            'email' => 'joko.pembina@smkn1bawang.sch.id',
            'jenis_kelamin' => 'L',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);
        $pembina2->assignRole('pembina');

        // Admin Ekskul Users (Siswa Kelas 11)
        $adminEkskul1 = User::create([
            'nama' => 'Andi Pratama',
            'email' => 'andi.pratama@smkn1bawang.sch.id',
            'nis' => '12345',
            'kelas' => '11 RPL 1',
            'jurusan' => 'Rekayasa Perangkat Lunak',
            'jenis_kelamin' => 'L',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);
        $adminEkskul1->assignRole('admin-ekskul');

        $adminEkskul2 = User::create([
            'nama' => 'Budi Santoso',
            'email' => 'budi.santoso@smkn1bawang.sch.id',
            'nis' => '12346',
            'kelas' => '11 TKJ 2',
            'jurusan' => 'Teknik Komputer dan Jaringan',
            'jenis_kelamin' => 'L',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);
        $adminEkskul2->assignRole('admin-ekskul');

        // Student Users (Siswa Kelas 10)
        $studentsData = [
            ['nama' => 'Rina Wijaya', 'email' => 'rina.wijaya@smkn1bawang.sch.id', 'nis' => '20001', 'kelas' => '10 RPL 1', 'jurusan' => 'Rekayasa Perangkat Lunak', 'jenis_kelamin' => 'P'],
            ['nama' => 'Doni Setiawan', 'email' => 'doni.setiawan@smkn1bawang.sch.id', 'nis' => '20002', 'kelas' => '10 TKJ 1', 'jurusan' => 'Teknik Komputer dan Jaringan', 'jenis_kelamin' => 'L'],
            ['nama' => 'Siti Aminah', 'email' => 'siti.aminah@smkn1bawang.sch.id', 'nis' => '20003', 'kelas' => '10 DKV 2', 'jurusan' => 'Desain Komunikasi Visual', 'jenis_kelamin' => 'P'],
            ['nama' => 'Taufik Hidayat', 'email' => 'taufik.hidayat@smkn1bawang.sch.id', 'nis' => '20004', 'kelas' => '10 AKL 1', 'jurusan' => 'Akuntansi dan Keuangan Lembaga', 'jenis_kelamin' => 'L'],
            ['nama' => 'Fina Rahmawati', 'email' => 'fina.rahmawati@smkn1bawang.sch.id', 'nis' => '20005', 'kelas' => '10 MPLB 1', 'jurusan' => 'Manajemen Perkantoran dan Layanan Bisnis', 'jenis_kelamin' => 'P'],
        ];

        foreach ($studentsData as $studentItem) {
            $student = User::create([
                'nama' => $studentItem['nama'],
                'email' => $studentItem['email'],
                'nis' => $studentItem['nis'],
                'kelas' => $studentItem['kelas'],
                'jurusan' => $studentItem['jurusan'],
                'jenis_kelamin' => $studentItem['jenis_kelamin'],
                'status' => 'aktif',
                'email_verified_at' => now(),
            ]);
            $student->assignRole('siswa');
        }

        // 5. Seed Extracurricular Leaders
        $this->call(EkstrakurikulerLeaderSeeder::class);
    }
}
