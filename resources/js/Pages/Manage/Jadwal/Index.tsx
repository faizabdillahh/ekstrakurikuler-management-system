import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Jadwal {
    id: string;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi: string | null;
    keterangan: string | null;
}

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    jadwal: Jadwal[];
}

export default function Index({ ekskulTa, jadwal = [] }: IndexProps) {
    const { props } = usePage<any>();
    const { flash } = props;

    const form = useForm({
        hari: 'senin',
        jam_mulai: '14:00',
        jam_selesai: '16:00',
        lokasi: '',
        keterangan: '',
    });

    const editForm = useForm({
        id: '',
        hari: 'senin',
        jam_mulai: '',
        jam_selesai: '',
        lokasi: '',
        keterangan: '',
    });

    const [editingJadwalId, setEditingJadwalId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/manage/ekskul/${ekskulTa.id}/jadwal`, {
            onSuccess: () => {
                form.reset('lokasi', 'keterangan');
            }
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(`/manage/ekskul/${ekskulTa.id}/jadwal/${editForm.data.id}`, {
            onSuccess: () => {
                setEditingJadwalId(null);
            }
        });
    };

    const deleteForm = useForm();
    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            deleteForm.delete(`/manage/ekskul/${ekskulTa.id}/jadwal/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Jadwal Latihan - ${ekskulTa.ekskul_nama}`}>
            <Head title={`Jadwal Latihan - ${ekskulTa.ekskul_nama}`} />

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
                    <h2 className="text-2xl font-black text-navy">Jadwal Latihan Rutin</h2>
                    <p className="text-xs text-gray-400 font-bold">Atur hari, jam operasional, dan lokasi latihan rutin ekstrakurikuler.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Schedule Form */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-fit space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                            <h3 className="font-black text-navy text-md">Tambah Jadwal</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Hari</label>
                                <select
                                    value={form.data.hari}
                                    onChange={(e) => form.setData('hari', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                >
                                    {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map((hari) => (
                                        <option key={hari} value={hari}>{hari.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Jam Mulai</label>
                                    <input
                                        type="time"
                                        value={form.data.jam_mulai}
                                        onChange={(e) => form.setData('jam_mulai', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    />
                                    {form.errors.jam_mulai && <p className="text-xs text-red-500 font-bold">{form.errors.jam_mulai}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Jam Selesai</label>
                                    <input
                                        type="time"
                                        value={form.data.jam_selesai}
                                        onChange={(e) => form.setData('jam_selesai', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    />
                                    {form.errors.jam_selesai && <p className="text-xs text-red-500 font-bold">{form.errors.jam_selesai}</p>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Lokasi Latihan</label>
                                <input
                                    type="text"
                                    value={form.data.lokasi}
                                    onChange={(e) => form.setData('lokasi', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    placeholder="Contoh: Lapangan Utama"
                                />
                                {form.errors.lokasi && <p className="text-xs text-red-500 font-bold">{form.errors.lokasi}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Keterangan (Opsional)</label>
                                <input
                                    type="text"
                                    value={form.data.keterangan}
                                    onChange={(e) => form.setData('keterangan', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    placeholder="Contoh: Baju kaos olahraga bebas"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="w-full py-3 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-navy/95 transition-all disabled:opacity-50"
                            >
                                Simpan Jadwal
                            </button>
                        </form>
                    </div>

                    {/* Schedule List */}
                    <div className="lg:col-span-2 space-y-6">
                        {editingJadwalId && (
                            <form onSubmit={handleUpdate} className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm space-y-4">
                                <h3 className="font-black text-navy text-sm border-b border-gray-100 pb-2">Edit Jadwal</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Hari</label>
                                        <select
                                            value={editForm.data.hari}
                                            onChange={(e) => editForm.setData('hari', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        >
                                            {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map((h) => (
                                                <option key={h} value={h}>{h.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Mulai</label>
                                        <input
                                            type="time"
                                            value={editForm.data.jam_mulai}
                                            onChange={(e) => editForm.setData('jam_mulai', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Selesai</label>
                                        <input
                                            type="time"
                                            value={editForm.data.jam_selesai}
                                            onChange={(e) => editForm.setData('jam_selesai', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Lokasi</label>
                                        <input
                                            type="text"
                                            value={editForm.data.lokasi}
                                            onChange={(e) => editForm.setData('lokasi', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Keterangan</label>
                                        <input
                                            type="text"
                                            value={editForm.data.keterangan}
                                            onChange={(e) => editForm.setData('keterangan', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingJadwalId(null)}
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
                                            <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Hari & Jam</th>
                                            <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Lokasi</th>
                                            <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Keterangan</th>
                                            <th className="p-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {jadwal.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-xs text-gray-400 font-semibold">
                                                    Belum ada jadwal latihan rutin yang ditambahkan.
                                                </td>
                                            </tr>
                                        ) : (
                                            jadwal.map((j) => (
                                                <tr key={j.id} className="hover:bg-gray-50/40 transition-colors">
                                                    <td className="p-4">
                                                        <p className="text-sm font-black text-gray-800 capitalize">{j.hari}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{j.jam_mulai} - {j.jam_selesai}</p>
                                                    </td>
                                                    <td className="p-4 text-xs font-bold text-navy">{j.lokasi || '-'}</td>
                                                    <td className="p-4 text-xs text-gray-500 font-semibold">{j.keterangan || '-'}</td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingJadwalId(j.id);
                                                                    editForm.setData({
                                                                        id: j.id,
                                                                        hari: j.hari,
                                                                        jam_mulai: j.jam_mulai,
                                                                        jam_selesai: j.jam_selesai,
                                                                        lokasi: j.lokasi || '',
                                                                        keterangan: j.keterangan || '',
                                                                    });
                                                                }}
                                                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg text-[10px] font-extrabold text-blue-700 uppercase"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(j.id)}
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
