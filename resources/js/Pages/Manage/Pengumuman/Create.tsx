import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface CreateProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
}

export default function Create({ ekskulTa }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        konten: '',
        dijadwalkan_pada: '',
        files: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/manage/ekskul/${ekskulTa.id}/pengumuman`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('files', Array.from(e.target.files));
        }
    };

    return (
        <AuthenticatedLayout title="Buat Pengumuman">
            <Head title="Buat Pengumuman" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-navy">Buat Pengumuman Baru</h2>
                    <p className="text-xs text-gray-400 font-bold">Terbitkan berita atau informasi penting ke anggota aktif ekstrakurikuler.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm">
                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Judul Pengumuman</label>
                        <input
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                            placeholder="Tulis judul pengumuman..."
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
                            placeholder="Tulis detail isi pengumuman..."
                        />
                        {errors.konten && <p className="text-xs text-red-500 font-bold mt-1">{errors.konten}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Jadwalkan Penerbitan (Opsional)</label>
                        <input
                            type="datetime-local"
                            value={data.dijadwalkan_pada}
                            onChange={(e) => setData('dijadwalkan_pada', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary"
                        />
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">Kosongkan jika ingin langsung diterbitkan saat ini juga.</p>
                        {errors.dijadwalkan_pada && <p className="text-xs text-red-500 font-bold mt-1">{errors.dijadwalkan_pada}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Lampiran File (Opsional, Max 5MB/file)</label>
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
                            {data.dijadwalkan_pada ? 'Jadwalkan' : 'Terbitkan Sekarang'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
