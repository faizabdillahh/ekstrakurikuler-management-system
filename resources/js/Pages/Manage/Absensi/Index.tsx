import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface SessionItem {
    id: string;
    tanggal: string;
    keterangan: string | null;
    total_hadir: number;
    total_peserta: number;
}

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    sessions: SessionItem[];
}

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

export default function Index({ ekskulTa, sessions }: IndexProps) {
    const { props } = usePage<SharedProps>();
    const { flash } = props;

    const [showCreateForm, setShowCreateForm] = useState(false);

    const form = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
    });

    const handleCreateSession = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/manage/ekskul/${ekskulTa.id}/absensi`, {
            onSuccess: () => {
                form.reset();
                setShowCreateForm(false);
            }
        });
    };

    const handleDeleteSession = (id: string, date: string) => {
        if (confirm(`⚠️ Apakah Anda yakin ingin menghapus sesi absensi tanggal ${date}? Semua riwayat absensi siswa pada sesi ini akan terhapus secara permanen.`)) {
            router.delete(`/manage/ekskul/${ekskulTa.id}/absensi/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Absensi ${ekskulTa.ekskul_nama}`}>
            <Head title={`Absensi - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Alerts */}
                {flash.success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3 text-green-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-navy">Absensi Sesi Latihan</h2>
                        <p className="text-xs text-gray-400 font-bold">Kelola pencatatan kehadiran latihan rutin anggota.</p>
                    </div>

                    <div>
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="w-full sm:w-auto px-5 py-3 bg-secondary hover:bg-secondary-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all"
                        >
                            {showCreateForm ? 'Batal Tambah' : '+ Buat Sesi Baru'}
                        </button>
                    </div>
                </div>

                {/* Collapsible Create Session Form */}
                {showCreateForm && (
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                            <h3 className="font-black text-navy text-sm">Buat Sesi Latihan Baru</h3>
                            <p className="text-xs text-gray-400 font-semibold">Membuat sesi baru akan menginisialisasi lembar kehadiran "Hadir" untuk seluruh anggota aktif secara default.</p>
                        </div>

                        <form onSubmit={handleCreateSession} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                    Tanggal Latihan
                                </label>
                                <input
                                    type="date"
                                    value={form.data.tanggal}
                                    onChange={(e) => form.setData('tanggal', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-150 rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary font-semibold text-navy"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2 flex flex-col sm:flex-row gap-4 items-end">
                                <div className="w-full space-y-2">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                        Keterangan / Materi Latihan
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Latihan dasar fisik / Materi passing..."
                                        value={form.data.keterangan}
                                        onChange={(e) => form.setData('keterangan', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-150 rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary font-semibold text-navy"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-5 py-2.5 bg-navy hover:bg-navy-light text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all shrink-0 w-full sm:w-auto h-fit"
                                >
                                    Buat Sesi
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Sessions Table Card */}
                <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tanggal Latihan</th>
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Materi / Keterangan</th>
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tingkat Kehadiran</th>
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                            Belum ada sesi latihan yang dibuat.
                                        </td>
                                    </tr>
                                ) : (
                                    sessions.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50/40 transition-colors">
                                            <td className="p-4 text-xs font-black text-gray-800">
                                                {s.tanggal}
                                            </td>
                                            <td className="p-4 text-xs font-bold text-gray-600">
                                                {s.keterangan || <span className="text-gray-300 font-semibold italic">Tidak ada keterangan</span>}
                                            </td>
                                            <td className="p-4 space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs font-black text-navy">{s.total_hadir} / {s.total_peserta}</span>
                                                    <span className="text-[10px] text-gray-400 font-semibold">hadir</span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-secondary"
                                                        style={{ width: `${s.total_peserta ? (s.total_hadir / s.total_peserta) * 100 : 0}%` }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <Link
                                                    href={`/manage/ekskul/${ekskulTa.id}/absensi/${s.id}`}
                                                    className="px-3.5 py-2 bg-white border border-gray-150 hover:border-gray-300 text-navy font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-colors inline-block"
                                                >
                                                    Kelola Kehadiran
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteSession(s.id, s.tanggal)}
                                                    className="px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-150 text-red-700 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
