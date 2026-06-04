<?php

namespace App\Exports;

use App\Models\Anggota;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class AnggotaExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
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
        return Anggota::with('user')
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
            'Tanggal Bergabung',
            'Status Keanggotaan',
            'Sumber Pendaftaran',
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
            $row->tanggal_bergabung ? $row->tanggal_bergabung->format('Y-m-d') : '-',
            ucfirst($row->status),
            ucfirst($row->sumber),
        ];
    }
}
