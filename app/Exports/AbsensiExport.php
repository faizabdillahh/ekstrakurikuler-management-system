<?php

namespace App\Exports;

use App\Models\Anggota;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class AbsensiExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $ekskul_ta_id;

    public function __construct(string $ekskul_ta_id)
    {
        $this->ekskul_ta_id = $ekskul_ta_id;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Anggota::with(['user', 'absensi'])
            ->where('ekskul_ta_id', $this->ekskul_ta_id)
            ->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'NIS',
            'Kelas',
            'Jurusan',
            'Total Sesi Latihan',
            'Hadir',
            'Izin',
            'Sakit',
            'Alfa',
            'Persentase Kehadiran',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        $total = $row->absensi->count();
        $hadir = $row->absensi->where('status', 'hadir')->count();
        $izin = $row->absensi->where('status', 'izin')->count();
        $sakit = $row->absensi->where('status', 'sakit')->count();
        $alfa = $row->absensi->where('status', 'alfa')->count();
        $percentage = $total > 0 ? round(($hadir / $total) * 100, 2) . '%' : '0%';

        return [
            $row->user->nama,
            $row->user->nis ?? '-',
            $row->user->kelas ?? '-',
            $row->user->jurusan ?? '-',
            $total,
            $hadir,
            $izin,
            $sakit,
            $alfa,
            $percentage,
        ];
    }
}
