import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface AlbumPublik {
    id: string;
    judul: string;
    deskripsi: string | null;
    ekskul_nama: string;
    cover_url: string | null;
    jumlah_foto: number;
    created_at: string;
}

interface IndexProps {
    albums: AlbumPublik[];
}

export default function Index({ albums = [] }: IndexProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title="Galeri Album Foto Ekskul" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* School Logo & Title */}
                        <Link href="/" className="flex items-center space-x-4">
                            <img 
                                src="/images/logo-SMKN1-Bawang.png" 
                                alt="Logo SMKN 1 Bawang" 
                                className="h-14 w-auto object-contain hover:scale-105 transition-transform duration-300"
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
                            <Link href="/kalender" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">Kalender</Link>
                            <Link href="/pencarian" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">Cari</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow py-12 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="inline-flex items-center px-4 py-1 bg-blue-50 border border-blue-200 text-secondary text-xs font-bold rounded-full tracking-wider uppercase">
                        📸 Portofolio Kegiatan
                    </span>
                    <h2 className="text-4xl font-black text-navy leading-tight">Galeri Foto Ekstrakurikuler</h2>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        Lihat kilasan dokumentasi, piala, dan keseruan aktivitas ekstrakurikuler SMKN 1 Bawang.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                    {albums.map((album) => (
                        <Link
                            key={album.id}
                            href={`/galeri/${album.id}`}
                            className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.01] hover:border-transparent transition-all group flex flex-col justify-between"
                        >
                            <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
                                {album.cover_url ? (
                                    <img
                                        src={album.cover_url}
                                        alt={album.judul}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-navy/5 text-navy/40 font-extrabold text-sm">
                                        Tidak ada foto
                                    </div>
                                )}
                                <span className="absolute bottom-4 left-4 text-[10px] font-extrabold text-white bg-navy/80 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider">
                                    {album.ekskul_nama}
                                </span>
                            </div>

                            <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black text-navy group-hover:text-secondary transition-colors line-clamp-1">{album.judul}</h3>
                                    <p className="text-xs text-gray-500 font-semibold leading-relaxed line-clamp-3">
                                        {album.deskripsi || 'Tidak ada deskripsi.'}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-semibold">
                                    <span>{album.jumlah_foto} Foto</span>
                                    <span>{new Date(album.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {albums.length === 0 && (
                        <div className="col-span-full bg-white border border-gray-150 rounded-3xl p-16 text-center shadow-sm">
                            <p className="text-sm text-gray-400 font-semibold">Belum ada album foto yang dipublikasikan.</p>
                        </div>
                    )}
                </div>
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
