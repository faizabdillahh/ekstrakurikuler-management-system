import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface EkskulResult {
    id: string;
    nama: string;
    kategori: string;
    deskripsi: string | null;
    logo_url: string | null;
}

interface EventResult {
    id: string;
    judul: string;
    deskripsi: string;
    tanggal_mulai: string;
    ekskul_nama: string;
}

interface PengumumanResult {
    id: string;
    judul: string;
    konten: string;
    diterbitkan_pada: string;
    ekskul_nama: string;
}

interface IndexProps {
    query: string;
    ekskulResults: EkskulResult[];
    eventResults: EventResult[];
    pengumumanResults: PengumumanResult[];
}

export default function Index({ query = '', ekskulResults = [], eventResults = [], pengumumanResults = [] }: IndexProps) {
    const [searchVal, setSearchVal] = useState(query);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/pencarian', { q: searchVal }, { preserveState: true });
    };

    const totalResults = ekskulResults.length + eventResults.length + pengumumanResults.length;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title="Pencarian Global Ekskul" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center space-x-4">
                            <img 
                                src="/images/logo-SMKN1-Bawang.png" 
                                alt="Logo SMKN 1 Bawang" 
                                className="h-14 w-auto object-contain"
                            />
                            <div>
                                <h1 className="text-lg font-bold text-navy tracking-tight leading-none">
                                    SMKN 1 Bawang
                                </h1>
                                <p className="text-xs text-gray-500 mt-1 font-medium">
                                    Sistem Manajemen Ekstrakurikuler
                                </p>
                            </div>
                        </Link>

                        <nav className="flex items-center space-x-6">
                            <Link href="/" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">Beranda</Link>
                            <Link href="/galeri" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">Galeri</Link>
                            <Link href="/kalender" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">Kalender</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-grow py-12 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
                {/* Search Bar section */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-2xl font-black text-navy">Pencarian Ekskul, Event & Pengumuman</h2>
                        <p className="text-xs text-gray-400 font-bold">Masukkan kata kunci untuk mencari seluruh informasi di dalam sistem.</p>
                    </div>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center space-x-2">
                        <input
                            type="text"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            placeholder="Contoh: Pramuka, Futsal, Latihan gabungan..."
                            className="flex-grow px-5 py-3 border border-gray-150 rounded-xl font-bold text-sm text-navy focus:border-secondary focus:ring-secondary focus:ring-1"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-navy/95 transition-all"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Search Results */}
                {query && (
                    <div className="space-y-6">
                        <p className="text-xs text-gray-500 font-bold">
                            Menampilkan {totalResults} hasil pencarian untuk kata kunci <span className="text-navy">"{query}"</span>:
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Ekskul Results */}
                            {ekskulResults.length > 0 && (
                                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                                    <h3 className="text-sm font-black text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Unit Ekstrakurikuler ({ekskulResults.length})</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {ekskulResults.map((e) => (
                                            <div key={e.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100/50">
                                                <div className="flex items-center space-x-3.5 min-w-0 pr-4">
                                                    {e.logo_url ? (
                                                        <img src={`/storage/${e.logo_url}`} alt={e.nama} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                                    ) : (
                                                        <span className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-xs shrink-0">
                                                            {e.nama.substring(0, 2)}
                                                        </span>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-black text-sm text-gray-800 truncate">{e.nama}</p>
                                                        <p className="text-xs text-gray-400 font-semibold">{e.kategori}</p>
                                                    </div>
                                                </div>
                                                <Link href={`/ekskul/${e.id}`} className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-xl hover:bg-secondary hover:text-white transition-all shrink-0">Detail</Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Event Results */}
                            {eventResults.length > 0 && (
                                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                                    <h3 className="text-sm font-black text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Agenda Kegiatan ({eventResults.length})</h3>
                                    <div className="space-y-3">
                                        {eventResults.map((ev) => (
                                            <div key={ev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-[10px] font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase">{ev.ekskul_nama}</span>
                                                        <span className="text-xs text-gray-400 font-bold">{new Date(ev.tanggal_mulai).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    <h4 className="font-black text-navy text-md">{ev.judul}</h4>
                                                    <p className="text-xs text-gray-500 font-semibold line-clamp-2">{ev.deskripsi}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Announcement Results */}
                            {pengumumanResults.length > 0 && (
                                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                                    <h3 className="text-sm font-black text-navy uppercase tracking-wider border-b border-gray-100 pb-2">Pengumuman ({pengumumanResults.length})</h3>
                                    <div className="space-y-3">
                                        {pengumumanResults.map((p) => (
                                            <div key={p.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-extrabold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase">{p.ekskul_nama}</span>
                                                    <span className="text-xs text-gray-400 font-bold">{new Date(p.diterbitkan_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <h4 className="font-black text-navy text-md">{p.judul}</h4>
                                                <p className="text-xs text-gray-500 font-semibold line-clamp-3 leading-relaxed whitespace-pre-wrap">{p.konten}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {totalResults === 0 && (
                                <div className="bg-white border border-gray-150 rounded-3xl p-16 text-center shadow-sm">
                                    <p className="text-sm text-gray-400 font-semibold">Tidak ditemukan hasil pencarian yang cocok.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-navy text-white/90 pt-8 pb-8 border-t border-navy/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-white/50 font-medium">
                    <p>© 2026 SMKN 1 Bawang. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
