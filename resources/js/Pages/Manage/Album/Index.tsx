import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
    creator: {
        nama: string;
    };
    foto: Foto[];
    cover_url: string | null;
    created_at: string;
}

interface IndexProps {
    ekskulTa: {
        id: string;
        ekskul_nama: string;
    };
    albums: Album[];
}

export default function Index({ ekskulTa, albums = [] }: IndexProps) {
    const { props } = usePage<any>();
    const { flash } = props;

    // Album forms
    const albumForm = useForm({
        judul: '',
        deskripsi: '',
    });

    const editAlbumForm = useForm({
        id: '',
        judul: '',
        deskripsi: '',
    });

    // Foto form
    const fotoForm = useForm({
        file: null as File | null,
        caption: '',
        urutan: 0,
    });

    const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(albums[0]?.id || null);

    const handleCreateAlbum = (e: React.FormEvent) => {
        e.preventDefault();
        albumForm.post(`/manage/ekskul/${ekskulTa.id}/album`, {
            onSuccess: () => {
                albumForm.reset();
            }
        });
    };

    const handleUpdateAlbum = (e: React.FormEvent) => {
        e.preventDefault();
        editAlbumForm.put(`/manage/ekskul/${ekskulTa.id}/album/${editAlbumForm.data.id}`, {
            onSuccess: () => {
                setEditingAlbumId(null);
            }
        });
    };

    const handleUploadFoto = (e: React.FormEvent, albumId: string) => {
        e.preventDefault();
        fotoForm.post(`/manage/ekskul/${ekskulTa.id}/album/${albumId}/foto`, {
            onSuccess: () => {
                fotoForm.reset();
            }
        });
    };

    const deleteAlbumForm = useForm();
    const handleDeleteAlbum = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus album ini beserta seluruh foto didalamnya?')) {
            deleteAlbumForm.delete(`/manage/ekskul/${ekskulTa.id}/album/${id}`, {
                onSuccess: () => {
                    if (selectedAlbumId === id) {
                        setSelectedAlbumId(null);
                    }
                }
            });
        }
    };

    const deleteFotoForm = useForm();
    const handleDeleteFoto = (fotoId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
            deleteFotoForm.delete(`/manage/ekskul/${ekskulTa.id}/foto/${fotoId}`);
        }
    };

    const activeAlbum = albums.find((a) => a.id === selectedAlbumId);

    return (
        <AuthenticatedLayout title={`Album Foto - ${ekskulTa.ekskul_nama}`}>
            <Head title={`Galeri Album - ${ekskulTa.ekskul_nama}`} />

            <div className="max-w-6xl mx-auto space-y-8">
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
                    <h2 className="text-2xl font-black text-navy">Galeri Album & Foto</h2>
                    <p className="text-xs text-gray-400 font-bold">Kelola album foto publik untuk portofolio dan dokumentasi publik ekstrakurikuler.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Albums List & Create */}
                    <div className="space-y-6 h-fit">
                        {/* Create Album */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                            <div className="border-b border-gray-100 pb-3">
                                <h3 className="font-black text-navy text-md">Buat Album Baru</h3>
                            </div>
                            <form onSubmit={handleCreateAlbum} className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Nama Album</label>
                                    <input
                                        type="text"
                                        value={albumForm.data.judul}
                                        onChange={(e) => albumForm.setData('judul', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        placeholder="Contoh: HUT Ambalan 2026"
                                    />
                                    {albumForm.errors.judul && <p className="text-xs text-red-500 font-bold">{albumForm.errors.judul}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Deskripsi</label>
                                    <textarea
                                        value={albumForm.data.deskripsi}
                                        onChange={(e) => albumForm.setData('deskripsi', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                        placeholder="Tulis keterangan singkat..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={albumForm.processing}
                                    className="w-full py-2.5 bg-navy text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:bg-navy/95 transition-all"
                                >
                                    Buat Album
                                </button>
                            </form>
                        </div>

                        {/* List Albums */}
                        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                            <div className="border-b border-gray-100 pb-3">
                                <h3 className="font-black text-navy text-md">Daftar Album</h3>
                            </div>
                            <div className="space-y-2">
                                {albums.length === 0 ? (
                                    <p className="text-xs text-gray-400 font-semibold text-center py-4">Belum ada album.</p>
                                ) : (
                                    albums.map((a) => (
                                        <div
                                            key={a.id}
                                            onClick={() => setSelectedAlbumId(a.id)}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                                selectedAlbumId === a.id
                                                    ? 'border-secondary bg-secondary/5 text-navy'
                                                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className="min-w-0 pr-2">
                                                <p className="font-black text-sm truncate">{a.judul}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{a.foto.length} Foto</p>
                                            </div>
                                            <div className="flex space-x-1 shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingAlbumId(a.id);
                                                        editAlbumForm.setData({
                                                            id: a.id,
                                                            judul: a.judul,
                                                            deskripsi: a.deskripsi || '',
                                                        });
                                                    }}
                                                    className="p-1 hover:text-blue-600"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAlbum(a.id);
                                                    }}
                                                    className="p-1 hover:text-red-600"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Album Details & Photo Upload */}
                    <div className="lg:col-span-2 space-y-6">
                        {editingAlbumId && (
                            <form onSubmit={handleUpdateAlbum} className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm space-y-4">
                                <div className="border-b border-gray-100 pb-2">
                                    <h4 className="font-black text-navy text-sm">Edit Profil Album</h4>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Judul Album</label>
                                    <input
                                        type="text"
                                        value={editAlbumForm.data.judul}
                                        onChange={(e) => editAlbumForm.setData('judul', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Deskripsi</label>
                                    <input
                                        type="text"
                                        value={editAlbumForm.data.deskripsi}
                                        onChange={(e) => editAlbumForm.setData('deskripsi', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingAlbumId(null)}
                                        className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editAlbumForm.processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeAlbum ? (
                            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6">
                                <div className="border-b border-gray-100 pb-4">
                                    <h3 className="font-black text-navy text-lg">{activeAlbum.judul}</h3>
                                    <p className="text-xs text-gray-500 font-semibold mt-1">{activeAlbum.deskripsi || 'Tidak ada deskripsi.'}</p>
                                </div>

                                {/* Upload Photo Form */}
                                <form onSubmit={(e) => handleUploadFoto(e, activeAlbum.id)} className="p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-4">
                                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Tambahkan Foto Baru</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">File Gambar</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => fotoForm.setData('file', e.target.files?.[0] || null)}
                                                className="w-full text-xs font-bold text-navy"
                                            />
                                            {fotoForm.errors.file && <p className="text-xs text-red-500 font-bold">{fotoForm.errors.file}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Urutan Tampil</label>
                                            <input
                                                type="number"
                                                value={fotoForm.data.urutan}
                                                onChange={(e) => fotoForm.setData('urutan', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Keterangan / Caption</label>
                                        <input
                                            type="text"
                                            value={fotoForm.data.caption}
                                            onChange={(e) => fotoForm.setData('caption', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-150 rounded-xl font-bold text-sm text-navy"
                                            placeholder="Contoh: Upacara penutupan"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={fotoForm.processing}
                                        className="px-4 py-2 bg-secondary text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow hover:bg-secondary/90 transition-all"
                                    >
                                        Unggah Foto
                                    </button>
                                </form>

                                {/* List of Photos */}
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Foto Dalam Album ({activeAlbum.foto.length})</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {activeAlbum.foto.map((f) => (
                                            <div key={f.id} className="relative border border-gray-100 rounded-2xl overflow-hidden group shadow-sm bg-gray-50 flex flex-col justify-between">
                                                <img src={f.path} alt={f.caption || 'Foto'} className="w-full h-32 object-cover" />
                                                <div className="p-3 space-y-1">
                                                    <p className="text-[10px] font-bold text-gray-700 line-clamp-1">{f.caption || 'Tanpa keterangan'}</p>
                                                    <p className="text-[9px] text-gray-400 font-extrabold uppercase">Urutan: {f.urutan}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteFoto(f.id)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                                                    title="Hapus Foto"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center shadow-sm">
                                <p className="text-sm text-gray-400 font-semibold">Silakan pilih atau buat album foto di samping.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
