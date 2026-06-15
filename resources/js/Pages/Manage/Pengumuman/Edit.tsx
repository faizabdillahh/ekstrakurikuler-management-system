import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Lampiran {
    id: string;
    nama_file: string;
    url: string;
    ukuran_bytes: number;
}

interface EditProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    pengumuman: {
        id: string;
        judul: string;
        konten: string;
        dijadwalkan_pada: string | null;
        lampiran: Lampiran[];
    };
}

export default function Edit({ ekskulTa, pengumuman }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        judul: pengumuman.judul,
        konten: pengumuman.konten,
        dijadwalkan_pada: pengumuman.dijadwalkan_pada || '',
        files: [] as File[],
        delete_attachments: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // We use POST with _method=PUT to support file uploads in Laravel
        post(`/manage/ekskul/${ekskulTa.id}/pengumuman/${pengumuman.id}`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('files', Array.from(e.target.files));
        }
    };

    const toggleDeleteAttachment = (id: string) => {
        if (data.delete_attachments.includes(id)) {
            setData('delete_attachments', data.delete_attachments.filter((x) => x !== id));
        } else {
            setData('delete_attachments', [...data.delete_attachments, id]);
        }
    };

    return (
        <AuthenticatedLayout title="Edit Pengumuman">
            <Head title="Edit Pengumuman" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Edit Pengumuman</h2>
                    <p className="text-xs text-gray-400 font-bold">Perbarui pengumuman ekskul atau edit daftar file lampiran.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm">
                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Judul Pengumuman</label>
                        <input
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                        />
                        {errors.judul && <p className="text-xs text-red-500 font-bold mt-1">{errors.judul}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Konten / Isi Pengumuman</label>
                        <textarea
                            value={data.konten}
                            onChange={(e) => setData('konten', e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                        />
                        {errors.konten && <p className="text-xs text-red-500 font-bold mt-1">{errors.konten}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Jadwalkan Penerbitan</label>
                        <input
                            type="datetime-local"
                            value={data.dijadwalkan_pada}
                            onChange={(e) => setData('dijadwalkan_pada', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                        />
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">Biarkan kosong jika ingin langsung menerbitkan saat ini.</p>
                        {errors.dijadwalkan_pada && <p className="text-xs text-red-500 font-bold mt-1">{errors.dijadwalkan_pada}</p>}
                    </div>

                    {pengumuman.lampiran.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Lampiran Saat Ini (Centang untuk menghapus)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {pengumuman.lampiran.map((l) => {
                                    const willDelete = data.delete_attachments.includes(l.id);
                                    return (
                                        <button
                                            type="button"
                                            key={l.id}
                                            onClick={() => toggleDeleteAttachment(l.id)}
                                            className={`flex items-center justify-between p-3.5 border rounded-2xl transition-all text-left ${
                                                willDelete
                                                    ? 'bg-red-50/70 border-red-200 text-red-700'
                                                    : 'bg-gray-50 border-gray-150 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className={`text-xs font-bold truncate ${willDelete ? 'line-through' : ''}`}>
                                                📎 {l.nama_file}
                                            </span>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider shrink-0 ml-2">
                                                {willDelete ? 'Hapus' : 'Pertahankan'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Unggah Lampiran Baru (Max 5MB/file)</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full text-sm font-bold text-navy file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:uppercase file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {data.files.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Daftar File Dipilih:</p>
                                <ul className="space-y-1">
                                    {data.files.map((file, idx) => (
                                        <li key={idx} className="text-xs font-bold text-gray-600 flex items-center space-x-2">
                                            <span>📎</span>
                                            <span>{file.name}</span>
                                            <span className="text-gray-400 font-normal">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {errors.files && <p className="text-xs text-red-500 font-bold mt-1">{errors.files}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                        <Link
                            href={`/manage/ekskul/${ekskulTa.id}/pengumuman`}
                            className="px-5 py-3 border border-gray-200 text-gray-600 text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-3 bg-secondary text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-secondary/90 transition-all disabled:opacity-50"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
