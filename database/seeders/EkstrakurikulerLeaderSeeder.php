<?php

namespace Database\Seeders;

use App\Models\Ekskul;
use App\Models\EkskulTahunAjaran;
use App\Models\TahunAjaran;
use App\Models\User;
use App\Models\AdminEkskulAssignment;
use App\Models\Anggota;
use App\Models\StrukturOrganisasi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EkstrakurikulerLeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tahunAjaran = TahunAjaran::where('is_aktif', true)->first();
        if (!$tahunAjaran) {
            $tahunAjaran = TahunAjaran::create([
                'nama' => '2026/2027',
                'tanggal_mulai' => '2026-07-01',
                'tanggal_selesai' => '2027-06-30',
                'is_aktif' => true,
                'is_archived' => false,
            ]);
        }

        $leadersData = [
            [
                'nama' => 'Erlangga Irfan Jati',
                'kelas' => 'XI RPL',
                'jurusan' => 'Rekayasa Perangkat Lunak',
                'ekskul_nama' => 'PKS',
                'no_hp' => '+62 882-3358-0016',
                'gender' => 'L',
                'kategori' => 'Kemanusiaan & Bela Negara'
            ],
            [
                'nama' => 'Alvy Nur Khasanah',
                'kelas' => 'XI LPB',
                'jurusan' => 'Layanan Perbankan Syariah',
                'ekskul_nama' => 'PMR Wira (Palang Merah Remaja)',
                'no_hp' => '088802966231',
                'gender' => 'P',
                'kategori' => 'Kemanusiaan & Bela Negara'
            ],
            [
                'nama' => 'Augya Ridha Yuliza',
                'kelas' => 'XI TKJ 2',
                'jurusan' => 'Teknik Komputer dan Jaringan',
                'ekskul_nama' => 'Tari Tradisional',
                'no_hp' => '087832517610',
                'gender' => 'P',
                'kategori' => 'Seni & Budaya'
            ],
            [
                'nama' => 'Jeny Suryaningsih',
                'kelas' => 'XII MP 2',
                'jurusan' => 'Manajemen Perkantoran',
                'ekskul_nama' => 'Teater',
                'no_hp' => '083840237727',
                'gender' => 'P',
                'kategori' => 'Seni & Budaya'
            ],
            [
                'nama' => 'Tria Nur Kholifah',
                'kelas' => 'XI LPB',
                'jurusan' => 'Layanan Perbankan Syariah',
                'ekskul_nama' => 'Atletik',
                'no_hp' => '085875562744',
                'gender' => 'P',
                'kategori' => 'Olahraga & Kesehatan'
            ],
            [
                'nama' => 'Dholi Adi Pratama',
                'kelas' => 'XI TJKT 2',
                'jurusan' => 'Teknik Jaringan Komputer dan Telekomunikasi',
                'ekskul_nama' => 'Multi Media',
                'no_hp' => '082135867571',
                'gender' => 'L',
                'kategori' => 'Sains & Teknologi'
            ],
            [
                'nama' => 'Awaluddin Adaffa',
                'kelas' => 'X AP 1',
                'jurusan' => 'Agribisnis Perikanan Air Tawar',
                'ekskul_nama' => 'Futsal',
                'no_hp' => '085135339704',
                'gender' => 'L',
                'kategori' => 'Olahraga & Kesehatan'
            ],
            [
                'nama' => 'Johan Adi Wibowo',
                'kelas' => 'XI BD',
                'jurusan' => 'Bisnis Digital',
                'ekskul_nama' => 'Palase',
                'no_hp' => '085747432227',
                'gender' => 'L',
                'kategori' => 'Kemanusiaan & Bela Negara'
            ],
            [
                'nama' => 'Vera Anggrayni Laila Mutohharoh',
                'kelas' => 'XI TJKT 2',
                'jurusan' => 'Teknik Jaringan Komputer dan Telekomunikasi',
                'ekskul_nama' => 'Karawitan',
                'no_hp' => '+62 812-2564-2987',
                'gender' => 'P',
                'kategori' => 'Seni & Budaya'
            ],
            [
                'nama' => 'Keysha Resti Fajar Nandika',
                'kelas' => 'X TE 2',
                'jurusan' => 'Teknik Elektronika',
                'ekskul_nama' => 'Paduan Suara (Gita Suara)',
                'no_hp' => '085942172680',
                'gender' => 'P',
                'kategori' => 'Seni & Budaya'
            ],
            [
                'nama' => 'Famya Rahma Permadi',
                'kelas' => 'X MPLB 2',
                'jurusan' => 'Manajemen Perkantoran dan Layanan Bisnis',
                'ekskul_nama' => 'Tari Modern (Modern Dance)',
                'no_hp' => '+62 895-2685-5975',
                'gender' => 'P',
                'kategori' => 'Seni & Budaya'
            ],
            [
                'nama' => 'Chalisa Firzhani Hapsari',
                'kelas' => 'XI MP 1',
                'jurusan' => 'Manajemen Perkantoran',
                'ekskul_nama' => 'Seni Lukis & Kriya',
                'no_hp' => '+62 813-2513-6360',
                'gender' => 'P',
                'kategori' => 'Seni & Budaya'
            ],
            [
                'nama' => 'Hannan Habibur Rahmaan',
                'kelas' => 'XI BD',
                'jurusan' => 'Bisnis Digital',
                'ekskul_nama' => 'Panahan',
                'no_hp' => '+62 882-0054-06087',
                'gender' => 'L',
                'kategori' => 'Olahraga & Kesehatan'
            ],
            [
                'nama' => 'Alwi Assegaf',
                'kelas' => '11 APAT 1',
                'jurusan' => 'Agribisnis Perikanan Air Tawar',
                'ekskul_nama' => 'Rebana',
                'no_hp' => '+62-856-4140-8033',
                'gender' => 'L',
                'kategori' => 'Keagamaan'
            ],
            [
                'nama' => 'Rulia Syifa Kalina Zakia',
                'kelas' => 'XI BD',
                'jurusan' => 'Bisnis Digital',
                'ekskul_nama' => 'PIK Remaja (PIK R)',
                'no_hp' => '082264285016',
                'gender' => 'P',
                'kategori' => 'Kemanusiaan & Bela Negara'
            ],
            [
                'nama' => 'Rio Garap Aramiko',
                'kelas' => '11 APAT 3',
                'jurusan' => 'Agribisnis Perikanan Air Tawar',
                'ekskul_nama' => 'E-sport',
                'no_hp' => '085154836790',
                'gender' => 'L',
                'kategori' => 'Sains & Teknologi'
            ],
            [
                'nama' => 'Nadya Nur Nailah',
                'kelas' => 'XI MLOG',
                'jurusan' => 'Manajemen Logistik',
                'ekskul_nama' => 'Karya Ilmiah Remaja (KIR)',
                'no_hp' => '+62 878-9477-3454',
                'gender' => 'P',
                'kategori' => 'Sains & Teknologi'
            ],
            [
                'nama' => 'Syarifatul Ummah',
                'kelas' => 'XI MP 1',
                'jurusan' => 'Manajemen Perkantoran',
                'ekskul_nama' => 'Rohani Islam (Rohis)',
                'no_hp' => '+62 819-9334-7121',
                'gender' => 'P',
                'kategori' => 'Keagamaan'
            ],
            [
                'nama' => 'Kaeyla rizza azahra',
                'kelas' => 'XI AK 1',
                'jurusan' => 'Akuntansi',
                'ekskul_nama' => 'Karate',
                'no_hp' => '+62 822-5773-0376',
                'gender' => 'P',
                'kategori' => 'Kemanusiaan & Bela Negara'
            ],
            [
                'nama' => 'Ririt Purwaningsih',
                'kelas' => 'X TJKT 2',
                'jurusan' => 'Teknik Jaringan Komputer dan Telekomunikasi',
                'ekskul_nama' => 'Takraw',
                'no_hp' => '+62 881-7662-149',
                'gender' => 'P',
                'kategori' => 'Olahraga & Kesehatan'
            ],
            [
                'nama' => 'Nazwa Tegar Auliya',
                'kelas' => 'XI APAT 2',
                'jurusan' => 'Agribisnis Perikanan Air Tawar',
                'ekskul_nama' => 'Voli',
                'no_hp' => '0823-2209-9273',
                'gender' => 'L',
                'kategori' => 'Olahraga & Kesehatan'
            ],
            [
                'nama' => 'Migge Tegar Fallahi',
                'kelas' => 'XI PG',
                'jurusan' => 'Pengembangan Gim',
                'ekskul_nama' => 'Basket',
                'no_hp' => '088238827323',
                'gender' => 'L',
                'kategori' => 'Olahraga & Kesehatan'
            ],
            [
                'nama' => 'Pinkan Rastiana Gayuh Palupi',
                'kelas' => 'XI DPB 2',
                'jurusan' => 'Desain Pemodelan dan Informasi Bangunan',
                'ekskul_nama' => 'Chayo',
                'no_hp' => '+62 858-6710-1350',
                'gender' => 'P',
                'kategori' => 'Seni & Budaya'
            ],
            [
                'nama' => 'Zaki Rulis Oktori',
                'kelas' => 'XI TKJ 1',
                'jurusan' => 'Teknik Komputer dan Jaringan',
                'ekskul_nama' => 'Badminton',
                'no_hp' => '+62 857-8669-7354',
                'gender' => 'L',
                'kategori' => 'Olahraga & Kesehatan'
            ],
            [
                'nama' => 'Laura Lintang',
                'kelas' => 'X TE 2',
                'jurusan' => 'Teknik Elektronika',
                'ekskul_nama' => 'Pencak Silat',
                'no_hp' => '+62 889-8023-8400',
                'gender' => 'P',
                'kategori' => 'Kemanusiaan & Bela Negara'
            ],
            [
                'nama' => 'Mochammad Rico Setiyana',
                'kelas' => 'Xl TM 2',
                'jurusan' => 'Teknik Mesin',
                'ekskul_nama' => 'Renang',
                'no_hp' => '+62 882-0033-86722',
                'gender' => 'L',
                'kategori' => 'Olahraga & Kesehatan'
            ],
            [
                'nama' => 'ALQODRI ADI TRI WALUYO',
                'kelas' => 'XI RPL',
                'jurusan' => 'Rekayasa Perangkat Lunak',
                'ekskul_nama' => 'Pramuka Wijaya',
                'no_hp' => '0882-2514-3124',
                'gender' => 'L',
                'kategori' => 'Kemanusiaan & Bela Negara'
            ],
            [
                'nama' => 'Baihaqqi Fadli Ar Rahman',
                'kelas' => 'XII AK 1',
                'jurusan' => 'Akuntansi',
                'ekskul_nama' => 'FLC',
                'no_hp' => '082313465075',
                'gender' => 'L',
                'kategori' => 'Sains & Teknologi'
            ],
            [
                'nama' => 'Marisa Rizqi Nugraheni',
                'kelas' => 'XI TKJ 2',
                'jurusan' => 'Teknik Komputer dan Jaringan',
                'ekskul_nama' => 'Musik & Band',
                'no_hp' => '0819-3571-5889',
                'gender' => 'P',
                'kategori' => 'Seni & Budaya'
            ],
            [
                'nama' => 'Arda Binuri Bambika',
                'kelas' => 'XI BD',
                'jurusan' => 'Bisnis Digital',
                'ekskul_nama' => 'Kewirausahaan (KWU)',
                'no_hp' => '+62 882-0035-62360',
                'gender' => 'L',
                'kategori' => 'Sains & Teknologi'
            ]
        ];

        // System Admin or OSIS for Ditugaskan Oleh FK
        $kesiswaan = User::role('kesiswaan')->first();
        $kesiswaanId = $kesiswaan ? $kesiswaan->id : User::first()->id;

        foreach ($leadersData as $data) {
            // Normalize email
            $cleanName = strtolower(preg_replace('/[^a-zA-Z]/', '', $data['nama']));
            $email = substr($cleanName, 0, 15) . '.ketua@smkn1bawang.sch.id';

            // Check if user already exists
            $user = User::where('email', $email)->first();
            if (!$user) {
                // Generate dummy NIS if not present
                $nis = '11' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT);
                $user = User::create([
                    'nama' => $data['nama'],
                    'email' => $email,
                    'nis' => $nis,
                    'kelas' => $data['kelas'],
                    'jurusan' => $data['jurusan'],
                    'jenis_kelamin' => $data['gender'],
                    'no_hp' => $data['no_hp'],
                    'status' => 'aktif',
                    'email_verified_at' => now(),
                ]);
            }

            // Assign Roles
            $user->assignRole('admin-ekskul');
            $user->assignRole('siswa');

            // Find or create Ekstrakurikuler master
            $ekskul = Ekskul::where('nama', 'LIKE', '%' . $data['ekskul_nama'] . '%')
                ->orWhere('nama', $data['ekskul_nama'])
                ->first();

            if (!$ekskul) {
                $ekskul = Ekskul::create([
                    'nama' => $data['ekskul_nama'],
                    'kategori' => $data['kategori'],
                    'deskripsi' => 'Ekstrakurikuler ' . $data['ekskul_nama'] . ' SMKN 1 Bawang.',
                    'warna_primer' => '#124272',
                    'warna_sekunder' => '#fda800',
                    'media_sosial' => ['instagram' => '@ekskul_' . strtolower(str_replace(' ', '_', $data['ekskul_nama']))],
                    'is_active' => true,
                ]);
            }

            // Find or create EkskulTahunAjaran
            $ekskulTa = EkskulTahunAjaran::where('ekskul_id', $ekskul->id)
                ->where('tahun_ajaran_id', $tahunAjaran->id)
                ->first();

            if (!$ekskulTa) {
                $ekskulTa = EkskulTahunAjaran::create([
                    'ekskul_id' => $ekskul->id,
                    'tahun_ajaran_id' => $tahunAjaran->id,
                    'kuota_anggota' => 40,
                    'is_pendaftaran_dibuka' => true,
                    'is_seleksi_final' => false,
                ]);
            }

            // Assign as Admin Ekskul Assignment
            AdminEkskulAssignment::updateOrCreate([
                'user_id' => $user->id,
                'ekskul_ta_id' => $ekskulTa->id,
            ], [
                'ditugaskan_oleh' => $kesiswaanId
            ]);

            // Add as active member (Anggota)
            $anggota = Anggota::updateOrCreate([
                'user_id' => $user->id,
                'ekskul_ta_id' => $ekskulTa->id,
            ], [
                'status' => 'aktif',
                'tanggal_bergabung' => now()->format('Y-m-d'),
                'sumber' => 'manual',
            ]);

            // Add to Struktur Organisasi as Ketua
            StrukturOrganisasi::updateOrCreate([
                'ekskul_ta_id' => $ekskulTa->id,
                'anggota_id' => $anggota->id,
            ], [
                'jabatan' => 'Ketua',
                'urutan' => 1
            ]);
        }
    }
}
