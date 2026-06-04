<?php

namespace App\Http\Controllers\Manage;

use App\Exports\AbsensiExport;
use App\Exports\AnggotaExport;
use App\Exports\PenilaianExport;
use App\Http\Controllers\Controller;
use App\Models\Anggota;
use App\Models\EkskulTahunAjaran;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LaporanController extends Controller
{
    /**
     * Display reports dashboard.
     */
    public function index(string $ekskul_ta_id): Response
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);

        return Inertia::render('Manage/Laporan/Index', [
            'ekskulTa' => [
                'id' => $ekskulTa->id,
                'ekskul_nama' => $ekskulTa->ekskul->nama,
            ],
        ]);
    }

    /**
     * Export members list to PDF.
     */
    public function exportAnggotaPdf(string $ekskul_ta_id): HttpResponse
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $anggota = Anggota::with('user')
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->get();

        $pdf = Pdf::loadView('pdf.anggota', [
            'ekskulNama' => $ekskulTa->ekskul->nama,
            'tanggalCetak' => now()->format('d M Y'),
            'anggota' => $anggota,
        ]);

        $fileName = 'laporan-anggota-' . str_replace(' ', '-', strtolower($ekskulTa->ekskul->nama)) . '.pdf';
        return $pdf->download($fileName);
    }

    /**
     * Export members list to Excel.
     */
    public function exportAnggotaExcel(string $ekskul_ta_id): BinaryFileResponse
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $fileName = 'laporan-anggota-' . str_replace(' ', '-', strtolower($ekskulTa->ekskul->nama)) . '.xlsx';
        return Excel::download(new AnggotaExport($ekskul_ta_id), $fileName);
    }

    /**
     * Export attendance metrics to PDF.
     */
    public function exportAbsensiPdf(string $ekskul_ta_id): HttpResponse
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $anggota = Anggota::with(['user', 'absensi'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->get();

        $pdf = Pdf::loadView('pdf.absensi', [
            'ekskulNama' => $ekskulTa->ekskul->nama,
            'tanggalCetak' => now()->format('d M Y'),
            'anggota' => $anggota,
        ]);

        $fileName = 'laporan-absensi-' . str_replace(' ', '-', strtolower($ekskulTa->ekskul->nama)) . '.pdf';
        return $pdf->download($fileName);
    }

    /**
     * Export attendance metrics to Excel.
     */
    public function exportAbsensiExcel(string $ekskul_ta_id): BinaryFileResponse
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $fileName = 'laporan-absensi-' . str_replace(' ', '-', strtolower($ekskulTa->ekskul->nama)) . '.xlsx';
        return Excel::download(new AbsensiExport($ekskul_ta_id), $fileName);
    }

    /**
     * Export grading sheet to PDF.
     */
    public function exportPenilaianPdf(string $ekskul_ta_id): HttpResponse
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $anggota = Anggota::with(['user', 'penilaian.grader'])
            ->where('ekskul_ta_id', $ekskul_ta_id)
            ->get();

        $pdf = Pdf::loadView('pdf.penilaian', [
            'ekskulNama' => $ekskulTa->ekskul->nama,
            'tanggalCetak' => now()->format('d M Y'),
            'anggota' => $anggota,
        ]);

        $fileName = 'laporan-nilai-' . str_replace(' ', '-', strtolower($ekskulTa->ekskul->nama)) . '.pdf';
        return $pdf->download($fileName);
    }

    /**
     * Export grading sheet to Excel.
     */
    public function exportPenilaianExcel(string $ekskul_ta_id): BinaryFileResponse
    {
        $ekskulTa = EkskulTahunAjaran::with(['ekskul'])->findOrFail($ekskul_ta_id);
        $fileName = 'laporan-nilai-' . str_replace(' ', '-', strtolower($ekskulTa->ekskul->nama)) . '.xlsx';
        return Excel::download(new PenilaianExport($ekskul_ta_id), $fileName);
    }
}
