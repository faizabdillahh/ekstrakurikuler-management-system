import React, { useState } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface UserDetail {
    id: string;
    nama: string;
    nis: string | null;
    kelas: string | null;
    jurusan: string | null;
    no_hp: string | null;
}

interface Sertifikat {
    id: string;
    nama_file: string;
    url: string;
}

interface Pendaftar {
    id: string;
    status: 'dalam_review' | 'diterima' | 'ditolak';
    created_at: string;
    user: UserDetail;
    sertifikat: Sertifikat[];
}

interface Statistik {
    total: number;
    dalam_review: number;
    diterima: number;
    ditolak: number;
}

interface EkskulTaInfo {
    id: string;
    ekskul_nama: string;
    kuota_anggota: number | null;
    is_seleksi_final: boolean;
}

interface IndexProps {
    ekskulTa: EkskulTaInfo;
    pendaftar: Pendaftar[];
    statistik: Statistik;
}

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

export default function Index({ ekskulTa, pendaftar, statistik }: IndexProps) {
    const { props } = usePage<SharedProps>();
    const { flash } = props;

    // Checkbox State for Bulk Actions
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    // Quota Form
    const quotaForm = useForm({
        kuota: ekskulTa.kuota_anggota || 30,
    });

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Select only those still in review or changeable
            const reviewableIds = pendaftar.map(p => p.id);
            setSelectedIds(reviewableIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectIndividual = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const handleSingleDecision = (id: string, status: 'diterima' | 'ditolak') => {
        router.put(`/manage/ekskul/${ekskulTa.id}/seleksi/${id}`, { status });
    };

    const handleBulkDecision = (status: 'diterima' | 'ditolak') => {
        if (selectedIds.length === 0) return;
        
        router.put(`/manage/ekskul/${ekskulTa.id}/seleksi/bulk`, {
            status,
            pendaftaran_ids: selectedIds,
        }, {
            onSuccess: () => {
                setSelectedIds([]);
            }
        });
    };

    const handleUpdateQuota = (e: React.FormEvent) => {
        e.preventDefault();
        quotaForm.put(`/manage/ekskul/${ekskulTa.id}/kuota`);
    };

    const handleFinalize = () => {
        if (confirm('⚠️ PERINGATAN: Finalisasi seleksi bersifat IRREVERSIBLE (tidak dapat dibatalkan). Siswa yang diterima akan didaftarkan sebagai anggota resmi dan semua file sertifikat akan dijadwalkan untuk dihapus secara otomatis. Apakah Anda yakin?')) {
            router.post(`/manage/ekskul/${ekskulTa.id}/seleksi/finalize`);
        }
    };

    // Helper to generate WhatsApp URL
    const openWhatsApp = (user: UserDetail, status: string) => {
        if (!user.no_hp) {
            alert('Nomor HP siswa tidak terdaftar.');
            return;
        }

        const cleanNo = user.no_hp.replace(/[^0-9]/g, '');
        const recipient = cleanNo.startsWith('0') ? '62' + cleanNo.slice(1) : cleanNo;
        
        const message = `Halo ${user.nama}, kami dari Pembina Ekstrakurikuler ${ekskulTa.ekskul_nama} ingin menginfokan bahwa pendaftaran Anda berstatus [${status.toUpperCase()}]. Silakan cek akun Anda di portal sistem manajemen ekskul. Terima kasih!`;
        
        window.open(`https://wa.me/${recipient}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <AuthenticatedLayout title={`Seleksi ${ekskulTa.ekskul_nama}`}>
            <Head title={`Seleksi - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Alert Notifications */}
                {flash.success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3 text-green-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Configuration Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quota Management */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                        <div className="space-y-1">
                            <h3 className="font-black text-navy text-sm">Kuota Anggota</h3>
                            <p className="text-xs text-gray-400 font-semibold">Tentukan batas kuota maksimal untuk tahun ajaran ini.</p>
                        </div>
                        
                        <form onSubmit={handleUpdateQuota} className="flex items-center space-x-3 mt-4">
                            <input
                                type="number"
                                value={quotaForm.data.kuota}
                                onChange={(e) => quotaForm.setData('kuota', parseInt(e.target.value))}
                                disabled={ekskulTa.is_seleksi_final || quotaForm.processing}
                                className="w-24 px-4 py-2 border border-gray-150 rounded-xl font-bold text-navy text-center text-sm disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={ekskulTa.is_seleksi_final || quotaForm.processing}
                                className="px-4 py-2 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all hover:bg-navy-light disabled:opacity-50"
                            >
                                Simpan
                            </button>
                        </form>
                    </div>

                    {/* Stats */}
                    <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
                        <div className="grid grid-cols-4 gap-4 text-center">
                            {[
                                { label: 'Total Pendaftar', val: statistik.total, color: 'text-navy' },
                                { label: 'Dalam Review', val: statistik.dalam_review, color: 'text-yellow-600' },
                                { label: 'Diterima', val: statistik.diterima, color: 'text-green-600' },
                                { label: 'Ditolak', val: statistik.ditolak, color: 'text-red-600' },
                            ].map((stat, idx) => (
                                <div key={idx} className="space-y-1">
                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
                    {/* Header and Finalize Control */}
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="font-black text-navy text-md">Pendaftar Masuk</h3>
                            <p className="text-xs text-gray-400 font-bold">Kelola dan tentukan keputusan penerimaan siswa di bawah.</p>
                        </div>

                        <div>
                            {ekskulTa.is_seleksi_final ? (
                                <div className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wider rounded-xl text-center">
                                    🔓 Status: Seleksi Final & Terkunci
                                </div>
                            ) : (
                                <button
                                    onClick={handleFinalize}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all"
                                >
                                    Finalisasikan Seleksi
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bulk Action Bar */}
                    {selectedIds.length > 0 && !ekskulTa.is_seleksi_final && (
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-600">
                                {selectedIds.length} baris dipilih
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleBulkDecision('diterima')}
                                    className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg"
                                >
                                    Terima Massal
                                </button>
                                <button
                                    onClick={() => handleBulkDecision('ditolak')}
                                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg"
                                >
                                    Tolak Massal
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    {!ekskulTa.is_seleksi_final && (
                                        <th className="p-4 w-10">
                                            <input 
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={selectedIds.length === pendaftar.length && pendaftar.length > 0}
                                                className="rounded border-gray-300 text-secondary focus:ring-secondary"
                                            />
                                        </th>
                                    )}
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Identitas Siswa</th>
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Kontak</th>
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Sertifikat</th>
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Status</th>
                                    {!ekskulTa.is_seleksi_final && (
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider text-right">Keputusan</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendaftar.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                            Belum ada pendaftar pada ekstrakurikuler ini.
                                        </td>
                                    </tr>
                                ) : (
                                    pendaftar.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                                            {!ekskulTa.is_seleksi_final && (
                                                <td className="p-4">
                                                    <input 
                                                        type="checkbox"
                                                        onChange={(e) => handleSelectIndividual(p.id, e.target.checked)}
                                                        checked={selectedIds.includes(p.id)}
                                                        className="rounded border-gray-300 text-secondary focus:ring-secondary"
                                                    />
                                                </td>
                                            )}
                                            <td className="p-4 space-y-1">
                                                <p className="text-sm font-black text-gray-800">{p.user.nama}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">
                                                    NIS: {p.user.nis || '-'} | Kelas: {p.user.kelas || '-'} ({p.user.jurusan || '-'})
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                {p.user.no_hp ? (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs font-semibold text-gray-700">{p.user.no_hp}</span>
                                                        <button
                                                            onClick={() => openWhatsApp(p.user, p.status)}
                                                            className="text-emerald-500 hover:text-emerald-600 text-xs"
                                                            title="Kirim Notifikasi WA"
                                                        >
                                                            💬 WA
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-300 font-bold">-</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {p.sertifikat.length === 0 ? (
                                                    <span className="text-[10px] text-gray-300 font-bold">Tidak ada</span>
                                                ) : (
                                                    <div className="flex flex-col space-y-1">
                                                        {p.sertifikat.map((s) => (
                                                            <a
                                                                key={s.id}
                                                                href={s.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] text-secondary hover:underline truncate max-w-[150px] font-bold"
                                                            >
                                                                📄 {s.nama_file}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {p.status === 'dalam_review' && (
                                                    <span className="text-[9px] font-extrabold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                        Dalam Review
                                                    </span>
                                                )}
                                                {p.status === 'diterima' && (
                                                    <span className="text-[9px] font-extrabold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                        Diterima
                                                    </span>
                                                )}
                                                {p.status === 'ditolak' && (
                                                    <span className="text-[9px] font-extrabold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                        Ditolak
                                                    </span>
                                                )}
                                            </td>
                                            {!ekskulTa.is_seleksi_final && (
                                                <td className="p-4 text-right space-x-1 shrink-0">
                                                    <button
                                                        onClick={() => handleSingleDecision(p.id, 'diterima')}
                                                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${
                                                            p.status === 'diterima'
                                                                ? 'bg-green-600 border-green-600 text-white'
                                                                : 'bg-white border-green-200 text-green-600 hover:bg-green-50'
                                                        }`}
                                                    >
                                                        Terima
                                                    </button>
                                                    <button
                                                        onClick={() => handleSingleDecision(p.id, 'ditolak')}
                                                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${
                                                            p.status === 'ditolak'
                                                                ? 'bg-red-600 border-red-600 text-white'
                                                                : 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                                                        }`}
                                                    >
                                                        Tolak
                                                    </button>
                                                </td>
                                            )}
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
