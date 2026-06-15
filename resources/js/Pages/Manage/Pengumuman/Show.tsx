import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Lampiran {
    id: string;
    nama_file: string;
    url: string;
    ukuran_bytes: number;
}

interface ShowProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    pengumuman: {
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
    };
}

export default function Show({ ekskulTa, pengumuman }: ShowProps) {
    const isScheduled = pengumuman.dijadwalkan_pada && new Date(pengumuman.dijadwalkan_pada) > new Date();

    return (
        <AuthenticatedLayout title={pengumuman.judul}>
            <Head title={`Pengumuman - ${pengumuman.judul}`} />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center space-x-2">
                    <Link
                        href={`/manage/ekskul/${ekskulTa.id}/pengumuman`}
                        className="text-xs font-bold text-gray-500 hover:text-navy flex items-center space-x-1"
                    >
                        <span>← Kembali ke Pengumuman</span>
                    </Link>
                </div>

                <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                    <div className="space-y-3 border-b border-gray-100 pb-6">
                        <div className="flex items-center space-x-3">
                            {isScheduled ? (
                                <span className="text-[10px] font-extrabold text-accent bg-accent/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    Dijadwalkan: {new Date(pengumuman.dijadwalkan_pada!).toLocaleString('id-ID')}
                                </span>
                            ) : (
                                <span className="text-[10px] font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                    Diterbitkan
                                </span>
                            )}
                            <span className="text-xs text-gray-400 font-bold">
                                Dibuat oleh {pengumuman.creator.nama}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-navy leading-tight">{pengumuman.judul}</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Dibuat Pada: {new Date(pengumuman.created_at).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="text-sm font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {pengumuman.konten}
                    </div>

                    {pengumuman.lampiran.length > 0 && (
                        <div className="border-t border-gray-100 pt-6 space-y-3">
                            <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">File Lampiran</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {pengumuman.lampiran.map((l) => (
                                    <a
                                        key={l.id}
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-gray-50 border border-gray-150 rounded-2xl hover:bg-gray-100 hover:border-gray-300 transition-all group"
                                    >
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <span className="text-xl">📎</span>
                                            <div className="min-w-0">
                                                <p className="text-xs font-black text-gray-800 truncate group-hover:text-secondary transition-colors">{l.nama_file}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{(l.ukuran_bytes / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-extrabold text-secondary uppercase tracking-wider shrink-0 ml-2">Unduh</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
