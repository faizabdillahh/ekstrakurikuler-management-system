import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface Foto {
    id: string;
    path: string;
    caption: string | null;
    urutan: number;
}

interface Album {
    id: string;
    judul: string;
    deskripsi: string | null;
    ekskul_nama: string;
    created_at: string;
}

interface ShowProps {
    album: Album;
    fotos: Foto[];
}

export default function Show({ album, fotos = [] }: ShowProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<Foto | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title={`Album ${album.judul}`} />

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
                            <Link href="/galeri" className="text-gray-600 hover:text-navy font-semibold text-sm transition-colors">← Kembali ke Galeri</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-grow py-12 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
                {/* Album Header */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 lg:p-8 shadow-sm space-y-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                            {album.ekskul_nama}
                        </span>
                        <span className="text-xs text-gray-400 font-bold">
                            Diposting pada {new Date(album.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    <h2 className="text-3xl font-black text-navy">{album.judul}</h2>
                    <p className="text-sm text-gray-600 font-semibold leading-relaxed max-w-4xl">{album.deskripsi || 'Tidak ada deskripsi.'}</p>
                </div>

                {/* Photos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {fotos.map((f) => (
                        <div
                            key={f.id}
                            onClick={() => setSelectedPhoto(f)}
                            className="bg-white border border-gray-100 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
                        >
                            <div className="h-48 bg-gray-100 overflow-hidden relative">
                                <img src={f.path} alt={f.caption || 'Foto'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-black uppercase tracking-wider bg-navy/85 px-4 py-2 rounded-full">
                                        Perbesar 🔍
                                    </span>
                                </div>
                            </div>
                            {f.caption && (
                                <div className="p-3 border-t border-gray-50 bg-white">
                                    <p className="text-xs font-bold text-gray-700 line-clamp-2">{f.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}

                    {fotos.length === 0 && (
                        <div className="col-span-full bg-white border border-gray-150 rounded-3xl p-16 text-center shadow-sm">
                            <p className="text-sm text-gray-400 font-semibold">Belum ada foto di dalam album ini.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    onClick={() => setSelectedPhoto(null)}
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out animate-fade-in"
                >
                    <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center space-y-4" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 font-extrabold text-sm uppercase tracking-wider bg-white/10 px-4 py-2 rounded-full"
                        >
                            Tutup ✕
                        </button>
                        <img
                            src={selectedPhoto.path}
                            alt={selectedPhoto.caption || 'Foto'}
                            className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                        />
                        {selectedPhoto.caption && (
                            <div className="p-4 bg-navy/95 border border-white/10 rounded-2xl max-w-xl text-center shadow-lg">
                                <p className="text-white text-sm font-semibold">{selectedPhoto.caption}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-navy text-white/90 pt-8 pb-8 border-t border-navy/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-white/50 font-medium">
                    <p>© 2026 SMKN 1 Bawang. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
