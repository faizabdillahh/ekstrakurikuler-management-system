<?php

namespace App\Imports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class SiswaImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * Map Excel rows to the User model.
     */
    public function model(array $row)
    {
        // 1. Resolve NIS (Required)
        $nis = $row['nis'] ?? $row['NIS'] ?? $row['Nis'] ?? null;
        if (!$nis) {
            return null;
        }

        // 2. Resolve Name (Required)
        $nama = $row['nama'] ?? $row['Nama'] ?? $row['nama_lengkap'] ?? $row['Nama Lengkap'] ?? null;
        if (!$nama) {
            return null;
        }

        // 3. Resolve Class
        $kelas = $row['kelas'] ?? $row['Kelas'] ?? null;

        // 4. Resolve Jurusan
        $jurusan = $row['jurusan'] ?? $row['Jurusan'] ?? null;

        // 5. Resolve Gender (L/P)
        $jkRaw = $row['jenis_kelamin'] ?? $row['Jenis Kelamin'] ?? $row['gender'] ?? $row['Gender'] ?? $row['lp'] ?? $row['L/P'] ?? 'L';
        $jk = strtoupper(trim($jkRaw));
        if ($jk !== 'P') {
            $jk = 'L';
        }

        // 6. Resolve Phone Number
        $noHp = $row['no_hp'] ?? $row['No HP'] ?? $row['nomor_hp'] ?? $row['Nomor HP'] ?? $row['No. HP'] ?? null;
        if ($noHp) {
            $noHp = preg_replace('/[^0-9+]/', '', (string)$noHp);
        }

        // 7. Resolve Email
        $email = $row['email'] ?? $row['Email'] ?? $row['email_sekolah'] ?? $row['Email Sekolah'] ?? null;
        if (!$email) {
            // Map the department name to its subdomain code
            $jurusanCode = 'pplg'; // Default fallback
            if ($jurusan) {
                $jTrim = strtolower(trim($jurusan));
                if (str_contains($jTrim, 'rekayasa') || str_contains($jTrim, 'rpl') || str_contains($jTrim, 'pplg') || str_contains($jTrim, 'gim')) {
                    $jurusanCode = 'pplg';
                } elseif (str_contains($jTrim, 'komputer') || str_contains($jTrim, 'tkj') || str_contains($jTrim, 'tjkt') || str_contains($jTrim, 'jaringan')) {
                    $jurusanCode = 'tjkt';
                } elseif (str_contains($jTrim, 'bisnis') || str_contains($jTrim, 'bd') || str_contains($jTrim, 'digital')) {
                    $jurusanCode = 'bd';
                } elseif (str_contains($jTrim, 'akuntansi') || str_contains($jTrim, 'akl') || str_contains($jTrim, 'ak')) {
                    $jurusanCode = 'akl';
                } elseif (str_contains($jTrim, 'perkantoran') || str_contains($jTrim, 'mplb') || str_contains($jTrim, 'mp')) {
                    $jurusanCode = 'mplb';
                } elseif (str_contains($jTrim, 'desain') || str_contains($jTrim, 'dkv') || str_contains($jTrim, 'visual') || str_contains($jTrim, 'multimedia')) {
                    $jurusanCode = 'dkv';
                } elseif (str_contains($jTrim, 'perikanan') || str_contains($jTrim, 'apat')) {
                    $jurusanCode = 'apat';
                } elseif (str_contains($jTrim, 'elektronika') || str_contains($jTrim, 'te')) {
                    $jurusanCode = 'te';
                } elseif (str_contains($jTrim, 'logistik') || str_contains($jTrim, 'mlog')) {
                    $jurusanCode = 'mlog';
                } elseif (str_contains($jTrim, 'mesin') || str_contains($jTrim, 'tm')) {
                    $jurusanCode = 'tm';
                }
            }
            $email = $nis . '@' . $jurusanCode . '.smkn1bawang.sch.id';
        }

        // 8. Create or update user
        $user = User::updateOrCreate(
            ['nis' => $nis],
            [
                'nama' => $nama,
                'email' => $email,
                'kelas' => $kelas,
                'jurusan' => $jurusan,
                'jenis_kelamin' => $jk,
                'no_hp' => $noHp,
                'status' => 'aktif',
                'email_verified_at' => now(),
            ]
        );

        // Assign default 'siswa' role if not already assigned
        if (!$user->hasRole('siswa')) {
            $user->assignRole('siswa');
        }

        return $user;
    }

    /**
     * Define validation rules for rows.
     */
    public function rules(): array
    {
        return [];
    }
}
