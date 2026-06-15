import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Lampiran {
    id: string;
    nama_file: string;
    url: string;
    ukuran_bytes: number;
}

interface Pengumuman {
    id: string;
    judul: string;
    konten: string;
    dijadwalkan_pada: string | null;
    diterbitkan_pada: string | null;
    creator: {
        nama: string;
    };
    lampiran: Lampiran[];
    created_at: string;
}

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    pengumuman: Pengumuman[];
}

interface SharedProps {
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function Index({ ekskulTa, pengumuman = [] }: IndexProps) {
    const { props } = usePage<any>();
    const { flash } = props as SharedProps;
    const { delete: destroy } = useForm();

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            destroy(`/manage/ekskul/${ekskulTa.id}/pengumuman/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title={`Pengumuman - ${ekskulTa.ekskul_nama}`}>
            <Head title={`Pengumuman - ${ekskulTa.ekskul_nama}`} />

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

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-navy">Pengumuman Ekskul</h2>
                        <p className="text-xs text-gray-400 font-bold">Kelola pengumuman internal ekskul beserta file lampiran pendukung.</p>
                    </div>
                    <div>
                        <Link
                            href={`/manage/ekskul/${ekskulTa.id}/pengumuman/create`}
                            className="inline-flex items-center px-5 py-3 bg-secondary text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-secondary/90 transition-all"
                        >
                            Buat Pengumuman
                        </Link>
                    </div>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {pengumuman.length === 0 ? (
                        <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center">
                            <p className="text-sm text-gray-400 font-semibold">Belum ada pengumuman yang dibuat.</p>
                        </div>
                    ) : (
                        pengumuman.map((p) => {
                            const isScheduled = p.dijadwalkan_pada && new Date(p.dijadwalkan_pada) > new Date();
                            return (
                                <div key={p.id} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-start md:justify-between gap-6 hover:shadow-md transition-all">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center space-x-3">
                                            {isScheduled ? (
                                                <span className="text-[10px] font-extrabold text-accent bg-accent/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                    Dijadwalkan: {new Date(p.dijadwalkan_pada!).toLocaleString('id-ID')}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                    Diterbitkan
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400 font-bold">
                                                Oleh {p.creator.nama}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-black text-navy">{p.judul}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">{p.konten}</p>

                                        {p.lampiran.length > 0 && (
                                            <div className="pt-2">
                                                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Lampiran File</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {p.lampiran.map((l) => (
                                                        <a
                                                            key={l.id}
                                                            href={l.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-xs font-bold text-gray-700"
                                                        >
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span>{l.nama_file}</span>
                                                            <span className="text-gray-400 font-normal">({(l.ukuran_bytes / 1024).toFixed(1)} KB)</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 shrink-0">
                                        <Link
                                            href={`/manage/ekskul/${ekskulTa.id}/pengumuman/${p.id}`}
                                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-600 transition-colors"
                                        >
                                            Lihat
                                        </Link>
                                        <Link
                                            href={`/manage/ekskul/${ekskulTa.id}/pengumuman/${p.id}/edit`}
                                            className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 text-xs font-bold text-blue-600 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="px-3 py-2 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 text-xs font-bold text-red-600 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
