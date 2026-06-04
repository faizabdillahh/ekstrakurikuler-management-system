import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface EkskulItem {
    id: string;
    nama: string;
    kategori: string;
    logo_url: string | null;
    deskripsi: string | null;
    warna_primer: string;
    warna_sekunder: string;
    kuota_anggota: number | null;
    is_pendaftaran_dibuka: boolean;
}

interface IndexProps {
    ekskulList: EkskulItem[];
    kategori: string | null;
}

export default function Index({ ekskulList, kategori }: IndexProps) {
    const categories = ['Semua', 'Olahraga', 'Seni', 'Akademik', 'Keagamaan', 'Sosial'];
    const activeCategory = kategori || 'Semua';

    const handleCategoryChange = (cat: string) => {
        if (cat === 'Semua') {
            router.get('/ekskul');
        } else {
            router.get('/ekskul', { kategori: cat });
        }
    };

    return (
        <AuthenticatedLayout title="Daftar Ekstrakurikuler">
            <Head title="Daftar Ekstrakurikuler" />

            <div className="space-y-8">
                {/* Intro Banner */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm">
                    <h2 className="text-2xl font-black text-navy">Temukan Minat & Bakatmu</h2>
                    <p className="text-sm text-gray-500 font-semibold mt-1">
                        SMKN 1 Bawang menyediakan 27 pilihan kegiatan ekstrakurikuler untuk mendukung kreativitas dan kepemimpinanmu.
                    </p>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all border ${
                                    activeCategory === cat
                                        ? 'bg-navy border-navy text-white shadow-sm'
                                        : 'bg-white border-gray-150 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Content */}
                {ekskulList.length === 0 ? (
                    <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center shadow-sm">
                        <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-navy font-black text-lg mt-4">Belum Ada Ekstrakurikuler</h3>
                        <p className="text-xs text-gray-400 font-bold mt-1">Tidak ada ekskul aktif dalam kategori yang dipilih pada tahun ajaran ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ekskulList.map((ekskul) => (
                            <div 
                                key={ekskul.id}
                                onClick={() => router.get(`/ekskul/${ekskul.id}`)}
                                className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden h-72 hover:-translate-y-1"
                                style={{
                                    '--color-primary': ekskul.warna_primer,
                                    '--color-secondary': ekskul.warna_sekunder
                                } as React.CSSProperties}
                            >
                                {/* Color accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"></div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                                            {ekskul.logo_url ? (
                                                <img src={ekskul.logo_url} alt={ekskul.nama} className="w-10 h-10 object-contain" />
                                            ) : (
                                                <span className="text-navy font-black text-lg">{ekskul.nama.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-extrabold text-secondary bg-secondary/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                {ekskul.kategori}
                                            </span>
                                            <h4 className="font-black text-navy text-md mt-1 group-hover:text-secondary transition-colors line-clamp-1">
                                                {ekskul.nama}
                                            </h4>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 font-semibold line-clamp-4 leading-relaxed">
                                        {ekskul.deskripsi || 'Tidak ada deskripsi singkat untuk ekstrakurikuler ini.'}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-4">
                                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                                        Kuota: {ekskul.kuota_anggota || 'Tidak Terbatas'}
                                    </span>

                                    {ekskul.is_pendaftaran_dibuka ? (
                                        <span className="text-[9px] font-extrabold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                            Buka Pendaftaran
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-extrabold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                            Tutup Pendaftaran
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
