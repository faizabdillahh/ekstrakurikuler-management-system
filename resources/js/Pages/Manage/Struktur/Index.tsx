import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Anggota {
    id: string;
    nama: string;
    nis: string | null;
}

interface StrukturItem {
    id: string;
    anggota_id: string;
    jabatan: string;
    urutan: number;
    anggota: {
        id: string;
        nama: string;
        nis: string | null;
    };
}

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    struktur: StrukturItem[];
    activeMembers: Anggota[];
}

export default function Index({ ekskulTa, struktur = [], activeMembers = [] }: IndexProps) {
    const { props } = usePage<any>();
    const { flash } = props;

    const form = useForm({
        anggota_id: activeMembers[0]?.id || '',
        jabatan: '',
        urutan: 0,
    });

    const editForm = useForm({
        id: '',
        anggota_id: '',
        jabatan: '',
        urutan: 0,
    });

    const [editingStrukturId, setEditingStrukturId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.data.anggota_id) {
            alert('Silakan pilih anggota terlebih dahulu.');
            return;
        }
        form.post(`/manage/ekskul/${ekskulTa.id}/struktur`, {
            onSuccess: () => {
                form.reset('jabatan', 'urutan');
            }
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(`/manage/ekskul/${ekskulTa.id}/struktur/${editForm.data.id}`, {
            onSuccess: () => {
                setEditingStrukturId(null);
            }
        });
    };

    const deleteForm = useForm();
    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus jabatan struktur ini?')) {
            deleteForm.delete(`/manage/ekskul/${ekskulTa.id}/struktur/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Struktur Organisasi - ${ekskulTa.ekskul_nama}`}>
            <Head title={`Struktur Organisasi - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Alerts */}
                {flash.success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start space-x-3 text-green-800 text-sm font-semibold">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Struktur Kepengurusan Organisasi</h2>
                    <p className="text-xs text-gray-400 font-bold">Kelola jabatan fungsional pengurus ekstrakurikuler (Ketua, Wakil, Sekretaris, Bendahara, dll).</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Member Role Form */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-fit space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                            <h3 className="font-black text-navy text-md">Tambah Pengurus</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Pilih Anggota</label>
                                <select
                                    value={form.data.anggota_id}
                                    onChange={(e) => form.setData('anggota_id', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                                >
                                    <option value="" disabled>-- Pilih Anggota Aktif --</option>
                                    {activeMembers.map((m) => (
                                        <option key={m.id} value={m.id}>{m.nama} (NIS: {m.nis || '-'})</option>
                                    ))}
                                </select>
                                {activeMembers.length === 0 && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1">Belum ada anggota aktif ekskul untuk dipilih.</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Nama Jabatan</label>
                                <input
                                    type="text"
                                    value={form.data.jabatan}
                                    onChange={(e) => form.setData('jabatan', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    placeholder="Contoh: Ketua Ekskul, Sekretaris I"
                                />
                                {form.errors.jabatan && <p className="text-xs text-red-500 font-bold">{form.errors.jabatan}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Urutan Prioritas Tampil</label>
                                <input
                                    type="number"
                                    value={form.data.urutan}
                                    onChange={(e) => form.setData('urutan', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing || activeMembers.length === 0}
                                className="w-full py-3 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-navy/95 transition-all disabled:opacity-50"
                            >
                                Tambahkan Pengurus
                            </button>
                        </form>
                    </div>

                    {/* Structure List Table */}
                    <div className="lg:col-span-2 space-y-6">
                        {editingStrukturId && (
                            <form onSubmit={handleUpdate} className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm space-y-4">
                                <h3 className="font-black text-navy text-sm border-b border-gray-100 pb-2">Edit Jabatan Pengurus</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Anggota</label>
                                        <select
                                            value={editForm.data.anggota_id}
                                            onChange={(e) => editForm.setData('anggota_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        >
                                            {activeMembers.map((m) => (
                                                <option key={m.id} value={m.id}>{m.nama}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Jabatan</label>
                                        <input
                                            type="text"
                                            value={editForm.data.jabatan}
                                            onChange={(e) => editForm.setData('jabatan', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 w-32">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Urutan</label>
                                    <input
                                        type="number"
                                        value={editForm.data.urutan}
                                        onChange={(e) => editForm.setData('urutan', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingStrukturId(null)}
                                        className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Pengurus (Siswa)</th>
                                            <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Jabatan</th>
                                            <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider w-24">Urutan</th>
                                            <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {struktur.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                                    Belum ada struktur kepengurusan yang didefinisikan.
                                                </td>
                                            </tr>
                                        ) : (
                                            struktur.map((s) => (
                                                <tr key={s.id} className="hover:bg-gray-50/40 transition-colors">
                                                    <td className="p-4">
                                                        <p className="text-sm font-black text-gray-800">{s.anggota.nama}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">NIS: {s.anggota.nis || '-'}</p>
                                                    </td>
                                                    <td className="p-4 text-xs font-black text-navy">{s.jabatan}</td>
                                                    <td className="p-4 text-xs font-bold text-gray-500">{s.urutan}</td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingStrukturId(s.id);
                                                                    editForm.setData({
                                                                        id: s.id,
                                                                        anggota_id: s.anggota_id,
                                                                        jabatan: s.jabatan,
                                                                        urutan: s.urutan,
                                                                    });
                                                                }}
                                                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg text-[10px] font-extrabold text-blue-700 uppercase"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(s.id)}
                                                                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg text-[10px] font-extrabold text-red-700 uppercase"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
