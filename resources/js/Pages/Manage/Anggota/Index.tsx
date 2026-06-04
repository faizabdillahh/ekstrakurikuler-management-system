import React, { useState } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface StudentInfo {
    id: string;
    nama: string;
    nis: string | null;
    kelas: string | null;
    jurusan: string | null;
}

interface AnggotaItem {
    id: string;
    status: 'aktif' | 'dikeluarkan';
    tanggal_bergabung: string;
    tanggal_dikeluarkan: string | null;
    sumber: 'seleksi' | 'manual';
    user: {
        id: string;
        nama: string;
        nis: string | null;
        kelas: string | null;
        jurusan: string | null;
        no_hp: string | null;
    };
}

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    anggotaList: AnggotaItem[];
    eligibleStudents: StudentInfo[];
}

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

export default function Index({ ekskulTa, anggotaList, eligibleStudents }: IndexProps) {
    const { props } = usePage<SharedProps>();
    const { flash } = props;

    const [activeTab, setActiveTab] = useState<'aktif' | 'dikeluarkan'>('aktif');
    const [searchStudentQuery, setSearchStudentQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const addForm = useForm({
        user_id: '',
    });

    const handleUpdateStatus = (id: string, newStatus: 'aktif' | 'dikeluarkan', studentNama: string) => {
        const actionStr = newStatus === 'aktif' ? 'mengaktifkan kembali' : 'mengeluarkan';
        if (confirm(`Apakah Anda yakin ingin ${actionStr} ${studentNama}?`)) {
            router.put(`/manage/ekskul/${ekskulTa.id}/anggota/${id}/status`, {
                status: newStatus,
            });
        }
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.data.user_id) return;

        addForm.post(`/manage/ekskul/${ekskulTa.id}/anggota`, {
            onSuccess: () => {
                addForm.reset();
                setShowAddForm(false);
            }
        });
    };

    const filteredEligibleStudents = eligibleStudents.filter(s => 
        s.nama.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
        (s.nis && s.nis.includes(searchStudentQuery))
    );

    const activeMembers = anggotaList.filter(a => a.status === 'aktif');
    const expelledMembers = anggotaList.filter(a => a.status === 'dikeluarkan');

    return (
        <AuthenticatedLayout title={`Anggota ${ekskulTa.ekskul_nama}`}>
            <Head title={`Anggota - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Alerts */}
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

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-navy">Manajemen Anggota</h2>
                        <p className="text-xs text-gray-400 font-bold">Total Anggota Aktif: {activeMembers.length} siswa</p>
                    </div>

                    <div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="w-full sm:w-auto px-5 py-3 bg-secondary hover:bg-secondary-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all"
                        >
                            {showAddForm ? 'Batal Tambah' : '+ Tambah Anggota Manual'}
                        </button>
                    </div>
                </div>

                {/* Add Member Collapsible Form */}
                {showAddForm && (
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                            <h3 className="font-black text-navy text-sm">Formulir Tambah Anggota Manual</h3>
                            <p className="text-xs text-gray-400 font-semibold">Gunakan ini untuk memasukkan siswa yang terlambat mendaftar.</p>
                        </div>

                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                        Cari Siswa
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ketik nama atau NIS siswa..."
                                        value={searchStudentQuery}
                                        onChange={(e) => setSearchStudentQuery(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-150 rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary font-semibold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                        Pilih Siswa ({filteredEligibleStudents.length} opsi ditemukan)
                                    </label>
                                    <select
                                        value={addForm.data.user_id}
                                        onChange={(e) => addForm.setData('user_id', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-150 rounded-xl text-sm focus:border-secondary focus:ring-1 focus:ring-secondary font-semibold text-navy bg-white"
                                    >
                                        <option value="">-- Pilih Siswa --</option>
                                        {filteredEligibleStudents.slice(0, 100).map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.nama} ({s.nis || '-'} - {s.kelas || '-'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={addForm.processing || !addForm.data.user_id}
                                    className="px-5 py-2.5 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
                                >
                                    Masukkan Anggota
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tabs & Table */}
                <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 bg-gray-50/50">
                        <button
                            onClick={() => setActiveTab('aktif')}
                            className={`px-6 py-4 text-xs font-extrabold border-b-2 transition-all uppercase tracking-wider ${
                                activeTab === 'aktif'
                                    ? 'border-navy text-navy bg-white font-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Anggota Aktif ({activeMembers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('dikeluarkan')}
                            className={`px-6 py-4 text-xs font-extrabold border-b-2 transition-all uppercase tracking-wider ${
                                activeTab === 'dikeluarkan'
                                    ? 'border-navy text-navy bg-white font-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            Dikeluarkan ({expelledMembers.length})
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/20">
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Identitas Siswa</th>
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Sumber</th>
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tanggal Bergabung</th>
                                    {activeTab === 'dikeluarkan' && (
                                        <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tanggal Keluar</th>
                                    )}
                                    <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activeTab === 'aktif' ? (
                                    activeMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                                Belum ada anggota aktif terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        activeMembers.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                                                <td className="p-4 space-y-1">
                                                    <p className="text-sm font-black text-gray-800">{item.user.nama}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">
                                                        NIS: {item.user.nis || '-'} | Kelas: {item.user.kelas || '-'} ({item.user.jurusan || '-'})
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    {item.sumber === 'seleksi' ? (
                                                        <span className="text-[8px] font-extrabold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            Seleksi
                                                        </span>
                                                    ) : (
                                                        <span className="text-[8px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            Manual (Late)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-xs font-bold text-gray-600">
                                                    {item.tanggal_bergabung}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleUpdateStatus(item.id, 'dikeluarkan', item.user.nama)}
                                                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors"
                                                    >
                                                        Keluarkan
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    expelledMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                                Tidak ada riwayat anggota yang dikeluarkan.
                                            </td>
                                        </tr>
                                    ) : (
                                        expelledMembers.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                                                <td className="p-4 space-y-1">
                                                    <p className="text-sm font-black text-gray-800">{item.user.nama}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">
                                                        NIS: {item.user.nis || '-'} | Kelas: {item.user.kelas || '-'} ({item.user.jurusan || '-'})
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    {item.sumber === 'seleksi' ? (
                                                        <span className="text-[8px] font-extrabold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            Seleksi
                                                        </span>
                                                    ) : (
                                                        <span className="text-[8px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            Manual (Late)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-xs font-bold text-gray-500">
                                                    {item.tanggal_bergabung}
                                                </td>
                                                <td className="p-4 text-xs font-bold text-red-600">
                                                    {item.tanggal_dikeluarkan || '-'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleUpdateStatus(item.id, 'aktif', item.user.nama)}
                                                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors"
                                                    >
                                                        Aktifkan Kembali
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
