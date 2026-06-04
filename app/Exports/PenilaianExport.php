<?php

namespace App\Exports;

use App\Models\Anggota;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PenilaianExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
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
        return Anggota::with(['user', 'penilaian.grader'])
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
            'Nilai Akhir',
            'Penilai (Grader)',
        ];
    }

    /**
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row->user->nama,
            $row->user->nis ?? '-',
            $row->user->kelas ?? '-',
            $row->user->jurusan ?? '-',
            $row->penilaian ? floatval($row->penilaian->nilai_akhir) : 'Belum dinilai',
            $row->penilaian && $row->penilaian->grader ? $row->penilaian->grader->nama : '-',
        ];
    }
}
