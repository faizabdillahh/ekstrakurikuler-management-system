import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface AnggotaUser {
    id: string;
    nama: string;
    nis: string | null;
    kelas: string | null;
    jurusan: string | null;
}

interface AbsensiRecord {
    id: string; // ID of absensi table row
    status: 'hadir' | 'izin' | 'sakit' | 'alfa';
    anggota: AnggotaUser;
}

interface ShowProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    session: {
        id: string;
        tanggal: string;
        keterangan: string | null;
    };
    records: AbsensiRecord[];
}

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

export default function Show({ ekskulTa, session, records }: ShowProps) {
    const { props } = usePage<SharedProps>();
    const { flash } = props;

    // We build the default form state where keys are absensi IDs, and values are current statuses
    const initialAttendance = records.reduce((acc, r) => {
        acc[r.id] = r.status;
        return acc;
    }, {} as Record<string, 'hadir' | 'izin' | 'sakit' | 'alfa'>);

    const form = useForm({
        attendance: initialAttendance,
    });

    const handleStatusChange = (absensiId: string, status: 'hadir' | 'izin' | 'sakit' | 'alfa') => {
        form.setData('attendance', {
            ...form.data.attendance,
            [absensiId]: status,
        });
    };

    const handleSelectAll = (status: 'hadir' | 'izin' | 'sakit' | 'alfa') => {
        const updated = records.reduce((acc, r) => {
            acc[r.id] = status;
            return acc;
        }, {} as Record<string, 'hadir' | 'izin' | 'sakit' | 'alfa'>);
        form.setData('attendance', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/manage/ekskul/${ekskulTa.id}/absensi/${session.id}`);
    };

    return (
        <AuthenticatedLayout title={`Kelola Kehadiran`}>
            <Head title={`Absensi ${session.tanggal} - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back button */}
                <div>
                    <Link 
                        href={`/manage/ekskul/${ekskulTa.id}/absensi`}
                        className="flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-navy transition-colors bg-white border border-gray-150 rounded-full px-4 py-2 w-fit"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Batal & Kembali</span>
                    </Link>
                </div>

                {/* Session Card Info */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-navy">Absensi Sesi: {session.tanggal}</h2>
                        <p className="text-xs text-gray-400 font-bold">
                            Materi: {session.keterangan || <span className="italic font-semibold text-gray-300">Tidak ada keterangan</span>}
                        </p>
                    </div>

                    {/* Quick Bulk Presets */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mr-2">Setel Semua:</span>
                        <button
                            type="button"
                            onClick={() => handleSelectAll('hadir')}
                            className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase rounded-lg hover:bg-green-100 transition-colors"
                        >
                            Hadir
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelectAll('izin')}
                            className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            Izin
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelectAll('sakit')}
                            className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-[10px] font-bold uppercase rounded-lg hover:bg-yellow-100 transition-colors"
                        >
                            Sakit
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelectAll('alfa')}
                            className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase rounded-lg hover:bg-red-100 transition-colors"
                        >
                            Alfa
                        </button>
                    </div>
                </div>

                {/* Form Sheet */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Identitas Siswa</th>
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider text-center">Status Kehadiran</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan={2} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                                Tidak ada anggota aktif untuk dilakukan absensi.
                                            </td>
                                        </tr>
                                    ) : (
                                        records.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50/40 transition-colors">
                                                <td className="p-4 space-y-1">
                                                    <p className="text-sm font-black text-gray-800">{r.anggota.nama}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">
                                                        NIS: {r.anggota.nis || '-'} | Kelas: {r.anggota.kelas || '-'} ({r.anggota.jurusan || '-'})
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center items-center space-x-2">
                                                        {[
                                                            { key: 'hadir', label: 'Hadir', activeStyle: 'bg-green-600 border-green-600 text-white', inactiveStyle: 'bg-white border-green-200 text-green-700 hover:bg-green-50' },
                                                            { key: 'izin', label: 'Izin', activeStyle: 'bg-blue-600 border-blue-600 text-white', inactiveStyle: 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50' },
                                                            { key: 'sakit', label: 'Sakit', activeStyle: 'bg-yellow-600 border-yellow-600 text-white', inactiveStyle: 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-50' },
                                                            { key: 'alfa', label: 'Alfa', activeStyle: 'bg-red-600 border-red-600 text-white', inactiveStyle: 'bg-white border-red-200 text-red-700 hover:bg-red-50' },
                                                        ].map((btn) => (
                                                            <button
                                                                key={btn.key}
                                                                type="button"
                                                                onClick={() => handleStatusChange(r.id, btn.key as any)}
                                                                className={`px-4 py-2 text-xs font-bold uppercase rounded-xl border transition-all ${
                                                                    form.data.attendance[r.id] === btn.key
                                                                        ? btn.activeStyle
                                                                        : btn.inactiveStyle
                                                                }`}
                                                            >
                                                                {btn.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={form.processing || records.length === 0}
                            className="px-6 py-3 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-navy-light transition-all disabled:opacity-50"
                        >
                            Simpan Rekap Absensi
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
