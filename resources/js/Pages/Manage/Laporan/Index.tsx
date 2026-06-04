import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
}

export default function Index({ ekskulTa }: IndexProps) {
    const reportTypes = [
        {
            title: 'Daftar Roster Anggota',
            desc: 'Cetak daftar seluruh anggota aktif dan dikeluarkan beserta identitas kelas, NIS, tanggal bergabung, dan sumber pendaftaran.',
            pdfUrl: `/manage/ekskul/${ekskulTa.id}/laporan/pdf/anggota`,
            excelUrl: `/manage/ekskul/${ekskulTa.id}/laporan/excel/anggota`,
            icon: '👥',
        },
        {
            title: 'Rekapitulasi Absensi Kehadiran',
            desc: 'Rekapitulasi total kehadiran latihan rutin, rasio presensi per siswa (Hadir, Izin, Sakit, Alfa), serta persentase kehadiran.',
            pdfUrl: `/manage/ekskul/${ekskulTa.id}/laporan/pdf/absensi`,
            excelUrl: `/manage/ekskul/${ekskulTa.id}/laporan/excel/absensi`,
            icon: '📅',
        },
        {
            title: 'Penilaian Akhir Anggota',
            desc: 'Unduh laporan nilai akhir anggota sebagai dokumen resmi sekolah. Mencantumkan nilai akhir (skala 100) dan guru penilai.',
            pdfUrl: `/manage/ekskul/${ekskulTa.id}/laporan/pdf/penilaian`,
            excelUrl: `/manage/ekskul/${ekskulTa.id}/laporan/excel/penilaian`,
            icon: '🏆',
        },
    ];

    return (
        <AuthenticatedLayout title={`Laporan ${ekskulTa.ekskul_nama}`}>
            <Head title={`Laporan - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Pusat Laporan & Ekspor</h2>
                    <p className="text-xs text-gray-400 font-bold">Unduh laporan resmi kegiatan ekstrakurikuler dalam format PDF dan Excel spreadsheet.</p>
                </div>

                {/* Report Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reportTypes.map((rep, idx) => (
                        <div key={idx} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-navy/5 flex items-center justify-center rounded-2xl text-2xl">
                                    {rep.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-navy text-md">{rep.title}</h3>
                                    <p className="text-xs text-gray-400 font-semibold leading-relaxed">{rep.desc}</p>
                                </div>
                            </div>

                            {/* Export Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <a
                                    href={rep.pdfUrl}
                                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm text-center block transition-all"
                                >
                                    Unduh PDF
                                </a>
                                <a
                                    href={rep.excelUrl}
                                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm text-center block transition-all"
                                >
                                    Unduh Excel
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
